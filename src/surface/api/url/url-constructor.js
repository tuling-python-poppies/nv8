import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeURL } from "./url-state.js";

export function URL(url, base = undefined) {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  if (arguments.length === 0) {
    throw new TypeError("Failed to construct 'URL': 1 argument required");
  }
  initializeURL(this, url, base);
}

registerNativeFunction(URL, "URL");

export function installURLConstructor() {
  delete URL.prototype.constructor;
  defineToStringTag(URL.prototype, "URL");
  defineGlobalConstructor("URL", URL);
  Object.defineProperty(globalThis, "webkitURL", {
    value: URL,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export function installURLConstructorBacklink() {
  defineConstructorBacklink(URL.prototype, URL);
}
