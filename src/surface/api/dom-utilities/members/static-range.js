import * as runtime from "../dom-utilities-runtime.js";
import { StaticRange } from "../dom-utilities-runtime.js";
import { AbstractRange as __ExplicitParent } from "../../dom/abstract-range-constructor.js";
import { NodeRange as __Edge152Parent } from "../../dom/range-152-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(StaticRange);
}

/** @param {boolean} [edge152Surface] 152 起 `StaticRange → NodeRange → AbstractRange`。 */
export function installRelation(edge152Surface = false) {
  installDispatchedRelation(
    StaticRange,
    edge152Surface ? "NodeRange" : "AbstractRange",
    edge152Surface ? __Edge152Parent : __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(StaticRange);
}

export function installTag() {
  installDispatchedTag(StaticRange);
}
