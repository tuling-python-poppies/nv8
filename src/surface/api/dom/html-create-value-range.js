import { traceCall } from "../../../infra/trace/trace-function.js";
import { createOpaqueRange } from "./range-152-runtime.js";

export function createValueRange(start, end, value, label, type = null) {
  const length = value.length;
  const startOffset = Number(start);
  const endOffset = Number(end);
  if (!Number.isInteger(startOffset) || !Number.isInteger(endOffset)) {
    throw new DOMException(
      `Failed to execute 'createValueRange' on '${label}': Start or end offset is not an integer.`,
      "TypeError",
    );
  }
  if (startOffset < 0 || endOffset < startOffset || endOffset > length) {
    throw new DOMException(
      `Failed to execute 'createValueRange' on '${label}': Start or end offset exceeds value length.`,
      "IndexSizeError",
    );
  }
  if (type !== null && !["text", "search", "url", "tel", "password"].includes(type)) {
    throw new DOMException(
      `Failed to execute 'createValueRange' on '${label}': <input> element must be of a text field type: text, search, url, tel, or password.`,
      "NotSupportedError",
    );
  }
  const result = createOpaqueRange(startOffset, endOffset);
  traceCall(`window.${label}.prototype.createValueRange`, label, [start, end], result);
  return result;
}

