import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// 定位单例、watch 序号/集合和传感器 profile 原先是模块级状态，
// 会跨 legacy Realm 共享。现在按当前 Realm 的 globalThis 隔离。
const deviceSlot = createRealmSlot(() => ({
  geolocationSingleton: null,
  nextWatchId: 0,
  watches: new Map(),
  sensorProfile: Object.freeze({}),
}), "device-runtime");

function deviceState() {
  return deviceSlot.get(globalThis);
}

export function configureDeviceProfile(profile = null) {
  const device = deviceState();
  const input = profile ?? {};
  device.sensorProfile = Object.freeze(Object.fromEntries(
    Object.entries(input).map(([name, value]) => [
      name,
      value === null
        ? null
        : Object.freeze({
            x: nullableNumber(value?.x),
            y: nullableNumber(value?.y),
            z: nullableNumber(value?.z),
            quaternion: value?.quaternion === null
              || value?.quaternion === undefined
              ? null
              : Object.freeze([...value.quaternion].map(Number)),
            frequency: Number(value?.frequency ?? 60),
          }),
    ]),
  ));
}

export function GeolocationPositionError() { illegalConstructor("GeolocationPositionError"); }
export function GeolocationPosition() { illegalConstructor("GeolocationPosition"); }
export function GeolocationCoordinates() { illegalConstructor("GeolocationCoordinates"); }
export function Geolocation() { illegalConstructor("Geolocation"); }
export function GamepadHapticActuator() { illegalConstructor("GamepadHapticActuator"); }
export function GamepadEvent(type, init = {}) {
  initializeDeviceEvent(this, type, init, "gamepadEvent", {
    gamepad: init.gamepad ?? null,
  });
}
export function GamepadButton() { illegalConstructor("GamepadButton"); }
export function Gamepad() { illegalConstructor("Gamepad"); }
export function Sensor() { illegalConstructor("Sensor"); }
export function SensorErrorEvent(type, init) {
  initializeDeviceEvent(this, type, init, "sensorErrorEvent", {
    error: init?.error ?? new DOMException("Sensor unavailable", "NotReadableError"),
  });
}
export function Accelerometer(options = {}) {
  requireNew(new.target, "Accelerometer");
  initializeSensor(this, "accelerometer", options);
}
export function GravitySensor(options = {}) {
  requireNew(new.target, "GravitySensor");
  initializeSensor(this, "gravitySensor", options);
}
export function LinearAccelerationSensor(options = {}) {
  requireNew(new.target, "LinearAccelerationSensor");
  initializeSensor(this, "linearAccelerationSensor", options);
}
export function Gyroscope(options = {}) {
  requireNew(new.target, "Gyroscope");
  initializeSensor(this, "gyroscope", options);
}
export function OrientationSensor() { illegalConstructor("OrientationSensor"); }
export function AbsoluteOrientationSensor(options = {}) {
  requireNew(new.target, "AbsoluteOrientationSensor");
  initializeSensor(this, "absoluteOrientationSensor", options);
}
export function RelativeOrientationSensor(options = {}) {
  requireNew(new.target, "RelativeOrientationSensor");
  initializeSensor(this, "relativeOrientationSensor", options);
}
export function DeviceMotionEvent(type, init = {}) {
  initializeDeviceEvent(this, type, init, "deviceMotionEvent", {
    acceleration: createAcceleration(init.acceleration),
    accelerationIncludingGravity: createAcceleration(
      init.accelerationIncludingGravity,
    ),
    rotationRate: createRotationRate(init.rotationRate),
    interval: Number(init.interval ?? 0),
  });
}
export function DeviceMotionEventAcceleration() { illegalConstructor("DeviceMotionEventAcceleration"); }
export function DeviceMotionEventRotationRate() { illegalConstructor("DeviceMotionEventRotationRate"); }
export function DeviceOrientationEvent(type, init = {}) {
  initializeDeviceEvent(this, type, init, "deviceOrientationEvent", {
    alpha: nullableNumber(init.alpha),
    beta: nullableNumber(init.beta),
    gamma: nullableNumber(init.gamma),
    absolute: Boolean(init.absolute),
  });
}

export const deviceConstructors = Object.freeze([
  GeolocationPositionError, GeolocationPosition, GeolocationCoordinates,
  Geolocation, GamepadHapticActuator, GamepadEvent, GamepadButton, Gamepad,
  Sensor, SensorErrorEvent, Accelerometer, GravitySensor,
  LinearAccelerationSensor, Gyroscope, OrientationSensor,
  AbsoluteOrientationSensor, RelativeOrientationSensor, DeviceMotionEvent,
  DeviceMotionEventAcceleration, DeviceMotionEventRotationRate,
  DeviceOrientationEvent,
]);
for (const constructor of deviceConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createGeolocation() {
  const device = deviceState();
  if (device.geolocationSingleton !== null) return device.geolocationSingleton;
  const value = Object.create(Geolocation.prototype);
  state.set(value, { kind: "geolocation" });
  device.geolocationSingleton = value;
  return value;
}

export function deviceProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setDeviceProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function deviceOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "geolocation") return geolocationOperation(name, args);
  if (record.kind === "coordinates" && name === "toJSON") {
    return coordinatesJSON(record);
  }
  if (record.kind === "position" && name === "toJSON") {
    return { coords: coordinatesJSON(requireRecord(record.coords)), timestamp: record.timestamp };
  }
  if (record.kind === "haptic") {
    if (name === "playEffect") return Promise.resolve("complete");
    if (name === "reset") return Promise.resolve("complete");
  }
  if (record.category === "sensor") {
    if (name === "start") return startSensor(record);
    if (name === "stop") {
      record.generation += 1;
      record.activated = false;
      record.hasReading = false;
      record.timestamp = null;
      return;
    }
    if (name === "populateMatrix") {
      if (!record.hasReading) throw new DOMException(
        "Sensor has no reading.",
        "NotReadableError",
      );
      const target = args[0];
      const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      identity.forEach((item, index) => { target[index] = item; });
      return;
    }
  }
  throw new TypeError(`Unsupported device operation: ${name}`);
}

export function requestDevicePermission(callback) {
  const promise = Promise.resolve("granted");
  if (typeof callback === "function") {
    promise.then(value => Reflect.apply(callback, undefined, [value]));
  }
  return promise;
}

function geolocationOperation(name, args) {
  const device = deviceState();
  if (name === "clearWatch") {
    device.watches.delete(Number(args[0]));
    return;
  }
  const success = args[0];
  const error = args[1];
  if (typeof success !== "function") {
    throw new TypeError("Position callback is required");
  }
  const positionError = createPositionError(
    1,
    "Geolocation permission is denied in the offline sandbox.",
  );
  if (name === "getCurrentPosition") {
    Promise.resolve().then(() => {
      if (typeof error === "function") Reflect.apply(error, undefined, [positionError]);
    });
    return;
  }
  if (name === "watchPosition") {
    device.nextWatchId += 1;
    const id = device.nextWatchId;
    device.watches.set(id, true);
    Promise.resolve().then(() => {
      if (device.watches.has(id) && typeof error === "function") {
        Reflect.apply(error, undefined, [positionError]);
      }
    });
    return id;
  }
}

function initializeSensor(value, kind, options) {
  initializeEventTarget(value);
  state.set(value, {
    kind,
    category: "sensor",
    object: value,
    activated: false,
    hasReading: false,
    timestamp: null,
    x: null,
    y: null,
    z: null,
    quaternion: null,
    frequency: Number(
      options.frequency ?? deviceState().sensorProfile[kind]?.frequency ?? 60,
    ),
    referenceFrame: `${options.referenceFrame ?? "device"}`,
    profile: deviceState().sensorProfile[kind] ?? null,
    handlers: new Map([
      ["onerror", null],
      ["onreading", null],
      ["onactivate", null],
    ]),
    generation: 0,
  });
}

function startSensor(record) {
  record.generation += 1;
  const generation = record.generation;
  Promise.resolve().then(() => {
    if (record.generation !== generation) return;
    if (record.profile !== null) {
      record.activated = true;
      record.hasReading = true;
      record.timestamp = globalThis.performance?.now?.() ?? 0;
      record.x = record.profile.x;
      record.y = record.profile.y;
      record.z = record.profile.z;
      record.quaternion = record.profile.quaternion;
      emit(record, new Event("activate"), "onactivate");
      emit(record, new Event("reading"), "onreading");
      return;
    }
    const event = new SensorErrorEvent("error", {
      error: new DOMException(
        "No physical sensor is available in the offline sandbox.",
        "NotReadableError",
      ),
    });
    emit(record, event, "onerror");
  });
}

function createPositionError(code, message) {
  const value = Object.create(GeolocationPositionError.prototype);
  state.set(value, { kind: "positionError", code, message });
  return value;
}

function createAcceleration(init) {
  if (init === null || init === undefined) return null;
  const value = Object.create(DeviceMotionEventAcceleration.prototype);
  state.set(value, {
    kind: "acceleration",
    x: nullableNumber(init.x),
    y: nullableNumber(init.y),
    z: nullableNumber(init.z),
  });
  return value;
}

function createRotationRate(init) {
  if (init === null || init === undefined) return null;
  const value = Object.create(DeviceMotionEventRotationRate.prototype);
  state.set(value, {
    kind: "rotationRate",
    alpha: nullableNumber(init.alpha),
    beta: nullableNumber(init.beta),
    gamma: nullableNumber(init.gamma),
  });
  return value;
}

function initializeDeviceEvent(value, type, init, kind, fields) {
  if (value === undefined) throw new TypeError("Constructor requires new");
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init?.bubbles),
    cancelable: Boolean(init?.cancelable),
    composed: Boolean(init?.composed),
  });
  state.set(value, { kind, ...fields });
}

function emit(record, event, handlerName) {
  record.object.dispatchEvent(event);
  const handler = record.handlers.get(handlerName);
  if (handler !== null) Reflect.apply(handler, record.object, [event]);
}

function coordinatesJSON(record) {
  return {
    latitude: record.latitude,
    longitude: record.longitude,
    altitude: record.altitude,
    accuracy: record.accuracy,
    altitudeAccuracy: record.altitudeAccuracy,
    heading: record.heading,
    speed: record.speed,
  };
}

function nullableNumber(value) {
  return value === null || value === undefined ? null : Number(value);
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

function illegalConstructor(name) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    name === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
