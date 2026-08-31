import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { CharacterData } from "./character-data-constructor.js";
import { requireNode } from "./node-state.js";

export const previousElementSibling = Object.getOwnPropertyDescriptor({
  get previousElementSibling() {
    const state = requireNode(this);
    let value = null;
    if (state.parent !== null) {
      const siblings = requireNode(state.parent).children;
      for (let index = siblings.indexOf(this) - 1; index >= 0; index -= 1) {
        if (requireNode(siblings[index]).nodeType === 1) {
          value = siblings[index];
          break;
        }
      }
    }
    traceGetter(
      "window.CharacterData.prototype.previousElementSibling",
      "CharacterData",
      value,
    );
    return value;
  },
}, "previousElementSibling").get;
registerNativeGetter(previousElementSibling, "previousElementSibling");
export function installCharacterDataPreviousElementSibling() {
  definePrototypeGetter(
    CharacterData.prototype,
    "previousElementSibling",
    previousElementSibling,
  );
}
