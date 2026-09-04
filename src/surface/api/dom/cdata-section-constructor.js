import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Text } from "./text-constructor.js";
import {
  CDATA_SECTION_NODE,
  initializeNode,
} from "./node-state.js";

export function CDATASection() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CDATASection, "CDATASection");

export function createCDATASection(data, ownerDocument) {
  const section = Object.create(CDATASection.prototype);
  initializeNode(
    section,
    CDATA_SECTION_NODE,
    "#cdata-section",
    `${data}`,
    ownerDocument,
  );
  return section;
}

export function installCDATASectionConstructor() {
  Object.setPrototypeOf(CDATASection.prototype, Text.prototype);
  Object.setPrototypeOf(CDATASection, Text);
  delete CDATASection.prototype.constructor;
  defineGlobalConstructor("CDATASection", CDATASection);
}

export function finishCDATASectionConstructor() {
  defineConstructorBacklink(CDATASection.prototype, CDATASection);
  defineToStringTag(CDATASection.prototype, "CDATASection");
}
