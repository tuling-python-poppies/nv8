import { ariaElementProperty } from "./element-aria-element-property.js";

const ARIA_ELEMENT_PROPERTY_TABLE_ROWS = [
  ["ariaActionsElements", "ariaActionsElements", "aria-actions", true],
  ["ariaActiveDescendantElement", "ariaActiveDescendantElement", "aria-activedescendant", false],
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

const ELEMENT_NULLABLE_STRING_PROPERTY_TABLE_ROWS = [
  ["ariaAtomic", "ariaAtomic", "aria-atomic"],
  ["ariaAutoComplete", "ariaAutoComplete", "aria-autocomplete"],
  ["ariaBrailleLabel", "ariaBrailleLabel", "aria-braillelabel"],
  ["ariaBrailleRoleDescription", "ariaBrailleRoleDescription", "aria-brailleroledescription"],
  ["ariaBusy", "ariaBusy", "aria-busy"],
  ["ariaChecked", "ariaChecked", "aria-checked"],
  ["ariaColCount", "ariaColCount", "aria-colcount"],
  ["ariaColIndex", "ariaColIndex", "aria-colindex"],
  ["ariaColIndexText", "ariaColIndexText", "aria-colindextext"],
  ["ariaColSpan", "ariaColSpan", "aria-colspan"],
  ["ariaCurrent", "ariaCurrent", "aria-current"],
  ["ariaDescription", "ariaDescription", "aria-description"],
  ["ariaDisabled", "ariaDisabled", "aria-disabled"],
  ["ariaExpanded", "ariaExpanded", "aria-expanded"],
  ["ariaHasPopup", "ariaHasPopup", "aria-haspopup"],
  ["ariaHidden", "ariaHidden", "aria-hidden"],
  ["ariaInvalid", "ariaInvalid", "aria-invalid"],
  ["ariaKeyShortcuts", "ariaKeyShortcuts", "aria-keyshortcuts"],
  ["ariaLabel", "ariaLabel", "aria-label"],
  ["ariaLevel", "ariaLevel", "aria-level"],
  ["ariaLive", "ariaLive", "aria-live"],
  ["ariaModal", "ariaModal", "aria-modal"],
  ["ariaMultiLine", "ariaMultiLine", "aria-multiline"],
  ["ariaMultiSelectable", "ariaMultiSelectable", "aria-multiselectable"],
  ["ariaOrientation", "ariaOrientation", "aria-orientation"],
  ["ariaPlaceholder", "ariaPlaceholder", "aria-placeholder"],
  ["ariaPosInSet", "ariaPosInSet", "aria-posinset"],
  ["ariaPressed", "ariaPressed", "aria-pressed"],
  ["ariaReadOnly", "ariaReadOnly", "aria-readonly"],
  ["ariaRelevant", "ariaRelevant", "aria-relevant"],
  ["ariaRequired", "ariaRequired", "aria-required"],
  ["ariaRoleDescription", "ariaRoleDescription", "aria-roledescription"],
  ["ariaRowCount", "ariaRowCount", "aria-rowcount"],
  ["ariaRowIndex", "ariaRowIndex", "aria-rowindex"],
  ["ariaRowIndexText", "ariaRowIndexText", "aria-rowindextext"],
  ["ariaRowSpan", "ariaRowSpan", "aria-rowspan"],
  ["ariaSelected", "ariaSelected", "aria-selected"],
  ["ariaSetSize", "ariaSetSize", "aria-setsize"],
  ["ariaSort", "ariaSort", "aria-sort"],
  ["ariaValueMax", "ariaValueMax", "aria-valuemax"],
  ["ariaValueMin", "ariaValueMin", "aria-valuemin"],
  ["ariaValueNow", "ariaValueNow", "aria-valuenow"],
  ["ariaValueText", "ariaValueText", "aria-valuetext"],
  ["role", "role", "role"],
];

export const elementNullableStringPropertyTable = ELEMENT_NULLABLE_STRING_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementNullableStringProperty(...args)],
);

