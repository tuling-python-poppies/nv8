export function cloneDetail(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  const known = seen.get(value);
  if (known !== undefined) {
    return known;
  }
  if (Array.isArray(value)) {
    const output = new Array(value.length);
    seen.set(value, output);
    for (let index = 0; index < value.length; index += 1) {
      output[index] = cloneDetail(value[index], seen);
    }
    return output;
  }
  const output = {};
  seen.set(value, output);
  for (const key of Object.keys(value)) {
    output[key] = cloneDetail(value[key], seen);
  }
  return output;
}
