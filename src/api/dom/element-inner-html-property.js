import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { Element } from "./element-constructor.js";
import { innerHTML } from "./element-inner-html-getter.js";
import { setInnerHTML } from "./element-inner-html-setter.js";

export function installElementInnerHTML() {
  definePrototypeAccessor(
    Element.prototype,
    "innerHTML",
    innerHTML,
    setInnerHTML,
  );
}
