import { CSSPseudoElement } from "./css-pseudo-element-constructor.js";
const state=new WeakMap();
export function createCSSPseudoElement(element,type,parent=null){const pseudo=Object.create(CSSPseudoElement.prototype);state.set(pseudo,{element,type:`${type}`,parent});return pseudo;}
export function requireCSSPseudoElement(pseudo){const value=state.get(pseudo);if(value===undefined)throw new TypeError("Illegal invocation");return value;}
