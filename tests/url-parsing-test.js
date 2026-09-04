import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseUrl,
  serializeUrl,
  updateUrlComponent,
  urlOrigin,
} from '../src/infra/navigation/url-record.js';

/**
 * URL 主机解析的校验与规范化。
 *
 * 这一层直接测 `url-record.js`，不经过 Realm：主机解析是纯函数，套一层沙箱
 * 只会让一次失败要多花 1 秒才能定位，而且看不出是哪个字符分类错了。
 * `new URL()` 在 Realm 里的最终行为由 `edge-behavior-parity-test.js` 的
 * `urlParsing` 8 项探针对着真实 Edge 锁定，两层职责不重叠。
 *
 * **基准是真实浏览器，不是规范条文，也不是 Node 的 `URL`。** 三者对同一个
 * 输入会给出不同结论，最典型的是主机里的空格：
 *
 * | 输入 | 真实 Edge | Node | WHATWG 条文 |
 * |---|---|---|---|
 * | `https://a b/` | `https://a%20b/` | THROWS | 失败 |
 *
 * 所以主机字符必须分**三类**（safe / escape / forbidden）而不是两类。
 * 只分两类的实现无论选哪一侧都错：全放过 → `http://%` 不抛；全拒绝 →
 * `https://a b/` 误抛。
 */

const BASE = parseUrl('https://t.test/dir/page');

function href(input, base = BASE) {
  return serializeUrl(parseUrl(input, base));
}

function throws(input, base = BASE) {
  assert.throws(() => parseUrl(input, base), TypeError, `${input} should be rejected`);
}
// ------------------------------------------------------ forbidden：必须失败

test('invalid percent escapes in the host are rejected', () => {
  // 孤立的 `%` 不是合法转义序列。真实 Edge 抛 TypeError。
  throws('http://%');
  throws('http://a%/');
  throws('http://a%zz/');
  throws('http://a%2/');
});

test('percent escapes that decode to a forbidden byte are rejected', () => {
  // `%2F` → `/`、`%3A` → `:`、`%00` → NUL：解码后都是禁用字符，
  // 只看原始字符串会全部放过。
  throws('http://a%2Fb/');
  throws('http://a%3Ab/');
  throws('http://a%00b/');
  // `%25` → `%`，`%` 本身在 domain 主机里也是禁用的。
  throws('http://a%25b/');
});

test('unterminated IPv6 literals are rejected', () => {
  throws('http://[');
  throws('http://[::1/');
  throws('http://[not-ipv6]/');
});

test('an empty host is rejected for special schemes except file:', () => {
  throws('http://');
  throws('https://');
  throws('ws://');
  // `file:` 的空主机是合法的，第三个斜杠属于路径。
  assert.equal(href('file:///etc/passwd'), 'file:///etc/passwd');
  // 非特殊 scheme 也允许空主机。
  assert.equal(href('nv8-unknown:///p'), 'nv8-unknown:///p');
});

test('a non-numeric port fails the whole parse', () => {
  // 端口按**最左**冒号切分：`a:b:c` 的端口是 `b:c`，非法。
  // 按最右冒号切会把 `a:b` 当成主机名静默放过。
  throws('http://a:b:c/');
  throws('http://host:port/');
  throws('http://host:8080x/');
  throws('http://host:99999/');
});

test('structural delimiters inside the host are rejected', () => {
  for (const character of ['<', '>', '^', '|', '\\', ']']) {
    throws(`http://a${character}b/`);
  }
});

// ------------------------------------------------------ escape：编码而非失败

test('characters Chromium escapes are encoded, not rejected', () => {
  // 这一组的判定与规范条文相反。依据是 Chromium `url_canon_host.cc` 的
  // `kHostCharLookup`，它把这些字符标成 escape 而不是 invalid。
  assert.equal(href('https://a b/'), 'https://a%20b/');
  assert.equal(href('https://a"b/'), 'https://a%22b/');
  assert.equal(href('https://a{b}/'), 'https://a%7Bb%7D/');
  assert.equal(href('https://a`b/'), 'https://a%60b/');
  assert.equal(href("https://a'b/"), 'https://a%27b/');
});

test('already-escaped safe bytes survive unchanged', () => {
  // `%20` 解码是空格，属于 escape 类而不是 forbidden，所以原样保留。
  assert.equal(href('http://a%20b/'), 'http://a%20b/');
  // 转义序列统一大写，与浏览器一致。
  assert.equal(href('http://a%2bb/'), 'http://a%2Bb/');
});

// ------------------------------------------------------ safe：原样保留

test('unreserved host characters keep their literal form', () => {
  assert.equal(href('http://a-b_c.d~e/'), 'http://a-b_c.d~e/');
});

test('the host is lower-cased but credentials and path are not', () => {
  assert.equal(
    href('http://User:Pass@Example.COM/A/B'),
    'http://User:Pass@example.com/A/B',
  );
});

// ------------------------------------------------------ 路径与 scheme

test('special schemes get a root path, non-special schemes do not', () => {
  // 给未知 scheme 补尾斜杠是一处可检测偏差：真实 Edge 给
  // `nv8-unknown://x`，NV8 曾给 `nv8-unknown://x/`。
  assert.equal(href('nv8-unknown://x'), 'nv8-unknown://x');
  assert.equal(href('http://x'), 'http://x/');
  assert.equal(href('ws://x'), 'ws://x/');
  assert.equal(href('ftp://x'), 'ftp://x/');
});

test('special schemes ignore extra slashes after the scheme', () => {
  // `http:///a` 在真实浏览器里等价于 `http://a/`。
  assert.equal(href('http:///a'), 'http://a/');
  assert.equal(href('http:////a/b'), 'http://a/b');
});

test('scheme-relative and path-relative inputs resolve against the base', () => {
  assert.equal(href('//x'), 'https://x/');
  assert.equal(href('sub'), 'https://t.test/dir/sub');
  assert.equal(href('/root'), 'https://t.test/root');
  assert.equal(href('../up'), 'https://t.test/up');
  assert.equal(href('?q=1'), 'https://t.test/dir/page?q=1');
  assert.equal(href('#frag'), 'https://t.test/dir/page#frag');
});

test('a valid URL passes through untouched', () => {
  assert.equal(href('https://ok.test/p?q=1#h'), 'https://ok.test/p?q=1#h');
});

// ------------------------------------------------------ 端口归一化

test('default ports are dropped and leading zeros normalized', () => {
  assert.equal(href('http://x:80/'), 'http://x/');
  assert.equal(href('https://x:443/'), 'https://x/');
  assert.equal(href('http://x:080/'), 'http://x/');
  assert.equal(href('http://x:8080/'), 'http://x:8080/');
  assert.equal(href('http://x:0/'), 'http://x:0/');
  assert.equal(href('http://x:65535/'), 'http://x:65535/');
});

test('IPv6 hosts keep their brackets and accept a port', () => {
  assert.equal(href('http://[::1]/'), 'http://[::1]/');
  assert.equal(href('http://[::1]:8080/'), 'http://[::1]:8080/');
  assert.equal(href('http://[2001:DB8::1]/'), 'http://[2001:db8::1]/');
  assert.equal(urlOrigin(parseUrl('http://[::1]:8080/')), 'http://[::1]:8080');
});

// ------------------------------------------------------ setter 语义

/**
 * 规范要求组件 setter 对非法值**静默忽略**，不抛。
 *
 * 这条与构造器相反，所以主机解析器返回 `null` 而不是自己抛——由调用方决定
 * 是抛还是忽略。解析器内部抛的话 setter 就得包 try/catch，而 catch 住的
 * 异常无法区分「值非法」和「实现有 bug」。
 */
test('component setters ignore invalid values instead of throwing', () => {
  const record = parseUrl('http://host.test:8080/p');
  for (const [component, value] of [
    ['host', 'a:b:c'],
    ['host', 'a<b'],
    ['hostname', 'a/b'],
    ['hostname', '%'],
    ['port', 'abc'],
    ['port', '99999'],
  ]) {
    assert.equal(
      serializeUrl(updateUrlComponent(record, component, value)),
      'http://host.test:8080/p',
      `${component} = ${value} should be ignored`,
    );
  }
});

test('component setters apply valid values', () => {
  const record = parseUrl('http://host.test:8080/p');
  assert.equal(
    serializeUrl(updateUrlComponent(record, 'hostname', 'Other.Test')),
    'http://other.test:8080/p',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(record, 'host', 'other.test:99')),
    'http://other.test:99/p',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(record, 'port', '80')),
    'http://host.test/p',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(record, 'hostname', 'a b')),
    'http://a%20b:8080/p',
  );
});

test('the href setter rejects an invalid URL', () => {
  const record = parseUrl('http://host.test/p');
  assert.throws(
    () => updateUrlComponent(record, 'href', 'http://%'),
    TypeError,
  );
});

// ------------------------------------------------------ blob:

test('blob URLs keep their inner origin and survive a malformed inner URL', () => {
  const record = parseUrl('blob:https://x.test/abc');
  assert.equal(serializeUrl(record), 'blob:https://x.test/abc');
  assert.equal(urlOrigin(record), 'https://x.test');
  // 内层 URL 解析失败不能让整个 blob: URL 抛——真实浏览器给 opaque origin。
  assert.equal(urlOrigin(parseUrl('blob:http://%/abc')), 'null');
  assert.equal(urlOrigin(parseUrl('blob:abc')), 'null');
});

// ------------------------------------------------------ opaque path

/**
 * 有 scheme 但没有 `//` 的 URL —— WHATWG 的 opaque path。
 *
 * 原实现完全不认它们，后果分两种，**第二种更糟**：
 *
 * | 输入 | 原行为 | 真实浏览器 |
 * |---|---|---|
 * | `new URL('mailto:a@b.com')` | THROWS | `mailto:a@b.com` |
 * | `new URL('mailto:a@b.com', base)` | `https://t.test/dir/mailto:a@b.com` | `mailto:a@b.com` |
 *
 * 抛错至少是显式失败；带 base 时它**静默**拼成一个 http URL，origin 还成了父
 * 页面的。脚本拿这个结果去比对、去发请求、去判同源，都会走到完全错误的分支。
 *
 * 这一组不存在「浏览器与规范打架」的情况（不像主机里的空格），
 * 所以按规范实现即可。
 */

test('schemes without // parse as opaque-path URLs', () => {
  for (const [input, expected] of [
    ['about:blank', 'about:blank'],
    ['mailto:a@b.com', 'mailto:a@b.com'],
    ['data:text/plain,hi', 'data:text/plain,hi'],
    ['javascript:void 0', 'javascript:void 0'],
    ['tel:+123', 'tel:+123'],
    ['urn:isbn:1', 'urn:isbn:1'],
    ['about:blank#frag', 'about:blank#frag'],
    ['mailto:a@b?x=1', 'mailto:a@b?x=1'],
  ]) {
    assert.equal(href(input), expected, `${input} with a base`);
    assert.equal(href(input, null), expected, `${input} without a base`);
  }
});

test('an absolute opaque-path URL ignores the base entirely', () => {
  // 这条是这组里最重要的：原实现会把它拼到 base 的目录下，
  // 变成一个 origin 属于父页面的 https URL——静默且错得彻底。
  assert.equal(href('mailto:a@b.com'), 'mailto:a@b.com');
  assert.notEqual(href('mailto:a@b.com'), 'https://t.test/dir/mailto:a@b.com');
});

test('opaque-path URLs have an opaque origin', () => {
  for (const input of ['about:blank', 'mailto:a@b.com', 'data:text/plain,x']) {
    assert.equal(urlOrigin(parseUrl(input)), 'null', input);
  }
});

test('non-special schemes with an authority also have an opaque origin', () => {
  // 元组 origin 只属于特殊 scheme。拼出 `protocol//host` 会让两个
  // `nv8-unknown://x` 被判成同源——同源判断错在放宽方向上，比报错危险。
  assert.equal(urlOrigin(parseUrl('nv8-unknown://x')), 'null');
  assert.equal(urlOrigin(parseUrl('about://x')), 'null');
  // 特殊 scheme 不受影响
  assert.equal(urlOrigin(parseUrl('https://ok.test:8443/p')), 'https://ok.test:8443');
  assert.equal(urlOrigin(parseUrl('file:///etc/passwd')), 'file://');
});

test('special schemes without // still get an authority', () => {
  // 规范的 "special authority ignore slashes state" 会跳过缺失或多余的斜杠。
  // 不处理这条的话 `http:example.com/` 会被当成 opaque path，origin 变 null。
  assert.equal(href('http:example.com/p'), 'http://example.com/p');
  assert.equal(href('https:/foo'), 'https://foo/');
  assert.equal(urlOrigin(parseUrl('http:example.com/p')), 'http://example.com');
});

test('an opaque-path base only accepts a fragment', () => {
  const opaque = parseUrl('mailto:a@b.com');
  assert.equal(href('#f', opaque), 'mailto:a@b.com#f');
  assert.equal(href('', opaque), 'mailto:a@b.com');
  // `mailto:a@b` 没有目录结构可以拼，相对路径必须失败而不是编一个结果
  throws('x', opaque);
  throws('/y', opaque);
});

test('opaque-path setters ignore authority and path, but accept query and hash', () => {
  const opaque = parseUrl('mailto:a@b.com');
  for (const component of ['host', 'hostname', 'port', 'pathname']) {
    assert.equal(
      serializeUrl(updateUrlComponent(opaque, component, 'zzz')),
      'mailto:a@b.com',
      `${component} must be ignored on an opaque path`,
    );
  }
  assert.equal(serializeUrl(updateUrlComponent(opaque, 'hash', 'h')), 'mailto:a@b.com#h');
  assert.equal(serializeUrl(updateUrlComponent(opaque, 'search', 'q=1')), 'mailto:a@b.com?q=1');
});

test('a single-letter scheme is still a scheme', () => {
  // `C:/x` 看起来像 Windows 路径，但 `C` 是合法 scheme，浏览器按 URL 解析。
  // 这条锁住「不要为了照顾路径写法而放弃 scheme 判定」。
  assert.equal(href('C:/x'), 'c:/x');
});
