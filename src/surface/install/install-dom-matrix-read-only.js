import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  DOMMatrixReadOnly,
  installDOMMatrixReadOnlyConstructor,
} from "../api/geometry/dom-matrix-read-only-constructor.js";
import { rotate } from "../api/geometry/dom-matrix-read-only-rotate.js";
import { scale3d } from "../api/geometry/dom-matrix-read-only-scale-3d.js";
import { scale } from "../api/geometry/dom-matrix-read-only-scale.js";
import { skewX } from "../api/geometry/dom-matrix-read-only-skew-x.js";
import { skewY } from "../api/geometry/dom-matrix-read-only-skew-y.js";
import { transformPoint } from "../api/geometry/dom-matrix-read-only-transform-point.js";
import { matrixBooleanGetterTable } from "../api/geometry/matrix-boolean-getter-members.js";
import { matrixComponentGetterTable } from "../api/geometry/matrix-component-getter-members.js";
import { readonlyMatrixOperationTable } from "../api/geometry/readonly-matrix-operation-members.js";
import { readonlyMatrixValueOperationTable } from "../api/geometry/readonly-matrix-value-operation-members.js";

export function installDOMMatrixReadOnly() {
  installDOMMatrixReadOnlyConstructor();
  for (const [name, entry] of matrixComponentGetterTable) getter(name, entry); getter("b", b); getter("c", c); getter("d", d);
  for (const [name, entry] of matrixComponentGetterTable) getter(name, entry); getter("f", f);
  for (const [name, entry] of matrixComponentGetterTable) getter(name, entry); getter("m12", m12); getter("m13", m13); getter("m14", m14);
  for (const [name, entry] of matrixComponentGetterTable) getter(name, entry); getter("m22", m22); getter("m23", m23); getter("m24", m24);
  for (const [name, entry] of matrixComponentGetterTable) getter(name, entry); getter("m32", m32); getter("m33", m33); getter("m34", m34);
  for (const [name, entry] of matrixComponentGetterTable) getter(name, entry); getter("m42", m42); getter("m43", m43); getter("m44", m44);
  for (const [name, entry] of matrixBooleanGetterTable) getter(name, entry);
  for (const [name, entry] of readonlyMatrixOperationTable) method(name, entry);
  method("rotate", rotate);
  for (const [name, entry] of readonlyMatrixOperationTable) method(name, entry);
  method("scale", scale);
  method("scale3d", scale3d);
  for (const [name, entry] of readonlyMatrixOperationTable) method(name, entry);
  method("skewX", skewX);
  method("skewY", skewY);
  for (const [name, entry] of readonlyMatrixValueOperationTable) method(name, entry);
  method("transformPoint", transformPoint);
  for (const [name, entry] of readonlyMatrixOperationTable) method(name, entry);
  defineConstructorBacklink(DOMMatrixReadOnly.prototype, DOMMatrixReadOnly);
  for (const [name, entry] of readonlyMatrixValueOperationTable) method(name, entry);
  defineToStringTag(DOMMatrixReadOnly.prototype, "DOMMatrixReadOnly");
}

function getter(name, callback) {
  definePrototypeGetter(DOMMatrixReadOnly.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(DOMMatrixReadOnly.prototype, name, callback);
}
