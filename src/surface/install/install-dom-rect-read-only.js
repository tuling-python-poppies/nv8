import { defineConstructorBacklink,definePrototypeGetter,definePrototypeMethod,defineToStringTag } from "../../engine/webidl/descriptor.js";
import { DOMRectReadOnly,installDOMRectReadOnlyConstructor } from "../api/geometry/dom-rect-read-only-constructor.js";
import { x } from "../api/geometry/dom-rect-x-getter.js"; import { y } from "../api/geometry/dom-rect-y-getter.js";
import { width } from "../api/geometry/dom-rect-width-getter.js"; import { height } from "../api/geometry/dom-rect-height-getter.js";
import { top } from "../api/geometry/dom-rect-top-getter.js"; import { right } from "../api/geometry/dom-rect-right-getter.js";
import { bottom } from "../api/geometry/dom-rect-bottom-getter.js"; import { left } from "../api/geometry/dom-rect-left-getter.js";
import { toJSON } from "../api/geometry/dom-rect-to-json.js";
export function installDOMRectReadOnly(){installDOMRectReadOnlyConstructor();getter("x",x);getter("y",y);getter("width",width);getter("height",height);getter("top",top);getter("right",right);getter("bottom",bottom);getter("left",left);definePrototypeMethod(DOMRectReadOnly.prototype,"toJSON",toJSON);defineConstructorBacklink(DOMRectReadOnly.prototype,DOMRectReadOnly);defineToStringTag(DOMRectReadOnly.prototype,"DOMRectReadOnly");}
function getter(name,callback){definePrototypeGetter(DOMRectReadOnly.prototype,name,callback);}
