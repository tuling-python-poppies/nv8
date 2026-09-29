/**
 * 行内文本度量 —— offsetWidth/offsetHeight 对文本的尺寸来源
 *
 * ## 修复前的破绽
 *
 * 引擎没有字形度量：`<span style="font-size:114px">text</span>` 这种只含文本、
 * 无显式宽高的行内元素，`offsetWidth` / `offsetHeight` 一律量成 0。瑞数（RS6）的
 * 字体枚举探针正是拿这个 0 抓「非真浏览器」：它塞一段固定文本 `mmmmmmmmmmmlliii`
 * （16 字符、114px），逐个改 `span.style.fontFamily`，比较 `offsetWidth` 是否变化
 * 来判断某字体是否装机。真浏览器每个装机字体给出不同宽度，我们全 0，直接露馅。
 *
 * ## 基准（真实 Chrome，zh-CN + Windows 11，逐字体采集 482 个候选）
 *
 * 未装字体回退到浏览器默认字体 → `[1320, 165]`；下面是几类代表值。完整 482 项由
 * `js_reverse_cache/iv8/verify_model.mjs` 对 `font-metrics.js` 做 482/482 校验。
 *
 * ## 两个机制缺一不可
 *
 * 1. **字体 → 度量**（`font-metrics.js` + `element-layout.js`）：装机字体各有度量，
 *    未装的落到默认。
 * 2. **CSSOM font-family 校验**（`css-style-declaration-properties.js`）：非法的未加
 *    引号字体名（数字开头、含 `.`）被拒绝并保留原值，于是量出上一个合法字体的度量
 *    ——RS6 观察到的「继承假象」。少了它，`"Helvetica Neue LT Pro 35 Thin"` 会落到
 *    默认字体而非上一个 `Verdana`，与真实浏览器对不上。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  measureText,
  resolveFontMetric,
  DEFAULT_METRIC,
} from '../src/infra/fingerprint/font-metrics.js';

// ---- 基准条件（16 字符、114px）下的真实 Chrome 度量 [宽, 高] ----
// 2026-09-29 以真机 Edge 154 复测重校：补 19 个已装字体（缺失会让「已装」判成
// 「未装」）、修正 tahoma/Georgia/Times New Roman 高度 +1。
const EXPECTED = {
  mmllii: [1320, 165],           // 合法名但未装 → 默认
  SimHei: [912, 114],
  'Microsoft YaHei': [1327, 151],
  Arial: [1171, 127],
  helvetica: [1171, 127],        // Chrome 把 helvetica 别名到 Arial
  Verdana: [1376, 139],
  verdana: [1376, 139],          // 大小写不敏感
  tahoma: [1184, 138],
  Georgia: [1270, 130],
  'Times New Roman': [1134, 127],
  'Courier New': [1095, 129],
  'Microsoft Himalaya': [759, 114],
  'Segoe UI': [1218, 152],
  Consolas: [1003, 134],
  Calibri: [1133, 140],
  'Comic Sans MS': [1133, 159],
  'Lucida Console': [1099, 114],
  Wingdings: [1632, 126],
  serif: [1411, 164],
  monospace: [912, 114],
  cursive: [912, 114],
  fantasy: [1123, 139],
  FangSongGB2312: [1320, 165],   // 未装 → 默认
  'sans-serif': [1320, 165],     // 实测等于默认（Chrome 标准字体即 sans-serif）
};

const RS6_TEXT = 'mmmmmmmmmmmlliii';

// ------------------------------------------------------ 纯函数层

test('measureText reproduces the real-Chrome metric at the RS6 reference', () => {
  for (const [font, [w, h]] of Object.entries(EXPECTED)) {
    const m = measureText(RS6_TEXT, font, 114);
    assert.deepEqual([m.width, m.height], [w, h], `${font}`);
  }
});

test('font-family lists resolve to the first available font', () => {
  // 第一个装了的胜出；都没装则默认
  assert.deepEqual(resolveFontMetric('NoSuchFont, Arial, serif'), [1171, 127]);
  // 2026-09-29 起 Noto Sans SC 已按真机实测入表（此前缺失会误判为未装）
  assert.deepEqual(resolveFontMetric('"Noto Sans SC", monospace'), [1320, 165]);
  assert.deepEqual(resolveFontMetric('"Not Installed Font", monospace'), [912, 114]);
  assert.deepEqual([...resolveFontMetric('NoSuchFont')], [...DEFAULT_METRIC]);
});

test('width scales with character count, height with font-size only', () => {
  // 高只跟字号走，与字符数无关（单行行高）
  const a = measureText('mm', 'SimHei', 114);
  const b = measureText('mmmm', 'SimHei', 114);
  assert.equal(a.height, b.height);
  assert.equal(b.width, 2 * a.width);
});

// ------------------------------------------------------ 端到端（真实引擎）

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

const PROBE = `JSON.stringify((() => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.innerHTML = '<span lang="zh" style="font-family:mmllii;font-size:114px">${RS6_TEXT}</span>';
  const span = div.children[0];
  const out = { mmllii: [span.offsetWidth, span.offsetHeight] };
  for (const font of ${JSON.stringify(Object.keys(EXPECTED).filter(f => f !== 'mmllii'))}) {
    span.style.fontFamily = font;
    out[font] = [span.offsetWidth, span.offsetHeight];
  }
  return out;
})())`;

const INHERITANCE_PROBE = `JSON.stringify((() => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.innerHTML = '<span style="font-family:mmllii;font-size:114px">${RS6_TEXT}</span>';
  const span = div.children[0];
  span.style.fontFamily = 'Verdana';
  const valid = [span.offsetWidth, span.offsetHeight];
  // 非法（"35" 数字开头）：真实 Edge 拒绝赋值，保留 Verdana
  span.style.fontFamily = 'Helvetica Neue LT Pro 35 Thin';
  const rejected = [span.offsetWidth, span.offsetHeight];
  const readback = span.style.fontFamily;
  return { valid, rejected, readback };
})())`;

async function runProbe(code) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://font.test/page', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
  });
  try {
    return JSON.parse(await sandbox.run(code));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

test('inline text elements measure to the real-Chrome font metrics', async () => {
  const out = await runProbe(PROBE);
  for (const [font, [w, h]] of Object.entries(EXPECTED)) {
    assert.deepEqual(out[font], [w, h], `${font} offsetWidth/Height`);
  }
});

test('an invalid font-family is rejected and keeps the previous value', async () => {
  const { valid, rejected, readback } = await runProbe(INHERITANCE_PROBE);
  assert.deepEqual(valid, [1376, 139], 'Verdana baseline');
  // 非法值被拒 → 仍是 Verdana 的度量（继承假象），不是默认 1320/165
  assert.deepEqual(rejected, [1376, 139], 'invalid name inherits Verdana');
  assert.equal(readback, 'Verdana', 'style.fontFamily unchanged by invalid set');
});
