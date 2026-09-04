import * as runtime from "../dom-utilities-runtime.js";
import { XPathResult } from "../dom-utilities-runtime.js";
import {
  installDispatchedConstant,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(XPathResult);
}

export function installRelation() {
  installDispatchedRelation(
    XPathResult,
    "Object",
    null,
  );
}

export function installConstant0() {
  installDispatchedConstant(
    XPathResult,
    "ANY_TYPE",
    0,
  );
}

export function installConstant1() {
  installDispatchedConstant(
    XPathResult,
    "NUMBER_TYPE",
    1,
  );
}

export function installConstant2() {
  installDispatchedConstant(
    XPathResult,
    "STRING_TYPE",
    2,
  );
}

export function installConstant3() {
  installDispatchedConstant(
    XPathResult,
    "BOOLEAN_TYPE",
    3,
  );
}

export function installConstant4() {
  installDispatchedConstant(
    XPathResult,
    "UNORDERED_NODE_ITERATOR_TYPE",
    4,
  );
}

export function installConstant5() {
  installDispatchedConstant(
    XPathResult,
    "ORDERED_NODE_ITERATOR_TYPE",
    5,
  );
}

export function installConstant6() {
  installDispatchedConstant(
    XPathResult,
    "UNORDERED_NODE_SNAPSHOT_TYPE",
    6,
  );
}

export function installConstant7() {
  installDispatchedConstant(
    XPathResult,
    "ORDERED_NODE_SNAPSHOT_TYPE",
    7,
  );
}

export function installConstant8() {
  installDispatchedConstant(
    XPathResult,
    "ANY_UNORDERED_NODE_TYPE",
    8,
  );
}

export function installConstant9() {
  installDispatchedConstant(
    XPathResult,
    "FIRST_ORDERED_NODE_TYPE",
    9,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(XPathResult);
}

export function installTag() {
  installDispatchedTag(XPathResult);
}
