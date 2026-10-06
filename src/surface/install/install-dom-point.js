import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  DOMPoint,
  installDOMPointConstructor,
} from "../api/geometry/dom-point-constructor.js";
import { mutablePointPropertyTable } from "../api/geometry/mutable-point-property-members.js";

export function installDOMPoint() {
  installDOMPointConstructor();
  for (const [name, entry] of mutablePointPropertyTable) definePrototypeAccessor(DOMPoint.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(DOMPoint.prototype, DOMPoint);
  defineToStringTag(DOMPoint.prototype, "DOMPoint");
}
