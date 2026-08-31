import { stylePropertyMapMethod } from "./style-property-map-method.js";
import { normalizeStyleMapName } from "./style-property-map-state.js";

export const deleteProperty = stylePropertyMapMethod("delete", 1, (record, args) => {
  const map = record.read();
  const removed = map.delete(normalizeStyleMapName(args[0]));
  record.write(map);
  return removed;
});
