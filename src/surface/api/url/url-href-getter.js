import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeAccessor,
} from "../../../engine/webidl/cross-realm-method.js";
import { readURLComponent } from "./url-state.js";

export const href = Object.getOwnPropertyDescriptor({
  get href() {
    const foreignGetter = findCrossRealmPrototypeAccessor(
      this,
      "href",
      "get",
      href,
    );
    if (foreignGetter !== null) {
      return Reflect.apply(foreignGetter, this, []);
    }
    const value = readURLComponent(this, "href");
    traceGetter("window.URL.prototype.href", "URL", value);
    return value;
  },
}, "href").get;
registerNativeGetter(href, "href");
