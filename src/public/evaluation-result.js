const RESULT_TYPES = new Set([
  "undefined",
  "null",
  "boolean",
  "number",
  "string",
  "other",
]);

export function toPublicEvaluationResult(record) {
  if (
    record === null
    || typeof record !== "object"
    || !RESULT_TYPES.has(record.type)
  ) {
    throw new TypeError("Child runtime returned an invalid evaluation result");
  }
  if (record.type === "other" || record.type === "undefined") {
    return { type: record.type, value: undefined };
  }
  return { type: record.type, value: record.value };
}
