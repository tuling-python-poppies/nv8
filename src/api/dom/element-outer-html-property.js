import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { Element } from "./element-constructor.js";
import { outerHTML } from "./element-outer-html-getter.js";
import { setOuterHTML } from "./element-outer-html-setter.js";

export function installElementOuterHTML() {
  definePrototypeAccessor(
    Element.prototype,
    "outerHTML",
    outerHTML,
    setOuterHTML,
  );
}
