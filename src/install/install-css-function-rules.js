import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  CSSFunctionDeclarations,
  CSSFunctionDescriptors,
  CSSFunctionRule,
  installCSSFunctionRuleConstructors,
} from "../api/css/css-function-rule-constructors.js";
import {
  functionDeclarationsStyle,
  functionDescriptorResult,
  functionName,
  functionReturnType,
  getParameters,
} from "../api/css/css-function-rule-members.js";

export function installCSSFunctionRules() {
  installCSSFunctionRuleConstructors();
  definePrototypeGetter(
    CSSFunctionDeclarations.prototype,
    "style",
    functionDeclarationsStyle,
  );
  finish(CSSFunctionDeclarations);
  definePrototypeGetter(
    CSSFunctionDescriptors.prototype,
    "result",
    functionDescriptorResult,
  );
  finish(CSSFunctionDescriptors);
  definePrototypeGetter(CSSFunctionRule.prototype, "name", functionName);
  definePrototypeGetter(CSSFunctionRule.prototype, "returnType", functionReturnType);
  definePrototypeMethod(CSSFunctionRule.prototype, "getParameters", getParameters);
  finish(CSSFunctionRule);
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
