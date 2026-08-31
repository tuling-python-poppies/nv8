import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
import {
  ATTRIBUTE_NODE,
  CDATA_SECTION_NODE,
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_POSITION_CONTAINED_BY,
  DOCUMENT_POSITION_CONTAINS,
  DOCUMENT_POSITION_DISCONNECTED,
  DOCUMENT_POSITION_FOLLOWING,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
  DOCUMENT_POSITION_PRECEDING,
  DOCUMENT_TYPE_NODE,
  ELEMENT_NODE,
  ENTITY_NODE,
  ENTITY_REFERENCE_NODE,
  NOTATION_NODE,
  PROCESSING_INSTRUCTION_NODE,
  TEXT_NODE,
} from "./node-state.js";

export function Node() {
  // 真实 Chromium 带接口名前缀：`Failed to construct 'Node': Illegal constructor`
  throw new TypeError("Failed to construct 'Node': Illegal constructor");
}

registerNativeFunction(Node, "Node");

export function installNodeConstructor() {
  Object.setPrototypeOf(Node.prototype, EventTarget.prototype);
  Object.setPrototypeOf(Node, EventTarget);
  delete Node.prototype.constructor;
  defineConstants(Node);
  defineGlobalConstructor("Node", Node);
}

export function installNodePrototypeConstants() {
  defineConstants(Node.prototype);
}

export function installNodeConstructorBacklink() {
  defineConstructorBacklink(Node.prototype, Node);
}

export function installNodeToStringTag() {
  defineToStringTag(Node.prototype, "Node");
}

function defineConstants(object) {
  defineConstant(object, "ELEMENT_NODE", ELEMENT_NODE);
  defineConstant(object, "ATTRIBUTE_NODE", ATTRIBUTE_NODE);
  defineConstant(object, "TEXT_NODE", TEXT_NODE);
  defineConstant(object, "CDATA_SECTION_NODE", CDATA_SECTION_NODE);
  defineConstant(object, "ENTITY_REFERENCE_NODE", ENTITY_REFERENCE_NODE);
  defineConstant(object, "ENTITY_NODE", ENTITY_NODE);
  defineConstant(object, "PROCESSING_INSTRUCTION_NODE", PROCESSING_INSTRUCTION_NODE);
  defineConstant(object, "COMMENT_NODE", COMMENT_NODE);
  defineConstant(object, "DOCUMENT_NODE", DOCUMENT_NODE);
  defineConstant(object, "DOCUMENT_TYPE_NODE", DOCUMENT_TYPE_NODE);
  defineConstant(object, "DOCUMENT_FRAGMENT_NODE", DOCUMENT_FRAGMENT_NODE);
  defineConstant(object, "NOTATION_NODE", NOTATION_NODE);
  defineConstant(object, "DOCUMENT_POSITION_DISCONNECTED", DOCUMENT_POSITION_DISCONNECTED);
  defineConstant(object, "DOCUMENT_POSITION_PRECEDING", DOCUMENT_POSITION_PRECEDING);
  defineConstant(object, "DOCUMENT_POSITION_FOLLOWING", DOCUMENT_POSITION_FOLLOWING);
  defineConstant(object, "DOCUMENT_POSITION_CONTAINS", DOCUMENT_POSITION_CONTAINS);
  defineConstant(object, "DOCUMENT_POSITION_CONTAINED_BY", DOCUMENT_POSITION_CONTAINED_BY);
  defineConstant(
    object,
    "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC",
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
  );
}

function defineConstant(object, name, value) {
  Object.defineProperty(object, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
