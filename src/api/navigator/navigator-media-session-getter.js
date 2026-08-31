import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
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
