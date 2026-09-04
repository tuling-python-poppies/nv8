/**
 * 走代理的传输
 *
 * Node 全局 `fetch`（undici）没有公开的代理钩子，用 `ProxyAgent` 就得引依赖，
 * 而本项目零依赖。所以这里基于 `node:http`/`node:https` 自建，把
 * `connectThroughProxy` 建好的隧道 socket 通过 `createConnection` 交给
 * HTTP 客户端。
 *
 * 两个关键行为：
 *
 * 1. **配了代理就绝不直连** —— 回落直连会泄露真实出口 IP，而用代理的全部意义
 *    就在于不暴露它。更糟的是这种泄露完全无声：请求成功、采集正常，
 *    等到目标把真实 IP 拉黑才发现。
 * 2. **响应体边收边判上限** —— 先缓冲完再检查的话，超限本身就是被撑爆的那一刻，
 *    这个上限根本保护不了内存。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';

import { createProxyTransport } from '../src/collection/collector/proxy-transport.js';
import { ProxyPool } from '../src/collection/collector/proxy.js';
import { createRequestPlan } from '../src/collection/request-protocol/request-plan.js';
import { CollectorErrorCode } from '../src/collection/collector/errors.js';

/** 起一个可控的目标服务。 */
async function startTarget(handler) {
  const server = http.createServer(handler);
  const sockets = new Set();
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    server,
    port: server.address().port,
    // server.close() 只停止监听，残留连接会让测试进程挂住
    close: () => { for (const socket of sockets) socket.destroy(); server.close(); },
  };
}

/**
 * 起一个最小 CONNECT 代理，记录它收到的 CONNECT 目标。
 *
 * @param {object} [options]
 * @param {boolean} [options.refuse]
 */
async function startProxy(options = {}) {
  const connects = [];
  const sockets = new Set();
  const track = (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  };
  const server = net.createServer((client) => {
    track(client);
    client.once('data', (buffer) => {
      const request = buffer.toString('latin1');
      if (!request.startsWith('CONNECT ')) { client.end(); return; }
      const [, authority] = request.split(' ');
      connects.push(authority);
      if (options.refuse) { client.end('HTTP/1.1 502 Bad Gateway\r\n\r\n'); return; }
      const [host, port] = authority.split(':');
      const upstream = net.connect({ host, port: Number(port) }, () => {
        client.write('HTTP/1.1 200 Connection established\r\n\r\n');
        client.pipe(upstream);
        upstream.pipe(client);
      });
      track(upstream);
      upstream.on('error', () => client.destroy());
    });
    client.on('error', () => {});
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    server,
    port: server.address().port,
    connects,
    close: () => { for (const socket of sockets) socket.destroy(); server.close(); },
  };
}

/** 解出响应体文本。 */
function bodyOf(response) {
  return Buffer.from(response.body, 'base64').toString('utf8');
}

test('a request is tunnelled through the proxy and reaches the target', async () => {
  const target = await startTarget((request, response) => {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({
      method: request.method,
      path: request.url,
      host: request.headers.host,
      agent: request.headers['user-agent'] ?? null,
    }));
  });
  const proxy = await startProxy();
  try {
    const transport = createProxyTransport({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    const response = await transport.send(createRequestPlan({
      url: `http://127.0.0.1:${target.port}/list?page=2`,
      method: 'GET',
      headers: [{ name: 'user-agent', value: 'nv8' }],
    }));

    assert.equal(response.status, 200);
    assert.deepEqual(JSON.parse(bodyOf(response)), {
      method: 'GET',
      path: '/list?page=2',
      // Host 必须是**目标**，写成代理会让目标虚拟主机路由错
      host: `127.0.0.1:${target.port}`,
      agent: 'nv8',
    });
    assert.deepEqual(proxy.connects, [`127.0.0.1:${target.port}`]);
  } finally {
    target.close();
    proxy.close();
  }
});

test('a request body is sent through the tunnel', async () => {
  const target = await startTarget((request, response) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      response.writeHead(201);
      response.end(JSON.stringify({
        received: Buffer.concat(chunks).toString(),
        type: request.headers['content-type'],
      }));
    });
  });
  const proxy = await startProxy();
  try {
    const transport = createProxyTransport({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    const response = await transport.send(createRequestPlan({
      url: `http://127.0.0.1:${target.port}/submit`,
      method: 'POST',
      body: { encoding: 'json', value: { q: 'shoes' } },
    }));

    assert.equal(response.status, 201);
    assert.deepEqual(JSON.parse(bodyOf(response)), {
      received: '{"q":"shoes"}',
      // body 编码规则与 fetch transport 共享，不会在两条路径上分叉
      type: 'application/json',
    });
  } finally {
    target.close();
    proxy.close();
  }
});

test('duplicate response headers are preserved', async () => {
  const target = await startTarget((request, response) => {
    response.setHeader('Set-Cookie', ['a=1; Path=/', 'b=2; Path=/']);
    response.writeHead(200);
    response.end('ok');
  });
  const proxy = await startProxy();
  try {
    const transport = createProxyTransport({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    const response = await transport.send(createRequestPlan({
      url: `http://127.0.0.1:${target.port}/`,
      method: 'GET',
    }));

    // 用 rawHeaders 而不是 headers：后者把重复项合并成一条，
    // 多个 set-cookie 会被拼起来，Cookie 解析随之出错
    const cookies = response.headers.find((entry) => entry.name === 'set-cookie');
    assert.deepEqual([...cookies.values], ['a=1; Path=/', 'b=2; Path=/']);
  } finally {
    target.close();
    proxy.close();
  }
});

test('redirects are not followed', async () => {
  const target = await startTarget((request, response) => {
    if (request.url === '/from') {
      response.writeHead(302, { location: '/to' });
      response.end();
      return;
    }
    response.writeHead(200);
    response.end('arrived');
  });
  const proxy = await startProxy();
  try {
    const transport = createProxyTransport({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    const response = await transport.send(createRequestPlan({
      url: `http://127.0.0.1:${target.port}/from`,
      method: 'GET',
    }));

    // 重定向由上层策略决定是否跟随，传输层只负责如实回报
    assert.equal(response.status, 302);
    assert.equal(bodyOf(response), '');
  } finally {
    target.close();
    proxy.close();
  }
});

test('an oversized response is cut off mid-stream', async () => {
  let sent = 0;
  const target = await startTarget((request, response) => {
    response.writeHead(200);
    const chunk = Buffer.alloc(64 * 1024, 0x61);
    let open = true;
    response.on('close', () => { open = false; });
    const pump = () => {
      if (!open) return;
      while (open && sent < 8 * 1024 * 1024 && response.write(chunk)) sent += chunk.length;
      if (open && sent < 8 * 1024 * 1024) response.once('drain', pump);
    };
    pump();
  });
  const proxy = await startProxy();
  try {
    const transport = createProxyTransport({
      proxies: [`http://127.0.0.1:${proxy.port}`],
      maxResponseBytes: 128 * 1024,
    });
    await assert.rejects(
      transport.send(createRequestPlan({ url: `http://127.0.0.1:${target.port}/big`, method: 'GET' })),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.RESPONSE_TOO_LARGE);
        assert.equal(error.retryable, false);
        // 边收边判：超出上限就断，不会先缓冲完再检查
        assert.ok(error.actual <= 128 * 1024 + 64 * 1024);
        return true;
      }
    );
  } finally {
    target.close();
    proxy.close();
  }
});

test('an unreachable proxy never falls back to a direct connection', async () => {
  let reached = false;
  const target = await startTarget((request, response) => {
    reached = true;
    response.writeHead(200);
    response.end('direct');
  });
  try {
    const transport = createProxyTransport({
      proxies: ['http://127.0.0.1:1'],
      connectTimeoutMs: 5_000,
    });
    await assert.rejects(
      transport.send(createRequestPlan({
        url: `http://127.0.0.1:${target.port}/`,
        method: 'GET',
      })),
      (error) => error.code === CollectorErrorCode.PROXY_CONNECT_FAILED
    );
    // 回落直连会泄露真实出口 IP，而且完全无声——请求成功、采集正常，
    // 等到目标把真实 IP 拉黑才发现
    assert.equal(reached, false, 'the target must not be contacted directly');
  } finally {
    target.close();
  }
});

test('a failing proxy is put into cooldown', async () => {
  const transport = createProxyTransport({
    proxies: ['http://127.0.0.1:1'],
    connectTimeoutMs: 5_000,
  });
  await assert.rejects(transport.send(createRequestPlan({ url: 'http://127.0.0.1:9/', method: 'GET' })));

  const health = transport.proxyHealth();
  assert.equal(health[0].coolingDown, true);
  // 健康快照必须可以直接进日志
  assert.ok(!JSON.stringify(health).includes('password'));
});

test('a refused CONNECT is reported as a proxy failure', async () => {
  const proxy = await startProxy({ refuse: true });
  try {
    const transport = createProxyTransport({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    await assert.rejects(
      transport.send(createRequestPlan({ url: 'http://blocked.example/', method: 'GET' })),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.PROXY_CONNECT_FAILED);
        return true;
      }
    );
  } finally {
    proxy.close();
  }
});

test('a target failure after the tunnel is established is not blamed on the proxy', async () => {
  // 目标接受连接后立刻断开：隧道本身是好的
  const targetSockets = new Set();
  const target = net.createServer((socket) => {
    targetSockets.add(socket);
    socket.destroy();
  });
  await new Promise((resolve) => target.listen(0, '127.0.0.1', resolve));
  const targetPort = target.address().port;
  const proxy = await startProxy();
  try {
    const pool = new ProxyPool({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    const transport = createProxyTransport({ proxies: pool });

    await assert.rejects(
      transport.send(createRequestPlan({
        url: `http://127.0.0.1:${targetPort}/`,
        method: 'GET',
      })),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.REQUEST_FAILED);
        return true;
      }
    );
    // 代理已经证明自己能用；因目标的问题冷却出口会把可用出口一个个误伤掉
    assert.equal(transport.proxyHealth()[0].coolingDown, false);
  } finally {
    for (const socket of targetSockets) socket.destroy();
    target.close();
    proxy.close();
  }
});

test('an existing pool can be shared across transports', async () => {
  const target = await startTarget((request, response) => {
    response.writeHead(200);
    response.end('ok');
  });
  const proxy = await startProxy();
  try {
    const pool = new ProxyPool({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    const first = createProxyTransport({ proxies: pool });
    const second = createProxyTransport({ proxies: pool });

    const url = `http://127.0.0.1:${target.port}/`;
    assert.equal((await first.send(createRequestPlan({ url, method: 'GET' }))).status, 200);
    assert.equal((await second.send(createRequestPlan({ url, method: 'GET' }))).status, 200);
    // 共享池才能共享健康状态；各自建池会让同一个坏出口被每个 transport 各踩一次
    assert.equal(pool.size, 1);
  } finally {
    target.close();
    proxy.close();
  }
});

test('an aborted signal is honoured before any connection', async () => {
  const proxy = await startProxy();
  try {
    const transport = createProxyTransport({ proxies: [`http://127.0.0.1:${proxy.port}`] });
    const controller = new AbortController();
    controller.abort();

    await assert.rejects(
      transport.send(createRequestPlan({ url: 'http://127.0.0.1:9/', method: 'GET' }), {
        signal: controller.signal,
      }),
      (error) => error.code === CollectorErrorCode.ABORTED
    );
    assert.deepEqual(proxy.connects, [], 'no CONNECT may be attempted after abort');
  } finally {
    proxy.close();
  }
});

test('maxResponseBytes must be a positive integer', () => {
  assert.throws(
    () => createProxyTransport({ proxies: ['http://h'], maxResponseBytes: 0 }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

test('a transport needs at least one proxy', () => {
  assert.throws(
    () => createProxyTransport({ proxies: [] }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});
