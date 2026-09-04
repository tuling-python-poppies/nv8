import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireTextArea } from "./html-text-area-element-state.js";

export const setRangeText = { setRangeText(replacement) {
  const state = requireTextArea(this);
  const normalized = `${replacement}`;
  const hasRange = arguments.length >= 3;
  const start = hasRange
    ? Math.min(Number(arguments[1]) >>> 0, state.value.length)
    : state.selectionStart;
  const end = hasRange
    ? Math.min(Number(arguments[2]) >>> 0, state.value.length)
    : state.selectionEnd;
  if (start > end) {
    throw new DOMException("The start index exceeds the end index", "IndexSizeError");
  }
  const mode = arguments.length >= 4 ? `${arguments[3]}` : "preserve";
  if (!new Set(["select", "start", "end", "preserve"]).has(mode)) {
    throw new TypeError("Invalid selection mode");
  }
  const oldStart = state.selectionStart;
  const oldEnd = state.selectionEnd;
  state.value = state.value.slice(0, start) + normalized + state.value.slice(end);
  state.valueDirty = true;
  const insertedEnd = start + normalized.length;
  if (mode === "select") {
    state.selectionStart = start;
    state.selectionEnd = insertedEnd;
  } else if (mode === "start") {
    state.selectionStart = start;
    state.selectionEnd = start;
  } else if (mode === "end") {
    state.selectionStart = insertedEnd;
    state.selectionEnd = insertedEnd;
  } else {
    const adjust = position => position <= start
      ? position
      : position >= end
        ? position - (end - start) + normalized.length
        : insertedEnd;
    state.selectionStart = adjust(oldStart);
    state.selectionEnd = adjust(oldEnd);
  }
  traceCall(
    "window.HTMLTextAreaElement.prototype.setRangeText",
    "HTMLTextAreaElement",
    [...arguments],
    undefined,
  );
}}.setRangeText;
registerNativeFunction(setRangeText, "setRangeText");
