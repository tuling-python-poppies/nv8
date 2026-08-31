import { traceCall } from "../../trace/trace-function.js";
import { toDOMString } from "../../webidl/conversions.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Event } from "../event/event-constructor.js";
import { dispatchEvent } from "../event/event-target-dispatch-event.js";
import { ScreenOrientation } from "./screen-orientation-constructor.js";
import { requireScreenOrientation } from "./screen-orientation-state.js";

const allowedOrientations = new Set([
  "any",
  "natural",
  "landscape",
  "portrait",
  "portrait-primary",
  "portrait-secondary",
  "landscape-primary",
  "landscape-secondary",
]);

export const lock = {
  lock(orientation) {
    const state = requireScreenOrientation(this);
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'lock' on 'ScreenOrientation': 1 argument required.",
      );
    }
    const normalized = toDOMString(orientation);
    if (!allowedOrientations.has(normalized)) {
      throw new TypeError(`'${normalized}' is not a valid orientation lock type.`);
    }
    if (normalized !== "any" && normalized !== "natural") {
      state.type = normalized.includes("-")
        ? normalized
        : `${normalized}-primary`;
      state.angle = state.type.endsWith("secondary") ? 180 : 0;
    }
    const event = new Event("change");
    Reflect.apply(dispatchEvent, this, [event]);
    if (typeof state.onchange === "function") {
      Reflect.apply(state.onchange, this, [event]);
    }
    const result = Promise.resolve(undefined);
    traceCall(
      "window.ScreenOrientation.prototype.lock",
      "ScreenOrientation",
      [normalized],
      result,
    );
    return result;
  },
}.lock;

registerNativeFunction(lock, "lock");

export function installScreenOrientationLock() {
  definePrototypeMethod(ScreenOrientation.prototype, "lock", lock);
}
