import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import {
  createDOMImplementation,
} from "./dom-implementation-constructor.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";

export const implementation = Object.getOwnPropertyDescriptor({
  get implementation() {
    const state = requireDocument(this);
    if (state.implementation === undefined) {
      state.implementation = createDOMImplementation(this);
    }
    traceGetter(
      "window.Document.prototype.implementation",
      "Document",
      state.implementation,
    );
    return state.implementation;
  },
}, "implementation").get;
registerNativeGetter(implementation, "implementation");

export function installDocumentImplementation() {
  definePrototypeGetter(
    Document.prototype,
    "implementation",
    implementation,
  );
}
