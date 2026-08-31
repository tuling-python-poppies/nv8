import { registerNativeFunction } from "../../webidl/native-function.js"; import { requireDOMRectList } from "./dom-rect-list-state.js";
export const item={item(index){return requireDOMRectList(this)[Number(index)>>>0]??null;}}.item;registerNativeFunction(item,"item");
