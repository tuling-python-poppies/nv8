import * as runtime from "../dom-utilities-runtime.js";
import { StaticRange } from "../dom-utilities-runtime.js";
import { AbstractRange as __ExplicitParent } from "../../dom/abstract-range-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(StaticRange);
}

export function installRelation() {
  installDispatchedRelation(
    StaticRange,
    "AbstractRange",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(StaticRange);
}

export function installTag() {
  installDispatchedTag(StaticRange);
}
