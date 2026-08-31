import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { close } from "../api/dom/html-dialog-element-close.js";
import { closedBy, setClosedBy } from "../api/dom/html-dialog-element-closed-by-property.js";
import {
  HTMLDialogElement,
  installHTMLDialogElementConstructor,
} from "../api/dom/html-dialog-element-constructor.js";
import { open, setOpen } from "../api/dom/html-dialog-element-open-property.js";
import { requestClose } from "../api/dom/html-dialog-element-request-close.js";
import { returnValue, setReturnValue } from "../api/dom/html-dialog-element-return-value-property.js";
import { show } from "../api/dom/html-dialog-element-show.js";
import { showModal } from "../api/dom/html-dialog-element-show-modal.js";

export function installHTMLDialogElement() {
  installHTMLDialogElementConstructor();
  accessor("open", open, setOpen);
  accessor("returnValue", returnValue, setReturnValue);
  accessor("closedBy", closedBy, setClosedBy);
  method("close", close);
  method("requestClose", requestClose);
  method("show", show);
  method("showModal", showModal);
  defineConstructorBacklink(HTMLDialogElement.prototype, HTMLDialogElement);
  defineToStringTag(HTMLDialogElement.prototype, "HTMLDialogElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLDialogElement.prototype, name, getter, setter);
}

function method(name, callback) {
  definePrototypeMethod(HTMLDialogElement.prototype, name, callback);
}
