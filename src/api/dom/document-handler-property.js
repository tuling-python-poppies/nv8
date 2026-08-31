import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { documentHandler, setDocumentHandler } from "./document-record.js";

export function documentHandlerDescriptor(name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = documentHandler(this, name);
      traceGetter(`window.Document.prototype.${name}`, "Document", result);
      return result;
    },
    set [name](value) {
      setDocumentHandler(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
