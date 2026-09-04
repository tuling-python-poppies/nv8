import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMarquee } from "./html-marquee-element-state.js";
export const start = { start() {
  requireMarquee(this).running = true;
  traceCall("window.HTMLMarqueeElement.prototype.start", "HTMLMarqueeElement", [], undefined);
}}.start;
registerNativeFunction(start, "start");
