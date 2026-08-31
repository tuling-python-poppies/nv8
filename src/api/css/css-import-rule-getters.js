import { cssImportRuleGetter } from "./css-import-rule-property.js";

export const href = cssImportRuleGetter("href", record => record.href);
export const media = cssImportRuleGetter("media", record => record.media);
export const styleSheet = cssImportRuleGetter("styleSheet", record => record.styleSheet);
export const layerName = cssImportRuleGetter("layerName", record => record.layerName);
export const supportsText = cssImportRuleGetter(
  "supportsText",
  record => record.supportsText,
);
