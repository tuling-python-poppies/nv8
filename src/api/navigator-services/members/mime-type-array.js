import * as runtime from "../navigator-services-runtime.js";
import { MimeTypeArray } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIterator,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MimeTypeArray);
}

export function installRelation() {
  installDispatchedRelation(
    MimeTypeArray,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MimeTypeArray,
    "length",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    MimeTypeArray,
    "item",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    MimeTypeArray,
    "namedItem",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MimeTypeArray);
}

export function installTag() {
  installDispatchedTag(MimeTypeArray);
}

export function installIterator() {
  installDispatchedIterator(
    MimeTypeArray,
    "values",
    runtime.navigatorServiceIterator,
  );
}
