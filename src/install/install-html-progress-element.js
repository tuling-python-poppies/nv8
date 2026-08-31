import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  HTMLProgressElement,
  installHTMLProgressElementConstructor,
} from "../api/dom/html-progress-element-constructor.js";
import {
  labels,
} from "../api/dom/html-progress-element-labels-getter.js";
import {
  max,
  setMax,
} from "../api/dom/html-progress-element-max-property.js";
import {
  position,
} from "../api/dom/html-progress-element-position-getter.js";
import {
  setValue,
  value,
} from "../api/dom/html-progress-element-value-property.js";

export function installHTMLProgressElement() {
  installHTMLProgressElementConstructor();
  definePrototypeAccessor(
    HTMLProgressElement.prototype,
    "value",
    value,
    setValue,
  );
  definePrototypeAccessor(
    HTMLProgressElement.prototype,
    "max",
    max,
    setMax,
  );
  definePrototypeGetter(
    HTMLProgressElement.prototype,
    "position",
    position,
  );
  definePrototypeGetter(HTMLProgressElement.prototype, "labels", labels);
  defineConstructorBacklink(HTMLProgressElement.prototype, HTMLProgressElement);
  defineToStringTag(HTMLProgressElement.prototype, "HTMLProgressElement");
}
