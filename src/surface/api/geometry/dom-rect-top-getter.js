import { rectGetter } from "./dom-rect-property.js"; export const top = rectGetter("top", s => Math.min(s.y, s.y + s.height));
