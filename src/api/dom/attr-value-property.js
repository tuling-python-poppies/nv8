import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { Attr } from "./attr-constructor.js";
import { value } from "./attr-value-getter.js";
import { setValue } from "./attr-value-setter.js";

export function installAttrValue() {
  definePrototypeAccessor(Attr.prototype, "value", value, setValue);
}
