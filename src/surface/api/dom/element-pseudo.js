import { createCSSPseudoElement } from "../css/css-pseudo-element-state.js";import { elementExtendedMethod } from "./element-extended-method.js";
export const pseudo=elementExtendedMethod("pseudo",1,(element,args)=>createCSSPseudoElement(element,args[0]));
