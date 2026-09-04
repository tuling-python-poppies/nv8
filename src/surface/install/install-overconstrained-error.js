import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  OverconstrainedError,
  installOverconstrainedErrorConstructor,
} from "../api/media/overconstrained-error-constructor.js";
import { constraint } from "../api/media/overconstrained-error-constraint-getter.js";
export function installOverconstrainedError() {
  installOverconstrainedErrorConstructor();
  definePrototypeGetter(OverconstrainedError.prototype, "constraint", constraint);
  defineConstructorBacklink(OverconstrainedError.prototype, OverconstrainedError);
  defineToStringTag(OverconstrainedError.prototype, "OverconstrainedError");
}
