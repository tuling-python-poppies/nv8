export function summarizePrimitive(value) {
  if (
    value === undefined
    || value === null
    || typeof value === "boolean"
    || typeof value === "number"
    || typeof value === "bigint"
  ) {
    return value;
  }
  if (typeof value === "string") {
    return value.length <= 256 ? value : `${value.slice(0, 256)}…`;
  }
  if (typeof value === "symbol") {
    return "symbol";
  }
  if (typeof value === "function") {
    return "function";
  }
  return "object";
}
