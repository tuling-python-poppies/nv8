import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function ProtectedAudience() {
  throw new TypeError("Illegal constructor");
}
export function IdentityProvider() {
  throw new TypeError("Illegal constructor");
}
export function NavigatorLogin() {
  throw new TypeError("Illegal constructor");
}

export const identityServiceConstructors = Object.freeze([
  ProtectedAudience,
  IdentityProvider,
  NavigatorLogin,
]);
for (const Constructor of identityServiceConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createProtectedAudience() {
  return create(ProtectedAudience, { kind: "audience" });
}

export function createNavigatorLogin() {
  return create(NavigatorLogin, {
    kind: "login",
    status: "logged-out",
  });
}

export function identityServiceOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "audience" && name === "queryFeatureSupport") {
    return Promise.resolve({ supported: true });
  }
  if (record.kind === "login" && name === "setStatus") {
    record.status = `${args[0]}`;
    return Promise.resolve();
  }
  throw new TypeError(`Unsupported identity service operation: ${name}`);
}

export function identityProviderClose() {
  return Promise.resolve();
}

export function identityProviderGetUserInfo() {
  return Promise.resolve([]);
}

export function identityProviderResolve(value) {
  return Promise.resolve(value);
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
