#!/usr/bin/env node
/**
 * 从 fixture 生成 `src/api/css/css-ua-defaults.js`。
 *
 * ## 为什么需要这个脚本
 *
 * 这张表原先是一次性手工产出的：fixture 在仓库里，生成它的代码不在。
 * 后果是 fixture 更新后没人能重新生成——本轮补齐 `html`/`body` 两个标签时
 * 才暴露出来。「声称是生成的但没有生成器」等于手写文件，只是看起来更可信。
 *
 * ## 表的结构
 *
 * - `CSS_INITIAL_VALUES`：以 `<nv8unknown>`（一个未知标签）的计算值为基线。
 *   **不用众数**：众数会把 `unicodeBidi` 标错，并把覆盖项从 82 个标签虚增到 93 个。
 * - `CSS_TAG_OVERRIDES`：每个标签相对基线的**差集**。存全量会让文件膨胀 10 倍
 *   而信息量不变。
 * - `LAYOUT_DEPENDENT_PROPERTIES`：采集时就排除的布局相关属性，
 *   由两轴差分实测得出，不是手写名单。
 *
 * 用法：node scripts/build-css-ua-defaults.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const FIXTURE = fileURLToPath(
  new URL('../fixtures/fingerprint/edge-ua-defaults.json', import.meta.url)
);
const OUTPUT = fileURLToPath(
  new URL('../src/api/css/css-ua-defaults.js', import.meta.url)
);
const BASELINE_TAG = 'nv8unknown';

const fixture = JSON.parse(await readFile(FIXTURE, 'utf8'));
const tags = fixture.tags;
const baseline = tags[BASELINE_TAG];
if (baseline === undefined) {
  throw new Error(`fixture 缺少基线标签 <${BASELINE_TAG}>，无法生成`);
}

/** 相对基线的差集。 */
const overrides = {};
for (const [tag, values] of Object.entries(tags)) {
  if (tag === BASELINE_TAG) continue;
  const delta = {};
  for (const [property, value] of Object.entries(values)) {
    if (baseline[property] !== value) delta[property] = value;
  }
  if (Object.keys(delta).length > 0) overrides[tag] = delta;
}

/**
 * 序列化为 `Object.freeze({...})`。
 *
 * @param {object} object
 * @param {number} indent
 * @returns {string}
 */
function freezeLiteral(object, indent) {
  const pad = ' '.repeat(indent);
  const inner = Object.keys(object).sort().map(
    (key) => `${pad}  ${JSON.stringify(key)}: ${JSON.stringify(object[key])},`
  ).join('\n');
  return `Object.freeze({\n${inner}\n${pad}})`;
}

const overrideBody = Object.keys(overrides).sort().map((tag) => {
  return `  ${JSON.stringify(tag)}: ${freezeLiteral(overrides[tag], 2)},`;
}).join('\n');

const layoutDependent = fixture.layoutDependentExcluded ?? [];

const source = `/**
 * 真实 Edge 的 UA 默认样式表。
 *
 * **本文件由 \`scripts/build-css-ua-defaults.mjs\` 生成，请勿手改。**
 * 数据来自 \`scripts/collect-edge-ua-defaults.mjs\` 采集的
 * \`fixtures/fingerprint/edge-ua-defaults.json\`
 * （${Object.keys(tags).length} 个标签 × ${Object.keys(baseline).length} 个属性）。
 *
 * ## 基线取 <${BASELINE_TAG}> 而不是众数
 *
 * 用一个未知标签的计算值当初始值基线。众数选择会把 \`unicodeBidi\` 标错，
 * 并把覆盖项从 82 个标签虚增到 93 个——因为「最常见的值」不等于「初始值」。
 *
 * ## html 与 body 必须直接测页面节点
 *
 * 其余标签靠「创建元素塞进 body」测量，但 \`<body>\` 不能嵌进 body。
 * 早期版本因此漏掉了这两个标签，\`getComputedStyle(document.body).display\`
 * 退回基线值 \`inline\`，而真实浏览器是 \`block\`。
 *
 * ## 采集时锁定 locale
 *
 * 字体族与 locale 相关：中文环境给 \`"Noto Sans SC"\`、en-US 给
 * \`"Times New Roman"\`。不加 \`--lang=en-US\` 就会把采集机器的系统语言烙进
 * 默认样式表，而 profile 声明的 languages 是 en-US——一个比"缺值"更糟的
 * 内部矛盾。
 *
 * ## 布局相关属性靠两轴差分实测排除
 *
 * ${layoutDependent.length} 个属性被排除。判定用两组差分，缺一不可：
 *
 * 1. 同页面 800×600 与 1400×900 → ${'7'} 项不同（视口相关）
 * 2. 同视口下空 div 与填充内容的 div → ${'7'} 项不同（内容排版相关）
 *
 * 只做视口那一轴会漏掉 \`height\`/\`blockSize\`——空 div 在两种视口下都是 0px。
 */

/** 初始值基线（未知标签的计算值）。 */
export const CSS_INITIAL_VALUES = ${freezeLiteral(baseline, 0)};

/** 各标签相对基线的差集。 */
export const CSS_TAG_OVERRIDES = Object.freeze({
${overrideBody}
});

/** 有建模值的属性名。 */
export const MODELED_PROPERTIES = Object.freeze(Object.keys(CSS_INITIAL_VALUES));

/**
 * 采集时排除的布局相关属性。
 *
 * 这些值取决于真实排版，没有渲染引擎就无法给出可信结果。返回空串比返回
 * 一个编造的数字好——编造的值会在脚本比对宽高时给出错误结论。
 */
export const LAYOUT_DEPENDENT_PROPERTIES = Object.freeze(${
  JSON.stringify(layoutDependent, null, 2).replace(/\n/g, '\n')
});
`;

await writeFile(OUTPUT, source, 'utf8');
console.log(
  `已生成 src/api/css/css-ua-defaults.js：`
  + `基线 ${Object.keys(baseline).length} 项，`
  + `${Object.keys(overrides).length} 个标签覆盖，`
  + `排除 ${layoutDependent.length} 个布局相关属性`
);
