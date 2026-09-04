import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { CharacterData } from "./character-data-constructor.js";
import { requireNode } from "./node-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const value = (requireNode(this).nodeValue ?? "").length;
    traceGetter("window.CharacterData.prototype.length", "CharacterData", value);
    return value;
  },
}, "length").get;
registerNativeGetter(length, "length");
export function installCharacterDataLength() {
  definePrototypeGetter(CharacterData.prototype, "length", length);
}
