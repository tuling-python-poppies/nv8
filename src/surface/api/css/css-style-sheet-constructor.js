import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { StyleSheet } from "./style-sheet-constructor.js";
import { initializeCSSStyleSheet } from "./css-style-sheet-state.js";

export function CSSStyleSheet(options = {}) {
  if (new.target === undefined) throw new TypeError("CSSStyleSheet must be constructed");
  initializeCSSStyleSheet(this, options);
}
registerNativeFunction(CSSStyleSheet, "CSSStyleSheet");

export function installCSSStyleSheetConstructor() {
  Object.setPrototypeOf(CSSStyleSheet.prototype, StyleSheet.prototype);
  Object.setPrototypeOf(CSSStyleSheet, StyleSheet);
  delete CSSStyleSheet.prototype.constructor;
  defineGlobalConstructor("CSSStyleSheet", CSSStyleSheet);
}
