import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { initializeEvent } from "../event/event-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const navServicesSlot = createRealmSlot(() => ({
  batterySingleton: null,
}), "navServices");

function navServicesState() {
  return navServicesSlot.get(globalThis);
}

const state = new WeakMap();

export function NetworkInformation() { illegalConstructor("NetworkInformation", new.target); }
export function BatteryManager() { illegalConstructor("BatteryManager", new.target); }
export function Keyboard() { illegalConstructor("Keyboard", new.target); }
export function KeyboardLayoutMap() { illegalConstructor("KeyboardLayoutMap", new.target); }
export function VirtualKeyboard() { illegalConstructor("VirtualKeyboard", new.target); }
export function WindowControlsOverlay() { illegalConstructor("WindowControlsOverlay", new.target); }
export function DevicePosture() { illegalConstructor("DevicePosture", new.target); }
export function NavigatorManagedData() { illegalConstructor("NavigatorManagedData", new.target); }
export function WindowControlsOverlayGeometryChangeEvent(type, init) {
  initializeGeometryEvent(this, new.target, type, init, {
    kind: "windowControlsOverlayGeometryChangeEvent",
    titlebarAreaRect: init?.titlebarAreaRect ?? createDOMRect(),
    visible: Boolean(init?.visible),
  });
}
export function VirtualKeyboardGeometryChangeEvent(type) {
  initializeGeometryEvent(this, new.target, type, arguments[1], {
    kind: "virtualKeyboardGeometryChangeEvent",
  });
}
export function PluginArray() { illegalConstructor("PluginArray", new.target); }
export function Plugin() { illegalConstructor("Plugin", new.target); }
export function MimeTypeArray() { illegalConstructor("MimeTypeArray", new.target); }
export function MimeType() { illegalConstructor("MimeType", new.target); }
export function BarProp() { illegalConstructor("BarProp", new.target); }
export function External() { illegalConstructor("External", new.target); }

export const navigatorServiceConstructors = Object.freeze([
  NetworkInformation,
  BatteryManager,
  Keyboard,
  KeyboardLayoutMap,
  VirtualKeyboard,
  WindowControlsOverlay,
  DevicePosture,
  NavigatorManagedData,
  WindowControlsOverlayGeometryChangeEvent,
  VirtualKeyboardGeometryChangeEvent,
  PluginArray,
  Plugin,
  MimeTypeArray,
  MimeType,
  BarProp,
  External,
]);
for (const Constructor of navigatorServiceConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createNetworkInformation(profile = null) {
  return createEventService(NetworkInformation, {
    kind: "network",
    effectiveType: `${profile?.effectiveType ?? "4g"}`,
    type: `${profile?.type ?? "wifi"}`,
    rtt: Number(profile?.rtt ?? 50),
    downlink: Number(profile?.downlink ?? 1.75),
    saveData: Boolean(profile?.saveData),
    handlers: new Map([["onchange", null]]),
  });
}

export function createBatteryManager() {
  if (navServicesState().batterySingleton !== null) return navServicesState().batterySingleton;
  navServicesState().batterySingleton = createEventService(BatteryManager, {
    kind: "battery",
    charging: true,
    chargingTime: 0,
    dischargingTime: Infinity,
    level: 1,
    handlers: new Map([
      ["onchargingchange", null],
      ["onchargingtimechange", null],
      ["ondischargingtimechange", null],
      ["onlevelchange", null],
    ]),
  });
  return navServicesState().batterySingleton;
}

export function createKeyboard() {
  const layoutMap = Object.create(KeyboardLayoutMap.prototype);
  state.set(layoutMap, {
    kind: "layoutMap",
    values: new Map([
      ["KeyA", "a"], ["KeyB", "b"], ["KeyC", "c"],
      ["Digit1", "1"], ["Space", " "], ["Enter", "\r"],
    ]),
  });
  const value = Object.create(Keyboard.prototype);
  state.set(value, {
    kind: "keyboard",
    layoutMap,
    lockedKeys: [],
  });
  return value;
}

export function createVirtualKeyboard() {
  return createEventService(VirtualKeyboard, {
    kind: "virtualKeyboard",
    boundingRect: createDOMRect(),
    overlaysContent: false,
    visible: false,
    handlers: new Map([["ongeometrychange", null]]),
  });
}

export function createWindowControlsOverlay() {
  return createEventService(WindowControlsOverlay, {
    kind: "windowControlsOverlay",
    visible: false,
    titlebarAreaRect: createDOMRect(),
    handlers: new Map([["ongeometrychange", null]]),
  });
}

export function createDevicePosture() {
  return createEventService(DevicePosture, {
    kind: "devicePosture",
    type: "continuous",
    handlers: new Map([["onchange", null]]),
  });
}

export function createNavigatorManagedData() {
  return createEventService(NavigatorManagedData, {
    kind: "managed",
    handlers: new Map([["onmanagedconfigurationchange", null]]),
  });
}

export function createLegacyCollections(
  pluginProfile = [],
  mimeTypeProfile = [],
) {
  const pluginValues = [];
  const mimeTypeValues = [];
  const pluginsByName = new Map();

  for (const entry of pluginProfile) {
    const plugin = Object.create(Plugin.prototype);
    const pluginRecord = {
      kind: "plugin",
      name: `${entry.name ?? ""}`,
      filename: `${entry.filename ?? ""}`,
      description: `${entry.description ?? ""}`,
      values: [],
    };
    state.set(plugin, pluginRecord);
    pluginValues.push(plugin);
    if (pluginRecord.name !== "") pluginsByName.set(pluginRecord.name, plugin);
    for (const mimeEntry of entry.mimeTypes ?? []) {
      const mimeType = createMimeTypeValue(mimeEntry, plugin);
      pluginRecord.values.push(mimeType);
      mimeTypeValues.push(mimeType);
    }
  }

  for (const entry of mimeTypeProfile) {
    const mimeType = createMimeTypeValue(
      entry,
      pluginsByName.get(`${entry.pluginName ?? ""}`) ?? null,
    );
    mimeTypeValues.push(mimeType);
  }

  for (const plugin of pluginValues) {
    const record = state.get(plugin);
    record.values = Object.freeze(record.values);
  }
  return {
    plugins: createLegacyCollection(PluginArray, "pluginArray", pluginValues),
    mimeTypes: createLegacyCollection(
      MimeTypeArray,
      "mimeTypeArray",
      mimeTypeValues,
    ),
  };
}

export function createPluginArray(profile = []) {
  return createLegacyCollections(profile, []).plugins;
}

export function createMimeTypeArray(profile = []) {
  return createLegacyCollections([], profile).mimeTypes;
}

export function createBarProp() {
  const value = Object.create(BarProp.prototype);
  state.set(value, { kind: "barProp", visible: true });
  return value;
}

export function createExternal() {
  const value = Object.create(External.prototype);
  state.set(value, { kind: "external" });
  return value;
}

export function navigatorServiceProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "layoutMap" && name === "size") {
    return record.values.size;
  }
  if (["pluginArray", "plugin", "mimeTypeArray"].includes(record.kind)
      && name === "length") {
    return record.values.length;
  }
  return record[name];
}

export function setNavigatorServiceProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  } else if (record.kind === "virtualKeyboard" && name === "overlaysContent") {
    record.overlaysContent = Boolean(input);
  }
}

export function navigatorServiceOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "keyboard") {
    if (name === "getLayoutMap") return Promise.resolve(record.layoutMap);
    if (name === "lock") {
      const keys = args[0] === undefined ? [] : [...args[0]].map(String);
      record.lockedKeys = keys;
      return Promise.resolve();
    }
    if (name === "unlock") {
      record.lockedKeys = [];
      return undefined;
    }
  }
  if (record.kind === "layoutMap") {
    return layoutMapOperation(record, value, name, args);
  }
  if (["pluginArray", "plugin", "mimeTypeArray"].includes(record.kind)) {
    if (name === "item") return record.values[toIndex(args[0])] ?? null;
    if (name === "namedItem") {
      const key = `${args[0]}`;
      return record.values.find(item => {
        const itemRecord = state.get(item);
        return itemRecord?.name === key || itemRecord?.type === key;
      }) ?? null;
    }
    if (record.kind === "pluginArray" && name === "refresh") return undefined;
  }
  if (record.kind === "virtualKeyboard") {
    if (name === "show") record.visible = true;
    if (name === "hide") record.visible = false;
    return undefined;
  }
  if (record.kind === "windowControlsOverlay"
      && name === "getTitlebarAreaRect") {
    return record.titlebarAreaRect;
  }
  if (record.kind === "managed" && name === "getManagedConfiguration") {
    if (!Array.isArray(args[0])) {
      return Promise.reject(new TypeError("Keys must be a sequence"));
    }
    return Promise.resolve(Object.freeze({}));
  }
  if (record.kind === "external") {
    if (name === "AddSearchProvider") return undefined;
    if (name === "IsSearchProviderInstalled") return 0;
  }
  throw new TypeError(`Unsupported navigator service operation: ${name}`);
}

export function navigatorServiceIterator(value) {
  const record = requireRecord(value);
  if (record.kind === "layoutMap") return record.values.entries();
  if (["pluginArray", "plugin", "mimeTypeArray"].includes(record.kind)) {
    return record.values.values();
  }
  throw new TypeError("Illegal invocation");
}

function layoutMapOperation(record, object, name, args) {
  if (name === "entries") return record.values.entries();
  if (name === "keys") return record.values.keys();
  if (name === "values") return record.values.values();
  if (name === "get") return record.values.get(`${args[0]}`);
  if (name === "has") return record.values.has(`${args[0]}`);
  if (name === "forEach") {
    if (typeof args[0] !== "function") throw new TypeError("Callback required");
    record.values.forEach((item, key) => {
      Reflect.apply(args[0], args[1], [item, key, object]);
    });
    return undefined;
  }
  throw new TypeError(`Unsupported KeyboardLayoutMap operation: ${name}`);
}

function createEventService(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  initializeEventTarget(value);
  state.set(value, record);
  return value;
}

function createMimeTypeValue(entry, enabledPlugin) {
  const value = Object.create(MimeType.prototype);
  state.set(value, {
    kind: "mimeType",
    type: `${entry.type ?? ""}`,
    suffixes: `${entry.suffixes ?? ""}`,
    description: `${entry.description ?? ""}`,
    enabledPlugin,
  });
  return value;
}

function createLegacyCollection(Constructor, kind, values = []) {
  const value = Object.create(Constructor.prototype);
  const frozenValues = Object.freeze([...values]);
  state.set(value, { kind, values: frozenValues });
  frozenValues.forEach((item, index) => {
    Object.defineProperty(value, `${index}`, {
      value: item,
      writable: false,
      enumerable: true,
      configurable: true,
    });
    const record = state.get(item);
    const name = kind === "pluginArray" ? record?.name : record?.type;
    if (name !== undefined && name !== "") {
      Object.defineProperty(value, name, {
        value: item,
        writable: false,
        enumerable: true,
        configurable: true,
      });
    }
  });
  return value;
}

function toIndex(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.trunc(number) : 0;
}

function initializeGeometryEvent(value, newTarget, type, init, record) {
  if (newTarget === undefined) throw new TypeError("Event constructor requires new");
  if (arguments.length < 3 || type === undefined) {
    throw new TypeError("Event type is required");
  }
  const options = init ?? {};
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(options.bubbles),
    cancelable: Boolean(options.cancelable),
    composed: Boolean(options.composed),
  });
  state.set(value, record);
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
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
