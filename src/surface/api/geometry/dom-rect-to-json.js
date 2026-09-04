import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { requireDOMRect } from "./dom-rect-state.js";
export const toJSON = { toJSON() {
  const foreignMethod = findCrossRealmPrototypeMethod(
    this,
    "toJSON",
    toJSON,
  );
  if (foreignMethod !== null) {
    return Reflect.apply(foreignMethod, this, arguments);
  }
  const s = requireDOMRect(this);
  const result = { x:s.x, y:s.y, width:s.width, height:s.height,
    top:Math.min(s.y,s.y+s.height), right:Math.max(s.x,s.x+s.width),
    bottom:Math.max(s.y,s.y+s.height), left:Math.min(s.x,s.x+s.width) };
  traceCall("window.DOMRectReadOnly.prototype.toJSON", "DOMRectReadOnly", [], result);
  return result;
}}.toJSON;
registerNativeFunction(toJSON, "toJSON");
