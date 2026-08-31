import { cssStyleRuleAccessorDescriptor } from "./css-style-rule-property.js";
export const selectorText = cssStyleRuleAccessorDescriptor(
  "selectorText",
  record => record.selector,
  (record, value) => {
    const selector = `${value}`.trim();
    if (selector !== "") record.selector = selector;
  },
);
