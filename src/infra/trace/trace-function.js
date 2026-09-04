import { summarizePrimitive } from "./trace-format.js";
import {
  appendTrace,
  traceIsEnabled,
} from "./trace-state.js";

export function traceCall(api, receiverName, argumentValues, resultValue) {
  if (!traceIsEnabled()) {
    return;
  }
  const argumentsSummary = new Array(argumentValues.length);
  for (let index = 0; index < argumentValues.length; index += 1) {
    argumentsSummary[index] = summarizePrimitive(argumentValues[index]);
  }
  appendTrace(
    "call",
    api,
    receiverName,
    argumentsSummary,
    summarizePrimitive(resultValue),
  );
}

export function traceConstruct(api, argumentValues, resultName) {
  if (!traceIsEnabled()) {
    return;
  }
  const argumentsSummary = new Array(argumentValues.length);
  for (let index = 0; index < argumentValues.length; index += 1) {
    argumentsSummary[index] = summarizePrimitive(argumentValues[index]);
  }
  appendTrace("construct", api, api, argumentsSummary, resultName);
}
