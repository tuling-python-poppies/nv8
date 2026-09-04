import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { refreshNodeList } from "./node-list-state.js";

export const value = Object.getOwnPropertyDescriptor({
  get value() {
    const result = refreshNodeList(this).find(item => Boolean(item.checked))
      ?.value ?? "";
    const normalized = `${result}`;
    traceGetter(
      "window.RadioNodeList.prototype.value",
      "RadioNodeList",
      normalized,
    );
    return normalized;
  },
}, "value").get;
registerNativeGetter(value, "value");

export const setValue = Object.getOwnPropertyDescriptor({
  set value(wanted) {
    const normalized = `${wanted}`;
    for (const item of refreshNodeList(this)) {
      item.checked = `${item.value ?? ""}` === normalized;
    }
  },
}, "value").set;
registerNativeFunction(setValue, "set value");
