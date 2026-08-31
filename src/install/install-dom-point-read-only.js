import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  DOMPointReadOnly,
  installDOMPointReadOnlyConstructor,
} from "../api/geometry/dom-point-read-only-constructor.js";
import { matrixTransform } from "../api/geometry/dom-point-read-only-matrix-transform.js";
import { toJSON } from "../api/geometry/dom-point-read-only-to-json.js";
import { w } from "../api/geometry/dom-point-read-only-w-getter.js";
import { x } from "../api/geometry/dom-point-read-only-x-getter.js";
import { y } from "../api/geometry/dom-point-read-only-y-getter.js";
import { z } from "../api/geometry/dom-point-read-only-z-getter.js";

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
