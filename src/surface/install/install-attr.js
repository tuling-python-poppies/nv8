import {
  finishAttrConstructor,
  installAttrConstructor,
} from "../api/dom/attr-constructor.js";
import {
  installAttrLocalName,
} from "../api/dom/attr-local-name-getter.js";
import { installAttrName } from "../api/dom/attr-name-getter.js";
import {
  installAttrNamespaceURI,
} from "../api/dom/attr-namespace-uri-getter.js";
import {
  installAttrOwnerElement,
} from "../api/dom/attr-owner-element-getter.js";
import { installAttrPrefix } from "../api/dom/attr-prefix-getter.js";
import { installAttrSpecified } from "../api/dom/attr-specified-getter.js";
import { installAttrValue } from "../api/dom/attr-value-property.js";

export function installAttr() {
  installAttrConstructor();
  installAttrNamespaceURI();
  installAttrPrefix();
  installAttrLocalName();
  installAttrName();
  installAttrValue();
  installAttrOwnerElement();
  installAttrSpecified();
  finishAttrConstructor();
}
