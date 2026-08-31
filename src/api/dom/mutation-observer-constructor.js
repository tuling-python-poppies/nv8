import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { traceConstruct } from "../../trace/trace-function.js";
import { initializeMutationObserver } from "./mutation-observer-state.js";

export function MutationObserver(callback) {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'MutationObserver': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  if (typeof callback !== "function") {
    throw new TypeError(
      "Failed to construct 'MutationObserver': parameter 1 is not a function.",
    );
  }
  initializeMutationObserver(this, callback);
  traceConstruct("window.MutationObserver", [callback], "MutationObserver");
}
registerNativeFunction(MutationObserver, "MutationObserver");

export function installMutationObserverConstructor() {
  delete MutationObserver.prototype.constructor;
  defineGlobalConstructor("MutationObserver", MutationObserver);
  Object.defineProperty(globalThis, "WebKitMutationObserver", {
    value: MutationObserver,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export function finishMutationObserverConstructor() {
  defineConstructorBacklink(MutationObserver.prototype, MutationObserver);
  defineToStringTag(MutationObserver.prototype, "MutationObserver");
}
