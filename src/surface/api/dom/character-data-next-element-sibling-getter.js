import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { CharacterData } from "./character-data-constructor.js";
import { requireNode } from "./node-state.js";

export const nextElementSibling = Object.getOwnPropertyDescriptor({
  get nextElementSibling() {
    const state = requireNode(this);
    let value = null;
    if (state.parent !== null) {
      const siblings = requireNode(state.parent).children;
      for (
        let index = siblings.indexOf(this) + 1;
        index < siblings.length;
        index += 1
      ) {
        if (requireNode(siblings[index]).nodeType === 1) {
          value = siblings[index];
          break;
        }
      }
    }
    traceGetter(
      "window.CharacterData.prototype.nextElementSibling",
      "CharacterData",
      value,
    );
    return value;
  },
}, "nextElementSibling").get;
registerNativeGetter(nextElementSibling, "nextElementSibling");
export function installCharacterDataNextElementSibling() {
  definePrototypeGetter(
    CharacterData.prototype,
    "nextElementSibling",
    nextElementSibling,
  );
}
