import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireCookieStore } from "./cookie-store-state.js";
export const setOnchange = Object.getOwnPropertyDescriptor({ set onchange(value) {
  requireCookieStore(this).onchange = typeof value === "function" ? value : null;
}}, "onchange").set;
registerNativeFunction(setOnchange, "set onchange");
