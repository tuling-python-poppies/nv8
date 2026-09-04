import { registerNativeFunction } from "../../../engine/webidl/native-function.js";import { createCSSStyleValue } from "./css-style-value-state.js";
export const parseAll={parseAll(property,value){void `${property}`;return `${value}`.split(",").map(part=>createCSSStyleValue(part.trim()));}}.parseAll;registerNativeFunction(parseAll,"parseAll");
