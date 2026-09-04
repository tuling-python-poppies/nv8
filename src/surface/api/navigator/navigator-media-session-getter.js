import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const mediaSession = Object.getOwnPropertyDescriptor({
  get mediaSession() {
    const value = navigatorService(this, "mediaSession");
    traceGetter("window.Navigator.prototype.mediaSession", "Navigator", value);
    return value;
  },
}, "mediaSession").get;
registerNativeGetter(mediaSession, "mediaSession");
export function installNavigatorMediaSession() {
  definePrototypeGetter(Navigator.prototype, "mediaSession", mediaSession);
}
