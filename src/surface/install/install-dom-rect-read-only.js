import { defineConstructorBacklink,definePrototypeGetter,definePrototypeMethod,defineToStringTag } from "../../engine/webidl/descriptor.js";
import { DOMRectReadOnly,installDOMRectReadOnlyConstructor } from "../api/geometry/dom-rect-read-only-constructor.js";
import { toJSON } from "../api/geometry/dom-rect-to-json.js";
import { rectGetterTable } from "../api/geometry/rect-getter-members.js";

export function installDOMRectReadOnly(){installDOMRectReadOnlyConstructor();for (const [name, entry] of rectGetterTable) getter(name,entry);definePrototypeMethod(DOMRectReadOnly.prototype,"toJSON",toJSON);defineConstructorBacklink(DOMRectReadOnly.prototype,DOMRectReadOnly);defineToStringTag(DOMRectReadOnly.prototype,"DOMRectReadOnly");}
function getter(name,callback){definePrototypeGetter(DOMRectReadOnly.prototype,name,callback);}
