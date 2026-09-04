import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
export function CSSStyleValue(){throw new TypeError("Illegal constructor");}registerNativeFunction(CSSStyleValue,"CSSStyleValue");
export function installCSSStyleValueConstructor(){delete CSSStyleValue.prototype.constructor;defineGlobalConstructor("CSSStyleValue",CSSStyleValue);}
