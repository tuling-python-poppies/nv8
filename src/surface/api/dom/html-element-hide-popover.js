import { htmlElementMethod } from "./html-element-method.js";
import { setHTMLPopoverVisible } from "./html-element-state.js";
export const hidePopover = htmlElementMethod("hidePopover", 0, element => setHTMLPopoverVisible(element, false));
