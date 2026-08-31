import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { align, setAlign } from "../api/dom/html-object-element-align-property.js";
import { archive, setArchive } from "../api/dom/html-object-element-archive-property.js";
import { border, setBorder } from "../api/dom/html-object-element-border-property.js";
import { checkValidity } from "../api/dom/html-object-element-check-validity.js";
import { codeBase, setCodeBase } from "../api/dom/html-object-element-code-base-property.js";
import { code, setCode } from "../api/dom/html-object-element-code-property.js";
import { codeType, setCodeType } from "../api/dom/html-object-element-code-type-property.js";
import { contentDocument } from "../api/dom/html-object-element-content-document-getter.js";
import { contentWindow } from "../api/dom/html-object-element-content-window-getter.js";
import {
  HTMLObjectElement,
  installHTMLObjectElementConstructor,
} from "../api/dom/html-object-element-constructor.js";
import { data, setData } from "../api/dom/html-object-element-data-property.js";
import { declare, setDeclare } from "../api/dom/html-object-element-declare-property.js";
import { form } from "../api/dom/html-object-element-form-getter.js";
import { getSVGDocument } from "../api/dom/html-object-element-get-svg-document.js";
import { height, setHeight } from "../api/dom/html-object-element-height-property.js";
import { hspace, setHspace } from "../api/dom/html-object-element-hspace-property.js";
import { name, setName } from "../api/dom/html-object-element-name-property.js";
import { reportValidity } from "../api/dom/html-object-element-report-validity.js";
import { setCustomValidity } from "../api/dom/html-object-element-set-custom-validity.js";
import { standby, setStandby } from "../api/dom/html-object-element-standby-property.js";
import { type, setType } from "../api/dom/html-object-element-type-property.js";
import { useMap, setUseMap } from "../api/dom/html-object-element-use-map-property.js";
import { validationMessage } from "../api/dom/html-object-element-validation-message-getter.js";
import { validity } from "../api/dom/html-object-element-validity-getter.js";
import { vspace, setVspace } from "../api/dom/html-object-element-vspace-property.js";
import { width, setWidth } from "../api/dom/html-object-element-width-property.js";
import { willValidate } from "../api/dom/html-object-element-will-validate-getter.js";

export function installHTMLObjectElement() {
  installHTMLObjectElementConstructor();
  accessor("data", data, setData);
  accessor("type", type, setType);
  accessor("name", name, setName);
  accessor("useMap", useMap, setUseMap);
  getter("form", form);
  accessor("width", width, setWidth);
  accessor("height", height, setHeight);
  getter("contentDocument", contentDocument);
  getter("contentWindow", contentWindow);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  accessor("align", align, setAlign);
  accessor("archive", archive, setArchive);
  accessor("code", code, setCode);
  accessor("declare", declare, setDeclare);
  accessor("hspace", hspace, setHspace);
  accessor("standby", standby, setStandby);
  accessor("vspace", vspace, setVspace);
  accessor("codeBase", codeBase, setCodeBase);
  accessor("codeType", codeType, setCodeType);
  accessor("border", border, setBorder);
  method("checkValidity", checkValidity);
  method("getSVGDocument", getSVGDocument);
  method("reportValidity", reportValidity);
  method("setCustomValidity", setCustomValidity);
  defineConstructorBacklink(HTMLObjectElement.prototype, HTMLObjectElement);
  defineToStringTag(HTMLObjectElement.prototype, "HTMLObjectElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLObjectElement.prototype, name, getter, setter);
}
function getter(name, callback) {
  definePrototypeGetter(HTMLObjectElement.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(HTMLObjectElement.prototype, name, callback);
}
