import {
  Headers,
  headersAppend,
  headersDelete,
  headersEntries,
  headersForEach,
  headersGet,
  headersGetSetCookie,
  headersHas,
  headersKeys,
  headersSet,
  headersValues,
} from "../api/fetch/headers-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../engine/webidl/cross-realm-method.js";

export function installHeaders() {
  delete Headers.prototype.constructor;
  defineGlobalConstructor("Headers", Headers);
  method("append", 2, headersAppend);
  method("delete", 1, headersDelete);
  method("get", 1, headersGet);
  method("getSetCookie", 0, headersGetSetCookie);
  method("has", 1, headersHas);
  method("set", 2, headersSet);
  const entries = method("entries", 0, headersEntries);
  method("forEach", 1, headersForEach);
  method("keys", 0, headersKeys);
  method("values", 0, headersValues);
  defineConstructorBacklink(Headers.prototype, Headers);
  defineToStringTag(Headers.prototype, "Headers");
  Object.defineProperty(Headers.prototype, Symbol.iterator, {
    value: entries,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function method(name, length, operation) {
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
      return operation(this, ...args);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Headers.prototype, name, callback);
  return callback;
}
