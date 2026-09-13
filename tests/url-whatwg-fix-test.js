/**
 * URL 解析 / 序列化与真实 Edge 的对齐回归（IKFD9Z）。
 *
 * 期望值来自本机 **真实 Edge**（Chromium，headless `--dump-dom` 探针逐项采集），
 * 并用 Node 22 的 WHATWG `URL` 交叉核对。两者在下面这些用例上一致；
 * 已知不一致的两处（Windows UNC `\\x`、`file:` 带端口）刻意不放进参考列表，
 * 详见 `url-record.js` 顶部注释。
 *
 * 覆盖四类偏差：
 *
 * 1. userinfo 二次编码 / `:` 被还原 / 空 username 丢 password
 * 2. path 吞空段、丢尾斜杠、`%2e` dot segment
 * 3. `ws:` / `wss:` / `ftp:` 默认端口未剥离
 * 4. `search` setter 不做 percent-encode
 * 5. 特殊 scheme 的反斜杠分隔符
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseUrl,
  serializeUrl,
  updateUrlComponent,
  urlOrigin,
} from '../src/infra/navigation/url-record.js';

const BASE = parseUrl('https://t.test/dir/page');

function href(input, base = BASE) {
  return serializeUrl(parseUrl(input, base));
}

function record(input) {
  return parseUrl(input, BASE);
}

// ------------------------------------------------------------- userinfo

test('userinfo keeps valid percent escapes instead of double-encoding', () => {
  // 旧实现 `encodeURIComponent` 会把 %3A 二次编码成 %253A。
  assert.equal(href('http://a%3Ab@x.test/'), 'http://a%3Ab@x.test/');
  assert.equal(href('http://a%40b@x.test/'), 'http://a%40b@x.test/');
  assert.equal(
    href('http://a%3A:b%3A@x.test/'),
    'http://a%3A:b%3A@x.test/',
  );
  // 转义大小写不做归一化，与真实 Edge 一致。
  assert.equal(href('http://a%3ab@x.test/'), 'http://a%3ab@x.test/');
  // 孤立 / 非法转义序列原样保留（userinfo 的 % 不在 encode 集合里）。
  assert.equal(href('http://%zz@x.test/'), 'http://%zz@x.test/');
});

test('userinfo separates at the last @ and encodes structural characters', () => {
  assert.equal(href('http://a@b@x.test/'), 'http://a%40b@x.test/');
  assert.equal(href('http://a:b@x.test/'), 'http://a:b@x.test/');
  // `:` 出现在 password 里必须编码，否则会再解析出一个分隔符。
  assert.equal(
    href('http://user:pass:word@x.test/'),
    'http://user:pass%3Aword@x.test/',
  );
  assert.equal(href('http://a b@x.test/'), 'http://a%20b@x.test/');
  assert.equal(href('http://a[b]@x.test/'), 'http://a%5Bb%5D@x.test/');
  assert.equal(href('http://ä@x.test/'), 'http://%C3%A4@x.test/');
});

test('userinfo setters encode `: @ / ? # [ ]` like URL.username/password', () => {
  const source = record('https://user:pass@x.test/p?q=1#h');
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'username', 'a:b')),
    'https://a%3Ab:pass@x.test/p?q=1#h',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'username', 'a@b')),
    'https://a%40b:pass@x.test/p?q=1#h',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'username', 'a/b?c#d[e]')),
    'https://a%2Fb%3Fc%23d%5Be%5D:pass@x.test/p?q=1#h',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'password', 'p:a')),
    'https://user:p%3Aa@x.test/p?q=1#h',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'password', 'p@ss')),
    'https://user:p%40ss@x.test/p?q=1#h',
  );
  // 合法转义不二次编码。
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'username', '%3A')),
    'https://%3A:pass@x.test/p?q=1#h',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'password', 'p%zzq')),
    'https://user:p%zzq@x.test/p?q=1#h',
  );
});

test('an empty username with a non-empty password keeps the leading colon', () => {
  // `new URL('http://:secret@x/').href` === 'http://:secret@x/'
  assert.equal(href('http://:pass@x.test/'), 'http://:pass@x.test/');
  const cleared = updateUrlComponent(
    updateUrlComponent(record('http://u:p@x.test/p'), 'password', 'x'),
    'username',
    '',
  );
  assert.equal(serializeUrl(cleared), 'http://:x@x.test/p');
  const passwordOnly = updateUrlComponent(record('http://x.test/p'), 'password', 'p');
  assert.equal(serializeUrl(passwordOnly), 'http://:p@x.test/p');
  // 反方向：username 有值、password 为空时不输出多余冒号。
  assert.equal(
    serializeUrl(updateUrlComponent(record('http://u:p@x.test/p'), 'password', '')),
    'http://u@x.test/p',
  );
});

// ------------------------------------------------------------- path

test('path normalization preserves empty segments', () => {
  assert.equal(href('https://x.test/a//b'), 'https://x.test/a//b');
  assert.equal(href('a//b'), 'https://t.test/dir/a//b');
  assert.equal(href('/a//b'), 'https://t.test/a//b');
});

test('dot segments fold while keeping the trailing-slash semantics', () => {
  const cases = [
    ['https://x.test/a/b/..', 'https://x.test/a/'],
    ['https://x.test/a/b/.', 'https://x.test/a/b/'],
    ['https://x.test/a/..', 'https://x.test/'],
    ['https://x.test/a/../', 'https://x.test/'],
    ['https://x.test/..', 'https://x.test/'],
    ['https://x.test/.', 'https://x.test/'],
    ['https://x.test/a//../b', 'https://x.test/a/b'],
    ['https://x.test/a/b/../../..', 'https://x.test/'],
    ['https://x.test/a/b/../c', 'https://x.test/a/c'],
    ['a/..', 'https://t.test/dir/'],
    ['a/b/..', 'https://t.test/dir/a/'],
    ['.', 'https://t.test/dir/'],
    ['..', 'https://t.test/'],
    // 根处的 `..` 之后紧跟 `//` 时，空段不会把根斜杠挤掉。
    ['https://x.test/./..//a', 'https://x.test//a'],
    ['https://x.test/..//a', 'https://x.test//a'],
    ['https://x.test/a//..', 'https://x.test/a/'],
    ['https://x.test/a/..//', 'https://x.test//'],
    ['https://x.test//..', 'https://x.test/'],
    ['https://x.test/..//..', 'https://x.test/'],
    ['https://x.test/a/..//..', 'https://x.test/'],
  ];
  for (const [input, expected] of cases) {
    assert.equal(href(input), expected, input);
  }
});

test('percent-encoded dot segments fold like literal ones', () => {
  // WHATWG 的 dot segment 判定包含 `.` / `%2e` 的组合（大小写不敏感）。
  assert.equal(href('https://x.test/a/%2e%2e/b'), 'https://x.test/b');
  assert.equal(href('https://x.test/a/%2E./b'), 'https://x.test/b');
  assert.equal(href('https://x.test/a/.%2e/b'), 'https://x.test/b');
  assert.equal(href('https://x.test/a/%2e/b'), 'https://x.test/a/b');
});

test('pathname setter uses the same segment rules', () => {
  const source = record('https://x.test/');
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'pathname', 'a//b')),
    'https://x.test/a//b',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'pathname', 'a/b/..')),
    'https://x.test/a/',
  );
});

// ------------------------------------------------------------- ports

test('special schemes strip their own default ports', () => {
  assert.equal(href('ws://x:80/'), 'ws://x/');
  assert.equal(href('wss://x:443/'), 'wss://x/');
  assert.equal(href('ftp://x:21/'), 'ftp://x/');
  assert.equal(href('http://x:80/'), 'http://x/');
  assert.equal(href('https://x:443/'), 'https://x/');
  // 非默认端口保留：ftp 的 80、http 的 443 都不是各自的默认端口。
  assert.equal(href('ftp://x:80/'), 'ftp://x:80/');
  assert.equal(href('http://x:443/'), 'http://x:443/');
});

test('origin follows the stripped port', () => {
  assert.equal(urlOrigin(record('ws://x:80/')), 'ws://x');
  assert.equal(urlOrigin(record('wss://x:443/')), 'wss://x');
  assert.equal(urlOrigin(record('ftp://x:21/')), 'ftp://x');
  assert.equal(urlOrigin(record('http://x:8080/')), 'http://x:8080');
});

test('protocol setter re-evaluates the default port', () => {
  const source = record('http://x.test:80/p');
  assert.equal(
    serializeUrl(updateUrlComponent(source, 'protocol', 'ws')),
    'ws://x.test/p',
  );
  assert.equal(
    serializeUrl(updateUrlComponent(record('https://x.test:443/p'), 'protocol', 'wss')),
    'wss://x.test/p',
  );
});

// ------------------------------------------------------------- search

test('the search setter percent-encodes like URL.search', () => {
  const source = record('https://user:pass@x.test/p?q=1#h');
  const search = (value) => serializeUrl(updateUrlComponent(source, 'search', value));
  assert.equal(search('a#b'), 'https://user:pass@x.test/p?a%23b#h');
  assert.equal(search('a b'), 'https://user:pass@x.test/p?a%20b#h');
  assert.equal(search('#frag'), 'https://user:pass@x.test/p?%23frag#h');
  assert.equal(search('ä'), 'https://user:pass@x.test/p?%C3%A4#h');
  // `'` 在真实 Chromium 的 query 中一律编码，无论 scheme 是否特殊。
  assert.equal(search("a'b"), 'https://user:pass@x.test/p?a%27b#h');
  // 合法转义保留，一个前导 `?` 被剥掉。
  assert.equal(search('%3A'), 'https://user:pass@x.test/p?%3A#h');
  assert.equal(search('?a=1'), 'https://user:pass@x.test/p?a=1#h');
  // 空串清除 query，fragment 不受影响。
  assert.equal(search(''), 'https://user:pass@x.test/p#h');
});

test('opaque-path search setter gets the same encoding', () => {
  const opaque = parseUrl('mailto:a@b.com');
  assert.equal(
    serializeUrl(updateUrlComponent(opaque, 'search', 'q=a#b')),
    'mailto:a@b.com?q=a%23b',
  );
});

// ------------------------------------------------------------- backslash

test('backslashes are path separators for special schemes', () => {
  assert.equal(href('http://a\\b/'), 'http://a/b/');
  assert.equal(href('http:\\\\a\\b'), 'http://a/b');
  // 相对输入也适用（base 是 https）。
  assert.equal(href('\\x'), 'https://t.test/x');
  // query / fragment 里的 `\` 是普通字符，不参与替换。
  assert.equal(href('https://a\\b?q=\\#h'), 'https://a/b?q=\\#h');
  // 非特殊 scheme 的主机仍把 `\` 当禁用字符。
  assert.throws(() => parseUrl('nv8-unknown://a\\b'), TypeError);
});

// ------------------------------------------------------------- Node 对照

test('the fixed cases agree with Node WHATWG URL', () => {
  // 这些用例在真实 Edge 与 Node 22 上逐字一致，用 `new URL` 当活参照，
  // 防止以后把某个期望值写错。
  const cases = [
    ['http://a%3Ab@x.test/'],
    ['http://a@b@x.test/'],
    ['http://:pass@x.test/'],
    ['http://user:@x.test/'],
    ['http://user:pass:word@x.test/'],
    ['http://a b@x.test/'],
    ['http://a[b]@x.test/'],
    ['https://x.test/a//b'],
    ['https://x.test/a/b/..'],
    ['https://x.test/a/b/.'],
    ['https://x.test/a/../'],
    ['https://x.test/a/%2e%2e/b'],
    ['ws://x:80/'],
    ['wss://x:443/'],
    ['ftp://x:21/'],
    ['ftp://x:80/'],
    ['http://x:443/'],
    ['http://a\\b/'],
    ['http:\\\\a\\b'],
    ['https://a\\b?q=\\#h'],
  ];
  for (const [input] of cases) {
    assert.equal(
      href(input),
      new URL(input).href,
      `${input} must match the WHATWG parser`,
    );
  }
  for (const [input, base] of [
    ['a/..', 'https://t.test/dir/page'],
    ['a//b', 'https://t.test/dir/page'],
    ['\\x', 'https://t.test/dir/page'],
  ]) {
    assert.equal(
      href(input, parseUrl(base)),
      new URL(input, base).href,
      `${input} against ${base}`,
    );
  }
});
