import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function FetchLaterResult() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(FetchLaterResult, "FetchLaterResult");

export function fetchLater(input) {
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'fetchLater' on 'Window': "
        + "1 argument required, but only 0 present.",
    );
  }
  const value = `${input}`;
  try {
    new URL(value);
  } catch {
    throw new TypeError("Failed to parse the deferred fetch URL.");
  }
  const result = Object.create(FetchLaterResult.prototype);
  state.set(result, true);
  return result;
}
registerNativeFunction(fetchLater, "fetchLater");

export function fetchLaterProperty(value, name) {
  const activated = state.get(value);
  if (activated === undefined || name !== "activated") {
    throw new TypeError("Illegal invocation");
  }
  return activated;
}
