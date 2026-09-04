import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  content,
} from "../api/dom/html-template-element-content-getter.js";
import {
  HTMLTemplateElement,
  installHTMLTemplateElementConstructor,
} from "../api/dom/html-template-element-constructor.js";
import {
  htmlFor,
  setHtmlFor,
} from "../api/dom/html-template-element-html-for-property.js";
import {
  setShadowRootClonable,
  shadowRootClonable,
} from "../api/dom/html-template-element-shadow-root-clonable-property.js";
import {
  setShadowRootCustomElementRegistry,
  shadowRootCustomElementRegistry,
} from "../api/dom/html-template-element-shadow-root-custom-element-registry-property.js";
import {
  setShadowRootDelegatesFocus,
  shadowRootDelegatesFocus,
} from "../api/dom/html-template-element-shadow-root-delegates-focus-property.js";
import {
  setShadowRootMode,
  shadowRootMode,
} from "../api/dom/html-template-element-shadow-root-mode-property.js";
import {
  setShadowRootSerializable,
  shadowRootSerializable,
} from "../api/dom/html-template-element-shadow-root-serializable-property.js";

export function installHTMLTemplateElement() {
  installHTMLTemplateElementConstructor();
  definePrototypeGetter(HTMLTemplateElement.prototype, "content", content);
  accessor("shadowRootMode", shadowRootMode, setShadowRootMode);
  accessor(
    "shadowRootDelegatesFocus",
    shadowRootDelegatesFocus,
    setShadowRootDelegatesFocus,
  );
  accessor("shadowRootClonable", shadowRootClonable, setShadowRootClonable);
  accessor(
    "shadowRootSerializable",
    shadowRootSerializable,
    setShadowRootSerializable,
  );
  accessor(
    "shadowRootCustomElementRegistry",
    shadowRootCustomElementRegistry,
    setShadowRootCustomElementRegistry,
  );
  accessor("htmlFor", htmlFor, setHtmlFor);
  defineConstructorBacklink(
    HTMLTemplateElement.prototype,
    HTMLTemplateElement,
  );
  defineToStringTag(HTMLTemplateElement.prototype, "HTMLTemplateElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTemplateElement.prototype, name, getter, setter);
}
