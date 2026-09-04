import { cssRuleReadonlyDescriptor } from "./css-rule-property.js";
export const parentStyleSheet = cssRuleReadonlyDescriptor(
  "parentStyleSheet",
  record => record.parentStyleSheet,
).get;
