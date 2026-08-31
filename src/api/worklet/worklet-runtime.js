import { registerNativeFunction } from "../../webidl/native-function.js";

const workletState = new WeakMap();
let workletFactory = null;
let workletBaseUrl = "https://sandbox.test/";
let nextWorkletId = 1;

export function configureWorklets(factory, baseUrl) {
  workletFactory = typeof factory === "function" ? factory : null;
  workletBaseUrl = `${baseUrl}`;
  nextWorkletId = 1;
}

export function Worklet() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(Worklet, "Worklet");

export function AudioWorklet() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(AudioWorklet, "AudioWorklet");

export function createWorklet(kind = "paint") {
  const prototype = kind === "audio"
    ? AudioWorklet.prototype
    : Worklet.prototype;
  const worklet = Object.create(prototype);
  workletState.set(worklet, {
    id: nextWorkletId,
    kind: `${kind}`,
    modules: new Set(),
  });
  nextWorkletId += 1;
  return worklet;
}

export async function workletAddModule(worklet, moduleURL, options) {
  const record = requireWorklet(worklet);
  if (workletFactory === null) {
    throw new DOMException("Worklets are unavailable.", "NotSupportedError");
  }
  const credentials = `${options?.credentials ?? "same-origin"}`;
  if (!["omit", "same-origin", "include"].includes(credentials)) {
    throw new TypeError("The provided value is not a valid RequestCredentials.");
  }
  const url = resolveWorkletUrl(moduleURL);
  if (record.modules.has(url)) return;
  await workletFactory({
    owner: globalThis,
    creatorOrigin: new URL(workletBaseUrl).origin,
    id: record.id,
    kind: record.kind,
    url,
    credentials,
  });
  record.modules.add(url);
}

function resolveWorkletUrl(value) {
  const source = `${value}`;
  if (source.startsWith("data:")) return source;
  let parsed;
  try {
    parsed = new URL(source, workletBaseUrl);
  } catch {
    throw new DOMException("The worklet module URL is invalid.", "SyntaxError");
  }
  const owner = new URL(workletBaseUrl);
  if (parsed.origin !== owner.origin) {
    throw new DOMException(
      "The worklet module must use the creator's origin.",
      "SecurityError",
    );
  }
  return parsed.href;
}

function requireWorklet(value) {
  const record = workletState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
