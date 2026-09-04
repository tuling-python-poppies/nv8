import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { URLSearchParams } from "./url-search-params-constructor.js";
import { mutateURLSearchParams } from "./url-search-params-state.js";

export const sort = {
  sort() {
    mutateURLSearchParams(this, (pairs) => {
      pairs.sort(([left], [right]) => {
        const leftUnits = Array.from(left);
        const rightUnits = Array.from(right);
        const limit = Math.min(leftUnits.length, rightUnits.length);
        for (let index = 0; index < limit; index += 1) {
          const difference = left.charCodeAt(index) - right.charCodeAt(index);
          if (difference !== 0) {
            return difference;
          }
        }
        return leftUnits.length - rightUnits.length;
      });
    });
    traceCall("window.URLSearchParams.prototype.sort", "URLSearchParams", [], undefined);
  },
}.sort;
registerNativeFunction(sort, "sort");
export function installURLSearchParamsSort() {
  definePrototypeMethod(URLSearchParams.prototype, "sort", sort);
}
