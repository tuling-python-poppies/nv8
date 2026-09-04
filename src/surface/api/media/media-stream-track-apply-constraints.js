import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { OverconstrainedError } from "./overconstrained-error-constructor.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
export const applyConstraints = {
  applyConstraints() {
    const state = requireMediaStreamTrack(this);
    const constraints = arguments[0];
    const empty = constraints === undefined
      || constraints === null
      || typeof constraints !== "object"
      || Reflect.ownKeys(constraints).length === 0;
    const result = empty
      ? Promise.resolve(undefined)
      : Promise.reject(new OverconstrainedError(
        state.kind === "video" ? "width" : "",
        "Constraints cannot be satisfied",
      ));
    traceCall(
      "window.MediaStreamTrack.prototype.applyConstraints",
      "MediaStreamTrack",
      constraints === undefined ? [] : [constraints],
      result,
    );
    return result;
  },
}.applyConstraints;
registerNativeFunction(applyConstraints, "applyConstraints");
