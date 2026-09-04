import { htmlElementMethod } from "./html-element-method.js";
import { htmlHandler } from "./html-element-state.js";
import { documentBody, requireDocument } from "./document-record.js";
import { requireNode } from "./node-state.js";
export const blur = htmlElementMethod("blur", 0, element => {
  const ownerDocument = requireNode(element).ownerDocument;
  if (ownerDocument !== null && requireDocument(ownerDocument).activeElement === element) {
    requireDocument(ownerDocument).activeElement = documentBody(ownerDocument);
  }
  const event = new Event("blur");
  element.dispatchEvent(event);
  const handler = htmlHandler(element, "onblur");
  if (handler !== null) Reflect.apply(handler, element, [event]);
});
