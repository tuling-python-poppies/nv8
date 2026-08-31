import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { taggedOfflineResult } from "./navigator-offline-result.js";
import { requireNavigator } from "./navigator-state.js";

export const getUserMedia = {
  getUserMedia(constraints, successCallback, errorCallback) {
    requireNavigator(this);
    const stream = taggedOfflineResult("MediaStream", {
      active: true,
      id: "edge-sandbox-media-stream",
    });
    if (typeof successCallback === "function") {
      Reflect.apply(successCallback, undefined, [stream]);
    }
    traceCall(
      "window.Navigator.prototype.getUserMedia",
      "Navigator",
      [constraints, successCallback, errorCallback],
      undefined,
    );
  },
}.getUserMedia;
registerNativeFunction(getUserMedia, "getUserMedia");
export function installNavigatorGetUserMedia() {
  definePrototypeMethod(Navigator.prototype, "getUserMedia", getUserMedia);
}
