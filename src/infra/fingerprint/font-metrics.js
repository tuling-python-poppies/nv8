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
  // ---- 装机字体（profile 值）----
  // 2026-09-29 以本机真机 Edge 154（16 字符 @114px 基准条件）全量重校：
  // 156 个系统字体族逐族实测；未列出者回退到候选表下一项/默认字体。
  ["arial", [1171, 127]],
  ["arial black", [1444, 160]],
  ["bahnschrift", [1226, 114]],
  ["bahnschrift condensed", [1066, 114]],
  ["bahnschrift light", [1226, 114]],
  ["bahnschrift light condensed", [912, 114]],
  ["bahnschrift light semicondensed", [912, 114]],
  ["bahnschrift semibold", [1226, 114]],
  ["bahnschrift semibold condensed", [912, 114]],
  ["bahnschrift semibold semiconden", [912, 114]],
  ["bahnschrift semicondensed", [1066, 114]],
  ["bahnschrift semilight", [912, 114]],
  ["bahnschrift semilight condensed", [912, 114]],
  ["bahnschrift semilight semiconde", [912, 114]],
  ["calibri", [1133, 140]],
  ["calibri light", [1118, 140]],
  ["cambria", [1200, 133]],
  ["cambria math", [1200, 114]],
  ["candara", [1154, 140]],
  ["candara light", [1137, 140]],
  ["cascadia code", [1069, 133]],
  ["cascadia code extralight", [1069, 133]],
  ["cascadia code light", [1069, 133]],
  ["cascadia code semibold", [1069, 133]],
  ["cascadia code semilight", [912, 114]],
  ["cascadia mono", [1069, 133]],
  ["cascadia mono extralight", [1069, 133]],
  ["cascadia mono light", [1069, 133]],
  ["cascadia mono semibold", [1069, 133]],
  ["cascadia mono semilight", [912, 114]],
  ["comic sans ms", [1133, 159]],
  ["consolas", [1003, 134]],
  ["constantia", [1247, 140]],
  ["corbel", [1171, 140]],
  ["corbel light", [1140, 140]],
  ["courier", [1095, 129]],
  ["courier new", [1095, 129]],
  ["dengxian", [1182, 118]],
  ["ebrima", [1218, 152]],
  ["fangsong", [912, 114]],
  ["franklin gothic medium", [1231, 129]],
  ["gabriola", [886, 114]],
  ["gadugi", [1218, 152]],
  ["georgia", [1270, 130]],
  ["helvetica", [1171, 127]],
  ["impact", [1123, 139]],
  ["ink free", [1059, 141]],
  ["javanese text", [1192, 259]],
  ["jetbrainsmono nfm", [1094, 150]],
  ["kaiti", [912, 114]],
  ["leelawadee ui", [1218, 152]],
  ["leelawadee ui semilight", [912, 114]],
  ["lucida console", [1099, 114]],
  ["lucida sans unicode", [1336, 175]],
  ["malgun gothic", [1244, 152]],
  ["malgun gothic semilight", [912, 114]],
  ["marlett", [1824, 114]],
  ["microsoft himalaya", [759, 114]],
  ["microsoft jhenghei", [1309, 152]],
  ["microsoft jhenghei ui", [1309, 145]],
  ["microsoft jhenghei ui light", [1243, 145]],
  ["microsoft new tai lue", [1218, 149]],
  ["microsoft phagspa", [1218, 146]],
  ["microsoft sans serif", [1175, 129]],
  ["microsoft tai le", [1218, 145]],
  ["microsoft yahei", [1327, 151]],
  ["microsoft yahei ui", [1327, 145]],
  ["microsoft yahei ui light", [1240, 150]],
  ["microsoft yi baiti", [877, 114]],
  ["mongolian baiti", [1134, 121]],
  ["ms gothic", [912, 114]],
  ["ms pgothic", [1041, 114]],
  ["ms ui gothic", [1041, 114]],
  ["mv boli", [1221, 184]],
  ["myanmar text", [1218, 212]],
  ["nirmala text", [1218, 114]],
  ["nirmala text semilight", [912, 114]],
  ["nirmala ui", [1218, 152]],
  ["nirmala ui semilight", [912, 114]],
  ["noto sans sc", [1320, 165]],
  ["noto sans sc black", [1421, 165]],
  ["noto sans sc demilight", [912, 114]],
  ["noto sans sc light", [1282, 165]],
  ["noto sans sc medium", [1349, 165]],
  ["noto sans sc thin", [1257, 165]],
  ["noto serif sc", [1411, 164]],
  ["noto serif sc black", [1491, 164]],
  ["noto serif sc extralight", [1391, 164]],
  ["noto serif sc light", [1400, 164]],
  ["noto serif sc medium", [1427, 164]],
  ["noto serif sc semibold", [1442, 164]],
  ["nsimsun", [912, 114]],
  ["palatino linotype", [1273, 154]],
  ["roboto", [1237, 137]],
  ["roboto regular", [1237, 137]],
  ["sans serif collection", [1320, 302]],
  ["segoe fluent icons", [912, 114]],
  ["segoe mdl2 assets", [912, 114]],
  ["segoe print", [1453, 198]],
  ["segoe script", [1513, 180]],
  ["segoe ui", [1218, 152]],
  ["segoe ui black", [1367, 152]],
  ["segoe ui emoji", [1218, 152]],
  ["segoe ui historic", [1218, 152]],
  ["segoe ui light", [1147, 152]],
  ["segoe ui semibold", [1260, 152]],
  ["segoe ui semilight", [912, 114]],
  ["segoe ui symbol", [1218, 152]],
  ["segoe ui variable display", [1200, 152]],
  ["segoe ui variable display light", [1104, 152]],
  ["segoe ui variable display semib", [912, 114]],
  ["segoe ui variable display semil", [912, 114]],
  ["segoe ui variable small", [1266, 152]],
  ["segoe ui variable small light", [1215, 152]],
  ["segoe ui variable small semibol", [912, 114]],
  ["segoe ui variable small semilig", [912, 114]],
  ["segoe ui variable text", [1218, 152]],
  ["segoe ui variable text light", [1147, 152]],
  ["segoe ui variable text semibold", [1260, 152]],
  ["segoe ui variable text semiligh", [912, 114]],
  ["simhei", [912, 114]],
  ["simsun", [912, 114]],
  ["simsun-extb", [912, 114]],
  ["simsun-extg", [912, 114]],
  ["sitka banner", [1102, 114]],
  ["sitka banner semibold", [1139, 114]],
  ["sitka display", [1138, 114]],
  ["sitka display semibold", [1175, 114]],
  ["sitka heading", [1183, 114]],
  ["sitka heading semibold", [1221, 114]],
  ["sitka small", [1401, 114]],
  ["sitka small semibold", [1446, 114]],
  ["sitka subheading", [1236, 114]],
  ["sitka subheading semibold", [1277, 114]],
  ["sitka text", [1307, 114]],
  ["sitka text semibold", [1350, 114]],
  ["sylfaen", [1192, 150]],
  ["symbol", [960, 140]],
  ["tahoma", [1184, 138]],
  ["times", [1134, 127]],
  ["times new roman", [1134, 127]],
  ["trebuchet ms", [1206, 132]],
  ["ubuntu mono", [1021, 128]],
  ["ubuntu mono medium", [1021, 128]],
  ["verdana", [1376, 139]],
  ["webdings", [1270, 114]],
  ["wingdings", [1632, 126]],
  ["yu gothic", [1229, 146]],
  ["yu gothic light", [1160, 147]],
  ["yu gothic medium", [1231, 147]],
  ["yu gothic ui", [1218, 152]],
  ["yu gothic ui light", [1147, 152]],
  ["yu gothic ui semibold", [1260, 152]],
  ["yu gothic ui semilight", [912, 114]],
  ["仿宋", [912, 114]],
  ["宋体", [912, 114]],
  ["微軟正黑體", [1309, 152]],
  ["微軟正黑體 light", [1243, 152]],
  ["微软雅黑", [1327, 151]],
  ["微软雅黑 light", [1240, 146]],
  ["新宋体", [912, 114]],
  ["新細明體-extb", [1066, 114]],
  ["楷体", [912, 114]],
  ["等线", [1182, 118]],
  ["等线 light", [1147, 118]],
  ["細明體-extb", [912, 114]],
  ["細明體_hkscs-extb", [912, 114]],
  ["細明體_mscs-extb", [912, 114]],
  ["黑体", [912, 114]],
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
