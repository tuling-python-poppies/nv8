import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const createEvent = {
  createEvent(interfaceName) {
    requireDocument(this);
    const normalized = `${interfaceName}`.toLowerCase();
    let result;
    if (
      normalized === "event"
      || normalized === "events"
      || normalized === "htmlevents"
    ) {
      result = new Event("");
    } else if (normalized === "customevent") {
      result = new CustomEvent("");
    } else {
      throw new DOMException(
        "The requested event interface is not supported.",
        "NotSupportedError",
      );
    }
    traceCall(
      "window.Document.prototype.createEvent",
      "Document",
      [interfaceName],
      result,
    );
    return result;
  },
}.createEvent;
registerNativeFunction(createEvent, "createEvent");

export function installDocumentCreateEvent() {
  definePrototypeMethod(Document.prototype, "createEvent", createEvent);
}
