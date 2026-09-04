import {
  inputNumericValue,
  normalizedInputType,
  requireInput,
  setInputValue,
} from "./html-input-element-state.js";

export function applyInputStep(input, direction, countValue) {
  requireInput(input);
  const type = normalizedInputType(input);
  if (!["number", "range", "date"].includes(type)) {
    throw new DOMException("The input type does not support stepping", "InvalidStateError");
  }
  if (input.step.toLowerCase() === "any") {
    throw new DOMException("The input has step='any'", "InvalidStateError");
  }
  const count = countValue === undefined ? 1 : Number(countValue);
  const unit = type === "date" ? 86_400_000 : 1;
  const parsedStep = Number.parseFloat(input.step);
  const step = Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep * unit : unit;
  const min = type === "date"
    ? Date.parse(`${input.min}T00:00:00Z`)
    : Number.parseFloat(input.min);
  const current = inputNumericValue(input);
  const next = Number.isFinite(current)
    ? current + direction * count * step
    : Number.isFinite(min) ? min : 0;
  if (type === "date") setInputValue(input, new Date(next).toISOString().slice(0, 10));
  else setInputValue(input, `${next}`);
}
