import { ViewTransitionTypeSet } from "./view-transition-type-set-constructor.js";
const state=new WeakMap();
export function createViewTransitionTypeSet(values=[]){const result=Object.create(ViewTransitionTypeSet.prototype);state.set(result,new Set(Array.from(values,value=>`${value}`)));return result;}
export function requireViewTransitionTypeSet(value){const result=state.get(value);if(result===undefined)throw new TypeError("Illegal invocation");return result;}
