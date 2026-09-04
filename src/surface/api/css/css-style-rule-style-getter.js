import { cssStyleRuleReadonlyDescriptor } from "./css-style-rule-property.js";
export const style = cssStyleRuleReadonlyDescriptor("style", record => record.style).get;
