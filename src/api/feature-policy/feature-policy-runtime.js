import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakSet();
const featureNames = Object.freeze([
  "geolocation",
  "ch-ua-full-version-list",
  "cross-origin-isolated",
  "screen-wake-lock",
  "on-device-speech-recognition",
  "translator",
  "publickey-credentials-get",
  "shared-storage-select-url",
  "ch-ua-arch",
  "bluetooth",
  "compute-pressure",
  "ch-prefers-reduced-transparency",
  "deferred-fetch",
  "usb",
  "ch-save-data",
  "publickey-credentials-create",
  "shared-storage",
  "deferred-fetch-minimal",
  "run-ad-auction",
  "ch-downlink",
  "ch-ua-form-factors",
  "otp-credentials",
  "payment",
  "ch-ua",
  "ch-ua-model",
  "ch-ect",
  "autoplay",
  "camera",
  "language-detector",
  "private-state-token-issuance",
  "digital-credentials-get",
  "accelerometer",
  "ch-ua-platform-version",
  "idle-detection",
  "private-aggregation",
  "interest-cohort",
  "ch-viewport-height",
  "captured-surface-control",
  "local-fonts",
  "ch-ua-platform",
  "midi",
  "ch-ua-full-version",
  "xr-spatial-tracking",
  "clipboard-read",
  "gamepad",
  "display-capture",
  "keyboard-map",
  "join-ad-interest-group",
  "aria-notify",
  "local-network",
  "ch-ua-high-entropy-values",
  "ch-width",
  "ch-prefers-reduced-motion",
  "browsing-topics",
  "encrypted-media",
  "local-network-access",
  "gyroscope",
  "serial",
  "ch-rtt",
  "ch-ua-mobile",
  "window-management",
  "unload",
  "ch-dpr",
  "ch-prefers-color-scheme",
  "ch-ua-wow64",
  "attribution-reporting",
  "fullscreen",
  "identity-credentials-get",
  "private-state-token-redemption",
  "hid",
  "summarizer",
  "ch-ua-bitness",
  "storage-access",
  "sync-xhr",
  "ch-device-memory",
  "ch-viewport-width",
  "picture-in-picture",
  "loopback-network",
  "magnetometer",
  "clipboard-write",
  "microphone",
]);

export function FeaturePolicy() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(FeaturePolicy, "FeaturePolicy");

export function createFeaturePolicy() {
  const value = Object.create(FeaturePolicy.prototype);
  state.add(value);
  return value;
}

export function featurePolicyOperation(value, name, args) {
  if (!state.has(value)) throw new TypeError("Illegal invocation");
  if (name === "allowedFeatures" || name === "features") {
    return [...featureNames];
  }
  if (name === "allowsFeature") {
    return featureNames.includes(`${args[0]}`);
  }
  if (name === "getAllowlistForFeature") return [];
  throw new TypeError("Illegal invocation");
}
