import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { isCanvasGradient } from "./canvas-gradient-state.js";
import { isCanvasPattern } from "./canvas-pattern-state.js";
import {
  normalizeCanvasColor,
  requireCanvas2DContext,
} from "./canvas-2d-context-state.js";

const enumValues = Object.freeze({
  textAlign: ["start", "end", "left", "right", "center"],
  textBaseline: ["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"],
  direction: ["ltr", "rtl", "inherit"],
  fontKerning: ["auto", "normal", "none"],
  imageSmoothingQuality: ["low", "medium", "high"],
  lineCap: ["butt", "round", "square"],
  lineJoin: ["round", "bevel", "miter"],
  globalCompositeOperation: [
    "source-over", "source-in", "source-out", "source-atop",
    "destination-over", "destination-in", "destination-out", "destination-atop",
    "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken",
    "lighten", "color-dodge", "color-burn", "hard-light", "soft-light",
    "difference", "exclusion", "hue", "saturation", "color", "luminosity",
  ],
});

const positiveNumbers = new Set(["lineWidth", "miterLimit"]);
const nonNegativeNumbers = new Set(["shadowBlur"]);
const finiteNumbers = new Set([
  "shadowOffsetX", "shadowOffsetY", "lineDashOffset",
]);
const colorNames = new Set(["shadowColor"]);
const paintNames = new Set(["strokeStyle", "fillStyle"]);

export function canvasContextReadonlyProperty(propertyName, select) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = select(requireCanvas2DContext(this));
      traceGetter(
        `window.OffscreenCanvasRenderingContext2D.prototype.${propertyName}`,
        "OffscreenCanvasRenderingContext2D",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}

export function canvasContextProperty(propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireCanvas2DContext(this).drawing[propertyName];
      traceGetter(
        `window.OffscreenCanvasRenderingContext2D.prototype.${propertyName}`,
        "OffscreenCanvasRenderingContext2D",
        result,
      );
      return result;
    },
    set [propertyName](value) {
      const state = requireCanvas2DContext(this);
      const normalized = normalizeProperty(propertyName, value);
      if (normalized.accepted) state.drawing[propertyName] = normalized.value;
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

function normalizeCanvasFont(value) {
  const input = `${value}`.trim();
  // Canvas uses the CSS font shorthand. This deliberately handles the stable
  // subset needed by the runtime: optional style/variant/weight, a CSS size,
  // then a non-empty family list. Invalid declarations leave the old value.
  const match = /^(?:(normal|italic|oblique)\s+)?(?:(normal|small-caps)\s+)?(?:(normal|bold|bolder|lighter|[1-9]00)\s+)?(([0-9]+(?:\.[0-9]+)?(?:px|pt|pc|in|cm|mm|em|rem|ex|ch|vh|vw|vmin|vmax)(?:\/[^\s]+)?\s+))(.+)$/i.exec(input);
  if (match === null) return null;
  const style = match[1]?.toLowerCase() ?? null;
  const variant = match[2]?.toLowerCase() ?? null;
  const weight = match[3]?.toLowerCase() ?? null;
  const sizeAndFamily = `${match[4]}${match[6]}`;
  const normalizedWeight = weight === "400" ? null : weight === "700" ? "bold" : weight;
  return [
    style === "normal" ? null : style,
    variant === "normal" ? null : variant,
    normalizedWeight === "normal" ? null : normalizedWeight,
    sizeAndFamily,
  ].filter(Boolean).join(" ");
}

function normalizeProperty(name, value) {
  if (name === "imageSmoothingEnabled") {
    return { accepted: true, value: Boolean(value) };
  }
  if (name === "globalAlpha") {
    const number = Number(value);
    return { accepted: Number.isFinite(number) && number >= 0 && number <= 1, value: number };
  }
  if (positiveNumbers.has(name)) {
    const number = Number(value);
    return { accepted: Number.isFinite(number) && number > 0, value: number };
  }
  if (nonNegativeNumbers.has(name)) {
    const number = Number(value);
    return { accepted: Number.isFinite(number) && number >= 0, value: number };
  }
  if (finiteNumbers.has(name)) {
    const number = Number(value);
    return { accepted: Number.isFinite(number), value: number };
  }
  if (paintNames.has(name)) {
    if (isCanvasGradient(value) || isCanvasPattern(value)) {
      return { accepted: true, value };
    }
    const color = `${value}`;
    return {
      accepted: color.trim() !== "",
      value: normalizeCanvasColor(color),
    };
  }
  const string = `${value}`;
  if (name === "font") {
    const normalizedFont = normalizeCanvasFont(string);
    return {
      accepted: normalizedFont !== null,
      value: normalizedFont ?? string,
    };
  }
  if (colorNames.has(name)) {
    return {
      accepted: string.trim() !== "",
      value: normalizeCanvasColor(string),
    };
  }
  const allowed = enumValues[name];
  return {
    accepted: allowed === undefined || allowed.includes(string),
    value: string,
  };
}
