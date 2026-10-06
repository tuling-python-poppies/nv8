import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  DOMMatrix,
  installDOMMatrixConstructor,
} from "../api/geometry/dom-matrix-constructor.js";
import { fromFloat32Array } from "../api/geometry/dom-matrix-from-float-32-array.js";
import { fromFloat64Array } from "../api/geometry/dom-matrix-from-float-64-array.js";
import { fromMatrix } from "../api/geometry/dom-matrix-from-matrix.js";
import { scale3dSelf } from "../api/geometry/dom-matrix-scale-3d-self.js";
import { scaleSelf } from "../api/geometry/dom-matrix-scale-self.js";
import { setMatrixValue } from "../api/geometry/dom-matrix-set-matrix-value.js";
import { skewXSelf } from "../api/geometry/dom-matrix-skew-x-self.js";
import { skewYSelf } from "../api/geometry/dom-matrix-skew-y-self.js";
import { mutableMatrixComponentTable } from "../api/geometry/mutable-matrix-component-members.js";
import { matrixSelfOperationTable } from "../api/geometry/matrix-self-operation-members.js";

export function installDOMMatrix() {
  installDOMMatrixConstructor();
  for (const [name, entry] of mutableMatrixComponentTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of matrixSelfOperationTable) method(name, entry);
  method("scale3dSelf", scale3dSelf);
  method("scaleSelf", scaleSelf);
  method("skewXSelf", skewXSelf);
  method("skewYSelf", skewYSelf);
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
