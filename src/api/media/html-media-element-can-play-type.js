import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";
import {
  mediaElementCanPlayTypeResult,
} from "./html-media-element-codec-profile.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";

export const canPlayType = {
  canPlayType(type) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "canPlayType",
      canPlayType,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    requireMediaElement(this);
    const result = mediaElementCanPlayTypeResult(type);
    traceCall(
      "window.HTMLMediaElement.prototype.canPlayType",
      "HTMLMediaElement",
      [type],
      result,
    );
    return result;
  },
}.canPlayType;
registerNativeFunction(canPlayType, "canPlayType");
