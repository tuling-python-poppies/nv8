import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  a,
  b,
  c,
  d,
  e,
  f,
  m11,
  m12,
  m13,
  m14,
  m21,
  m22,
  m23,
  m24,
  m31,
  m32,
  m33,
  m34,
  m41,
  m42,
  m43,
  m44,
} from "../api/geometry/matrix-component-getter-members.js";
import {
  DOMMatrixReadOnly,
  installDOMMatrixReadOnlyConstructor,
} from "../api/geometry/dom-matrix-read-only-constructor.js";
import {
  flipX,
  flipY,
  inverse,
  multiply,
  rotateAxisAngle,
  rotateFromVector,
  scaleNonUniform,
  translate,
} from "../api/geometry/readonly-matrix-operation-members.js";
import {
  is2D,
  isIdentity,
} from "../api/geometry/matrix-boolean-getter-members.js";
import { rotate } from "../api/geometry/dom-matrix-read-only-rotate.js";
import { scale3d } from "../api/geometry/dom-matrix-read-only-scale-3d.js";
import { scale } from "../api/geometry/dom-matrix-read-only-scale.js";
import { skewX } from "../api/geometry/dom-matrix-read-only-skew-x.js";
import { skewY } from "../api/geometry/dom-matrix-read-only-skew-y.js";
import {
  toFloat32Array,
  toFloat64Array,
  toJSON,
  toString,
} from "../api/geometry/readonly-matrix-value-operation-members.js";
import { transformPoint } from "../api/geometry/dom-matrix-read-only-transform-point.js";

export function installDOMMatrixReadOnly() {
  installDOMMatrixReadOnlyConstructor();
  getter("a", a); getter("b", b); getter("c", c); getter("d", d);
  getter("e", e); getter("f", f);
  getter("m11", m11); getter("m12", m12); getter("m13", m13); getter("m14", m14);
  getter("m21", m21); getter("m22", m22); getter("m23", m23); getter("m24", m24);
  getter("m31", m31); getter("m32", m32); getter("m33", m33); getter("m34", m34);
  getter("m41", m41); getter("m42", m42); getter("m43", m43); getter("m44", m44);
  getter("is2D", is2D);
  getter("isIdentity", isIdentity);
  method("flipX", flipX);
  method("flipY", flipY);
  method("inverse", inverse);
  method("multiply", multiply);
  method("rotate", rotate);
  method("rotateAxisAngle", rotateAxisAngle);
  method("rotateFromVector", rotateFromVector);
  method("scale", scale);
  method("scale3d", scale3d);
  method("scaleNonUniform", scaleNonUniform);
  method("skewX", skewX);
  method("skewY", skewY);
  method("toFloat32Array", toFloat32Array);
  method("toFloat64Array", toFloat64Array);
  method("toJSON", toJSON);
  method("transformPoint", transformPoint);
  method("translate", translate);
  defineConstructorBacklink(DOMMatrixReadOnly.prototype, DOMMatrixReadOnly);
  method("toString", toString);
  defineToStringTag(DOMMatrixReadOnly.prototype, "DOMMatrixReadOnly");
}

function getter(name, callback) {
  definePrototypeGetter(DOMMatrixReadOnly.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(DOMMatrixReadOnly.prototype, name, callback);
}
