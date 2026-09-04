import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLImageElement", "browsingTopics", "browsingtopics");
export const browsingTopics = descriptor.get;
export const setBrowsingTopics = descriptor.set;
