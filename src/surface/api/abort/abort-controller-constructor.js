import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  initializeAbortController,
} from "./abort-controller-state.js";

export function AbortController() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'AbortController': use new");
  }
  initializeAbortController(this);
}
registerNativeFunction(AbortController, "AbortController");
export function installAbortControllerConstructor() {
  delete AbortController.prototype.constructor;
  defineToStringTag(AbortController.prototype, "AbortController");
  defineGlobalConstructor("AbortController", AbortController);
}
export function installAbortControllerConstructorBacklink() {
  defineConstructorBacklink(AbortController.prototype, AbortController);
}
