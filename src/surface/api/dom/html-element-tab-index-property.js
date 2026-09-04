import { getAttributeValue, setAttributeValue } from "./element-state.js";
import { htmlCustomDescriptor } from "./html-element-property.js";
const descriptor = htmlCustomDescriptor("tabIndex", element => {
  const value = getAttributeValue(element, "tabindex");
  return value === null ? -1 : Number.parseInt(value, 10) || 0;
}, (element, value) => setAttributeValue(element, "tabindex", `${Math.trunc(Number(value) || 0)}`));
export const tabIndex = descriptor.get;
export const setTabIndex = descriptor.set;
