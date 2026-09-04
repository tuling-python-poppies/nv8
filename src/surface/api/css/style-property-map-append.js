import { stylePropertyMapMethod } from "./style-property-map-method.js";
import { convertStyleMapValues, normalizeStyleMapName } from "./style-property-map-state.js";

export const append = stylePropertyMapMethod("append", 1, (record, args) => {
  const name = normalizeStyleMapName(args[0]);
  if (name === "") throw new TypeError("Invalid property name");
  const map = record.read();
  const values = map.get(name) ?? [];
  values.push(...convertStyleMapValues(args.slice(1)));
  map.set(name, values);
  record.write(map);
});
