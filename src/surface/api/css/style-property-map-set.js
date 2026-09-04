import { stylePropertyMapMethod } from "./style-property-map-method.js";
import { convertStyleMapValues, normalizeStyleMapName } from "./style-property-map-state.js";

export const set = stylePropertyMapMethod("set", 1, (record, args) => {
  const name = normalizeStyleMapName(args[0]);
  if (name === "") throw new TypeError("Invalid property name");
  const values = convertStyleMapValues(args.slice(1));
  if (values.length === 0) throw new TypeError("A value is required");
  const map = record.read();
  map.set(name, values);
  record.write(map);
});
