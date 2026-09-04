import { defineConstructorBacklink,definePrototypeAccessor,defineToStringTag } from "../../engine/webidl/descriptor.js";
import { DOMRect,installDOMRectConstructor } from "../api/geometry/dom-rect-constructor.js";
import { mutableX,setX,mutableY,setY,mutableWidth,setWidth,mutableHeight,setHeight } from "../api/geometry/dom-rect-mutable-properties.js";
export function installDOMRect(){installDOMRectConstructor();accessor("x",mutableX,setX);accessor("y",mutableY,setY);accessor("width",mutableWidth,setWidth);accessor("height",mutableHeight,setHeight);defineConstructorBacklink(DOMRect.prototype,DOMRect);defineToStringTag(DOMRect.prototype,"DOMRect");}
function accessor(name,get,set){definePrototypeAccessor(DOMRect.prototype,name,get,set);}
