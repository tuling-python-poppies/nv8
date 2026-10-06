import {
  role,
  ariaAtomic,
  ariaAutoComplete,
  ariaBusy,
  ariaBrailleLabel,
  ariaBrailleRoleDescription,
  ariaChecked,
  ariaColCount,
  ariaColIndex,
  ariaColSpan,
  ariaCurrent,
  ariaDescription,
  ariaDisabled,
  ariaExpanded,
  ariaHasPopup,
  ariaHidden,
  ariaInvalid,
  ariaKeyShortcuts,
  ariaLabel,
  ariaLevel,
  ariaLive,
  ariaModal,
  ariaMultiLine,
  ariaMultiSelectable,
  ariaOrientation,
  ariaPlaceholder,
  ariaPosInSet,
  ariaPressed,
  ariaReadOnly,
  ariaRelevant,
  ariaRequired,
  ariaRoleDescription,
  ariaRowCount,
  ariaRowIndex,
  ariaRowSpan,
  ariaSelected,
  ariaSetSize,
  ariaSort,
  ariaValueMax,
  ariaValueMin,
  ariaValueNow,
  ariaValueText,
  ariaColIndexText,
  ariaRowIndexText,
  ariaActiveDescendantElement,
  ariaActionsElements,
  ariaControlsElements,
  ariaDescribedByElements,
  ariaDetailsElements,
  ariaErrorMessageElements,
  ariaFlowToElements,
  ariaLabelledByElements,
} from "../api/dom/element-internals-ariaproperty-members.js";

export function installElementInternalsARIABeforeMethods(accessor) {
  accessor("role", role);
  accessor("ariaAtomic", ariaAtomic);
  accessor("ariaAutoComplete", ariaAutoComplete);
  accessor("ariaBusy", ariaBusy);
  accessor("ariaBrailleLabel", ariaBrailleLabel);
  accessor("ariaBrailleRoleDescription", ariaBrailleRoleDescription);
  accessor("ariaChecked", ariaChecked);
  accessor("ariaColCount", ariaColCount);
  accessor("ariaColIndex", ariaColIndex);
  accessor("ariaColSpan", ariaColSpan);
  accessor("ariaCurrent", ariaCurrent);
  accessor("ariaDescription", ariaDescription);
  accessor("ariaDisabled", ariaDisabled);
  accessor("ariaExpanded", ariaExpanded);
  accessor("ariaHasPopup", ariaHasPopup);
  accessor("ariaHidden", ariaHidden);
  accessor("ariaInvalid", ariaInvalid);
  accessor("ariaKeyShortcuts", ariaKeyShortcuts);
  accessor("ariaLabel", ariaLabel);
  accessor("ariaLevel", ariaLevel);
  accessor("ariaLive", ariaLive);
  accessor("ariaModal", ariaModal);
  accessor("ariaMultiLine", ariaMultiLine);
  accessor("ariaMultiSelectable", ariaMultiSelectable);
  accessor("ariaOrientation", ariaOrientation);
  accessor("ariaPlaceholder", ariaPlaceholder);
  accessor("ariaPosInSet", ariaPosInSet);
  accessor("ariaPressed", ariaPressed);
  accessor("ariaReadOnly", ariaReadOnly);
  accessor("ariaRelevant", ariaRelevant);
  accessor("ariaRequired", ariaRequired);
  accessor("ariaRoleDescription", ariaRoleDescription);
  accessor("ariaRowCount", ariaRowCount);
  accessor("ariaRowIndex", ariaRowIndex);
  accessor("ariaRowSpan", ariaRowSpan);
  accessor("ariaSelected", ariaSelected);
  accessor("ariaSetSize", ariaSetSize);
  accessor("ariaSort", ariaSort);
  accessor("ariaValueMax", ariaValueMax);
  accessor("ariaValueMin", ariaValueMin);
  accessor("ariaValueNow", ariaValueNow);
  accessor("ariaValueText", ariaValueText);
}

export function installElementInternalsARIAAfterMethods(accessor) {
  accessor("ariaColIndexText", ariaColIndexText);
  accessor("ariaRowIndexText", ariaRowIndexText);
  accessor("ariaActiveDescendantElement", ariaActiveDescendantElement);
  accessor("ariaActionsElements", ariaActionsElements);
  accessor("ariaControlsElements", ariaControlsElements);
  accessor("ariaDescribedByElements", ariaDescribedByElements);
  accessor("ariaDetailsElements", ariaDetailsElements);
  accessor("ariaErrorMessageElements", ariaErrorMessageElements);
  accessor("ariaFlowToElements", ariaFlowToElements);
  accessor("ariaLabelledByElements", ariaLabelledByElements);
}
