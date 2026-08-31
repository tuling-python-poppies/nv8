import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "hrefTranslate", "hreftranslate");
export const hrefTranslate = descriptor.get;
export const setHrefTranslate = descriptor.set;
