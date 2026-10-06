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
import {
  w,
  x,
  y,
  z,
} from "../api/geometry/point-getter-members.js";

export function installDOMPointReadOnly() {
  installDOMPointReadOnlyConstructor();
  definePrototypeGetter(DOMPointReadOnly.prototype, "x", x);
  definePrototypeGetter(DOMPointReadOnly.prototype, "y", y);
  definePrototypeGetter(DOMPointReadOnly.prototype, "z", z);
  definePrototypeGetter(DOMPointReadOnly.prototype, "w", w);
  definePrototypeMethod(DOMPointReadOnly.prototype, "matrixTransform", matrixTransform);
  definePrototypeMethod(DOMPointReadOnly.prototype, "toJSON", toJSON);
  defineConstructorBacklink(DOMPointReadOnly.prototype, DOMPointReadOnly);
  defineToStringTag(DOMPointReadOnly.prototype, "DOMPointReadOnly");
}
