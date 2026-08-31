import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeAccessor,
} from "../../webidl/cross-realm-method.js";
import { requireBlob } from "./blob-state.js";

export function blobProperty(name, select) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      const foreignGetter = findCrossRealmPrototypeAccessor(
        this,
        name,
        "get",
        getter,
      );
      if (foreignGetter !== null) {
        return Reflect.apply(foreignGetter, this, []);
      }
      const result = select(requireBlob(this));
      traceGetter(`window.Blob.prototype.${name}`, "Blob", result);
      return result;
    },
  }, name).get;
  registerNativeGetter(getter, name);
  return getter;
}
