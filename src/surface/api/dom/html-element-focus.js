import { htmlElementMethod } from "./html-element-method.js";
import { htmlHandler } from "./html-element-state.js";
import { requireDocument } from "./document-record.js";
import { requireNode } from "./node-state.js";
export const focus = htmlElementMethod("focus", 0, element => {
  const ownerDocument = requireNode(element).ownerDocument;
  if (ownerDocument !== null) requireDocument(ownerDocument).activeElement = element;
  const event = new Event("focus");
  element.dispatchEvent(event);
  const handler = htmlHandler(element, "onfocus");
  if (handler !== null) Reflect.apply(handler, element, [event]);
});
