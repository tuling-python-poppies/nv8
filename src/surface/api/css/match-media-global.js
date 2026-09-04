import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createMediaQueryList } from "./media-query-list-state.js";

export function matchMedia(query) {
  if (arguments.length < 1) {
    throw new TypeError("Failed to execute 'matchMedia' on 'Window': 1 argument required");
  }
  const result = createMediaQueryList(query);
  traceCall("window.matchMedia", "Window", [query], result);
  return result;
}
registerNativeFunction(matchMedia, "matchMedia");
