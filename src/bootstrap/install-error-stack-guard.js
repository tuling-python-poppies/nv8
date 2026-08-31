import { registerNativeFunction } from "../webidl/native-function.js";

const NativeError = globalThis.Error;
const NativeEvalError = globalThis.EvalError;
const NativeRangeError = globalThis.RangeError;
const NativeReferenceError = globalThis.ReferenceError;
const NativeSyntaxError = globalThis.SyntaxError;
const NativeTypeError = globalThis.TypeError;
const NativeURIError = globalThis.URIError;
const NativeAggregateError = globalThis.AggregateError;
const visibleStackTraceLimit = NativeError.stackTraceLimit;
const internalSourceRoot = import.meta.url.slice(
  0,
  import.meta.url.indexOf("/bootstrap/") + 1,
);

function ErrorImplementation(message) {
  return constructSanitized(
    NativeError,
    ErrorImplementation,
    new.target,
    arguments,
  );
}

function EvalErrorImplementation(message) {
  return constructSanitized(
    NativeEvalError,
    EvalErrorImplementation,
    new.target,
    arguments,
  );
}

function RangeErrorImplementation(message) {
  return constructSanitized(
    NativeRangeError,
    RangeErrorImplementation,
    new.target,
    arguments,
  );
}

function ReferenceErrorImplementation(message) {
  return constructSanitized(
    NativeReferenceError,
    ReferenceErrorImplementation,
    new.target,
    arguments,
  );
}

function SyntaxErrorImplementation(message) {
  return constructSanitized(
    NativeSyntaxError,
    SyntaxErrorImplementation,
    new.target,
    arguments,
  );
}

function TypeErrorImplementation(message) {
  return constructSanitized(
    NativeTypeError,
    TypeErrorImplementation,
    new.target,
    arguments,
  );
}

function URIErrorImplementation(message) {
  return constructSanitized(
    NativeURIError,
    URIErrorImplementation,
    new.target,
    arguments,
  );
}

function AggregateErrorImplementation(errors, message) {
  return constructSanitized(
    NativeAggregateError,
    AggregateErrorImplementation,
    new.target,
    arguments,
  );
}

const ErrorConstructor = ErrorImplementation.bind(undefined);
const EvalErrorConstructor = EvalErrorImplementation.bind(undefined);
const RangeErrorConstructor = RangeErrorImplementation.bind(undefined);
const ReferenceErrorConstructor =
  ReferenceErrorImplementation.bind(undefined);
const SyntaxErrorConstructor = SyntaxErrorImplementation.bind(undefined);
const TypeErrorConstructor = TypeErrorImplementation.bind(undefined);
const URIErrorConstructor = URIErrorImplementation.bind(undefined);
const AggregateErrorConstructor =
  AggregateErrorImplementation.bind(undefined);

export function installErrorStackGuard(edge151Surface = false) {
  ErrorImplementation.prototype = NativeError.prototype;
  EvalErrorImplementation.prototype = NativeEvalError.prototype;
  RangeErrorImplementation.prototype = NativeRangeError.prototype;
  ReferenceErrorImplementation.prototype = NativeReferenceError.prototype;
  SyntaxErrorImplementation.prototype = NativeSyntaxError.prototype;
  TypeErrorImplementation.prototype = NativeTypeError.prototype;
  URIErrorImplementation.prototype = NativeURIError.prototype;
  AggregateErrorImplementation.prototype = NativeAggregateError.prototype;

  configureConstructor(
    ErrorConstructor,
    "Error",
    NativeError,
    Function.prototype,
  );
  configureConstructor(
    EvalErrorConstructor,
    "EvalError",
    NativeEvalError,
    ErrorConstructor,
  );
  configureConstructor(
    RangeErrorConstructor,
    "RangeError",
    NativeRangeError,
    ErrorConstructor,
  );
  configureConstructor(
    ReferenceErrorConstructor,
    "ReferenceError",
    NativeReferenceError,
    ErrorConstructor,
  );
  configureConstructor(
    SyntaxErrorConstructor,
    "SyntaxError",
    NativeSyntaxError,
    ErrorConstructor,
  );
  configureConstructor(
    TypeErrorConstructor,
    "TypeError",
    NativeTypeError,
    ErrorConstructor,
  );
  configureConstructor(
    URIErrorConstructor,
    "URIError",
    NativeURIError,
    ErrorConstructor,
  );
  configureConstructor(
    AggregateErrorConstructor,
    "AggregateError",
    NativeAggregateError,
    ErrorConstructor,
  );

  copyErrorStatic("captureStackTrace");
  copyErrorStatic("isError");
  Object.defineProperty(ErrorConstructor, "stackTraceLimit", {
    value: visibleStackTraceLimit,
    writable: true,
    enumerable: edge151Surface,
    configurable: true,
  });

  installGlobal("Error", ErrorConstructor);
  installGlobal("EvalError", EvalErrorConstructor);
  installGlobal("RangeError", RangeErrorConstructor);
  installGlobal("ReferenceError", ReferenceErrorConstructor);
  installGlobal("SyntaxError", SyntaxErrorConstructor);
  installGlobal("TypeError", TypeErrorConstructor);
  installGlobal("URIError", URIErrorConstructor);
  installGlobal("AggregateError", AggregateErrorConstructor);

  NativeError.stackTraceLimit = 1;
}

function configureConstructor(
  constructor,
  name,
  nativeConstructor,
  constructorPrototype,
) {
  Object.defineProperty(constructor, "name", {
    value: name,
    configurable: true,
  });
  Object.defineProperty(constructor, "prototype", {
    value: nativeConstructor.prototype,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  Object.setPrototypeOf(constructor, constructorPrototype);
  Object.defineProperty(nativeConstructor.prototype, "constructor", {
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  registerNativeFunction(constructor, name);
}

function copyErrorStatic(name) {
  const descriptor = Object.getOwnPropertyDescriptor(NativeError, name);
  if (descriptor !== undefined) {
    Object.defineProperty(ErrorConstructor, name, descriptor);
  }
}

function installGlobal(name, constructor) {
  Object.defineProperty(globalThis, name, {
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function constructSanitized(
  nativeConstructor,
  implementation,
  newTarget,
  argumentsObject,
) {
  const actualNewTarget = newTarget === undefined
      || newTarget === implementation
    ? nativeConstructor
    : newTarget;
  const previousLimit = NativeError.stackTraceLimit;
  NativeError.stackTraceLimit = 50;
  let error;
  try {
    error = Reflect.construct(
      nativeConstructor,
      Array.from(argumentsObject),
      actualNewTarget,
    );
    materializeSanitizedStack(error);
  } finally {
    NativeError.stackTraceLimit = previousLimit;
  }
  return error;
}

function materializeSanitizedStack(error) {
  const rawStack = error.stack;
  if (typeof rawStack !== "string") return;
  const lines = rawStack.split(/\r?\n/u);
  const sanitized = [];
  for (const line of lines) {
    if (isInternalStackLine(line)) continue;
    sanitized.push(
      line.replaceAll("evalmachine.<anonymous>", "<anonymous>"),
    );
  }
  Object.defineProperty(error, "stack", {
    value: sanitized.join("\n"),
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function isInternalStackLine(line) {
  return line.includes(internalSourceRoot)
    || line.includes("node:")
    || line.includes("node_modules")
    || line.includes("internal/")
    || line.includes("child/entry.js")
    || line.includes("Script.runInContext")
    || line.includes("SourceTextModule")
    || line.includes("processTicksAndRejections");
}
