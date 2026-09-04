import { htmlCustomDescriptor } from "./html-element-property.js";
const descriptor = htmlCustomDescriptor("innerText", element => element.textContent ?? "", (element, value) => {
  element.textContent = `${value}`;
});
export const innerText = descriptor.get;
export const setInnerText = descriptor.set;
