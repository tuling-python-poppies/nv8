import { registerNativeGetter } from "../../webidl/native-function.js"; import { requireDOMRectList } from "./dom-rect-list-state.js";
export const length=Object.getOwnPropertyDescriptor({get length(){return requireDOMRectList(this).length;}},"length").get;registerNativeGetter(length,"length");
