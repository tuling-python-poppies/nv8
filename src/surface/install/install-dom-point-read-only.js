import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  DOMPointReadOnly,
  installDOMPointReadOnlyConstructor,
} from "../api/geometry/dom-point-read-only-constructor.js";
import { matrixTransform } from "../api/geometry/dom-point-read-only-matrix-transform.js";
import { toJSON } from "../api/geometry/dom-point-read-only-to-json.js";
import { pointGetterTable } from "../api/geometry/point-getter-members.js";

export function installDOMPointReadOnly() {
  installDOMPointReadOnlyConstructor();
  for (const [name, entry] of pointGetterTable) definePrototypeGetter(DOMPointReadOnly.prototype, name, entry);
  definePrototypeMethod(DOMPointReadOnly.prototype, "matrixTransform", matrixTransform);
  definePrototypeMethod(DOMPointReadOnly.prototype, "toJSON", toJSON);
  defineConstructorBacklink(DOMPointReadOnly.prototype, DOMPointReadOnly);
  defineToStringTag(DOMPointReadOnly.prototype, "DOMPointReadOnly");
}
