import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { requireBlob } from "./blob-state.js";

export function blobMethod(name, operation) {
  const callback = {
    [name](...args) {
      const foreignMethod = findCrossRealmPrototypeMethod(
        this,
        name,
        callback,
      );
      if (foreignMethod !== null) {
        return Reflect.apply(foreignMethod, this, args);
      }
      const result = operation(requireBlob(this), args);
      traceCall(`window.Blob.prototype.${name}`, "Blob", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: 0, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
