import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// 凭据存储、容器单例和 PaymentRequest 序号原先是模块级状态，会跨 Realm
// 泄漏凭据并共享支付请求标识。
const credentialPaymentSlot = createRealmSlot(() => ({
  credentialsSingleton: null,
  storedCredentials: new Map(),
  nextPaymentId: 0,
}), "credential-payment-runtime");

function credentialPaymentState() {
  return credentialPaymentSlot.get(globalThis);
}

export function Credential() { illegalConstructor("Credential", new.target); }
export function CredentialsContainer() { illegalConstructor("CredentialsContainer", new.target); }
export function FederatedCredential(data) {
  requireNew(new.target, "FederatedCredential");
  requireObject(data, "FederatedCredential");
  initializeCredential(this, "federatedCredential", data.id, "federated", {
    provider: `${data.provider}`,
    protocol: data.protocol === undefined ? null : `${data.protocol}`,
    name: `${data.name ?? ""}`,
    iconURL: `${data.iconURL ?? ""}`,
  });
}
export function PasswordCredential(data) {
  requireNew(new.target, "PasswordCredential");
  if (typeof HTMLFormElement === "function" && data instanceof HTMLFormElement) {
    const id = data.elements.namedItem("username")?.value ?? "";
    const password = data.elements.namedItem("password")?.value ?? "";
    initializeCredential(this, "passwordCredential", id, "password", {
      password: `${password}`,
      name: "",
      iconURL: "",
    });
    return;
  }
  requireObject(data, "PasswordCredential");
  initializeCredential(this, "passwordCredential", data.id, "password", {
    password: `${data.password}`,
    name: `${data.name ?? ""}`,
    iconURL: `${data.iconURL ?? ""}`,
  });
}
export function AuthenticatorAssertionResponse() { illegalConstructor("AuthenticatorAssertionResponse", new.target); }
export function AuthenticatorAttestationResponse() { illegalConstructor("AuthenticatorAttestationResponse", new.target); }
export function AuthenticatorResponse() { illegalConstructor("AuthenticatorResponse", new.target); }
export function PublicKeyCredential() { illegalConstructor("PublicKeyCredential", new.target); }
export function DigitalCredential() { illegalConstructor("DigitalCredential", new.target); }
export function IdentityCredential() { illegalConstructor("IdentityCredential", new.target); }
export function IdentityCredentialError() { illegalConstructor("IdentityCredentialError", new.target); }
export function OTPCredential() { illegalConstructor("OTPCredential", new.target); }
export function PaymentAddress() { illegalConstructor("PaymentAddress", new.target); }
export function PaymentRequest(methodData) {
  requireNew(new.target, "PaymentRequest");
  const details = arguments[1];
  if (!Array.isArray(methodData) || details === null || typeof details !== "object") {
    throw new TypeError("PaymentRequest requires method data and details");
  }
  initializeEventTarget(this);
  credentialPaymentState().nextPaymentId += 1;
  const options = arguments[2] ?? {};
  state.set(this, {
    kind: "paymentRequest",
    object: this,
    id: `edge-payment-${credentialPaymentState().nextPaymentId}`,
    methodData: clone(methodData),
    details: clone(details),
    options: clone(options),
    shippingAddress: null,
    shippingOption: details.shippingOptions?.find(option => option.selected)?.id ?? null,
    shippingType: options.shippingType ?? null,
    handlers: handlers([
      "onshippingaddresschange",
      "onshippingoptionchange",
      "onpaymentmethodchange",
    ]),
    state: "created",
  });
}
export function PaymentRequestUpdateEvent(type) {
  const init = arguments[1] ?? {};
  initializePaymentEvent(this, type, init, "paymentUpdateEvent", {
    updatePromise: null,
  });
}
export function PaymentResponse() { illegalConstructor("PaymentResponse", new.target); }
export function PaymentManager() { illegalConstructor("PaymentManager", new.target); }
export function PaymentMethodChangeEvent(type) {
  const init = arguments[1] ?? {};
  initializePaymentEvent(this, type, init, "paymentMethodChangeEvent", {
    updatePromise: null,
    methodName: `${init.methodName ?? ""}`,
    methodDetails: clone(init.methodDetails ?? null),
  });
}

export const credentialPaymentConstructors = Object.freeze([
  Credential, CredentialsContainer, FederatedCredential, PasswordCredential,
  AuthenticatorAssertionResponse, AuthenticatorAttestationResponse,
  AuthenticatorResponse, PublicKeyCredential, DigitalCredential,
  IdentityCredential, IdentityCredentialError, OTPCredential, PaymentAddress,
  PaymentRequest, PaymentRequestUpdateEvent, PaymentResponse, PaymentManager,
  PaymentMethodChangeEvent,
]);
for (const constructor of credentialPaymentConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createCredentialsContainer() {
  if (credentialPaymentState().credentialsSingleton !== null) return credentialPaymentState().credentialsSingleton;
  credentialPaymentState().credentialsSingleton = Object.create(CredentialsContainer.prototype);
  state.set(credentialPaymentState().credentialsSingleton, {
    kind: "credentialsContainer",
    silentAccessPrevented: false,
  });
  return credentialPaymentState().credentialsSingleton;
}

export function credentialPaymentProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setCredentialPaymentProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "paymentManager" && name === "userHint") {
    record.userHint = `${input}`;
  }
}

export function credentialPaymentOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "credentialsContainer") {
    return credentialsOperation(record, name, args);
  }
  if (record.kind === "publicKeyCredential") {
    if (name === "getClientExtensionResults") return clone(record.extensions);
    if (name === "toJSON") return publicKeyJSON(record);
  }
  if (record.kind === "paymentRequest") return paymentRequestOperation(record, name);
  if (
    ["paymentUpdateEvent", "paymentMethodChangeEvent"].includes(record.kind)
    && name === "updateWith"
  ) {
    record.updatePromise = Promise.resolve(args[0]);
    return;
  }
  if (record.kind === "paymentResponse") {
    if (name === "toJSON") return paymentResponseJSON(record);
    if (name === "complete") {
      record.complete = true;
      return Promise.resolve();
    }
    if (name === "retry") {
      record.complete = false;
      return Promise.resolve();
    }
  }
  if (record.kind === "paymentManager" && name === "enableDelegations") {
    record.delegations = Object.freeze([...args[0]]);
    return Promise.resolve();
  }
  throw new TypeError(`Unsupported credential/payment operation: ${name}`);
}

export function publicKeyAvailability() {
  return Promise.resolve(false);
}

export function parsePublicKeyOptions(value) {
  requireObject(value, "PublicKeyCredential options");
  return clone(value);
}

function credentialsOperation(record, name, args) {
  if (name === "preventSilentAccess") {
    record.silentAccessPrevented = true;
    return Promise.resolve();
  }
  if (name === "store") {
    const credential = args[0];
    const item = requireRecord(credential);
    if (!item.type || !item.id) {
      return Promise.reject(new TypeError("Expected a storable Credential"));
    }
    credentialPaymentState().storedCredentials.set(`${item.type}:${item.id}`, credential);
    record.silentAccessPrevented = false;
    return Promise.resolve(credential);
  }
  const options = args[0] ?? {};
  if (name === "create") {
    if (options.password !== undefined) {
      return Promise.resolve(new PasswordCredential(options.password));
    }
    if (options.federated !== undefined) {
      return Promise.resolve(new FederatedCredential(options.federated));
    }
    return Promise.resolve(null);
  }
  if (name === "get") {
    if (record.silentAccessPrevented && options.mediation === "silent") {
      return Promise.resolve(null);
    }
    const types = [];
    if (options.password) types.push("password");
    if (options.federated) types.push("federated");
    for (const credential of credentialPaymentState().storedCredentials.values()) {
      if (types.length === 0 || types.includes(requireRecord(credential).type)) {
        return Promise.resolve(credential);
      }
    }
    return Promise.resolve(null);
  }
}

function paymentRequestOperation(record, name) {
  if (name === "canMakePayment" || name === "hasEnrolledInstrument") {
    return Promise.resolve(false);
  }
  if (name === "show") {
    record.state = "closed";
    return Promise.reject(new DOMException(
      "No payment handler is installed in the offline sandbox.",
      "NotSupportedError",
    ));
  }
  if (name === "abort") {
    if (record.state !== "interactive") {
      return Promise.reject(new DOMException(
        "The payment request is not interactive.",
        "InvalidStateError",
      ));
    }
    record.state = "closed";
    return Promise.resolve();
  }
}

function initializeCredential(value, kind, id, type, fields) {
  state.set(value, {
    kind,
    id: `${id}`,
    type,
    ...fields,
  });
}

function initializePaymentEvent(value, type, init, kind, fields) {
  if (value === undefined) throw new TypeError("Constructor requires new");
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, { kind, ...fields });
}

function publicKeyJSON(record) {
  return {
    id: record.id,
    rawId: arrayBufferToBase64(record.rawId),
    response: record.response,
    authenticatorAttachment: record.authenticatorAttachment,
    clientExtensionResults: clone(record.extensions),
    type: record.type,
  };
}

function paymentResponseJSON(record) {
  return {
    requestId: record.requestId,
    methodName: record.methodName,
    details: clone(record.details),
    shippingAddress: record.shippingAddress,
    shippingOption: record.shippingOption,
    payerName: record.payerName,
    payerEmail: record.payerEmail,
    payerPhone: record.payerPhone,
  };
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
}

function handlers(names) {
  return new Map(names.map(name => [name, null]));
}

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function requireObject(value, name) {
  if (value === null || typeof value !== "object") {
    throw new TypeError(`${name} requires an object`);
  }
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use the new operator`);
  }
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
