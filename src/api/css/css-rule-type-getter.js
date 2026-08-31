import { cssRuleReadonlyDescriptor } from "./css-rule-property.js";
export const type = cssRuleReadonlyDescriptor("type", record => record.type).get;
