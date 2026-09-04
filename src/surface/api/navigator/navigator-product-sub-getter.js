import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const productSub = Object.getOwnPropertyDescriptor({
  get productSub() {
    const value = navigatorField(this, "productSub");
    traceGetter("window.Navigator.prototype.productSub", "Navigator", value);
    return value;
  },
}, "productSub").get;
registerNativeGetter(productSub, "productSub");
export function installNavigatorProductSub() {
  definePrototypeGetter(Navigator.prototype, "productSub", productSub);
}
