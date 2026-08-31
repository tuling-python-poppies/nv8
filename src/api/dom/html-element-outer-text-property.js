import { htmlCustomDescriptor } from "./html-element-property.js";
const descriptor = htmlCustomDescriptor("outerText", element => element.textContent ?? "", (element, value) => {
  if (element.parentNode === null) element.textContent = `${value}`;
  else element.replaceWith(`${value}`);
});
export const outerText = descriptor.get;
export const setOuterText = descriptor.set;
