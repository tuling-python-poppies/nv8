import { initializeEventTarget } from "../event/event-target-state.js";
import { currentScreen, requireScreen } from "../screen/screen-state.js";
import { MediaQueryList } from "./media-query-list-constructor.js";

const state = new WeakMap();

export function createMediaQueryList(query) {
  const list = Object.create(MediaQueryList.prototype);
  initializeEventTarget(list);
  const screen = requireScreen(currentScreen());
  const media = `${query}`;
  state.set(list, {
    media,
    matches: evaluateMediaQuery(media, screen.width, screen.height, 1),
    onchange: null,
  });
  return list;
}

export function requireMediaQueryList(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function evaluateMediaQuery(query, width, height, devicePixelRatio = 1) {
  return `${query}`.split(",").some(part =>
    evaluateConjunction(part.trim(), width, height, devicePixelRatio));
}

function evaluateConjunction(query, width, height, devicePixelRatio) {
  if (query === "") return false;
  let source = query.toLowerCase().trim();
  let negate = false;
  if (source.startsWith("not ")) {
    negate = true;
    source = source.slice(4).trim();
  }
  const parts = source.split(/\s+and\s+/u).map(part => part.trim());
  let result = true;
  for (const part of parts) {
    if (part === "all" || part === "screen") continue;
    if (part === "print") { result = false; break; }
    if (!evaluateFeature(part, width, height, devicePixelRatio)) {
      result = false;
      break;
    }
  }
  return negate ? !result : result;
}

function evaluateFeature(part, width, height, devicePixelRatio) {
  if (!part.startsWith("(") || !part.endsWith(")")) return false;
  const body = part.slice(1, -1).trim();
  const separator = body.indexOf(":");
  const name = (separator < 0 ? body : body.slice(0, separator)).trim();
  const value = (separator < 0 ? "" : body.slice(separator + 1)).trim();
  const pixels = parseFloat(value);
  if (name === "min-width") return Number.isFinite(pixels) && width >= pixels;
  if (name === "max-width") return Number.isFinite(pixels) && width <= pixels;
  if (name === "width") return Number.isFinite(pixels) && width === pixels;
  if (name === "min-height") return Number.isFinite(pixels) && height >= pixels;
  if (name === "max-height") return Number.isFinite(pixels) && height <= pixels;
  if (name === "height") return Number.isFinite(pixels) && height === pixels;
  if (name === "orientation") return value === (width >= height ? "landscape" : "portrait");
  if (name === "min-resolution") return devicePixelRatio >= resolutionDppx(value);
  if (name === "max-resolution") return devicePixelRatio <= resolutionDppx(value);
  if (name === "resolution") return devicePixelRatio === resolutionDppx(value);
  if (name === "prefers-color-scheme") return value === "light";
  if (name === "prefers-reduced-motion") return value === "no-preference";
  if (name === "prefers-contrast") return value === "no-preference";
  if (name === "forced-colors") return value === "none";
  if (name === "hover" || name === "any-hover") return value === "hover";
  if (name === "pointer" || name === "any-pointer") return value === "fine";
  return false;
}

function resolutionDppx(value) {
  const number = parseFloat(value);
  if (!Number.isFinite(number)) return Number.NaN;
  return value.endsWith("dpi") ? number / 96 : number;
}
