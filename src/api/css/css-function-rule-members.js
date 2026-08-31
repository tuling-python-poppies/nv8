import { traceCall } from "../../trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import { requireCSSStyleDeclaration } from "./css-style-declaration-state.js";
import {
  requireCSSFunctionDeclarations,
  requireCSSFunctionRule,
} from "./css-function-rule-state.js";

export const functionDeclarationsStyle = getter(
  "CSSFunctionDeclarations",
  "style",
  value => requireCSSFunctionDeclarations(value).style,
);
export const functionDescriptorResult = getter(
  "CSSFunctionDescriptors",
  "result",
  value => {
    requireCSSStyleDeclaration(value);
    return value.getPropertyValue("result");
  },
);
export const functionName = getter(
  "CSSFunctionRule",
  "name",
  value => requireCSSFunctionRule(value).name,
);
export const functionReturnType = getter(
  "CSSFunctionRule",
  "returnType",
  value => requireCSSFunctionRule(value).returnType,
);
export const getParameters = {
  getParameters() {
    const result = [...requireCSSFunctionRule(this).parameters];
    traceCall(
      "window.CSSFunctionRule.prototype.getParameters",
      "CSSFunctionRule",
      [],
      result,
    );
    return result;
  },
}.getParameters;
registerNativeFunction(getParameters, "getParameters");

function getter(interfaceName, name, read) {
  const callback = function () {
    const result = read(this);
    traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}
