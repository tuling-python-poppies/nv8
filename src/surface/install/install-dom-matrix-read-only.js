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
import {
  readonlyMatrixOperationPart1Table,
  readonlyMatrixOperationPart2Table,
  readonlyMatrixOperationPart3Table,
  readonlyMatrixOperationPart4Table,
} from "../api/geometry/readonly-matrix-operation-members.js";
import {
  readonlyMatrixValueOperationPart1Table,
  readonlyMatrixValueOperationPart2Table,
} from "../api/geometry/readonly-matrix-value-operation-members.js";

export function installDOMMatrixReadOnly() {
  installDOMMatrixReadOnlyConstructor();
  for (const [name, entry] of matrixComponentGetterTable) getter(name, entry);
  for (const [name, entry] of matrixBooleanGetterTable) getter(name, entry);
  for (const [name, entry] of readonlyMatrixOperationPart1Table) method(name, entry);
  method("rotate", rotate);
  for (const [name, entry] of readonlyMatrixOperationPart2Table) method(name, entry);
  method("scale", scale);
  method("scale3d", scale3d);
  for (const [name, entry] of readonlyMatrixOperationPart3Table) method(name, entry);
  method("skewX", skewX);
  method("skewY", skewY);
  for (const [name, entry] of readonlyMatrixValueOperationPart1Table) method(name, entry);
  method("transformPoint", transformPoint);
  for (const [name, entry] of readonlyMatrixOperationPart4Table) method(name, entry);
  defineConstructorBacklink(DOMMatrixReadOnly.prototype, DOMMatrixReadOnly);
  for (const [name, entry] of readonlyMatrixValueOperationPart2Table) method(name, entry);
  defineToStringTag(DOMMatrixReadOnly.prototype, "DOMMatrixReadOnly");
}

function getter(name, callback) {
  definePrototypeGetter(DOMMatrixReadOnly.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(DOMMatrixReadOnly.prototype, name, callback);
}
