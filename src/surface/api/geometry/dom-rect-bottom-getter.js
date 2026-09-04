import { rectGetter } from "./dom-rect-property.js"; export const bottom = rectGetter("bottom", s => Math.max(s.y, s.y + s.height));
