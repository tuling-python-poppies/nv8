import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const connection = Object.getOwnPropertyDescriptor({
  get connection() {
    const value = navigatorService(this, "connection");
    traceGetter("window.Navigator.prototype.connection", "Navigator", value);
    return value;
  },
}, "connection").get;
registerNativeGetter(connection, "connection");
export function installNavigatorConnection() {
  definePrototypeGetter(Navigator.prototype, "connection", connection);
}
