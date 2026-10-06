import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection(
  "HTMLFormElement",
  "acceptCharset",
  "accept-charset",
);
export const acceptCharset = descriptor.get;
export const setAcceptCharset = descriptor.set;
