import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLScriptElement", "event", "event");
export const event = descriptor.get;
export const setEvent = descriptor.set;
