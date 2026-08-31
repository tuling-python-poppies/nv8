import {
  FormData,
  formDataAppend,
  formDataDelete,
  formDataEntries,
  formDataForEach,
  formDataGet,
  formDataGetAll,
  formDataHas,
  formDataKeys,
  formDataSet,
  formDataValues,
} from "../api/fetch/form-data-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { registerNativeFunction } from "../webidl/native-function.js";

export function installFormData() {
  delete FormData.prototype.constructor;
  defineGlobalConstructor("FormData", FormData);
  method("append", 2, formDataAppend);
  method("delete", 1, formDataDelete);
  method("get", 1, formDataGet);
  method("getAll", 1, formDataGetAll);
  method("has", 1, formDataHas);
  method("set", 2, formDataSet);
  const entries = method("entries", 0, formDataEntries);
  method("forEach", 1, formDataForEach);
  method("keys", 0, formDataKeys);
  method("values", 0, formDataValues);
  defineConstructorBacklink(FormData.prototype, FormData);
  defineToStringTag(FormData.prototype, "FormData");
  Object.defineProperty(FormData.prototype, Symbol.iterator, {
    value: entries,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function method(name, length, operation) {
  const callback = {
    [name](...args) {
      return operation(this, ...args);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(FormData.prototype, name, callback);
  return callback;
}
