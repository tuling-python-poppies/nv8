import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { descendantElements, requireElement } from "./element-state.js";
import { createHTMLCollection } from "./html-collection-state.js";

const collections = new WeakMap();

export const getElementsByTagName = {
  getElementsByTagName(qualifiedName) {
    requireElement(this);
    const name = `${qualifiedName}`.toLowerCase();
    let byName = collections.get(this);
    if (byName === undefined) {
      byName = new Map();
      collections.set(this, byName);
    }
    let result = byName.get(name);
    if (result === undefined) {
      result = createHTMLCollection(
        () => descendantElements(this).filter(
          element => name === "*" || element.localName === name,
        ),
      );
      byName.set(name, result);
    }
    traceCall(
      "window.Element.prototype.getElementsByTagName",
      "Element",
      [qualifiedName],
      result,
    );
    return result;
  },
}.getElementsByTagName;
registerNativeFunction(getElementsByTagName, "getElementsByTagName");
export function installElementGetElementsByTagName() {
  definePrototypeMethod(
    Element.prototype,
    "getElementsByTagName",
    getElementsByTagName,
  );
}
