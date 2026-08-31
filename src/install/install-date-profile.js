import {
  timingProfile,
  wallClockNow,
} from "../scheduler/monotonic-clock.js";
import { registerNativeFunction } from "../webidl/native-function.js";

let installed = false;

export function installDateProfile() {
  if (installed) return;
  const clock = timingProfile();
  if (clock.wallClockOffsetMs === 0 && clock.dateNowResolutionMs === 0) {
    installed = true;
    return;
  }
  const nativeDate = globalThis.Date;
  const now = {
    now() {
      return wallClockNow();
    },
  }.now;
  registerNativeFunction(now, "Date.now");

  const date = function Date(...args) {
    if (new.target === undefined) {
      return new nativeDate(wallClockNow()).toString();
    }
    const selectedArgs = args.length === 0 ? [wallClockNow()] : args;
    const selectedTarget = new.target === date ? nativeDate : new.target;
    return Reflect.construct(nativeDate, selectedArgs, selectedTarget);
  };
  Object.setPrototypeOf(date, nativeDate);
  Object.defineProperty(date, "prototype", {
    value: nativeDate.prototype,
    writable: true,
    enumerable: false,
    configurable: false,
  });
  Object.defineProperty(date, "now", {
    value: now,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(date, "parse", {
    value: nativeDate.parse,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(date, "UTC", {
    value: nativeDate.UTC,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(date, "length", {
    value: 7,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  registerNativeFunction(date, "Date");
  Object.defineProperty(nativeDate.prototype, "constructor", {
    value: date,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(globalThis, "Date", {
    value: date,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  installed = true;
}
