const validityState = new WeakMap();

const falseFlags = Object.freeze({
  valueMissing: false,
  typeMismatch: false,
  patternMismatch: false,
  tooLong: false,
  tooShort: false,
  rangeUnderflow: false,
  rangeOverflow: false,
  stepMismatch: false,
  badInput: false,
  customError: false,
});

export function initializeValidityState(validity, evaluate) {
  validityState.set(validity, { evaluate });
}

export function validityFlags(validity) {
  const state = validityState.get(validity);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  const flags = { ...falseFlags, ...state.evaluate() };
  flags.valid = !Object.values(flags).some(Boolean);
  return flags;
}
