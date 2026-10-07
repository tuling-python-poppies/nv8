// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { elementInternalsARIAProperty } from "./element-internals-property.js";

const ELEMENT_INTERNALS_ARIAPROPERTY_PART1_TABLE_ROWS = [
  ["role", "role", false],
  ["ariaAtomic", "ariaAtomic", false],
  ["ariaAutoComplete", "ariaAutoComplete", false],
  ["ariaBusy", "ariaBusy", false],
  ["ariaBrailleLabel", "ariaBrailleLabel", false],
  ["ariaBrailleRoleDescription", "ariaBrailleRoleDescription", false],
  ["ariaChecked", "ariaChecked", false],
  ["ariaColCount", "ariaColCount", false],
  ["ariaColIndex", "ariaColIndex", false],
  ["ariaColSpan", "ariaColSpan", false],
  ["ariaCurrent", "ariaCurrent", false],
  ["ariaDescription", "ariaDescription", false],
  ["ariaDisabled", "ariaDisabled", false],
  ["ariaExpanded", "ariaExpanded", false],
  ["ariaHasPopup", "ariaHasPopup", false],
  ["ariaHidden", "ariaHidden", false],
  ["ariaInvalid", "ariaInvalid", false],
  ["ariaKeyShortcuts", "ariaKeyShortcuts", false],
  ["ariaLabel", "ariaLabel", false],
  ["ariaLevel", "ariaLevel", false],
  ["ariaLive", "ariaLive", false],
  ["ariaModal", "ariaModal", false],
  ["ariaMultiLine", "ariaMultiLine", false],
  ["ariaMultiSelectable", "ariaMultiSelectable", false],
  ["ariaOrientation", "ariaOrientation", false],
  ["ariaPlaceholder", "ariaPlaceholder", false],
  ["ariaPosInSet", "ariaPosInSet", false],
  ["ariaPressed", "ariaPressed", false],
  ["ariaReadOnly", "ariaReadOnly", false],
  ["ariaRelevant", "ariaRelevant", false],
  ["ariaRequired", "ariaRequired", false],
  ["ariaRoleDescription", "ariaRoleDescription", false],
  ["ariaRowCount", "ariaRowCount", false],
  ["ariaRowIndex", "ariaRowIndex", false],
  ["ariaRowSpan", "ariaRowSpan", false],
  ["ariaSelected", "ariaSelected", false],
  ["ariaSetSize", "ariaSetSize", false],
  ["ariaSort", "ariaSort", false],
  ["ariaValueMax", "ariaValueMax", false],
  ["ariaValueMin", "ariaValueMin", false],
  ["ariaValueNow", "ariaValueNow", false],
  ["ariaValueText", "ariaValueText", false],
];

export const elementInternalsARIAPropertyPart1Table = ELEMENT_INTERNALS_ARIAPROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementInternalsARIAProperty(...args)],
);

const ELEMENT_INTERNALS_ARIAPROPERTY_PART2_TABLE_ROWS = [
  ["ariaColIndexText", "ariaColIndexText", false],
  ["ariaRowIndexText", "ariaRowIndexText", false],
  ["ariaActiveDescendantElement", "ariaActiveDescendantElement", true],
  ["ariaActionsElements", "ariaActionsElements", true],
  ["ariaControlsElements", "ariaControlsElements", true],
  ["ariaDescribedByElements", "ariaDescribedByElements", true],
  ["ariaDetailsElements", "ariaDetailsElements", true],
  ["ariaErrorMessageElements", "ariaErrorMessageElements", true],
  ["ariaFlowToElements", "ariaFlowToElements", true],
  ["ariaLabelledByElements", "ariaLabelledByElements", true],
];

export const elementInternalsARIAPropertyPart2Table = ELEMENT_INTERNALS_ARIAPROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementInternalsARIAProperty(...args)],
);
