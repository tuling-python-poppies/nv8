import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Element } from "./element-constructor.js";
import { id } from "./element-id-getter.js";
import { setId } from "./element-id-setter.js";

export function installElementId() {
  definePrototypeAccessor(Element.prototype, "id", id, setId);
}
