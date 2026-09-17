const evaluationResultBrand = Symbol("evaluationResult");
const errorRecordBrand = Symbol("errorRecord");
const traceEntryBrand = Symbol("traceEntry");

export function evaluationResult(type, value) {
  return {
    [evaluationResultBrand]: true,
    type,
    value,
  };
}

export function errorRecord(name, message, code, stack) {
  return {
    [errorRecordBrand]: true,
    name,
    message,
    code,
    stack,
  };
}

function traceEntry(fields) {
  return {
    [traceEntryBrand]: true,
    ...fields,
  };
}

export function typedValueKind(value) {
  if (value?.[evaluationResultBrand] === true) {
    return "evaluation-result";
  }
  if (value?.[errorRecordBrand] === true) {
    return "error";
  }
  if (value?.[traceEntryBrand] === true) {
    return "trace-entry";
  }
  return "ordinary";
}
