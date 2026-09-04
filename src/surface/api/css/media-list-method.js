import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaList } from "./media-list-state.js";

export function mediaListMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      const result = operation(requireMediaList(this), args, this);
      traceCall(`window.MediaList.prototype.${name}`, "MediaList", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
