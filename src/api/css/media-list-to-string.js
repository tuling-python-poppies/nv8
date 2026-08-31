import { mediaListMethod } from "./media-list-method.js";
export const toString = mediaListMethod("toString", 0, record => record.values.join(", "));
