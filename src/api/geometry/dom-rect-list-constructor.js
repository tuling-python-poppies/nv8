import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
export function DOMRectList(){throw new TypeError("Illegal constructor");}
registerNativeFunction(DOMRectList,"DOMRectList");
export function installDOMRectListConstructor(){delete DOMRectList.prototype.constructor;defineGlobalConstructor("DOMRectList",DOMRectList);}
