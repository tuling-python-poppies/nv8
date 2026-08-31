import {
  createNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

function defineStatic(
  owner,
  name,
  length,
  implementation,
  enumerable = true,
) {
  // 部分宿主内建对象在较旧 Node 上不存在（例如 `Iterator` 需 Node 22+）。
  // 这里跳过而不抛错：缺失的宿主能力由 host-capabilities 统一上报，
  // 不应让整个 bootstrap 失败。
  if (owner === null || (typeof owner !== "object" && typeof owner !== "function")) {
    return undefined;
  }
  const callback = createNativeFunction(name, length, implementation);
  Object.defineProperty(owner, name, {
    value: callback,
    writable: true,
    enumerable,
    configurable: true,
  });
  return callback;
}

function defineStaticGetter(owner, name, implementation) {
  if (owner === null || (typeof owner !== "object" && typeof owner !== "function")) {
    return undefined;
  }
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return Reflect.apply(implementation, this, []);
    },
  }, name).get;
  registerNativeGetter(getter, name);
  Object.defineProperty(owner, name, {
    get: getter,
    enumerable: true,
    configurable: true,
  });
  return getter;
}

function reorderOwnProperties(owner, names) {
  const descriptors = names.map(name => [
    name,
    Object.getOwnPropertyDescriptor(owner, name),
  ]);
  descriptors.forEach(([name, descriptor]) => {
    if (descriptor?.configurable) Reflect.deleteProperty(owner, name);
  });
  descriptors.forEach(([name, descriptor]) => {
    if (descriptor?.configurable) {
      Object.defineProperty(owner, name, descriptor);
    }
  });
}

function offlineAvailability() {
  return Promise.resolve(false);
}

function parseCSSNumericValue(input) {
  const source = `${input}`.trim();
  const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu.exec(source);
  if (match === null) {
    throw new SyntaxError(`Failed to parse CSS numeric value: ${source}`);
  }
  const unit = match[2] === "%"
    ? "percent"
    : match[2].toLowerCase() || "number";
  return new globalThis.CSSUnitValue(Number(match[1]), unit);
}

function parseHTMLDocument(input) {
  const result = globalThis.document.implementation.createHTMLDocument("");
  result.body.innerHTML = `${input}`;
  return result;
}

function pointFromValue(value = {}) {
  return [
    Number(value.x ?? 0),
    Number(value.y ?? 0),
    Number(value.z ?? 0),
    Number(value.w ?? 1),
  ];
}

function quadFromRect(rect = {}) {
  const x = Number(rect.x ?? 0);
  const y = Number(rect.y ?? 0);
  const width = Number(rect.width ?? 0);
  const height = Number(rect.height ?? 0);
  return new globalThis.DOMQuad(
    new globalThis.DOMPoint(x, y),
    new globalThis.DOMPoint(x + width, y),
    new globalThis.DOMPoint(x + width, y + height),
    new globalThis.DOMPoint(x, y + height),
  );
}

function quadFromValue(value = {}) {
  return new globalThis.DOMQuad(
    value.p1,
    value.p2,
    value.p3,
    value.p4,
  );
}

function scriptTypeSupported(type) {
  return [
    "classic",
    "module",
    "importmap",
    "speculationrules",
  ].includes(`${type}`.toLowerCase());
}

function iteratorConcat() {
  const iterables = Array.from(arguments);
  return (function* concatIterator() {
    for (const iterable of iterables) yield* iterable;
  }());
}

function responseCapabilities() {
  return Promise.resolve({
    authentication: false,
    userVerification: false,
  });
}

function publicKeyCapabilities() {
  return Promise.resolve({
    conditionalCreate: false,
    conditionalGet: false,
    extensionPrf: false,
    hybridTransport: false,
    passkeyPlatformAuthenticator: false,
    relatedOrigins: false,
    signalAllAcceptedCredentials: true,
    signalCurrentUserDetails: true,
    signalUnknownCredential: true,
    userVerifyingPlatformAuthenticator: false,
  });
}

function resolvedUndefined() {
  return Promise.resolve();
}

function taskSignalAny(signals) {
  const signal = globalThis.AbortSignal.any(signals);
  Object.setPrototypeOf(signal, globalThis.TaskSignal.prototype);
  return signal;
}

function fromBase64(source) {
  const decoded = globalThis.atob(`${source}`);
  return globalThis.Uint8Array.from(
    decoded,
    character => character.charCodeAt(0),
  );
}

function fromHex(source) {
  const value = `${source}`;
  if (value.length % 2 !== 0 || /[^0-9a-f]/iu.test(value)) {
    throw new SyntaxError("Invalid hexadecimal string");
  }
  return globalThis.Uint8Array.from(
    value.match(/../gu) ?? [],
    pair => Number.parseInt(pair, 16),
  );
}

function cssUnit(name, unit = name) {
  return defineStatic(globalThis.CSS, name, 1, function (value) {
    return new globalThis.CSSUnitValue(value, unit);
  });
}

function sumPrecise(values) {
  let sum = 0;
  let correction = 0;
  for (const value of values) {
    const number = Number(value);
    const adjusted = number - correction;
    const next = sum + adjusted;
    correction = (next - sum) - adjusted;
    sum = next;
  }
  return sum;
}

export function installEdgeStaticFunctions() {
  defineStatic(
    globalThis.Credential,
    "isConditionalMediationAvailable",
    0,
    offlineAvailability,
  );
  defineStatic(globalThis.CSSNumericValue, "parse", 1, parseCSSNumericValue);
  defineStatic(
    globalThis.DigitalCredential,
    "userAgentAllowsProtocol",
    1,
    offlineAvailability,
  );
  defineStatic(
    globalThis.Document,
    "parseHTMLUnsafe",
    1,
    parseHTMLDocument,
  );
  defineStatic(globalThis.Document, "parseHTML", 1, parseHTMLDocument);
  defineStatic(
    globalThis.DOMMatrixReadOnly,
    "fromFloat32Array",
    1,
    value => new globalThis.DOMMatrixReadOnly(value),
  );
  defineStatic(
    globalThis.DOMMatrixReadOnly,
    "fromFloat64Array",
    1,
    value => new globalThis.DOMMatrixReadOnly(value),
  );
  defineStatic(
    globalThis.DOMMatrixReadOnly,
    "fromMatrix",
    0,
    value => new globalThis.DOMMatrixReadOnly(value),
  );
  defineStatic(
    globalThis.DOMPoint,
    "fromPoint",
    0,
    value => new globalThis.DOMPoint(...pointFromValue(value)),
  );
  defineStatic(
    globalThis.DOMPointReadOnly,
    "fromPoint",
    0,
    value => new globalThis.DOMPointReadOnly(...pointFromValue(value)),
  );
  defineStatic(globalThis.DOMQuad, "fromQuad", 0, quadFromValue);
  defineStatic(globalThis.DOMQuad, "fromRect", 0, quadFromRect);
  defineStatic(
    globalThis.HTMLScriptElement,
    "supports",
    1,
    scriptTypeSupported,
  );
  defineStatic(
    globalThis.IdentityCredential,
    "disconnect",
    1,
    resolvedUndefined,
  );
  defineStatic(globalThis.Iterator, "concat", 0, iteratorConcat, false);
  defineStaticGetter(
    globalThis.MediaSource,
    "canConstructInDedicatedWorker",
    () => false,
  );
  defineStaticGetter(globalThis.Notification, "maxActions", () => 0);
  defineStatic(
    globalThis.PaymentRequest,
    "getSecurePaymentConfirmationCapabilities",
    0,
    responseCapabilities,
  );
  defineStatic(
    globalThis.PaymentRequest,
    "securePaymentConfirmationAvailability",
    0,
    offlineAvailability,
  );
  defineStaticGetter(
    globalThis.PerformanceObserver,
    "supportedEntryTypes",
    () => Object.freeze([
      "element",
      "event",
      "first-input",
      "largest-contentful-paint",
      "layout-shift",
      "long-animation-frame",
      "longtask",
      "mark",
      "measure",
      "navigation",
      "paint",
      "resource",
      "visibility-state",
    ]),
  );
  defineStaticGetter(
    globalThis.PressureObserver,
    "knownSources",
    () => Object.freeze(["cpu"]),
  );
  defineStatic(
    globalThis.PublicKeyCredential,
    "getClientCapabilities",
    0,
    publicKeyCapabilities,
  );
  defineStatic(
    globalThis.PublicKeyCredential,
    "signalAllAcceptedCredentials",
    1,
    resolvedUndefined,
  );
  defineStatic(
    globalThis.PublicKeyCredential,
    "signalCurrentUserDetails",
    1,
    resolvedUndefined,
  );
  defineStatic(
    globalThis.PublicKeyCredential,
    "signalUnknownCredential",
    1,
    resolvedUndefined,
  );
  defineStatic(globalThis.TaskSignal, "any", 1, taskSignalAny);
  defineStatic(globalThis.Uint8Array, "fromBase64", 1, fromBase64, false);
  defineStatic(globalThis.Uint8Array, "fromHex", 1, fromHex, false);
  cssUnit("cap");
  cssUnit("ch");
  cssUnit("cqb");
  cssUnit("cqh");
  cssUnit("cqi");
  cssUnit("cqmax");
  cssUnit("cqmin");
  cssUnit("cqw");
  cssUnit("dvb");
  cssUnit("dvh");
  cssUnit("dvi");
  cssUnit("dvmax");
  cssUnit("dvmin");
  cssUnit("dvw");
  cssUnit("ex");
  cssUnit("ic");
  cssUnit("lh");
  cssUnit("lvb");
  cssUnit("lvh");
  cssUnit("lvi");
  cssUnit("lvmax");
  cssUnit("lvmin");
  cssUnit("lvw");
  cssUnit("rcap");
  cssUnit("rch");
  cssUnit("rex");
  cssUnit("ric");
  cssUnit("rlh");
  cssUnit("svb");
  cssUnit("svh");
  cssUnit("svi");
  cssUnit("svmax");
  cssUnit("svmin");
  cssUnit("svw");
  cssUnit("vb");
  cssUnit("vi");
  cssUnit("x");
  const paintWorklet = globalThis.CSS.paintWorklet;
  const highlights = globalThis.CSS.highlights;
  defineStaticGetter(globalThis.CSS, "paintWorklet", () => paintWorklet);
  defineStaticGetter(globalThis.CSS, "highlights", () => highlights);
  defineStatic(globalThis.CSS, "registerProperty", 1, () => undefined);
  defineStatic(globalThis.Math, "sumPrecise", 1, sumPrecise, false);
  reorderOwnProperties(globalThis.MediaSource, [
    "canConstructInDedicatedWorker",
    "isTypeSupported",
  ]);
  reorderOwnProperties(globalThis.Notification, [
    "permission",
    "maxActions",
    "requestPermission",
  ]);
  reorderOwnProperties(globalThis.PublicKeyCredential, [
    "getClientCapabilities",
    "isConditionalMediationAvailable",
    "isUserVerifyingPlatformAuthenticatorAvailable",
    "parseCreationOptionsFromJSON",
    "parseRequestOptionsFromJSON",
    "signalAllAcceptedCredentials",
    "signalCurrentUserDetails",
    "signalUnknownCredential",
  ]);
  reorderOwnProperties(globalThis.IDBKeyRange, [
    "bound",
    "lowerBound",
    "only",
    "upperBound",
  ]);
}
