import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const requestMIDIAccess = {
  requestMIDIAccess() {
    const value = Promise.resolve(navigatorService(this, "midiAccess"));
    traceCall(
      "window.Navigator.prototype.requestMIDIAccess",
      "Navigator",
      arguments.length === 0 ? [] : [arguments[0]],
      value,
    );
    return value;
  },
}.requestMIDIAccess;
registerNativeFunction(requestMIDIAccess, "requestMIDIAccess");
export function installNavigatorRequestMIDIAccess() {
  definePrototypeMethod(Navigator.prototype, "requestMIDIAccess", requestMIDIAccess);
}
