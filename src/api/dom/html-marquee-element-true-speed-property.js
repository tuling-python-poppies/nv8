import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLMarqueeElement", "trueSpeed", "truespeed");
export const trueSpeed = descriptor.get;
export const setTrueSpeed = descriptor.set;
