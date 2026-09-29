import {
  descendantElements,
  getAttributeValue,
  requireElement,
} from "./element-state.js";
import { descendants, ELEMENT_NODE, requireNode, TEXT_NODE } from "./node-state.js";
import { htmlStyleRecord } from "./html-element-state.js";
import { measureText } from "../../../infra/fingerprint/font-metrics.js";

export function elementLayoutRect(element) {
  // 视口盒：documentElement / body 的 client/offset 尺寸来自视口（真机为
  // innerWidth 减去滚动条），不是文字/显式尺寸推导——返回 0 会被反爬识别为异常。
  const viewport = viewportBox(element);
  if (viewport !== null) return viewport;

  const own = explicitLayout(element);
  if (own.width > 0 && own.height > 0) return own;

  // 行内文本盒尺寸：只含文本、无显式宽高的收缩到内容元素（<span>text</span>）的
  // offsetWidth 就是文本宽度。没有这一步这类元素全量成 0，正是 RS6 字体枚举抓的点。
  const text = intrinsicTextSize(element);

  let descendantWidth = 0;
  let descendantHeight = 0;
  for (const descendant of layoutDescendants(element)) {
    const candidate = elementLayoutRect(descendant);
    descendantWidth = Math.max(descendantWidth, candidate.width);
    descendantHeight = Math.max(descendantHeight, candidate.height);
  }

  return {
    x: own.x,
    y: own.y,
    width: own.width || Math.max(text?.width ?? 0, descendantWidth),
    height: own.height || Math.max(text?.height ?? 0, descendantHeight),
  };
}

// Windows Chromium 经典滚动条宽（本机 Edge 实测：innerWidth 921 → clientWidth 906）。
const SCROLLBAR_PX = 15;

// documentElement / body 的布局盒 = 视口（真机语义）；拿不到视口时回退旧行为。
function viewportBox(element) {
  const document = requireNode(element).ownerDocument;
  if (document === null || document === undefined
    || (document.documentElement !== element && document.body !== element)) {
    return null;
  }
  const width = Number(globalThis.innerWidth);
  const height = Number(globalThis.innerHeight);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return {
    x: 0,
    y: 0,
    width: Math.max(0, width - SCROLLBAR_PX),
    height: Math.max(0, height - SCROLLBAR_PX),
  };
}

// 收缩到内容（shrink-to-fit）的 display：这些盒子的宽度取决于内容而非容器。
const SHRINK_TO_FIT_DISPLAYS = new Set([
  "inline", "inline-block", "inline-flex", "inline-grid", "table-cell",
]);

// 无显式 display 时按标签默认判断行内。只收录常见行内标签——块级标签（div/p/…）
// 的 offsetWidth 是容器宽度，不该按文本量，所以不进这张表。
const INLINE_TAGS = new Set([
  "span", "a", "b", "i", "em", "strong", "small", "label", "code",
  "abbr", "cite", "q", "s", "u", "sub", "sup", "mark", "time", "big", "tt",
]);

function intrinsicTextSize(element) {
  const state = requireElement(element);
  const style = parseStyle(getAttributeValue(element, "style") ?? "");
  if (!isShrinkToFit(state, style)) return null;
  const text = directText(element);
  if (text === "") return null;
  return measureText(text, resolveInherited(element, "font-family"),
    cssPixels(resolveInherited(element, "font-size")) ?? 16);
}

function isShrinkToFit(state, style) {
  const display = (style.display ?? "").toLowerCase();
  if (display !== "") {
    if (display === "none") return false;
    return SHRINK_TO_FIT_DISPLAYS.has(display);
  }
  return INLINE_TAGS.has(state.localName);
}

// 直接文本子节点拼接，按 CSS 折叠空白（连续空白合一、去首尾）。
function directText(element) {
  let text = "";
  for (const child of requireNode(element).children) {
    if (requireNode(child).nodeType === TEXT_NODE) {
      text += requireNode(child).nodeValue ?? "";
    }
  }
  return text.replace(/\s+/gu, " ").trim();
}

// font-size / font-family 沿祖先继承。命中第一个显式声明即止，否则用默认。
function resolveInherited(element, property) {
  let node = element;
  while (node !== null && requireNode(node).nodeType === ELEMENT_NODE) {
    const value = parseStyle(getAttributeValue(node, "style") ?? "")[property];
    if (value !== undefined && value !== "") return value;
    node = requireNode(node).parent;
  }
  return "";
}

function layoutDescendants(element) {
  const state = requireElement(element);
  const result = descendantElements(element);
  if (state.shadowRoot === null) return result;
  for (const node of descendants(state.shadowRoot)) {
    try {
      requireElement(node);
      result.push(node);
    } catch {
      // Non-element shadow descendants do not contribute layout dimensions.
    }
  }
  return result;
}

function explicitLayout(element) {
  const state = requireElement(element);
  const style = parseStyle(getAttributeValue(element, "style") ?? "");
  try {
    const declaration = htmlStyleRecord(element);
    style.width ||= declaration.width;
    style.height ||= declaration.height;
    style["min-width"] ||= declaration.minWidth;
    style["min-height"] ||= declaration.minHeight;
    style.left ||= declaration.left;
    style.top ||= declaration.top;
  } catch {
    // Non-HTML elements do not expose HTMLElement.style state.
  }
  let width = dimension(style.width, style["min-width"])
    ?? attributeDimension(element, "width");
  let height = dimension(style.height, style["min-height"])
    ?? attributeDimension(element, "height");

  if (state.localName === "iframe") {
    width ??= 300;
    height ??= 150;
  }

  return {
    x: cssPixels(style.left) ?? 0,
    y: cssPixels(style.top) ?? 0,
    width: width ?? 0,
    height: height ?? 0,
  };
}

function parseStyle(value) {
  const declarations = Object.create(null);
  for (const declaration of value.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator < 0) continue;
    const name = declaration.slice(0, separator).trim().toLowerCase();
    const propertyValue = declaration.slice(separator + 1).trim();
    if (name) declarations[name] = propertyValue;
  }
  return declarations;
}

function dimension(primary, minimum) {
  const exact = cssPixels(primary);
  if (exact !== null) return exact;
  return cssPixels(minimum);
}

function attributeDimension(element, name) {
  const value = Number.parseFloat(getAttributeValue(element, name) ?? "");
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function cssPixels(value) {
  const match = /^(-?(?:\d+\.?\d*|\.\d+))px$/i.exec(`${value ?? ""}`.trim());
  if (match === null) return null;
  const number = Number(match[1]);
  return Number.isFinite(number) ? Math.max(0, number) : null;
}
