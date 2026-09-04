import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createCDATASection } from "./cdata-section-constructor.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const createCDATASectionCallback = {
  createCDATASection(data) {
    const state = requireDocument(this);
    if (state.contentType === "text/html") {
      throw new DOMException(
        "CDATA sections are not supported in HTML documents.",
        "NotSupportedError",
      );
    }
    const normalized = `${data}`;
    if (normalized.includes("]]>")) {
      throw new DOMException(
        "CDATA section data cannot contain ']]>'.",
        "InvalidCharacterError",
      );
    }
    const result = createCDATASection(normalized, this);
    traceCall(
      "window.Document.prototype.createCDATASection",
      "Document",
      [data],
      result,
    );
    return result;
  },
}.createCDATASection;
registerNativeFunction(createCDATASectionCallback, "createCDATASection");

export function installDocumentCreateCDATASection() {
  definePrototypeMethod(
    Document.prototype,
    "createCDATASection",
    createCDATASectionCallback,
  );
}
