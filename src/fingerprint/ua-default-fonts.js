/**
 * UA 默认样式表里**标准字体族**与 locale 的配对。
 *
 * ## 为什么要有这张表
 *
 * `css-ua-defaults.js` 里 `fontFamily` 的基线值是 `"Times New Roman"`，那是
 * **en-US** 的默认字体；而 profile 声明的是 `locale: "zh-CN"`。于是
 * `navigator.language === 'zh-CN'` 而
 * `getComputedStyle(document.body).fontFamily` 是英文默认值——读这两个值一比就
 * 对不上，正是 ADR-0005 说的「比缺值更糟的内部矛盾」。
 *
 * README 记的是反向的那次修复（「采集机的中文系统语言混进默认样式表，而
 * navigator.language 声明 en-US」）。但 profile 实际写的是 zh-CN，所以当时把采集器
 * 锁到 `--lang=en-US` 是**制造**了矛盾——修了采集器没修 profile。
 *
 * ## 实测（Windows 11 + Edge 152，逐个 locale 跑 headless）
 *
 * | `--lang` | `getComputedStyle(document.body).fontFamily` |
 * |---|---|
 * | en-US / en-GB / de-DE / ru-RU / **zh-TW** | `"Times New Roman"` |
 * | zh-CN | `"Noto Sans SC"` |
 * | ja-JP | `"Yu Gothic"` |
 * | ko-KR | `"Malgun Gothic"` |
 *
 * 三条结论：
 *
 * 1. **拉丁/西里尔语系一律 `Times New Roman`**，zh-TW 也是——Chromium 只对少数
 *    locale 有专门的标准字体偏好，其余走通用默认。
 * 2. **ja / ko 拿到的是 Windows 自带字体**（Yu Gothic 随 Win8+、Malgun Gothic
 *    随 Win7+），所以与机器无关。
 * 3. zh-CN 拿到 `Noto Sans SC`。它**不是**上古 Windows 自带字体，但实测在本机的
 *    `%WINDIR%\Fonts` 里（`NotoSansSC-VF.ttf`，Windows 11 的中文语言支持会装），
 *    而同目录下 `simsun.ttc` / `msyh.ttc` 都在却没被选中——说明这是 Chromium
 *    对 zh-Hans 的**偏好顺序**，不是「碰巧只有 Noto」。
 *
 * 第 3 条仍是这张表里唯一有环境依赖的一项：Windows 10 或没装中文语言支持的机器上
 * 大概率会落到 `Microsoft YaHei`。所以它是**可覆盖的 profile 字段**，不是硬编码——
 * 与 `gpu-profiles.js` 同一个套路：值是**挑选**的，不是从开发机采下来就当真理。
 *
 * ## 为什么不干脆把 profile 改成 en-US
 *
 * 因为使用场景里中文站点与英文站点都有。把身份钉在一个 locale 上，另一半目标就
 * 天天带着一个不匹配的 `Accept-Language`。正确做法是让 locale 成为**能切的一维**，
 * 并保证切的时候相关字段一起动。
 */

/** locale 前缀 → 标准字体族。查表用最长前缀匹配。 */
const STANDARD_FONT_BY_LOCALE = Object.freeze({
  "zh-CN": '"Noto Sans SC"',
  "zh-Hans": '"Noto Sans SC"',
  "ja": '"Yu Gothic"',
  "ko": '"Malgun Gothic"',
});

/** 未命中时的通用默认（实测拉丁/西里尔/zh-TW 都是这个）。 */
const FALLBACK_STANDARD_FONT = '"Times New Roman"';

/**
 * 按 locale 查标准字体族。
 *
 * 最长前缀匹配：`zh-CN` 优先于 `zh`，`ja-JP` 落到 `ja`。
 *
 * @param {string} locale 例如 `zh-CN`
 * @returns {string} 计算值形态（带引号，与真实浏览器的序列化一致）
 */
export function standardFontFamilyFor(locale) {
  const normalized = `${locale ?? ""}`;
  if (normalized === "") return FALLBACK_STANDARD_FONT;
  const parts = normalized.split("-");
  for (let length = parts.length; length > 0; length -= 1) {
    const key = parts.slice(0, length).join("-");
    const font = STANDARD_FONT_BY_LOCALE[key];
    if (font !== undefined) return font;
  }
  return FALLBACK_STANDARD_FONT;
}

/**
 * 校验 profile 的 locale 与字体族是否配对。
 *
 * 只在**表里有该 locale 的条目**时校验：表外的 locale（比如 fr-FR）走通用默认，
 * 但调用方仍可以显式声明别的值——那可能是刻意模拟某台特定机器，不该被拦。
 *
 * 返回问题描述而不是抛错，让调用方决定是拦还是记——与
 * `validateDifferenceRegistry()` 同一个风格。
 *
 * @param {string} locale
 * @param {string} fontFamily
 * @returns {string[]} 空数组表示合规
 */
export function validateLocaleFontPair(locale, fontFamily) {
  const declared = `${fontFamily ?? ""}`;
  if (declared === "") {
    return [`locale ${locale} has no standardFontFamily declared`];
  }
  const expected = standardFontFamilyFor(locale);
  const normalized = `${locale ?? ""}`;
  const known = Object.keys(STANDARD_FONT_BY_LOCALE).some(
    (key) => normalized === key || normalized.startsWith(`${key}-`),
  );
  if (!known) return [];
  if (declared !== expected) {
    return [
      `locale ${normalized} implies standardFontFamily ${expected} `
      + `but the profile declares ${declared}`,
    ];
  }
  return [];
}

export { STANDARD_FONT_BY_LOCALE, FALLBACK_STANDARD_FONT };
