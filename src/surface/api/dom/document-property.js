import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireDocument } from "./document-record.js";

export function documentReadonlyDescriptor(name, operation) {
  return documentDescriptor(name, operation, null);
}

export function documentDescriptor(name, getOperation, setOperation) {
  const definition = setOperation === null ? {
    get [name]() {
      requireDocument(this);
      const result = getOperation(this);
      traceGetter(`window.Document.prototype.${name}`, "Document", result);
      return result;
    },
  } : {
    get [name]() {
      requireDocument(this);
      const result = getOperation(this);
      traceGetter(`window.Document.prototype.${name}`, "Document", result);
      return result;
    },
    set [name](value) {
      requireDocument(this);
      setOperation(this, value);
    },
  };
  const descriptor = Object.getOwnPropertyDescriptor(definition, name);
  registerNativeGetter(descriptor.get, name);
  if (descriptor.set !== undefined) registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
