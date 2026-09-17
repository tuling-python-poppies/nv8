import { CSS_INITIAL_VALUES, CSS_TAG_OVERRIDES } from "./css-ua-defaults.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

/**
 * 标准字体族的 per-Realm 覆盖。
 *
 * `css-ua-defaults.js` 是生成文件，里面 `fontFamily` 的基线是采集时那一个 locale
 * 的值（`"Times New Roman"`，en-US）。但 profile 的 locale 是可切的，字体必须跟着
 * 切，否则 `navigator.language` 与 `getComputedStyle(document.body).fontFamily`
 * 会对不上——见 `src/fingerprint/ua-default-fonts.js` 的实测表。
 *
 * 做成覆盖而不是重新生成 fixture：fixture 只能存一个 locale 的值，而这一维是
 * 运行时可变的。
 */
const fontSlot = createRealmSlot(() => ({
  standardFontFamily: null,
}), "css-standard-font");

/**
 * 注入本 Realm 的标准字体族。传空值表示沿用 fixture 里的基线。
 *
 * @param {string | null} fontFamily
 */
export function configureStandardFontFamily(fontFamily) {
  const value = `${fontFamily ?? ""}`;
  fontSlot.get(globalThis).standardFontFamily = value === "" ? null : value;
}

/**
 * 计算值解析：UA 默认样式表 + 内联声明。
 *
 * 迁移前 `getComputedStyle()` 只回显元素 `style` 属性里的原始值，没写的属性
 * 一律读作空串。真实浏览器对已挂载元素给出解析后的值：
 *
 * ```
 * getComputedStyle(document.createElement('div')).display   → ""      （游离元素）
 * getComputedStyle(attachedDiv).display                     → "block"
 * getComputedStyle(attachedDiv).color                       → "rgb(0, 0, 0)"
 * ```
 *
 * ## 覆盖范围
 *
 * 只建模 40 个**与布局无关**的属性（见 `css-ua-defaults.js`）。`width` /
 * `height` 这类取决于视口与排版，没有布局引擎复刻不出来；其余未建模属性仍读作
 * 空串，这条差距登记在 `tests/edge-behavior-parity-test.js`。
 *
 * ## 游离元素返回空串
 *
 * 实测真实 Edge 对不在文档树内的元素，所有计算值都是空串。所以解析前先判断
 * 元素是否已挂载——这一条双方原本就一致，不能因为加了默认值表而破坏。
 */

/** CSS 命名颜色 → rgb 三元组。只收 UA 默认样式表与常见写法会用到的。 */
const NAMED_COLORS = Object.freeze({
  transparent: null,
  black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0],
  green: [0, 128, 0], blue: [0, 0, 255], yellow: [255, 255, 0],
  cyan: [0, 255, 255], aqua: [0, 255, 255], magenta: [255, 0, 255],
  fuchsia: [255, 0, 255], gray: [128, 128, 128], grey: [128, 128, 128],
  silver: [192, 192, 192], maroon: [128, 0, 0], olive: [128, 128, 0],
  lime: [0, 255, 0], navy: [0, 0, 128], teal: [0, 128, 128],
  purple: [128, 0, 128], orange: [255, 165, 0], pink: [255, 192, 203],
  brown: [165, 42, 42], gold: [255, 215, 0], indigo: [75, 0, 130],
  violet: [238, 130, 238], beige: [245, 245, 220], ivory: [255, 255, 240],
  khaki: [240, 230, 140], plum: [221, 160, 221], salmon: [250, 128, 114],
  tan: [210, 180, 140], turquoise: [64, 224, 208], crimson: [220, 20, 60],
});

/** 需要按颜色语法序列化的属性。 */
const COLOR_PROPERTIES = new Set([
  "color", "backgroundColor", "borderTopColor", "borderRightColor",
  "borderBottomColor", "borderLeftColor", "outlineColor", "textDecorationColor",
  "caretColor", "columnRuleColor",
]);

/**
 * 把颜色写法序列化成浏览器的计算值形式。
 *
 * 真实浏览器统一输出 `rgb(r, g, b)`，带 alpha 时输出 `rgba(r, g, b, a)`。
 * 实测 `color: red` 的计算值是 `rgb(255, 0, 0)`，不是 `red`。
 *
 * @param {string} value
 * @returns {string} 无法识别时原样返回
 */
function serializeColor(value) {
  const text = `${value}`.trim();
  const lower = text.toLowerCase();

  if (lower === "transparent") return "rgba(0, 0, 0, 0)";

  const named = NAMED_COLORS[lower];
  if (named !== undefined && named !== null) {
    return `rgb(${named[0]}, ${named[1]}, ${named[2]})`;
  }

  const hex = /^#([0-9a-f]{3,8})$/iu.exec(lower);
  if (hex !== null) {
    const digits = hex[1];
    const expand = part => Number.parseInt(part.length === 1 ? part + part : part, 16);
    if (digits.length === 3 || digits.length === 4) {
      const parts = [...digits].map(expand);
      return digits.length === 3
        ? `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`
        : `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${round(parts[3] / 255)})`;
    }
    if (digits.length === 6 || digits.length === 8) {
      const parts = [];
      for (let index = 0; index < digits.length; index += 2) {
        parts.push(expand(digits.slice(index, index + 2)));
      }
      return digits.length === 6
        ? `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`
        : `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${round(parts[3] / 255)})`;
    }
  }

  const functional = /^rgba?\(([^)]*)\)$/iu.exec(lower);
  if (functional !== null) {
    const parts = functional[1].split(/[\s,/]+/u).filter(Boolean);
    if (parts.length >= 3) {
      const channels = parts.slice(0, 3).map(part => clampChannel(part));
      if (parts.length === 3) {
        return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
      }
      const alpha = round(Number.parseFloat(parts[3]));
      return alpha === 1
        ? `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`
        : `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})`;
    }
  }

  return text;
}

function clampChannel(part) {
  const numeric = part.endsWith("%")
    ? (Number.parseFloat(part) / 100) * 255
    : Number.parseFloat(part);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(255, Math.round(numeric)));
}

function round(value) {
  if (Number.isNaN(value)) return 0;
  // 浏览器把 alpha 序列化成最短形式：0.5 而不是 0.50
  return Number(value.toFixed(3));
}

/**
 * 求一个属性的计算值。
 *
 * @param {string} localName 元素标签名（小写）
 * @param {string} property camelCase 属性名
 * @param {Map} inlineDeclarations 内联声明（kebab-case 键）
 * @param {string} kebabName 对应的 kebab-case 属性名
 * @returns {string} 未建模时返回空串
 */
export function computedValueFor(localName, property, inlineDeclarations, kebabName) {
  const inline = inlineDeclarations.get(kebabName)?.value;
  if (inline !== undefined) {
    return COLOR_PROPERTIES.has(property) ? serializeColor(inline) : inline;
  }
  const override = CSS_TAG_OVERRIDES[localName]?.[property];
  if (override !== undefined) return override;
  if (property === "fontFamily") {
    // 只覆盖**基线**值。标签级 override（如 `<pre>` 的 monospace）优先，
    // 因为那与 locale 无关——实测八个 locale 下 `<pre>` 一律 monospace。
    const configured = fontSlot.get(globalThis).standardFontFamily;
    if (configured !== null) return configured;
  }
  return CSS_INITIAL_VALUES[property] ?? "";
}

/**
 * 元素是否在文档树内。游离元素的计算值全为空串。
 *
 * @param {object} element
 * @returns {boolean}
 */
export function isAttachedForStyle(element) {
  let node = element;
  while (node !== null && node !== undefined) {
    if (node.nodeType === 9) return true;
    node = node.parentNode ?? null;
  }
  return false;
}
