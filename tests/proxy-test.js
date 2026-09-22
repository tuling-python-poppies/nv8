/**
 * 代理支持
 *
 * 三个设计要点：
 *
 * 1. **代理故障必须与目标故障分开** —— 代理不通是我们这一侧的出口坏了。
 *    混在一起的话，一个代理挂掉 → 熔断器跳闸所有 origin → 运维看到
 *    「所有站点都挂了」，真实原因被完全掩盖。
 * 2. **轮换默认 sticky** —— 很多站点把会话绑定在 IP 上。会话中途换出口 IP
 *    表现为莫名掉登录态，看起来像「协议实现错了」，会把排查带向错误方向。
 * 3. **凭据不出现在任何输出里** —— 一条带密码的错误日志进了工单系统就是泄露。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { inspect } from 'node:util';

import {
  ProxyPool,
  ProxyProtocol,
  RotationStrategy,
  connectThroughProxy,
  isProxyError,
  parseProxy,
  redactUrl,
} from '../src/collection/collector/proxy.js';
import { CircuitBreaker } from '../src/collection/collector/circuit-breaker.js';
import { CollectorErrorCode } from '../src/collection/collector/errors.js';

// ------------------------------------------------------ 配置解析

test('proxy urls parse into a normalized shape', () => {
  const proxy = parseProxy('socks5://alice:s3cr3t@10.0.0.5:1080');
  assert.equal(proxy.protocol, ProxyProtocol.SOCKS5);
  assert.equal(proxy.host, '10.0.0.5');
  assert.equal(proxy.port, 1080);
  assert.equal(proxy.username, 'alice');
  assert.equal(proxy.password, 's3cr3t');
});

test('default ports are filled per protocol', () => {
  assert.equal(parseProxy('http://h').port, 80);
  assert.equal(parseProxy('https://h').port, 443);
  assert.equal(parseProxy('socks5://h').port, 1080);
});

test('percent-encoded credentials are decoded', () => {
  // 密码里的 `@` 和 `:` 必须写成编码形式，解析时要还原
  const proxy = parseProxy('http://user%40corp:p%40ss%3Aword@h:8080');
  assert.equal(proxy.username, 'user@corp');
  assert.equal(proxy.password, 'p@ss:word');
});

test('object form is accepted', () => {
  const proxy = parseProxy({ protocol: 'http', host: 'h', port: 3128 });
  assert.equal(proxy.label, 'http://h:3128');
  assert.equal(proxy.username, null);
});

test('unsupported protocols are rejected with the supported list', () => {
  assert.throws(() => parseProxy('socks4://h:1080'), (error) => {
    assert.equal(error.code, CollectorErrorCode.INVALID_CONFIG);
    assert.match(error.message, /http, https, socks5/);
    return true;
  });
});

test('a half-specified credential is a configuration error', () => {
  // 多半是 URL 里 `:` 写漏了。静默当成空密码会让认证在远端失败、
  // 报成"代理不通"，把配置问题伪装成网络问题
  assert.throws(() => parseProxy({ protocol: 'http', host: 'h', username: 'u' }),
    (error) => {
      assert.match(error.message, /username but no password/);
      return true;
    });
  assert.throws(() => parseProxy({ protocol: 'http', host: 'h', password: 'p' }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
});

test('invalid ports and missing hosts are rejected', () => {
  assert.throws(() => parseProxy({ protocol: 'http', host: '' }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
  assert.throws(() => parseProxy({ protocol: 'http', host: 'h', port: 70000 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
});

// ------------------------------------------------------ 凭据脱敏

test('the password never appears in any default output', () => {
  const proxy = parseProxy('http://alice:topsecret@h:8080');

  assert.ok(!Object.keys(proxy).includes('password'), 'not enumerable');
  assert.ok(!JSON.stringify(proxy).includes('topsecret'));
  assert.ok(!inspect(proxy).includes('topsecret'), 'console.log must be safe');
  assert.ok(!`${proxy}`.includes('topsecret'));
  assert.ok(!JSON.stringify({ ...proxy }).includes('topsecret'), 'spreading must be safe');

  // 但代码内部仍然要能读到
  assert.equal(proxy.password, 'topsecret');
});

test('toJSON reports whether auth is configured without leaking it', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(parseProxy('http://u:p@h:1'))), {
    protocol: 'http', host: 'h', port: 1, authenticated: true,
  });
  assert.equal(JSON.parse(JSON.stringify(parseProxy('http://h:1'))).authenticated, false);
});

test('an unparseable proxy url is redacted in the error', () => {
  // 解析失败的 URL 同样可能带密码，原串不能直接回显
  assert.throws(() => parseProxy('http://u:leaked@['), (error) => {
    assert.ok(!error.message.includes('leaked'));
    return true;
  });
});

test('redactUrl strips the credential section', () => {
  assert.equal(redactUrl('http://u:p@h:8080/x'), 'http://***@h:8080/x');
  assert.equal(redactUrl('http://h:8080/x'), 'http://h:8080/x');
});

// ------------------------------------------------------ 池与轮换

test('a pool needs at least one proxy', () => {
  assert.throws(() => new ProxyPool({ proxies: [] }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
});

test('an unknown rotation strategy is rejected', () => {
  assert.throws(() => new ProxyPool({ proxies: ['http://h'], strategy: 'sticky-ish' }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
});

test('sticky keeps one origin on one proxy', () => {
  const pool = new ProxyPool({ proxies: ['http://a:1', 'http://b:2', 'http://c:3'] });

  // 会话中途换出口 IP 会莫名掉登录态，且看起来像协议实现错了
  const first = pool.acquire('https://site.example');
  for (let index = 0; index < 10; index += 1) {
    assert.equal(pool.acquire('https://site.example').label, first.label);
  }
});

test('sticky spreads different origins across proxies', () => {
  const pool = new ProxyPool({ proxies: ['http://a:1', 'http://b:2'] });
  assert.notEqual(pool.acquire('one').label, pool.acquire('two').label);
});

test('round-robin cycles on every acquire', () => {
  const pool = new ProxyPool({
    proxies: ['http://a:1', 'http://b:2'],
    strategy: RotationStrategy.ROUND_ROBIN,
  });
  assert.deepEqual(
    [pool.acquire(), pool.acquire(), pool.acquire()].map((proxy) => proxy.host),
    ['a', 'b', 'a']
  );
});

test('random uses the injected generator', () => {
  const values = [0.99, 0.01];
  const pool = new ProxyPool({
    proxies: ['http://a:1', 'http://b:2'],
    strategy: RotationStrategy.RANDOM,
    random: () => values.shift(),
  });
  assert.equal(pool.acquire().host, 'b');
  assert.equal(pool.acquire().host, 'a');
});

test('sticky is the default strategy', () => {
  assert.equal(new ProxyPool({ proxies: ['http://a:1'] }).strategy, RotationStrategy.STICKY);
});

// ------------------------------------------------------ 健康与冷却

test('a failed proxy is taken out of rotation', () => {
  let now = 0;
  const pool = new ProxyPool({
    proxies: ['http://a:1', 'http://b:2'],
    cooldownMs: 100,
    now: () => now,
  });

  const bad = pool.acquire('o');
  pool.reportFailure(bad);

  // 没有冷却的话，挂掉的代理会在每轮轮换里反复被选中，把成功率拖到 1/N，
  // 而每次失败看起来都是随机的
  assert.notEqual(pool.acquire('o').label, bad.label);
});

test('failure releases the sticky pin', () => {
  let now = 0;
  const pool = new ProxyPool({ proxies: ['http://a:1', 'http://b:2'], now: () => now });
  const bad = pool.acquire('o');
  pool.reportFailure(bad);
  // 不解绑的话下次仍会尝试同一个坏代理
  assert.notEqual(pool.acquire('o').label, bad.label);
});

test('an all-cooling pool throws instead of using a known-bad proxy', () => {
  let now = 0;
  const pool = new ProxyPool({
    proxies: ['http://a:1', 'http://b:2'],
    cooldownMs: 500,
    now: () => now,
  });

  pool.reportFailure(pool.acquire('o'));
  pool.reportFailure(pool.acquire('o'));

  // 退回用坏代理会把故障重新伪装成目标故障——正是这个模块要避免的事
  assert.throws(() => pool.acquire('o'), (error) => {
    assert.equal(error.code, CollectorErrorCode.PROXY_EXHAUSTED);
    assert.equal(error.retryable, true, 'the pool recovers on its own');
    assert.match(error.message, /next available in 500ms/);
    return true;
  });
});

test('cooldown expires on the clock', () => {
  let now = 0;
  const pool = new ProxyPool({ proxies: ['http://a:1'], cooldownMs: 100, now: () => now });
  pool.reportFailure(pool.acquire('o'));
  assert.throws(() => pool.acquire('o'));

  now = 100;
  assert.equal(pool.acquire('o').label, 'http://a:1');
});

test('a success clears the cooldown immediately', () => {
  let now = 0;
  const pool = new ProxyPool({ proxies: ['http://a:1'], cooldownMs: 10_000, now: () => now });
  const proxy = pool.acquire('o');
  pool.reportFailure(proxy);
  pool.reportSuccess(proxy);
  assert.equal(pool.acquire('o').label, 'http://a:1');
});

test('cooldownMs 0 disables health tracking', () => {
  const pool = new ProxyPool({ proxies: ['http://a:1'], cooldownMs: 0 });
  pool.reportFailure(pool.acquire('o'));
  assert.equal(pool.acquire('o').label, 'http://a:1');
});

test('health() is safe to log', () => {
  let now = 0;
  const pool = new ProxyPool({
    proxies: ['http://u:secret@a:1'],
    cooldownMs: 250,
    now: () => now,
  });
  pool.reportFailure(pool.acquire('o'));

  const health = pool.health();
  // 带凭据的代理 label 追加脱敏哈希后缀（区分同 host:port 不同 auth），
  // 但绝不带明文密码。
  assert.match(health[0].label, /^http:\/\/a:1#[a-f0-9]{8}$/);
  assert.equal(health[0].coolingDown, true);
  assert.equal(health[0].cooldownRemainingMs, 250);
  assert.ok(!JSON.stringify(health).includes('secret'));
});

// ------------------------------------------------------ 与熔断器的边界

test('proxy failures never count against target health', () => {
  const breaker = new CircuitBreaker({});

  for (const code of [
    CollectorErrorCode.PROXY_CONNECT_FAILED,
    CollectorErrorCode.PROXY_AUTH_FAILED,
    CollectorErrorCode.PROXY_EXHAUSTED,
  ]) {
    assert.equal(breaker.countsAsFailure({ error: { code } }), false, code);
  }
  // 对照：目标真的 500 要计入
  assert.equal(breaker.countsAsFailure({ response: { status: 500 } }), true);
});

test('proxy exclusion holds even if a caller lists them as trip errors', () => {
  const breaker = new CircuitBreaker({
    tripErrors: [CollectorErrorCode.PROXY_CONNECT_FAILED],
  });
  // 硬排除：配错了也不会让一个代理故障跳闸所有 origin
  assert.equal(
    breaker.countsAsFailure({ error: { code: CollectorErrorCode.PROXY_CONNECT_FAILED } }),
    false
  );
});

test('isProxyError recognizes exactly the proxy codes', () => {
  assert.ok(isProxyError({ code: CollectorErrorCode.PROXY_CONNECT_FAILED }));
  assert.ok(isProxyError({ code: CollectorErrorCode.PROXY_AUTH_FAILED }));
  assert.ok(isProxyError({ code: CollectorErrorCode.PROXY_EXHAUSTED }));
  assert.ok(!isProxyError({ code: CollectorErrorCode.REQUEST_TIMEOUT }));
  assert.ok(!isProxyError(null));
});

// ------------------------------------------------------ 真实隧道

/** 起一个回显目标服务。 */
async function startEchoTarget() {
  const server = net.createServer((socket) => {
    socket.on('data', (chunk) => socket.write(Buffer.concat([Buffer.from('ECHO:'), chunk])));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

/**
 * 起一个最小 HTTP CONNECT 代理。
 *
 * @param {object} [options]
 * @param {boolean} [options.requireAuth]
 * @param {boolean} [options.splitResponse] 把响应头分两段发，验证分段解析
 */
async function startHttpProxy(options = {}) {
  const server = net.createServer((client) => {
    client.once('data', (buffer) => {
      const request = buffer.toString('latin1');
      if (!request.startsWith('CONNECT ')) { client.end(); return; }
      if (options.requireAuth && !request.includes('Proxy-Authorization:')) {
        client.end('HTTP/1.1 407 Proxy Authentication Required\r\n\r\n');
        return;
      }
      if (options.refuse) {
        client.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        return;
      }
      const [, authority] = request.split(' ');
      const [host, port] = authority.split(':');
      const upstream = net.connect({ host, port: Number(port) }, () => {
        if (options.splitResponse) {
          client.write('HTTP/1.1 200 Connection est');
          setImmediate(() => {
            client.write('ablished\r\nX-Proxy: test\r\n\r\n');
            client.pipe(upstream);
            upstream.pipe(client);
          });
        } else {
          client.write('HTTP/1.1 200 Connection established\r\n\r\n');
          client.pipe(upstream);
          upstream.pipe(client);
        }
      });
      upstream.on('error', () => client.destroy());
    });
    client.on('error', () => {});
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

/** 起一个最小 SOCKS5 代理。 */
async function startSocks5Proxy(options = {}) {
  const server = net.createServer((client) => {
    let stage = 'greeting';
    const onData = (chunk) => {
      if (stage === 'greeting') {
        const methods = [...chunk.subarray(2, 2 + chunk[1])];
        if (options.demandAuthAlways) {
          stage = 'auth';
          client.write(Buffer.from([0x05, 0x02]));
          return;
        }
        if (options.requireAuth) {
          if (!methods.includes(0x02)) { client.end(Buffer.from([0x05, 0xff])); return; }
          stage = 'auth';
          client.write(Buffer.from([0x05, 0x02]));
          return;
        }
        stage = 'connect';
        client.write(Buffer.from([0x05, 0x00]));
        return;
      }
      if (stage === 'auth') {
        const userLength = chunk[1];
        const user = chunk.subarray(2, 2 + userLength).toString();
        const pass = chunk.subarray(3 + userLength, 3 + userLength + chunk[2 + userLength])
          .toString();
        const ok = user === options.username && pass === options.password;
        client.write(Buffer.from([0x01, ok ? 0x00 : 0x01]));
        if (!ok) { client.end(); return; }
        stage = 'connect';
        return;
      }
      // connect
      const hostLength = chunk[4];
      const host = chunk.subarray(5, 5 + hostLength).toString();
      const port = chunk.readUInt16BE(5 + hostLength);
      if (options.replyCode !== undefined) {
        client.end(Buffer.concat([
          Buffer.from([0x05, options.replyCode, 0x00, 0x01]),
          Buffer.alloc(6),
        ]));
        return;
      }
      const upstream = net.connect({ host, port }, () => {
        client.write(Buffer.concat([
          Buffer.from([0x05, 0x00, 0x00, 0x01]), Buffer.alloc(6),
        ]));
        // 摘掉握手解析器再接管道，否则目标数据会被当成又一个 CONNECT 请求
        client.removeListener('data', onData);
        client.pipe(upstream);
        upstream.pipe(client);
      });
      upstream.on('error', () => client.destroy());
    };
    client.on('data', onData);
    client.on('error', () => {});
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, port: server.address().port };
}

/** 通过隧道回显一次，验证隧道确实连到了目标。 */
async function echoThrough(socket, text) {
  const reply = new Promise((resolve) => socket.once('data', (chunk) => resolve(`${chunk}`)));
  socket.write(text);
  return reply;
}

test('an http CONNECT tunnel reaches the target', async () => {
  const target = await startEchoTarget();
  const proxy = await startHttpProxy();
  try {
    const socket = await connectThroughProxy({
      proxy: parseProxy(`http://127.0.0.1:${proxy.port}`),
      host: '127.0.0.1',
      port: target.port,
    });
    assert.equal(await echoThrough(socket, 'hello'), 'ECHO:hello');
    socket.destroy();
  } finally {
    target.server.close();
    proxy.server.close();
  }
});

test('a CONNECT response split across segments is parsed correctly', async () => {
  const target = await startEchoTarget();
  const proxy = await startHttpProxy({ splitResponse: true });
  try {
    const socket = await connectThroughProxy({
      proxy: parseProxy(`http://127.0.0.1:${proxy.port}`),
      host: '127.0.0.1',
      port: target.port,
    });
    // 响应头分多个 TCP 段到达是常态，必须等到空行才解析
    assert.equal(await echoThrough(socket, 'x'), 'ECHO:x');
    socket.destroy();
  } finally {
    target.server.close();
    proxy.server.close();
  }
});

test('CONNECT sends basic credentials when configured', async () => {
  const target = await startEchoTarget();
  const proxy = await startHttpProxy({ requireAuth: true });
  try {
    const socket = await connectThroughProxy({
      proxy: parseProxy(`http://u:p@127.0.0.1:${proxy.port}`),
      host: '127.0.0.1',
      port: target.port,
    });
    assert.equal(await echoThrough(socket, 'y'), 'ECHO:y');
    socket.destroy();
  } finally {
    target.server.close();
    proxy.server.close();
  }
});

test('a 407 is a non-retryable auth failure', async () => {
  const proxy = await startHttpProxy({ requireAuth: true });
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`http://127.0.0.1:${proxy.port}`),
        host: '127.0.0.1',
        port: 9,
      }),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.PROXY_AUTH_FAILED);
        // 换多少次都一样，配置得改
        assert.equal(error.retryable, false);
        return true;
      }
    );
  } finally {
    proxy.server.close();
  }
});

test('a refused CONNECT is retryable and names the target', async () => {
  const proxy = await startHttpProxy({ refuse: true });
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`http://127.0.0.1:${proxy.port}`),
        host: 'blocked.example',
        port: 443,
      }),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.PROXY_CONNECT_FAILED);
        assert.equal(error.retryable, true);
        assert.match(error.message, /blocked\.example:443/);
        return true;
      }
    );
  } finally {
    proxy.server.close();
  }
});

test('an unreachable proxy reports the proxy, not the target', async () => {
  await assert.rejects(
    connectThroughProxy({
      proxy: parseProxy('http://127.0.0.1:1'),
      host: 'target.example',
      port: 443,
      timeoutMs: 5_000,
    }),
    (error) => {
      assert.equal(error.code, CollectorErrorCode.PROXY_CONNECT_FAILED);
      assert.match(error.message, /cannot reach proxy http:\/\/127\.0\.0\.1:1/);
      return true;
    }
  );
});

test('proxy errors carry only the redacted label', async () => {
  await assert.rejects(
    connectThroughProxy({
      proxy: parseProxy('http://alice:topsecret@127.0.0.1:1'),
      host: 'target.example',
      port: 443,
      timeoutMs: 5_000,
    }),
    (error) => {
      // 一条带密码的错误日志进了工单系统就是泄露
      assert.ok(!error.message.includes('topsecret'));
      assert.ok(!error.message.includes('alice'));
      return true;
    }
  );
});

test('a socks5 tunnel reaches the target', async () => {
  const target = await startEchoTarget();
  const proxy = await startSocks5Proxy();
  try {
    const socket = await connectThroughProxy({
      proxy: parseProxy(`socks5://127.0.0.1:${proxy.port}`),
      host: '127.0.0.1',
      port: target.port,
    });
    assert.equal(await echoThrough(socket, 'socks'), 'ECHO:socks');
    socket.destroy();
  } finally {
    target.server.close();
    proxy.server.close();
  }
});

test('socks5 username/password authentication works', async () => {
  const target = await startEchoTarget();
  const proxy = await startSocks5Proxy({
    requireAuth: true, username: 'bob', password: 'pw',
  });
  try {
    const socket = await connectThroughProxy({
      proxy: parseProxy(`socks5://bob:pw@127.0.0.1:${proxy.port}`),
      host: '127.0.0.1',
      port: target.port,
    });
    assert.equal(await echoThrough(socket, 'auth'), 'ECHO:auth');
    socket.destroy();
  } finally {
    target.server.close();
    proxy.server.close();
  }
});

test('socks5 rejecting credentials is a non-retryable auth failure', async () => {
  const proxy = await startSocks5Proxy({
    requireAuth: true, username: 'bob', password: 'right',
  });
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`socks5://bob:wrong@127.0.0.1:${proxy.port}`),
        host: '127.0.0.1',
        port: 9,
      }),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.PROXY_AUTH_FAILED);
        assert.equal(error.retryable, false);
        return true;
      }
    );
  } finally {
    proxy.server.close();
  }
});

test('socks5 rejecting all offered methods is an auth failure', async () => {
  // 客户端没配凭据时只提供 0x00；按 RFC 1928 代理回 0xff
  const proxy = await startSocks5Proxy({ requireAuth: true, username: 'x', password: 'y' });
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`socks5://127.0.0.1:${proxy.port}`),
        host: '127.0.0.1',
        port: 9,
      }),
      (error) => {
        // 报认证失败而不是"连不上"，否则会被当成网络问题反复重试
        assert.equal(error.code, CollectorErrorCode.PROXY_AUTH_FAILED);
        assert.equal(error.retryable, false);
        assert.match(error.message, /rejected all offered authentication methods/);
        return true;
      }
    );
  } finally {
    proxy.server.close();
  }
});

test('a socks5 proxy demanding user/pass with none configured says so', async () => {
  // 有些代理不管客户端提供了什么都直接要 0x02
  const proxy = await startSocks5Proxy({ demandAuthAlways: true });
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`socks5://127.0.0.1:${proxy.port}`),
        host: '127.0.0.1',
        port: 9,
      }),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.PROXY_AUTH_FAILED);
        assert.match(error.message, /none was configured/);
        return true;
      }
    );
  } finally {
    proxy.server.close();
  }
});

test('socks5 reply codes are translated to readable reasons', async () => {
  const proxy = await startSocks5Proxy({ replyCode: 0x04 });
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`socks5://127.0.0.1:${proxy.port}`),
        host: 'gone.example',
        port: 443,
      }),
      (error) => {
        assert.match(error.message, /host unreachable/);
        return true;
      }
    );
  } finally {
    proxy.server.close();
  }
});

test('a ruleset rejection is not retryable', async () => {
  const proxy = await startSocks5Proxy({ replyCode: 0x02 });
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`socks5://127.0.0.1:${proxy.port}`),
        host: 'blocked.example',
        port: 443,
      }),
      (error) => {
        // 代理规则不允许，重试永远不会通过
        assert.match(error.message, /not allowed by ruleset/);
        assert.equal(error.retryable, false);
        return true;
      }
    );
  } finally {
    proxy.server.close();
  }
});

test('connectThroughProxy validates its arguments', async () => {
  await assert.rejects(connectThroughProxy({ host: 'h', port: 1 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG);
  await assert.rejects(
    connectThroughProxy({ proxy: parseProxy('http://h'), host: 'h' }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

test('an aborted signal cancels the proxy connection', async () => {
  const proxy = await startHttpProxy();
  const controller = new AbortController();
  controller.abort();
  try {
    await assert.rejects(
      connectThroughProxy({
        proxy: parseProxy(`http://127.0.0.1:${proxy.port}`),
        host: '127.0.0.1',
        port: 9,
        signal: controller.signal,
      }),
      (error) => error.code === CollectorErrorCode.ABORTED
    );
  } finally {
    proxy.server.close();
  }
});
