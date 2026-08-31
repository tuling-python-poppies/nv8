import { htmlElementMethod } from "./html-element-method.js";
import { setHTMLPopoverVisible } from "./html-element-state.js";
export const showPopover = htmlElementMethod("showPopover", 0, element => setHTMLPopoverVisible(element, true));
