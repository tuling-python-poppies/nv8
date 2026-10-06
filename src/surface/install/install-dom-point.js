import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  DOMPoint,
  installDOMPointConstructor,
} from "../api/geometry/dom-point-constructor.js";
import { w, setW } from "../api/geometry/dom-point-w-property.js";
import { x, setX } from "../api/geometry/dom-point-x-property.js";
import { y, setY } from "../api/geometry/dom-point-y-property.js";
import { z, setZ } from "../api/geometry/dom-point-z-property.js";

export function installDOMPoint() {
  installDOMPointConstructor();
  definePrototypeAccessor(DOMPoint.prototype, "x", x, setX);
  definePrototypeAccessor(DOMPoint.prototype, "y", y, setY);
  definePrototypeAccessor(DOMPoint.prototype, "z", z, setZ);
  definePrototypeAccessor(DOMPoint.prototype, "w", w, setW);
  defineConstructorBacklink(DOMPoint.prototype, DOMPoint);
  defineToStringTag(DOMPoint.prototype, "DOMPoint");
}
