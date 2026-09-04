import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { taggedOfflineResult } from "./navigator-offline-result.js";
import { requireNavigator } from "./navigator-state.js";

export const webkitGetUserMedia = {
  webkitGetUserMedia(constraints, successCallback, errorCallback) {
    requireNavigator(this);
    const stream = taggedOfflineResult("MediaStream", {
      active: true,
      id: "edge-sandbox-media-stream",
    });
    if (typeof successCallback === "function") {
      Reflect.apply(successCallback, undefined, [stream]);
    }
    traceCall(
      "window.Navigator.prototype.webkitGetUserMedia",
      "Navigator",
      [constraints, successCallback, errorCallback],
      undefined,
    );
  },
}.webkitGetUserMedia;
registerNativeFunction(webkitGetUserMedia, "webkitGetUserMedia");
export function installNavigatorWebkitGetUserMedia() {
  definePrototypeMethod(
    Navigator.prototype,
    "webkitGetUserMedia",
    webkitGetUserMedia,
  );
}
