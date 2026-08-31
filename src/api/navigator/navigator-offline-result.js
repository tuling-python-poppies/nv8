export function taggedOfflineResult(tag, fields = null) {
  const value = fields === null ? {} : { ...fields };
  Object.defineProperty(value, Symbol.toStringTag, {
    value: tag,
    configurable: true,
  });
  return value;
}
