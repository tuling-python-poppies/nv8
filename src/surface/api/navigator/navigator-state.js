import { Navigator } from "./navigator-constructor.js";
import { createNavigatorUAData } from "./navigator-ua-data-state.js";
import {
  createServiceWorkerContainer,
} from "../worker/service-worker-runtime.js";
import { createGPU } from "../gpu/gpu-runtime.js";
import { createXRSystem } from "../xr/xr-core-runtime.js";
import {
  createClipboard,
  createPermissions,
} from "../user-agency/user-agency-runtime.js";
import { createGeolocation } from "../device/device-runtime.js";
import {
  createExternalDeviceManager,
} from "../external-device/external-device-runtime.js";
import {
  createStorageBucketManager,
  createStorageManager,
} from "../file-system/file-system-runtime.js";
import {
  createCredentialsContainer,
} from "../credential-payment/credential-payment-runtime.js";
import {
  createMediaCapabilities,
  createMediaDevices,
  createMediaSession,
} from "../media-agency/media-agency-runtime.js";
import {
  createLockManager,
  createWakeLock,
} from "../coordination/coordination-runtime.js";
import {
  createScheduling,
  createUserActivation,
} from "../scheduling/scheduling-runtime.js";
import {
  createBatteryManager,
  createDevicePosture,
  createKeyboard,
  createNavigatorManagedData,
  createNetworkInformation,
  createLegacyCollections,
  createVirtualKeyboard,
  createWindowControlsOverlay,
} from "../navigator-services/navigator-services-runtime.js";
import { createInk } from "../user-interaction/user-interaction-runtime.js";
import {
  createNavigatorLogin,
  createProtectedAudience,
} from "../identity-services/identity-services-runtime.js";
import { createMIDIAccess } from "../midi/midi-runtime.js";
import { createPresentation } from "../presentation/presentation-runtime.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const navigatorState = new WeakSet();

// profile/capabilities/singleton/services/vibrationPattern 原先是模块级状态，
// 会让多个 Realm 共享同一个 Navigator 实例和指纹 profile。
const navigatorSlot = createRealmSlot(() => ({
  profile: null,
  capabilities: null,
  singleton: null,
  services: null,
  vibrationPattern: [],
}), "navigator-state");

function navigatorRealmState() {
  return navigatorSlot.get(globalThis);
}

export function configureNavigatorProfile(
  userAgent,
  platform,
  encodedLanguages,
  language,
  hardwareConcurrency,
  deviceMemory,
  capabilityProfile = null,
  navigatorMetadata = null,
) {
  const state = navigatorRealmState();
  const languages = decodeStringList(encodedLanguages);
  const metadata = navigatorMetadata ?? {};
  const userAgentData = metadata.userAgentData ?? {};
  state.capabilities = capabilityProfile;
  state.profile = Object.freeze({
    vendorSub: metadata.vendorSub ?? "",
    productSub: metadata.productSub ?? "20030107",
    vendor: metadata.vendor ?? "Google Inc.",
    maxTouchPoints: metadata.maxTouchPoints ?? 0,
    doNotTrack: metadata.doNotTrack ?? null,
    hardwareConcurrency,
    cookieEnabled: metadata.cookieEnabled ?? true,
    appCodeName: metadata.appCodeName ?? "Mozilla",
    appName: metadata.appName ?? "Netscape",
    appVersion: metadata.appVersion ?? (userAgent.startsWith("Mozilla/")
      ? userAgent.slice("Mozilla/".length)
      : userAgent),
    platform,
    product: metadata.product ?? "Gecko",
    userAgent,
    language,
    languages: Object.freeze(languages),
    onLine: capabilityProfile?.network?.online ?? true,
    webdriver: metadata.webdriver ?? false,
    pdfViewerEnabled: metadata.pdfViewerEnabled ?? true,
    deviceMemory,
    cpuPerformance: metadata.cpuPerformance ?? 4,
    userAgentData: Object.freeze({
      architecture: userAgentData.architecture ?? "x86",
      bitness: userAgentData.bitness ?? "64",
      model: userAgentData.model ?? "",
      platformVersion: userAgentData.platformVersion ?? "19.0.0",
      wow64: userAgentData.wow64 ?? false,
      formFactors: Object.freeze([...(userAgentData.formFactors ?? ["Desktop"])]),
      mobile: userAgentData.mobile ?? false,
    }),
    plugins: Object.freeze([...(metadata.plugins ?? [])]),
    mimeTypes: Object.freeze([...(metadata.mimeTypes ?? [])]),
  });
  state.singleton = null;
  state.services = null;
  state.vibrationPattern = [];
}

export function createNavigator() {
  const state = navigatorRealmState();
  if (state.singleton !== null) {
    return state.singleton;
  }
  if (state.profile === null) {
    throw new Error("Navigator profile was not configured");
  }
  const value = Object.create(Navigator.prototype);
  navigatorState.add(value);
  state.singleton = value;
  state.services = createServices();
  return value;
}

export function requireNavigator(value) {
  if (!navigatorState.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}

export function navigatorField(value, name) {
  requireNavigator(value);
  return navigatorRealmState().profile[name];
}

export function navigatorService(value, name) {
  requireNavigator(value);
  return navigatorRealmState().services[name];
}

export function navigatorProfile() {
  return navigatorRealmState().profile;
}

export function setVibrationPattern(value, pattern) {
  requireNavigator(value);
  navigatorRealmState().vibrationPattern = pattern;
}

export function currentVibrationPattern() {
  return navigatorRealmState().vibrationPattern.slice();
}

function createServices() {
  const { profile, capabilities } = navigatorRealmState();
  const legacy = createLegacyCollections(profile.plugins, profile.mimeTypes);
  return Object.freeze({
    scheduling: createScheduling(),
    userActivation: createUserActivation(),
    geolocation: createGeolocation(),
    webkitTemporaryStorage: taggedService("DeprecatedStorageQuota"),
    webkitPersistentStorage: taggedService("DeprecatedStorageQuota"),
    windowControlsOverlay: createWindowControlsOverlay(),
    plugins: legacy.plugins,
    mimeTypes: legacy.mimeTypes,
    connection: createNetworkInformation(capabilities?.network),
    protectedAudience: createProtectedAudience(),
    bluetooth: createExternalDeviceManager(
      "bluetooth",
      capabilities?.externalDevices?.bluetooth,
    ),
    clipboard: createClipboard(),
    credentials: createCredentialsContainer(),
    keyboard: createKeyboard(),
    managed: createNavigatorManagedData(),
    mediaDevices: createMediaDevices(capabilities?.media),
    serviceWorker: createServiceWorkerContainer(),
    virtualKeyboard: createVirtualKeyboard(),
    wakeLock: createWakeLock(),
    userAgentData: createNavigatorUAData(),
    locks: createLockManager(),
    storage: createStorageManager(),
    gpu: createGPU(),
    login: createNavigatorLogin(),
    ink: createInk(),
    mediaCapabilities: createMediaCapabilities(capabilities?.media),
    permissions: createPermissions(),
    devicePosture: createDevicePosture(),
    hid: createExternalDeviceManager(
      "hid",
      capabilities?.externalDevices?.hid,
    ),
    mediaSession: createMediaSession(),
    presentation: createPresentation(),
    serial: createExternalDeviceManager(
      "serial",
      capabilities?.externalDevices?.serial,
    ),
    usb: createExternalDeviceManager(
      "usb",
      capabilities?.externalDevices?.usb,
    ),
    xr: createXRSystem(),
    storageBuckets: createStorageBucketManager(),
    battery: createBatteryManager(),
    midiAccess: createMIDIAccess(),
  });
}

function taggedService(tag) {
  const value = {};
  Object.defineProperty(value, Symbol.toStringTag, {
    value: tag,
    configurable: true,
  });
  return value;
}

function userActivationService() {
  const value = {
    hasBeenActive: false,
    isActive: false,
  };
  Object.defineProperty(value, Symbol.toStringTag, {
    value: "UserActivation",
    configurable: true,
  });
  return Object.freeze(value);
}

function decodeStringList(value) {
  const output = [];
  let offset = 0;
  while (offset < value.length) {
    const separator = value.indexOf(":", offset);
    if (separator === -1) {
      throw new TypeError("Invalid encoded language list");
    }
    const length = Number(value.slice(offset, separator));
    const start = separator + 1;
    const end = start + length;
    if (!Number.isSafeInteger(length) || length < 0 || end > value.length) {
      throw new TypeError("Invalid encoded language list");
    }
    output.push(value.slice(start, end));
    offset = end;
  }
  return output;
}
