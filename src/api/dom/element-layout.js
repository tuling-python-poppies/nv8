import {
  descendantElements,
  getAttributeValue,
  requireElement,
} from "./element-state.js";
import { descendants } from "./node-state.js";
import { htmlStyleRecord } from "./html-element-state.js";

export function elementLayoutRect(element) {
  const own = explicitLayout(element);
  if (own.width > 0 && own.height > 0) return own;

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
    width: own.width || descendantWidth,
    height: own.height || descendantHeight,
  };
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
