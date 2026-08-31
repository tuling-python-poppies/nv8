import { rectGetter } from "./dom-rect-property.js"; export const right = rectGetter("right", s => Math.max(s.x, s.x + s.width));
