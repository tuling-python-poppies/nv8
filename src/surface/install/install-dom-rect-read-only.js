import { defineConstructorBacklink,definePrototypeGetter,definePrototypeMethod,defineToStringTag } from "../../engine/webidl/descriptor.js";
import { DOMRectReadOnly,installDOMRectReadOnlyConstructor } from "../api/geometry/dom-rect-read-only-constructor.js";
import {
  x,
  y,
  width,
  height,
  top,
  right,
  bottom,
  left,
} from "../api/geometry/rect-getter-members.js"; 
import { toJSON } from "../api/geometry/dom-rect-to-json.js";

export function installDOMRectReadOnly(){installDOMRectReadOnlyConstructor();getter("x",x);getter("y",y);getter("width",width);getter("height",height);getter("top",top);getter("right",right);getter("bottom",bottom);getter("left",left);definePrototypeMethod(DOMRectReadOnly.prototype,"toJSON",toJSON);defineConstructorBacklink(DOMRectReadOnly.prototype,DOMRectReadOnly);defineToStringTag(DOMRectReadOnly.prototype,"DOMRectReadOnly");}
function getter(name,callback){definePrototypeGetter(DOMRectReadOnly.prototype,name,callback);}
