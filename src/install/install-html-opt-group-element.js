import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  disabled,
  setDisabled,
} from "../api/dom/html-opt-group-element-disabled-property.js";
import {
  HTMLOptGroupElement,
  installHTMLOptGroupElementConstructor,
} from "../api/dom/html-opt-group-element-constructor.js";
import {
  label,
  setLabel,
} from "../api/dom/html-opt-group-element-label-property.js";

export function installHTMLOptGroupElement() {
  installHTMLOptGroupElementConstructor();
  definePrototypeAccessor(
    HTMLOptGroupElement.prototype,
    "disabled",
    disabled,
    setDisabled,
  );
  definePrototypeAccessor(
    HTMLOptGroupElement.prototype,
    "label",
    label,
    setLabel,
  );
  defineConstructorBacklink(
    HTMLOptGroupElement.prototype,
    HTMLOptGroupElement,
  );
  defineToStringTag(HTMLOptGroupElement.prototype, "HTMLOptGroupElement");
}
