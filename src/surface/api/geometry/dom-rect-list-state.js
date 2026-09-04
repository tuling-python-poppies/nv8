import { DOMRectList } from "./dom-rect-list-constructor.js";
const state = new WeakMap();
export function createDOMRectList(rects) {
  const list=Object.create(DOMRectList.prototype); state.set(list,[...rects]);
  rects.forEach((rect,index)=>Object.defineProperty(list,index,{value:rect,enumerable:true,configurable:true}));
  return list;
}
export function requireDOMRectList(list) {
  const value=state.get(list); if(value===undefined) throw new TypeError("Illegal invocation"); return value;
}
