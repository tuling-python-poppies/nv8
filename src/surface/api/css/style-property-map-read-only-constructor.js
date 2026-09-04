import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
export function StylePropertyMapReadOnly(){throw new TypeError("Illegal constructor");}registerNativeFunction(StylePropertyMapReadOnly,"StylePropertyMapReadOnly");
export function installStylePropertyMapReadOnlyConstructor(){delete StylePropertyMapReadOnly.prototype.constructor;defineGlobalConstructor("StylePropertyMapReadOnly",StylePropertyMapReadOnly);}
