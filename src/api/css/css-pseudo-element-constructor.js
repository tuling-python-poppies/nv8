import { defineGlobalConstructor } from "../../webidl/descriptor.js";import { registerNativeFunction } from "../../webidl/native-function.js";
export function CSSPseudoElement(){throw new TypeError("Illegal constructor");}registerNativeFunction(CSSPseudoElement,"CSSPseudoElement");
export function installCSSPseudoElementConstructor(){delete CSSPseudoElement.prototype.constructor;defineGlobalConstructor("CSSPseudoElement",CSSPseudoElement);}
