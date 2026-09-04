import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireInput } from "./html-input-element-state.js";
export const setRangeText = { setRangeText(replacement) {
  const state = requireInput(this);
  const text = `${replacement}`;
  const hasRange = arguments.length >= 3;
  const start = hasRange ? Math.min(Number(arguments[1]) >>> 0, state.value.length) : state.selectionStart;
  const end = hasRange ? Math.min(Number(arguments[2]) >>> 0, state.value.length) : state.selectionEnd;
  if (start > end) throw new DOMException("The start index exceeds the end index", "IndexSizeError");
  const mode = arguments.length >= 4 ? `${arguments[3]}` : "preserve";
  if (!["select", "start", "end", "preserve"].includes(mode)) throw new TypeError("Invalid selection mode");
  const oldStart = state.selectionStart;
  const oldEnd = state.selectionEnd;
  state.value = state.value.slice(0, start) + text + state.value.slice(end);
  state.valueDirty = true;
  const insertedEnd = start + text.length;
  if (mode === "select") [state.selectionStart, state.selectionEnd] = [start, insertedEnd];
  else if (mode === "start") [state.selectionStart, state.selectionEnd] = [start, start];
  else if (mode === "end") [state.selectionStart, state.selectionEnd] = [insertedEnd, insertedEnd];
  else {
    const adjust = position => position <= start ? position
      : position >= end ? position - (end - start) + text.length : insertedEnd;
    state.selectionStart = adjust(oldStart);
    state.selectionEnd = adjust(oldEnd);
  }
  traceCall("window.HTMLInputElement.prototype.setRangeText", "HTMLInputElement", [...arguments], undefined);
}}.setRangeText;
registerNativeFunction(setRangeText, "setRangeText");
