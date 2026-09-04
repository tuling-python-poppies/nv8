import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
export function DOMRectList(){throw new TypeError("Illegal constructor");}
registerNativeFunction(DOMRectList,"DOMRectList");
export function installDOMRectListConstructor(){delete DOMRectList.prototype.constructor;defineGlobalConstructor("DOMRectList",DOMRectList);}
