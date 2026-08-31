import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { badInput } from "../api/dom/validity-state-bad-input-getter.js";
import {
  ValidityState,
  installValidityStateConstructor,
} from "../api/dom/validity-state-constructor.js";
import { customError } from "../api/dom/validity-state-custom-error-getter.js";
import { patternMismatch } from "../api/dom/validity-state-pattern-mismatch-getter.js";
import { rangeOverflow } from "../api/dom/validity-state-range-overflow-getter.js";
import { rangeUnderflow } from "../api/dom/validity-state-range-underflow-getter.js";
import { stepMismatch } from "../api/dom/validity-state-step-mismatch-getter.js";
import { tooLong } from "../api/dom/validity-state-too-long-getter.js";
import { tooShort } from "../api/dom/validity-state-too-short-getter.js";
import { typeMismatch } from "../api/dom/validity-state-type-mismatch-getter.js";
import { valid } from "../api/dom/validity-state-valid-getter.js";
import { valueMissing } from "../api/dom/validity-state-value-missing-getter.js";

export function installValidityState() {
  installValidityStateConstructor();
  getter("valueMissing", valueMissing);
  getter("typeMismatch", typeMismatch);
  getter("patternMismatch", patternMismatch);
  getter("tooLong", tooLong);
  getter("tooShort", tooShort);
  getter("rangeUnderflow", rangeUnderflow);
  getter("rangeOverflow", rangeOverflow);
  getter("stepMismatch", stepMismatch);
  getter("badInput", badInput);
  getter("customError", customError);
  getter("valid", valid);
  defineConstructorBacklink(ValidityState.prototype, ValidityState);
  defineToStringTag(ValidityState.prototype, "ValidityState");
}

function getter(name, callback) {
  definePrototypeGetter(ValidityState.prototype, name, callback);
}
