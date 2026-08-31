import { traceCall } from "../../trace/trace-function.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCSSDeclarationRule } from "./css-declaration-rule-state.js";

export const fontFaceStyle = getter("CSSFontFaceRule", "style", record => record.style);
export const marginName = getter("CSSMarginRule", "name", record => record.name);
export const marginStyle = getter("CSSMarginRule", "style", record => record.style);
export const nestedStyle = getter("CSSNestedDeclarations", "style", record => record.style);
export const namespaceURI = getter(
  "CSSNamespaceRule",
  "namespaceURI",
  record => record.namespaceURI,
);
export const namespacePrefix = getter(
  "CSSNamespaceRule",
  "prefix",
  record => record.prefix,
);
export const positionTryName = getter(
  "CSSPositionTryRule",
  "name",
  record => record.name,
);
export const positionTryStyle = getter(
  "CSSPositionTryRule",
  "style",
  record => record.style,
);
export const viewTransitionNavigation = getter(
  "CSSViewTransitionRule",
  "navigation",
  record => record.style.getPropertyValue("navigation"),
);
export const viewTransitionTypes = getter(
  "CSSViewTransitionRule",
  "types",
  record => record.style.getPropertyValue("types").split(/\s+/u).filter(Boolean),
);

function getter(interfaceName, name, read) {
  const callback = function () {
    const result = read(requireCSSDeclarationRule(this));
    traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}
