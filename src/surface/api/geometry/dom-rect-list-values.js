import { registerNativeFunction } from "../../../engine/webidl/native-function.js"; import { requireDOMRectList } from "./dom-rect-list-state.js";
export const values={values(){return requireDOMRectList(this).values();}}.values;registerNativeFunction(values,"values");
