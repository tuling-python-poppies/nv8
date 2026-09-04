import { registerNativeFunction } from "../../../engine/webidl/native-function.js";import { createCSSStyleValue } from "./css-style-value-state.js";
export const parse={parse(property,value){void `${property}`;return createCSSStyleValue(value);}}.parse;registerNativeFunction(parse,"parse");
