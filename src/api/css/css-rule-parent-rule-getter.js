import { cssRuleReadonlyDescriptor } from "./css-rule-property.js";
export const parentRule = cssRuleReadonlyDescriptor("parentRule", record => record.parentRule).get;
