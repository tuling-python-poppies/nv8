import {
  getAttributeValue,
  setAttributeValue,
} from "./element-state.js";

export function progressMaximum(element) {
  const value = Number(getAttributeValue(element, "max"));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

export function progressValue(element) {
  const value = Number(getAttributeValue(element, "value"));
  const normalized = Number.isFinite(value) && value >= 0 ? value : 0;
  return Math.min(normalized, progressMaximum(element));
}

export function setProgressNumber(element, attributeName, value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new TypeError("The provided value is non-finite.");
  }
  setAttributeValue(element, attributeName, `${number}`);
}
