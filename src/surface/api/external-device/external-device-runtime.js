import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const externalDeviceSlot = createRealmSlot(() => ({
  singletons: new Map(),
}), "externalDevice");

function externalDeviceState() {
  return externalDeviceSlot.get(globalThis);
}

export function Bluetooth() { illegalConstructor("Bluetooth", new.target); }
export function BluetoothCharacteristicProperties() { illegalConstructor("BluetoothCharacteristicProperties", new.target); }
export function BluetoothDevice() { illegalConstructor("BluetoothDevice", new.target); }
export function BluetoothRemoteGATTCharacteristic() { illegalConstructor("BluetoothRemoteGATTCharacteristic", new.target); }
export function BluetoothRemoteGATTDescriptor() { illegalConstructor("BluetoothRemoteGATTDescriptor", new.target); }
export function BluetoothRemoteGATTServer() { illegalConstructor("BluetoothRemoteGATTServer", new.target); }
export function BluetoothRemoteGATTService() { illegalConstructor("BluetoothRemoteGATTService", new.target); }
export function HID() { illegalConstructor("HID", new.target); }
export function HIDConnectionEvent(type, init) {
  initializeConnectionEvent(this, type, init, "hidConnectionEvent");
}
export function HIDDevice() { illegalConstructor("HIDDevice", new.target); }
export function HIDInputReportEvent() {
  const type = arguments[0];
  const init = arguments[1] ?? {};
  initializeExternalEvent(this, type, init, "hidInputReportEvent", {
    device: init.device ?? null,
    reportId: Number(init.reportId ?? 0),
    data: init.data instanceof DataView
      ? init.data
      : new DataView(new ArrayBuffer(0)),
  });
}
export function Serial() { illegalConstructor("Serial", new.target); }
export function SerialPort() { illegalConstructor("SerialPort", new.target); }
export function USB() { illegalConstructor("USB", new.target); }
export function USBAlternateInterface(device, alternateSetting) {
  void device;
  void alternateSetting;
  illegalConstructor(undefined, new.target);
}
export function USBConfiguration(device, configurationValue) {
  void device;
  void configurationValue;
  illegalConstructor(undefined, new.target);
}
export function USBConnectionEvent(type, init) {
  initializeConnectionEvent(this, type, init, "usbConnectionEvent");
}
export function USBDevice() { illegalConstructor("USBDevice", new.target); }
export function USBEndpoint(device, endpointNumber, direction) {
  void device;
  void endpointNumber;
  void direction;
  illegalConstructor(undefined, new.target);
}
export function USBInTransferResult(status) {
  void status;
  illegalConstructor(undefined, new.target);
}
export function USBInterface(device, interfaceNumber) {
  void device;
  void interfaceNumber;
  illegalConstructor(undefined, new.target);
}
export function USBIsochronousInTransferPacket(status) {
  void status;
  illegalConstructor(undefined, new.target);
}
export function USBIsochronousInTransferResult(packets) {
  void packets;
  illegalConstructor(undefined, new.target);
}
export function USBIsochronousOutTransferPacket(status) {
  void status;
  illegalConstructor(undefined, new.target);
}
export function USBIsochronousOutTransferResult(packets) {
  void packets;
  illegalConstructor(undefined, new.target);
}
export function USBOutTransferResult(status) {
  void status;
  illegalConstructor(undefined, new.target);
}
export function BluetoothUUID() { illegalConstructor("BluetoothUUID", new.target); }

export const externalDeviceConstructors = Object.freeze([
  Bluetooth, BluetoothCharacteristicProperties, BluetoothDevice,
  BluetoothRemoteGATTCharacteristic, BluetoothRemoteGATTDescriptor,
  BluetoothRemoteGATTServer, BluetoothRemoteGATTService, HID,
  HIDConnectionEvent, HIDDevice, HIDInputReportEvent, Serial, SerialPort, USB,
  USBAlternateInterface, USBConfiguration, USBConnectionEvent, USBDevice,
  USBEndpoint, USBInTransferResult, USBInterface,
  USBIsochronousInTransferPacket, USBIsochronousInTransferResult,
  USBIsochronousOutTransferPacket, USBIsochronousOutTransferResult,
  USBOutTransferResult, BluetoothUUID,
]);
for (const constructor of externalDeviceConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createExternalDeviceManager(kind, profile = null) {
  let value = externalDeviceState().singletons.get(kind);
  if (value !== undefined) return value;
  const Constructor = { bluetooth: Bluetooth, hid: HID, serial: Serial, usb: USB }[kind];
  value = Object.create(Constructor.prototype);
  initializeEventTarget(value);
  const eventNames = kind === "bluetooth"
    ? ["onavailabilitychanged"]
    : kind === "serial"
      ? ["onconnect", "ondisconnect"]
      : ["onconnect", "ondisconnect"];
  state.set(value, {
    kind,
    object: value,
    handlers: new Map(eventNames.map(name => [name, null])),
    available: kind === "bluetooth"
      ? Boolean(profile?.available)
      : true,
    devices: Object.freeze(createConfiguredDevices(kind, profile)),
  });
  externalDeviceState().singletons.set(kind, value);
  return value;
}

export function externalDeviceProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setExternalDeviceProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function externalDeviceOperation(value, name) {
  const record = requireRecord(value);
  if (record.kind === "bluetooth") {
    if (name === "getAvailability") return Promise.resolve(record.available);
    if (name === "getDevices") return Promise.resolve([...record.devices]);
    if (name === "requestDevice") {
      return record.devices.length === 0
        ? noDevice("Bluetooth")
        : Promise.resolve(record.devices[0]);
    }
  }
  if (record.kind === "hid") {
    if (name === "getDevices") return Promise.resolve([...record.devices]);
    if (name === "requestDevice") return Promise.resolve([...record.devices]);
  }
  if (record.kind === "serial") {
    if (name === "getPorts") return Promise.resolve([...record.devices]);
    if (name === "requestPort") {
      return record.devices.length === 0
        ? noDevice("serial")
        : Promise.resolve(record.devices[0]);
    }
  }
  if (record.kind === "usb") {
    if (name === "getDevices") return Promise.resolve([...record.devices]);
    if (name === "requestDevice") {
      return record.devices.length === 0
        ? noDevice("USB")
        : Promise.resolve(record.devices[0]);
    }
  }
  if (record.kind === "hidDevice") {
    if (name === "open") {
      record.opened = true;
      return Promise.resolve();
    }
    if (name === "close" || name === "forget") {
      record.opened = false;
      return Promise.resolve();
    }
    if (name === "receiveFeatureReport") {
      return Promise.resolve(new DataView(new ArrayBuffer(0)));
    }
    if (name === "sendFeatureReport" || name === "sendReport") {
      return Promise.resolve();
    }
  }
  if (record.kind === "serialPort") {
    if (name === "getInfo") {
      return Object.freeze({
        usbVendorId: record.usbVendorId,
        usbProductId: record.usbProductId,
      });
    }
    if (name === "open") {
      record.connected = true;
      return Promise.resolve();
    }
    if (name === "close" || name === "forget") {
      record.connected = false;
      return Promise.resolve();
    }
    if (name === "getSignals") {
      return Promise.resolve(Object.freeze({
        clearToSend: false,
        dataCarrierDetect: false,
        dataSetReady: false,
        ringIndicator: false,
      }));
    }
    if (name === "setSignals") return Promise.resolve();
  }
  if (record.kind === "usbDevice") {
    if (name === "open") {
      record.opened = true;
      return Promise.resolve();
    }
    if (name === "close" || name === "forget") {
      record.opened = false;
      return Promise.resolve();
    }
    if ([
      "claimInterface",
      "clearHalt",
      "releaseInterface",
      "reset",
      "selectAlternateInterface",
      "selectConfiguration",
    ].includes(name)) {
      return Promise.resolve();
    }
  }
  throw new TypeError(`Unsupported external-device operation: ${name}`);
}

function createConfiguredDevices(kind, profile) {
  if (kind === "bluetooth") {
    return (profile?.devices ?? []).map(input => {
      const value = Object.create(BluetoothDevice.prototype);
      initializeEventTarget(value);
      state.set(value, {
        kind: "bluetoothDevice",
        id: `${input.id}`,
        name: `${input.name}`,
        gatt: null,
        handlers: new Map([["ongattserverdisconnected", null]]),
      });
      return value;
    });
  }
  if (kind === "hid") {
    return (profile?.devices ?? []).map(input => {
      const value = Object.create(HIDDevice.prototype);
      initializeEventTarget(value);
      state.set(value, {
        kind: "hidDevice",
        opened: false,
        vendorId: Number(input.vendorId),
        productId: Number(input.productId),
        productName: `${input.productName}`,
        collections: Object.freeze([]),
        handlers: new Map([["oninputreport", null]]),
      });
      return value;
    });
  }
  if (kind === "serial") {
    return (profile?.ports ?? []).map(input => {
      const value = Object.create(SerialPort.prototype);
      initializeEventTarget(value);
      state.set(value, {
        kind: "serialPort",
        usbVendorId: Number(input.usbVendorId),
        usbProductId: Number(input.usbProductId),
        label: `${input.label}`,
        readable: null,
        writable: null,
        connected: false,
        handlers: new Map([
          ["onconnect", null],
          ["ondisconnect", null],
        ]),
      });
      return value;
    });
  }
  if (kind === "usb") {
    return (profile?.devices ?? []).map(input => {
      const value = Object.create(USBDevice.prototype);
      state.set(value, {
        kind: "usbDevice",
        usbVersionMajor: 3,
        usbVersionMinor: 2,
        usbVersionSubminor: 0,
        deviceClass: 0,
        deviceSubclass: 0,
        deviceProtocol: 0,
        vendorId: Number(input.vendorId),
        productId: Number(input.productId),
        deviceVersionMajor: 1,
        deviceVersionMinor: 0,
        deviceVersionSubminor: 0,
        manufacturerName: `${input.manufacturerName}`,
        productName: `${input.productName}`,
        serialNumber: `${input.serialNumber}`,
        configuration: null,
        configurations: Object.freeze([]),
        opened: false,
      });
      return value;
    });
  }
  return [];
}

export function bluetoothCanonicalUUID(value) {
  if (typeof value === "number") {
    const hex = value.toString(16).padStart(value <= 0xffff ? 4 : 8, "0");
    const full = hex.length === 4 ? `0000${hex}` : hex;
    return `${full}-0000-1000-8000-00805f9b34fb`;
  }
  const text = `${value}`.toLowerCase();
  if (/^[0-9a-f]{4}$/u.test(text)) return `0000${text}-0000-1000-8000-00805f9b34fb`;
  if (/^[0-9a-f]{8}$/u.test(text)) return `${text}-0000-1000-8000-00805f9b34fb`;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u.test(text)) {
    return text;
  }
  throw new TypeError("Invalid Bluetooth UUID");
}

export function bluetoothNamedUUID(value) {
  const names = {
    battery_service: 0x180f,
    heart_rate: 0x180d,
    battery_level: 0x2a19,
    client_characteristic_configuration: 0x2902,
  };
  return bluetoothCanonicalUUID(names[`${value}`] ?? value);
}

function initializeConnectionEvent(value, type, init, kind) {
  initializeExternalEvent(value, type, init, kind, {
    device: init?.device ?? null,
  });
}

function initializeExternalEvent(value, type, init, kind, fields) {
  if (value === undefined) throw new TypeError("Constructor requires new");
  if (init === null || typeof init !== "object") {
    throw new TypeError("Event init is required");
  }
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, { kind, ...fields });
}

function noDevice(label) {
  return Promise.reject(new DOMException(
    `No ${label} device is available in the offline sandbox.`,
    "NotFoundError",
  ));
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
