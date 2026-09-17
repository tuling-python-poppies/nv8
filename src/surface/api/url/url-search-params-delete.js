import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { mutateURLSearchParams } from "./url-search-params-state.js";

const deleteParam = {
  delete(name) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'delete' on 'URLSearchParams': 1 argument required");
    }
    const normalizedName = `${name}`;
    const normalizedValue = arguments.length > 1 ? `${arguments[1]}` : null;
    mutateURLSearchParams(this, (pairs) => {
      for (let index = pairs.length - 1; index >= 0; index -= 1) {
        if (
          pairs[index][0] === normalizedName
          && (normalizedValue === null || pairs[index][1] === normalizedValue)
        ) {
          pairs.splice(index, 1);
        }
      }
    });
    traceCall(
      "window.URLSearchParams.prototype.delete",
      "URLSearchParams",
      normalizedValue === null
        ? [normalizedName]
        : [normalizedName, normalizedValue],
      undefined,
    );
  },
}.delete;
registerNativeFunction(deleteParam, "delete");
export function installURLSearchParamsDelete() {
  definePrototypeMethod(URLSearchParams.prototype, "delete", deleteParam);
}
