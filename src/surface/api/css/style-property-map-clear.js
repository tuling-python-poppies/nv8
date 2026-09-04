import { stylePropertyMapMethod } from "./style-property-map-method.js";

export const clear = stylePropertyMapMethod("clear", 0, record => {
  record.write(new Map());
});
