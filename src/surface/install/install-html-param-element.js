import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLParamElement,
  installHTMLParamElementConstructor,
} from "../api/dom/html-param-element-constructor.js";
import {
  name,
  setName,
} from "../api/dom/html-param-element-name-property.js";
import {
  setType,
  type,
} from "../api/dom/html-param-element-type-property.js";
import {
  setValueType,
  valueType,
} from "../api/dom/html-param-element-value-type-property.js";
import {
  setValue,
  value,
} from "../api/dom/html-param-element-value-property.js";

export function installHTMLParamElement() {
  installHTMLParamElementConstructor();
  definePrototypeAccessor(HTMLParamElement.prototype, "name", name, setName);
  definePrototypeAccessor(HTMLParamElement.prototype, "value", value, setValue);
  definePrototypeAccessor(HTMLParamElement.prototype, "type", type, setType);
  definePrototypeAccessor(
    HTMLParamElement.prototype,
    "valueType",
    valueType,
    setValueType,
  );
  defineConstructorBacklink(HTMLParamElement.prototype, HTMLParamElement);
  defineToStringTag(HTMLParamElement.prototype, "HTMLParamElement");
}
