import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { a, setA } from "../api/geometry/dom-matrix-a-property.js";
import { b, setB } from "../api/geometry/dom-matrix-b-property.js";
import { c, setC } from "../api/geometry/dom-matrix-c-property.js";
import {
  DOMMatrix,
  installDOMMatrixConstructor,
} from "../api/geometry/dom-matrix-constructor.js";
import { d, setD } from "../api/geometry/dom-matrix-d-property.js";
import { e, setE } from "../api/geometry/dom-matrix-e-property.js";
import { f, setF } from "../api/geometry/dom-matrix-f-property.js";
import { fromFloat32Array } from "../api/geometry/dom-matrix-from-float-32-array.js";
import { fromFloat64Array } from "../api/geometry/dom-matrix-from-float-64-array.js";
import { fromMatrix } from "../api/geometry/dom-matrix-from-matrix.js";
import { invertSelf } from "../api/geometry/dom-matrix-invert-self.js";
import { m11, setM11 } from "../api/geometry/dom-matrix-m11-property.js";
import { m12, setM12 } from "../api/geometry/dom-matrix-m12-property.js";
import { m13, setM13 } from "../api/geometry/dom-matrix-m13-property.js";
import { m14, setM14 } from "../api/geometry/dom-matrix-m14-property.js";
import { m21, setM21 } from "../api/geometry/dom-matrix-m21-property.js";
import { m22, setM22 } from "../api/geometry/dom-matrix-m22-property.js";
import { m23, setM23 } from "../api/geometry/dom-matrix-m23-property.js";
import { m24, setM24 } from "../api/geometry/dom-matrix-m24-property.js";
import { m31, setM31 } from "../api/geometry/dom-matrix-m31-property.js";
import { m32, setM32 } from "../api/geometry/dom-matrix-m32-property.js";
import { m33, setM33 } from "../api/geometry/dom-matrix-m33-property.js";
import { m34, setM34 } from "../api/geometry/dom-matrix-m34-property.js";
import { m41, setM41 } from "../api/geometry/dom-matrix-m41-property.js";
import { m42, setM42 } from "../api/geometry/dom-matrix-m42-property.js";
import { m43, setM43 } from "../api/geometry/dom-matrix-m43-property.js";
import { m44, setM44 } from "../api/geometry/dom-matrix-m44-property.js";
import { multiplySelf } from "../api/geometry/dom-matrix-multiply-self.js";
import { preMultiplySelf } from "../api/geometry/dom-matrix-pre-multiply-self.js";
import { rotateAxisAngleSelf } from "../api/geometry/dom-matrix-rotate-axis-angle-self.js";
import { rotateFromVectorSelf } from "../api/geometry/dom-matrix-rotate-from-vector-self.js";
import { rotateSelf } from "../api/geometry/dom-matrix-rotate-self.js";
import { scale3dSelf } from "../api/geometry/dom-matrix-scale-3d-self.js";
import { scaleSelf } from "../api/geometry/dom-matrix-scale-self.js";
import { setMatrixValue } from "../api/geometry/dom-matrix-set-matrix-value.js";
import { skewXSelf } from "../api/geometry/dom-matrix-skew-x-self.js";
import { skewYSelf } from "../api/geometry/dom-matrix-skew-y-self.js";
import { translateSelf } from "../api/geometry/dom-matrix-translate-self.js";

export function installDOMMatrix() {
  installDOMMatrixConstructor();
  accessor("a", a, setA); accessor("b", b, setB); accessor("c", c, setC);
  accessor("d", d, setD); accessor("e", e, setE); accessor("f", f, setF);
  accessor("m11", m11, setM11); accessor("m12", m12, setM12);
  accessor("m13", m13, setM13); accessor("m14", m14, setM14);
  accessor("m21", m21, setM21); accessor("m22", m22, setM22);
  accessor("m23", m23, setM23); accessor("m24", m24, setM24);
  accessor("m31", m31, setM31); accessor("m32", m32, setM32);
  accessor("m33", m33, setM33); accessor("m34", m34, setM34);
  accessor("m41", m41, setM41); accessor("m42", m42, setM42);
  accessor("m43", m43, setM43); accessor("m44", m44, setM44);
  method("invertSelf", invertSelf);
  method("multiplySelf", multiplySelf);
  method("preMultiplySelf", preMultiplySelf);
  method("rotateAxisAngleSelf", rotateAxisAngleSelf);
  method("rotateFromVectorSelf", rotateFromVectorSelf);
  method("rotateSelf", rotateSelf);
  method("scale3dSelf", scale3dSelf);
  method("scaleSelf", scaleSelf);
  method("skewXSelf", skewXSelf);
  method("skewYSelf", skewYSelf);
  method("translateSelf", translateSelf);
  defineConstructorBacklink(DOMMatrix.prototype, DOMMatrix);
  method("setMatrixValue", setMatrixValue);
  defineToStringTag(DOMMatrix.prototype, "DOMMatrix");
  definePrototypeMethod(DOMMatrix, "fromFloat32Array", fromFloat32Array);
  definePrototypeMethod(DOMMatrix, "fromFloat64Array", fromFloat64Array);
  definePrototypeMethod(DOMMatrix, "fromMatrix", fromMatrix);
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(DOMMatrix.prototype, name, getter, setter);
}
function method(name, callback) {
  definePrototypeMethod(DOMMatrix.prototype, name, callback);
}
