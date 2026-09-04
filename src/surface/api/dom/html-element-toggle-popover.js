import { htmlElementMethod } from "./html-element-method.js";
import { htmlPopoverVisible, setHTMLPopoverVisible } from "./html-element-state.js";
export const togglePopover = htmlElementMethod("togglePopover", 0, (element, args) => {
  const visible = args[0] === undefined ? !htmlPopoverVisible(element) : Boolean(args[0]);
  setHTMLPopoverVisible(element, visible);
  return visible;
});
