import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMarquee } from "./html-marquee-element-state.js";
export const stop = { stop() {
  requireMarquee(this).running = false;
  traceCall("window.HTMLMarqueeElement.prototype.stop", "HTMLMarqueeElement", [], undefined);
}}.stop;
registerNativeFunction(stop, "stop");
