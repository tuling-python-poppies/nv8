import { summarizePrimitive } from "./trace-format.js";
import {
  appendTrace,
  traceIsEnabled,
} from "./trace-state.js";

export function traceGetter(api, receiverName, resultValue) {
  if (!traceIsEnabled()) {
    return;
  }
  appendTrace(
    "get",
    api,
    receiverName,
    [],
    summarizePrimitive(resultValue),
  );
}

export function traceSetter(api, receiverName, argumentValue) {
  if (!traceIsEnabled()) {
    return;
  }
  appendTrace(
    "set",
    api,
    receiverName,
    [summarizePrimitive(argumentValue)],
    undefined,
  );
}
