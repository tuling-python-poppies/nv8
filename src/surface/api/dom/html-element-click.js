import { htmlElementMethod } from "./html-element-method.js";
import { htmlHandler } from "./html-element-state.js";
export const click = htmlElementMethod("click", 0, element => {
  const event = new Event("click", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  const handler = htmlHandler(element, "onclick");
  if (handler !== null) Reflect.apply(handler, element, [event]);
});
