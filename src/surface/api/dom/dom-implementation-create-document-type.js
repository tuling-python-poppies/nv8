import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  requireDOMImplementation,
} from "./dom-implementation-constructor.js";
import { createDocumentType } from "./document-type-state.js";
import { validateName } from "./element-state.js";

export const createDocumentTypeCallback = {
  createDocumentType(qualifiedName, publicId, systemId) {
    requireDOMImplementation(this);
    const name = `${qualifiedName}`;
    validateName(name);
    const result = createDocumentType(
      name,
      null,
      `${publicId}`,
      `${systemId}`,
    );
    traceCall(
      "window.DOMImplementation.prototype.createDocumentType",
      "DOMImplementation",
      [qualifiedName, publicId, systemId],
      result,
    );
    return result;
  },
}.createDocumentType;
registerNativeFunction(
  createDocumentTypeCallback,
  "createDocumentType",
);
