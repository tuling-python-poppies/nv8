// css 的成员表：名字就能描述实现，不再一个成员一个文件。

import { cssRuleAccessorDescriptor } from "./css-rule-property.js";
import {
  cssRuleText,
  setCSSRuleText,
} from "./css-rule-state.js";

const CSS_RULE_ACCESSOR_DESCRIPTOR_TABLE_ROWS = [
  ["cssText", "cssText", (_record, rule) => cssRuleText(rule), setCSSRuleText],
];

export const cssRuleAccessorDescriptorTable = CSS_RULE_ACCESSOR_DESCRIPTOR_TABLE_ROWS.map(
  ([name, ...args]) => [name, cssRuleAccessorDescriptor(...args)],
);
