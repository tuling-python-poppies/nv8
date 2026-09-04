import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  controlsAreValid,
  requireForm,
} from "./html-form-element-state.js";
import { formOwnerOf } from "./form-association.js";

export const requestSubmit = {
  requestSubmit() {
    const state = requireForm(this);
    const submitter = arguments[0];
    if (submitter !== undefined) {
      const type = submitter?.getAttribute?.("type")?.toLowerCase()
        ?? (submitter?.localName === "button" ? "submit" : "text");
      const isSubmitButton = (
        submitter?.localName === "button"
        && (type === "submit" || type === "")
      ) || (
        submitter?.localName === "input"
        && (type === "submit" || type === "image")
      );
      if (!isSubmitButton) {
        throw new TypeError("The specified element is not a submit button");
      }
      if (formOwnerOf(submitter) !== this) {
        throw new DOMException(
          "The specified element is not owned by this form",
          "NotFoundError",
        );
      }
    }
    if (this.noValidate || submitter?.formNoValidate || controlsAreValid(this)) {
      const event = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      if (this.dispatchEvent(event)) {
        state.submitCount += 1;
      }
    }
    traceCall(
      "window.HTMLFormElement.prototype.requestSubmit",
      "HTMLFormElement",
      [...arguments],
      undefined,
    );
    return undefined;
  },
}.requestSubmit;
registerNativeFunction(requestSubmit, "requestSubmit");
