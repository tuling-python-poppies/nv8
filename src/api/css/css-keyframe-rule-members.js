import { cssKeyframeRuleGetter } from "./css-keyframe-rule-property.js";

export const keyText = cssKeyframeRuleGetter("keyText", record => record.keyText);
export const style = cssKeyframeRuleGetter("style", record => record.style);
