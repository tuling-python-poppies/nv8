import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireCSSGroupingSpecialRule } from "./css-grouping-special-state.js";

export const layerBlockName = getter("CSSLayerBlockRule", "name", record => record.name);
export const layerNameList = getter(
  "CSSLayerStatementRule",
  "nameList",
  record => [...record.nameList],
);
export const scopeStart = getter("CSSScopeRule", "start", record => record.start);
export const scopeEnd = getter("CSSScopeRule", "end", record => record.end);
export const pageSelectorText = getter(
  "CSSPageRule",
  "selectorText",
  record => record.selectorText,
);
export const pageStyle = getter("CSSPageRule", "style", record => record.style);
export const containerName = getter(
  "CSSContainerRule",
  "containerName",
  record => record.containerName,
);
export const containerQuery = getter(
  "CSSContainerRule",
  "containerQuery",
  record => record.containerQuery,
);
export const containerConditions = getter(
  "CSSContainerRule",
  "conditions",
  record => [...record.conditions],
);

function getter(interfaceName, name, read) {
  const callback = function () {
    const result = read(requireCSSGroupingSpecialRule(this));
    traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}
