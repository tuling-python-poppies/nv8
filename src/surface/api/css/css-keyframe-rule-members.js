// css 的成员表：名字就能描述实现，不再一个成员一个文件。

import { cssKeyframeRuleGetter } from "./css-keyframe-rule-property.js";

const CSS_KEYFRAME_RULE_GETTER_TABLE_ROWS = [
  ["keyText", "keyText", record => record.keyText],
  ["style", "style", record => record.style],
];

export const cssKeyframeRuleGetterTable = CSS_KEYFRAME_RULE_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, cssKeyframeRuleGetter(...args)],
);

