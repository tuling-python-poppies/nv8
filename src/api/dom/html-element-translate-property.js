import { getAttributeValue, removeAttributeValue, setAttributeValue } from "./element-state.js";
import { htmlCustomDescriptor } from "./html-element-property.js";
const descriptor = htmlCustomDescriptor("translate", element => {
  const value = getAttributeValue(element, "translate");
  return value === null || value.toLowerCase() !== "no";
}, (element, value) => {
  if (Boolean(value)) removeAttributeValue(element, "translate");
  else setAttributeValue(element, "translate", "no");
});
export const translate = descriptor.get;
export const setTranslate = descriptor.set;
