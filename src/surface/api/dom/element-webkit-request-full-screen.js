import { setDocumentInteractionElement } from "./document-record.js";
import { elementExtendedMethod } from "./element-extended-method.js";
import { requireNode } from "./node-state.js";
export const webkitRequestFullScreen = elementExtendedMethod("webkitRequestFullScreen", 0, element => {
  const document=requireNode(element).ownerDocument;
  if(document!==null)setDocumentInteractionElement(document,"fullscreenElement",element);
});
