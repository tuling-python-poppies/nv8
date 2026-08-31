import { getAttributeValue, setAttributeValue } from "./element-state.js";

export function meterMinimum(element) {
  return finiteAttribute(element, "min", 0);
}

export function meterMaximum(element) {
  const minimum = meterMinimum(element);
  return Math.max(finiteAttribute(element, "max", 1), minimum);
}

export function meterValue(element) {
  const minimum = meterMinimum(element);
  return Math.min(
    Math.max(finiteAttribute(element, "value", 0), minimum),
    meterMaximum(element),
  );
}

export function meterLow(element) {
  const minimum = meterMinimum(element);
  return Math.min(
    Math.max(finiteAttribute(element, "low", minimum), minimum),
    meterMaximum(element),
  );
}

export function meterHigh(element) {
  return Math.min(
    Math.max(
      finiteAttribute(element, "high", meterMaximum(element)),
      meterLow(element),
    ),
    meterMaximum(element),
  );
}

export function meterOptimum(element) {
  const minimum = meterMinimum(element);
  const maximum = meterMaximum(element);
  return Math.min(
    Math.max(
      finiteAttribute(element, "optimum", (minimum + maximum) / 2),
      minimum,
    ),
    maximum,
  );
}

export function setMeterNumber(element, attributeName, value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new TypeError("The provided value is non-finite.");
  }
  setAttributeValue(element, attributeName, `${number}`);
}

function finiteAttribute(element, name, fallback) {
  const raw = getAttributeValue(element, name);
  if (raw === null) {
    return fallback;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}
