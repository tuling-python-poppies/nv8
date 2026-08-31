import { rectGetter } from "./dom-rect-property.js"; export const left = rectGetter("left", s => Math.min(s.x, s.x + s.width));
