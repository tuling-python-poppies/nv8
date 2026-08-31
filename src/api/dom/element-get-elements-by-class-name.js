import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { descendantElements, requireElement } from "./element-state.js";
import { createHTMLCollection } from "./html-collection-state.js";

const collections = new WeakMap();

export const getElementsByClassName = {
  getElementsByClassName(classNames) {
    requireElement(this);
    const tokens = `${classNames}`.trim().split(/\s+/u).filter(Boolean);
    const key = tokens.join(" ");
    let byName = collections.get(this);
    if (byName === undefined) {
      byName = new Map();
      collections.set(this, byName);
    }
    let result = byName.get(key);
    if (result === undefined) {
      result = createHTMLCollection(
        () => descendantElements(this).filter((element) => {
          const classes = (element.getAttribute("class") ?? "").split(/\s+/u);
          return tokens.every(token => classes.includes(token));
        }),
      );
      byName.set(key, result);
    }
    traceCall(
      "window.Element.prototype.getElementsByClassName",
      "Element",
      [classNames],
      result,
    );
    return result;
  },
}.getElementsByClassName;
registerNativeFunction(getElementsByClassName, "getElementsByClassName");
export function installElementGetElementsByClassName() {
  definePrototypeMethod(
    Element.prototype,
    "getElementsByClassName",
    getElementsByClassName,
  );
}
