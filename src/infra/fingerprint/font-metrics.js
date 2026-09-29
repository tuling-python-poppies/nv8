/**
 * 文本度量表：`offsetWidth` / `offsetHeight` / `getBoundingClientRect` 对**行内
 * 文本**的尺寸来源。
 *
 * ## 为什么要有它
 *
 * 引擎原来完全没有字形度量：任何只含文本、没有显式宽高的行内元素
 * （`<span>text</span>`）都量成 0。瑞数（RS6）的字体枚举探针正是靠这个 0
 * 抓出「这不是真浏览器」——它塞一段固定文本，逐个换 `font-family`，比较
 * `offsetWidth` 是否变化来判断某字体是否装机。真浏览器每个字体给出不同的宽度，
 * 我们全 0，直接暴露。
 *
 * ## 实测基准（真实 Chrome，zh-CN + Windows 11）
 *
 * RS6 探针的度量条件是**固定**的：16 字符的字符串 `mmmmmmmmmmmlliii`、
 * `font-size:114px`。下表每一项是该条件下真实浏览器量到的 `[宽, 高]`（CSS px）。
 * 采集机上 482 个候选字体里：25 个装了（度量与默认值不同），其余落到浏览器默认
 * 字体（`DEFAULT_METRIC`）。
 *
 * ## 这张表里哪些跟机器相关
 *
 * - **装机字体清单**（simhei / arial / …）是**可覆盖的 profile 值**——它描述
 *   「被模拟的这台机器装了哪些字体」，不是开发机的真理。换 profile 就该换这张表，
 *   与 `ua-default-fonts.js` / `gpu-profiles.js` 同一套路。
 * - **通用族**（serif / monospace / cursive / fantasy）与机器无关，浏览器一定给得出。
 *   `sans-serif` 实测**等于**默认字体（Chrome 的标准字体就是 sans-serif），所以
 *   故意不进表，走 `DEFAULT_METRIC`。
 * - **每 px 的推导比例**（宽/字符/px、高/px）才是跨机不变的部分。基准量在 114px，
 *   在该点是精确的；换字号按线性缩放，是近似——RS6 只用 114px，对它精确。
 *   ponytail: 线性 per-char 模型，字号/字符数偏离基准点时为近似；若日后发现 RS6
 *   对其它字号/字符串也哈希原始宽度，再升级为 per-glyph 度量表。
 */

/** RS6 探针的基准度量条件：16 字符、114px。 */
export const REFERENCE_CHARS = 16;
export const REFERENCE_PX = 114;

/** 未装机字体 / 未知字体 / 浏览器默认字体的度量（== 真实 Chrome 的 `mmllii` 回退值）。 */
export const DEFAULT_METRIC = Object.freeze([1320, 165]);

/**
 * 字体族 → 基准条件下的 `[宽, 高]`。键为大小写折叠后的字体名（CSS 字体匹配对
 * ASCII 大小写不敏感，实测 `Verdana` == `verdana`、`Arial` == `helvetica`）。
 */
const FONT_METRICS = new Map([
  // ---- 装机字体（profile 值，随被模拟机器变化）----
  ["simhei", [912, 114]],
  ["simsun", [912, 114]],
  ["nsimsun", [912, 114]],
  ["fangsong", [912, 114]],
  ["kaiti", [912, 114]],
  ["microsoft yahei", [1327, 151]],
  ["verdana", [1376, 139]],
  ["tahoma", [1184, 137]],
  ["times new roman", [1134, 126]],
  ["times", [1134, 126]],
  ["courier new", [1095, 129]],
  ["courier", [1095, 129]],
  ["microsoft himalaya", [759, 114]],
  ["helvetica", [1171, 127]],
  ["arial", [1171, 127]],
  ["georgia", [1270, 129]],
  // ---- 通用族（与机器无关；sans-serif 故意缺省，等于 DEFAULT_METRIC）----
  ["serif", [1411, 164]],
  ["monospace", [912, 114]],
  ["cursive", [912, 114]],
  ["fantasy", [1123, 139]],
]);

/**
 * 解析 `font-family` 值（逗号分隔的候选列表），返回第一个可用字体的基准度量。
 *
 * 与真实字体回退一致：取列表里第一个「装了的 / 通用族」字体；一个都不匹配就走
 * 浏览器默认字体。
 *
 * @param {string} fontFamily 例如 `"SimHei"`、`"Arial, sans-serif"`、`'"Noto Sans SC"'`
 * @returns {readonly [number, number]} 基准条件下的 `[宽, 高]`
 */
export function resolveFontMetric(fontFamily) {
  for (const raw of `${fontFamily ?? ""}`.split(",")) {
    const name = raw.trim().replace(/^["']|["']$/gu, "").trim().toLowerCase();
    if (name === "") continue;
    const metric = FONT_METRICS.get(name);
    if (metric !== undefined) return metric;
  }
  return DEFAULT_METRIC;
}

/**
 * 计算一段单行文本在给定字体/字号下的行内盒尺寸。
 *
 * 宽 = 字符数 × 每字符每 px 的推进 × 字号；高 = 每 px 行高 × 字号。基准点（16 字符、
 * 114px）精确，其余按线性缩放（见文件头 ponytail 注释）。
 *
 * @param {string} text 文本内容
 * @param {string} fontFamily `font-family` 值
 * @param {number} fontSizePx 字号（px）
 * @returns {{ width: number, height: number }}
 */
export function measureText(text, fontFamily, fontSizePx) {
  const [referenceWidth, referenceHeight] = resolveFontMetric(fontFamily);
  const chars = `${text}`.length;
  const px = Number.isFinite(fontSizePx) && fontSizePx > 0
    ? fontSizePx
    : REFERENCE_PX;
  const width = Math.round(
    chars * (referenceWidth / (REFERENCE_CHARS * REFERENCE_PX)) * px,
  );
  const height = Math.round((referenceHeight / REFERENCE_PX) * px);
  return { width, height };
}
