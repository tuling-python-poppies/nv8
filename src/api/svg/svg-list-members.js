import { traceCall } from "../../trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import {
  appendSVGListItem,
  clearSVGList,
  consolidateSVGTransformList,
  createTransformFromMatrix,
  getSVGListItem,
  initializeSVGList,
  insertSVGListItem,
  refreshSVGList,
  removeSVGListItem,
  replaceSVGListItem,
  requireSVGList,
} from "./svg-list-state.js";

export function createSVGListMembers(interfaceName, transform = false) {
  const members = {
    length: getter(interfaceName, "length", value => requireSVGList(value).values.length),
    numberOfItems: getter(
      interfaceName,
      "numberOfItems",
      value => requireSVGList(value).values.length,
    ),
    appendItem: method(interfaceName, "appendItem", 1, (value, args) =>
      appendSVGListItem(value, args[0])),
    clear: method(interfaceName, "clear", 0, value => clearSVGList(value)),
    getItem: method(interfaceName, "getItem", 1, (value, args) =>
      getSVGListItem(value, args[0])),
    initialize: method(interfaceName, "initialize", 1, (value, args) =>
      initializeSVGList(value, args[0])),
    insertItemBefore: method(interfaceName, "insertItemBefore", 2, (value, args) =>
      insertSVGListItem(value, args[0], args[1])),
    removeItem: method(interfaceName, "removeItem", 1, (value, args) =>
      removeSVGListItem(value, args[0])),
    replaceItem: method(interfaceName, "replaceItem", 2, (value, args) =>
      replaceSVGListItem(value, args[0], args[1])),
    values: method(interfaceName, "values", 0, value => refreshSVGList(value).values()),
  };
  if (transform) {
    members.consolidate = method(interfaceName, "consolidate", 0, value =>
      consolidateSVGTransformList(value));
    members.createSVGTransformFromMatrix = method(
      interfaceName,
      "createSVGTransformFromMatrix",
      1,
      (_value, args) => createTransformFromMatrix(args[0]),
    );
  }
  return members;
}

function getter(interfaceName, name, read) {
  const callback = function () {
    const result = read(this);
    traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}

function method(interfaceName, name, arity, operation) {
  const callback = {
    [name](...args) {
      requireSVGList(this);
      const result = operation(this, args);
      traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
