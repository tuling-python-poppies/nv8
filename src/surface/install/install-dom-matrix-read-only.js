import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { a } from "../api/geometry/dom-matrix-read-only-a-getter.js";
import { b } from "../api/geometry/dom-matrix-read-only-b-getter.js";
import { c } from "../api/geometry/dom-matrix-read-only-c-getter.js";
import {
  DOMMatrixReadOnly,
  installDOMMatrixReadOnlyConstructor,
} from "../api/geometry/dom-matrix-read-only-constructor.js";
import { d } from "../api/geometry/dom-matrix-read-only-d-getter.js";
import { e } from "../api/geometry/dom-matrix-read-only-e-getter.js";
import { f } from "../api/geometry/dom-matrix-read-only-f-getter.js";
import { flipX } from "../api/geometry/dom-matrix-read-only-flip-x.js";
import { flipY } from "../api/geometry/dom-matrix-read-only-flip-y.js";
import { inverse } from "../api/geometry/dom-matrix-read-only-inverse.js";
import { is2D } from "../api/geometry/dom-matrix-read-only-is-2d-getter.js";
import { isIdentity } from "../api/geometry/dom-matrix-read-only-is-identity-getter.js";
import { m11 } from "../api/geometry/dom-matrix-read-only-m11-getter.js";
import { m12 } from "../api/geometry/dom-matrix-read-only-m12-getter.js";
import { m13 } from "../api/geometry/dom-matrix-read-only-m13-getter.js";
import { m14 } from "../api/geometry/dom-matrix-read-only-m14-getter.js";
import { m21 } from "../api/geometry/dom-matrix-read-only-m21-getter.js";
import { m22 } from "../api/geometry/dom-matrix-read-only-m22-getter.js";
import { m23 } from "../api/geometry/dom-matrix-read-only-m23-getter.js";
import { m24 } from "../api/geometry/dom-matrix-read-only-m24-getter.js";
import { m31 } from "../api/geometry/dom-matrix-read-only-m31-getter.js";
import { m32 } from "../api/geometry/dom-matrix-read-only-m32-getter.js";
import { m33 } from "../api/geometry/dom-matrix-read-only-m33-getter.js";
import { m34 } from "../api/geometry/dom-matrix-read-only-m34-getter.js";
import { m41 } from "../api/geometry/dom-matrix-read-only-m41-getter.js";
import { m42 } from "../api/geometry/dom-matrix-read-only-m42-getter.js";
import { m43 } from "../api/geometry/dom-matrix-read-only-m43-getter.js";
import { m44 } from "../api/geometry/dom-matrix-read-only-m44-getter.js";
import { multiply } from "../api/geometry/dom-matrix-read-only-multiply.js";
import { rotateAxisAngle } from "../api/geometry/dom-matrix-read-only-rotate-axis-angle.js";
import { rotateFromVector } from "../api/geometry/dom-matrix-read-only-rotate-from-vector.js";
import { rotate } from "../api/geometry/dom-matrix-read-only-rotate.js";
import { scale3d } from "../api/geometry/dom-matrix-read-only-scale-3d.js";
import { scaleNonUniform } from "../api/geometry/dom-matrix-read-only-scale-non-uniform.js";
import { scale } from "../api/geometry/dom-matrix-read-only-scale.js";
import { skewX } from "../api/geometry/dom-matrix-read-only-skew-x.js";
import { skewY } from "../api/geometry/dom-matrix-read-only-skew-y.js";
import { toFloat32Array } from "../api/geometry/dom-matrix-read-only-to-float-32-array.js";
import { toFloat64Array } from "../api/geometry/dom-matrix-read-only-to-float-64-array.js";
import { toJSON } from "../api/geometry/dom-matrix-read-only-to-json.js";
import { toString } from "../api/geometry/dom-matrix-read-only-to-string.js";
import { transformPoint } from "../api/geometry/dom-matrix-read-only-transform-point.js";
import { translate } from "../api/geometry/dom-matrix-read-only-translate.js";

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
