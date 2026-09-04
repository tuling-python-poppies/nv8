import { animationProperty } from "./animation-property.js";
import { animationOverallProgress } from "./animation-state.js";
export const overallProgress = animationProperty("overallProgress", true, record => animationOverallProgress(record.object)).get;
