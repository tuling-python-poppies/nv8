import { CSSStyleValue } from "./css-style-value-constructor.js";
const state=new WeakMap();
export function createCSSStyleValue(value){const result=Object.create(CSSStyleValue.prototype);initializeCSSStyleValue(result,()=>`${value}`);return result;}
export function initializeCSSStyleValue(value,serialize){state.set(value,typeof serialize==="function"?serialize:()=>`${serialize}`);return value;}
export function requireCSSStyleValue(value){const serialize=state.get(value);if(serialize===undefined)throw new TypeError("Illegal invocation");return `${serialize()}`;}
