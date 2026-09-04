import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export const run = {
  run(callback) {
    if (typeof callback !== "function") {
      return undefined;
    }
    return Reflect.apply(callback, undefined, []);
  },
}.run;
registerNativeFunction(run, "run");
