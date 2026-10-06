// css 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { cssRuleAccessorDescriptor } from "./css-rule-property.js";
import {
  cssRuleText,
  setCSSRuleText,
} from "./css-rule-state.js";

export const cssText = cssRuleAccessorDescriptor(
  "cssText",
  (_record, rule) => cssRuleText(rule),
  setCSSRuleText,
);
