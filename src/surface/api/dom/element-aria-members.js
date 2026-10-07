import { ariaElementProperty } from "./element-aria-element-property.js";

const ARIA_ELEMENT_PROPERTY_TABLE_ROWS = [
  ["ariaActiveDescendantElement", "ariaActiveDescendantElement", "aria-activedescendant", false],
  ["ariaActionsElements", "ariaActionsElements", "aria-actions", true],
  ["ariaControlsElements", "ariaControlsElements", "aria-controls", true],
  ["ariaDescribedByElements", "ariaDescribedByElements", "aria-describedby", true],
  ["ariaDetailsElements", "ariaDetailsElements", "aria-details", true],
  ["ariaErrorMessageElements", "ariaErrorMessageElements", "aria-errormessage", true],
  ["ariaFlowToElements", "ariaFlowToElements", "aria-flowto", true],
  ["ariaLabelledByElements", "ariaLabelledByElements", "aria-labelledby", true],
];

export const ariaElementPropertyTable = ARIA_ELEMENT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, ariaElementProperty(...args)],
);

import { elementNullableStringProperty } from "./element-extended-property.js";

const ELEMENT_NULLABLE_STRING_PROPERTY_PART1_TABLE_ROWS = [
  ["role", "role", "role"],
  ["ariaAtomic", "ariaAtomic", "aria-atomic"],
  ["ariaAutoComplete", "ariaAutoComplete", "aria-autocomplete"],
  ["ariaBusy", "ariaBusy", "aria-busy"],
  ["ariaBrailleLabel", "ariaBrailleLabel", "aria-braillelabel"],
];

export const elementNullableStringPropertyPart1Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART2_TABLE_ROWS = [
  ["ariaBrailleRoleDescription", "ariaBrailleRoleDescription", "aria-brailleroledescription"],
];

export const elementNullableStringPropertyPart2Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART3_TABLE_ROWS = [
  ["ariaChecked", "ariaChecked", "aria-checked"],
  ["ariaColCount", "ariaColCount", "aria-colcount"],
  ["ariaColIndex", "ariaColIndex", "aria-colindex"],
  ["ariaColSpan", "ariaColSpan", "aria-colspan"],
  ["ariaCurrent", "ariaCurrent", "aria-current"],
  ["ariaDescription", "ariaDescription", "aria-description"],
  ["ariaDisabled", "ariaDisabled", "aria-disabled"],
  ["ariaExpanded", "ariaExpanded", "aria-expanded"],
  ["ariaHasPopup", "ariaHasPopup", "aria-haspopup"],
  ["ariaHidden", "ariaHidden", "aria-hidden"],
  ["ariaInvalid", "ariaInvalid", "aria-invalid"],
];

export const elementNullableStringPropertyPart3Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART4_TABLE_ROWS = [
  ["ariaKeyShortcuts", "ariaKeyShortcuts", "aria-keyshortcuts"],
];

export const elementNullableStringPropertyPart4Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART5_TABLE_ROWS = [
  ["ariaLabel", "ariaLabel", "aria-label"],
  ["ariaLevel", "ariaLevel", "aria-level"],
  ["ariaLive", "ariaLive", "aria-live"],
  ["ariaModal", "ariaModal", "aria-modal"],
  ["ariaMultiLine", "ariaMultiLine", "aria-multiline"],
];

export const elementNullableStringPropertyPart5Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART6_TABLE_ROWS = [
  ["ariaMultiSelectable", "ariaMultiSelectable", "aria-multiselectable"],
];

export const elementNullableStringPropertyPart6Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART7_TABLE_ROWS = [
  ["ariaOrientation", "ariaOrientation", "aria-orientation"],
  ["ariaPlaceholder", "ariaPlaceholder", "aria-placeholder"],
  ["ariaPosInSet", "ariaPosInSet", "aria-posinset"],
  ["ariaPressed", "ariaPressed", "aria-pressed"],
  ["ariaReadOnly", "ariaReadOnly", "aria-readonly"],
  ["ariaRelevant", "ariaRelevant", "aria-relevant"],
  ["ariaRequired", "ariaRequired", "aria-required"],
];

export const elementNullableStringPropertyPart7Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART8_TABLE_ROWS = [
  ["ariaRoleDescription", "ariaRoleDescription", "aria-roledescription"],
];

export const elementNullableStringPropertyPart8Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART8_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART9_TABLE_ROWS = [
  ["ariaRowCount", "ariaRowCount", "aria-rowcount"],
  ["ariaRowIndex", "ariaRowIndex", "aria-rowindex"],
  ["ariaRowSpan", "ariaRowSpan", "aria-rowspan"],
  ["ariaSelected", "ariaSelected", "aria-selected"],
  ["ariaSetSize", "ariaSetSize", "aria-setsize"],
  ["ariaSort", "ariaSort", "aria-sort"],
  ["ariaValueMax", "ariaValueMax", "aria-valuemax"],
  ["ariaValueMin", "ariaValueMin", "aria-valuemin"],
  ["ariaValueNow", "ariaValueNow", "aria-valuenow"],
  ["ariaValueText", "ariaValueText", "aria-valuetext"],
];

export const elementNullableStringPropertyPart9Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART9_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

const ELEMENT_NULLABLE_STRING_PROPERTY_PART10_TABLE_ROWS = [
  ["ariaColIndexText", "ariaColIndexText", "aria-colindextext"],
  ["ariaRowIndexText", "ariaRowIndexText", "aria-rowindextext"],
];

export const elementNullableStringPropertyPart10Table = ELEMENT_NULLABLE_STRING_PROPERTY_PART10_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);
