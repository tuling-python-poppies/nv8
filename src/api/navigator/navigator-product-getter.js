import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const product = Object.getOwnPropertyDescriptor({
  get product() {
    const value = navigatorField(this, "product");
    traceGetter("window.Navigator.prototype.product", "Navigator", value);
    return value;
  },
}, "product").get;
registerNativeGetter(product, "product");
export function installNavigatorProduct() {
  definePrototypeGetter(Navigator.prototype, "product", product);
}
