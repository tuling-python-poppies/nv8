import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { Element } from "./element-constructor.js";
import { className } from "./element-class-name-getter.js";
import { setClassName } from "./element-class-name-setter.js";

export function installElementClassName() {
  definePrototypeAccessor(
    Element.prototype,
    "className",
    className,
    setClassName,
  );
}
