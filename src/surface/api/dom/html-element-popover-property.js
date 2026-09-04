import { getAttributeValue, removeAttributeValue, setAttributeValue } from "./element-state.js";
import { htmlCustomDescriptor } from "./html-element-property.js";
const descriptor = htmlCustomDescriptor("popover", element => getAttributeValue(element, "popover"), (element, value) => {
  if (value === null) removeAttributeValue(element, "popover");
  else setAttributeValue(element, "popover", `${value}`);
});
export const popover = descriptor.get;
export const setPopover = descriptor.set;
