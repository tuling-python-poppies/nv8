import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireDocument } from "./document-record.js";

export function documentMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireDocument(this);
      const result = operation(this, args);
      traceCall(`window.Document.prototype.${name}`, "Document", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
