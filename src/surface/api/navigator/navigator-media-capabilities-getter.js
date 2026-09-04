import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const mediaCapabilities = Object.getOwnPropertyDescriptor({
  get mediaCapabilities() {
    const value = navigatorService(this, "mediaCapabilities");
    traceGetter("window.Navigator.prototype.mediaCapabilities", "Navigator", value);
    return value;
  },
}, "mediaCapabilities").get;
registerNativeGetter(mediaCapabilities, "mediaCapabilities");
export function installNavigatorMediaCapabilities() {
  definePrototypeGetter(Navigator.prototype, "mediaCapabilities", mediaCapabilities);
}
