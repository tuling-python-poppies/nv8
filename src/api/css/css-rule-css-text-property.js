import { cssRuleAccessorDescriptor } from "./css-rule-property.js";
import { cssRuleText, setCSSRuleText } from "./css-rule-state.js";
export const cssText = cssRuleAccessorDescriptor(
  "cssText",
  (_record, rule) => cssRuleText(rule),
  setCSSRuleText,
);
