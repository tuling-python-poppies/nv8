import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function TextTrackCueList() {
  throw new TypeError(
    "Failed to construct 'TextTrackCueList': Illegal constructor",
  );
}
registerNativeFunction(TextTrackCueList, "TextTrackCueList");

export function installTextTrackCueListConstructor() {
  delete TextTrackCueList.prototype.constructor;
  defineGlobalConstructor("TextTrackCueList", TextTrackCueList);
}
