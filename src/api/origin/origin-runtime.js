import { currentOrigin } from "../../navigation/navigation-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function Origin() {
  if (new.target === undefined) {
    throw new TypeError("Origin must be constructed with new");
  }
  state.set(
    this,
    arguments.length === 0 ? opaqueRecord() : parse(`${arguments[0]}`),
  );
}
registerNativeFunction(Origin, "Origin");

export function originFrom(value) {
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'from' on 'Origin': "
        + "1 argument required, but only 0 present.",
    );
  }
  const existing = state.get(value);
  return createOrigin(existing === undefined ? parse(`${value}`) : existing);
}
Object.defineProperty(originFrom, "name", {
  value: "from",
  configurable: true,
});
registerNativeFunction(originFrom, "from");

export function currentGlobalOrigin() {
  return currentOrigin();
}

export function originProperty(value, name) {
  const record = requireRecord(value);
  if (name !== "opaque") throw new TypeError("Illegal invocation");
  return record.opaque;
}

export function originOperation(value, name, args) {
  const record = requireRecord(value);
  const other = state.get(args[0]);
  if (other === undefined) {
    throw new TypeError(`${name} requires an Origin`);
  }
  if (record.opaque || other.opaque) return false;
  if (name === "isSameOrigin") {
    return record.scheme === other.scheme
      && record.host === other.host
      && record.port === other.port;
  }
  if (name === "isSameSite") return site(record.host) === site(other.host);
  throw new TypeError("Illegal invocation");
}

function createOrigin(record) {
  const value = Object.create(Origin.prototype);
  state.set(value, { ...record });
  return value;
}

function parse(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return opaqueRecord();
  }
  const scheme = url.protocol.replace(/:$/u, "").toLowerCase();
  const host = url.hostname.toLowerCase();
  if (host === "" || ["data", "about", "javascript"].includes(scheme)) {
    return opaqueRecord();
  }
  const port = url.port === ""
    ? knownDefaultPort(scheme)
    : Number(url.port);
  return { scheme, host, port, opaque: false };
}

function opaqueRecord() {
  return { scheme: "", host: "", port: null, opaque: true };
}

function knownDefaultPort(scheme) {
  if (scheme === "http") return 80;
  if (scheme === "https") return 443;
  return null;
}

function site(host) {
  const parts = host.split(".");
  return parts.length < 2 ? host : parts.slice(-2).join(".");
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
