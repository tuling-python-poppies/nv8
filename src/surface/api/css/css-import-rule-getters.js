// css 的成员表：名字就能描述实现，不再一个成员一个文件。

import { cssImportRuleGetter } from "./css-import-rule-property.js";

const CSS_IMPORT_RULE_GETTER_TABLE_ROWS = [
  ["href", "href", record => record.href],
  ["media", "media", record => record.media],
  ["styleSheet", "styleSheet", record => record.styleSheet],
  ["layerName", "layerName", record => record.layerName],
  ["supportsText", "supportsText", record => record.supportsText],
];

export const cssImportRuleGetterTable = CSS_IMPORT_RULE_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, cssImportRuleGetter(...args)],
);
