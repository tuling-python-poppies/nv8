import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { DOMPointReadOnly } from "../geometry/dom-point-read-only-constructor.js";
import { monotonicNow } from "../../../infra/scheduler/monotonic-clock.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// XR frame 序号和集合工厂原先是模块级状态，会跨 Realm 共享动画帧 ID
// 和检测平面/anchor 容器。
const xrCoreSlot = createRealmSlot(() => ({
  nextAnimationFrame: 0,
  anchorSetFactory: () => new Set(),
  planeSetFactory: () => new Set(),
}), "xr-core-runtime");

function xrCoreState() {
  return xrCoreSlot.get(globalThis);
}

export function XRBoundedReferenceSpace() { illegalConstructor("XRBoundedReferenceSpace"); }
export function XRFrame() { illegalConstructor("XRFrame"); }
export function XRInputSourceArray() { illegalConstructor("XRInputSourceArray"); }
export function XRPose() { illegalConstructor("XRPose"); }
export function XRRay(origin = {}, direction = {}) {
  requireNew(new.target, "XRRay");
  const originPoint = point(origin, 0, 0, 0, 1);
  const directionPoint = point(direction, 0, 0, -1, 0);
  state.set(this, {
    kind: "ray",
    origin: originPoint,
    direction: directionPoint,
    matrix: rayMatrix(originPoint, directionPoint),
  });
}
export function XRReferenceSpace() { illegalConstructor("XRReferenceSpace"); }
export function XRReferenceSpaceEvent(type, init) {
  initializeXREvent(this, type, init, "referenceSpaceEvent", {
    referenceSpace: init?.referenceSpace ?? null,
    transform: init?.transform ?? null,
  });
}
export function XRRenderState() { illegalConstructor("XRRenderState"); }
export function XRRigidTransform(position = {}, orientation = {}) {
  requireNew(new.target, "XRRigidTransform");
  initializeRigidTransform(this, position, orientation);
}
export function XRSession() { illegalConstructor("XRSession"); }
export function XRSessionEvent(type, init) {
  initializeXREvent(this, type, init, "sessionEvent", {
    session: init?.session ?? null,
  });
}
export function XRSpace() { illegalConstructor("XRSpace"); }
export function XRSystem() { illegalConstructor("XRSystem"); }
export function XRView() { illegalConstructor("XRView"); }
export function XRViewerPose() { illegalConstructor("XRViewerPose"); }
export function XRViewport() { illegalConstructor("XRViewport"); }

export const xrCoreConstructors = Object.freeze([
  XRBoundedReferenceSpace,
  XRFrame,
  XRInputSourceArray,
  XRPose,
  XRRay,
  XRReferenceSpace,
  XRReferenceSpaceEvent,
  XRRenderState,
  XRRigidTransform,
  XRSession,
  XRSessionEvent,
  XRSpace,
  XRSystem,
  XRView,
  XRViewerPose,
  XRViewport,
]);

for (const constructor of xrCoreConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createXRSystem() {
  const value = Object.create(XRSystem.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "system",
    object: value,
    handlers: new Map([["ondevicechange", null]]),
    sessions: new Set(),
  });
  return value;
}

export function configureXRCollectionFactories(factories = {}) {
  xrCoreState().anchorSetFactory = factories.createAnchorSet ?? xrCoreState().anchorSetFactory;
  xrCoreState().planeSetFactory = factories.createPlaneSet ?? xrCoreState().planeSetFactory;
}

export function xrCoreRecord(value) {
  return requireRecord(value);
}

export function createXRViewport(x = 0, y = 0, width = 1, height = 1) {
  const value = Object.create(XRViewport.prototype);
  state.set(value, {
    kind: "viewport",
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
  });
  return value;
}

export function createXRCorePose(transform = new XRRigidTransform()) {
  return createPose(transform, false);
}

export function xrProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "inputSourceArray" && name === "length") {
    return record.values.length;
  }
  return record[name];
}

export function setXRProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function xrOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "system") return systemOperation(record, name, args);
  if (record.kind === "session") return sessionOperation(record, name, args);
  if (record.kind === "frame") return frameOperation(record, name, args);
  if (record.kind === "referenceSpace" && name === "getOffsetReferenceSpace") {
    const transform = args[0];
    requireKind(transform, "rigidTransform");
    return createReferenceSpace(record.type, transform, record.bounded);
  }
  if (record.kind === "view" && name === "requestViewportScale") {
    const scale = Number(args[0]);
    if (!Number.isFinite(scale) || scale <= 0) {
      throw new RangeError("Viewport scale must be positive");
    }
    record.requestedViewportScale = scale;
    return;
  }
  if (record.kind === "inputSourceArray") {
    return arrayOperation(record.values, value, name, args);
  }
  throw new TypeError(`Unsupported XR operation: ${name}`);
}

export function xrIterator(value) {
  return requireKind(value, "inputSourceArray").values.values();
}

function systemOperation(record, name, args) {
  if (name === "isSessionSupported") {
    const mode = `${args[0]}`;
    return Promise.resolve([
      "inline",
      "immersive-vr",
      "immersive-ar",
    ].includes(mode));
  }
  if (name === "requestSession") {
    const mode = `${args[0]}`;
    if (!["inline", "immersive-vr", "immersive-ar"].includes(mode)) {
      return Promise.reject(new DOMException(
        "The requested XR session mode is unsupported.",
        "NotSupportedError",
      ));
    }
    const session = createSession(mode, args[1] ?? {});
    record.sessions.add(session);
    return Promise.resolve(session);
  }
}

function createSession(mode, init) {
  const session = Object.create(XRSession.prototype);
  initializeEventTarget(session);
  const enabledFeatures = Object.freeze([
    "viewer",
    "local",
    ...(init.requiredFeatures ?? []),
  ].filter((item, index, values) => values.indexOf(item) === index));
  state.set(session, {
    kind: "session",
    object: session,
    mode,
    environmentBlendMode: mode === "immersive-ar" ? "alpha-blend" : "opaque",
    interactionMode: "world-space",
    visibilityState: "visible",
    renderState: createRenderState({}),
    inputSources: createInputSourceArray(),
    domOverlayState: null,
    preferredReflectionFormat: "srgba8",
    depthUsage: null,
    depthDataFormat: null,
    depthType: null,
    depthActive: false,
    enabledFeatures,
    maxRenderLayers: 1,
    handlers: createHandlers([
      "onend",
      "onselect",
      "oninputsourceschange",
      "onselectstart",
      "onselectend",
      "onvisibilitychange",
      "onsqueeze",
      "onsqueezestart",
      "onsqueezeend",
      "onvisibilitymaskchange",
    ]),
    callbacks: new Map(),
    ended: false,
  });
  return session;
}

function sessionOperation(record, name, args) {
  if (name === "end") {
    if (record.ended) return Promise.resolve();
    record.ended = true;
    record.callbacks.clear();
    emit(record, "end", "onend", new XRSessionEvent("end", {
      session: record.object,
    }));
    return Promise.resolve();
  }
  requireActiveSession(record);
  if (name === "requestAnimationFrame") {
    const callback = args[0];
    if (typeof callback !== "function") throw new TypeError("Callback is required");
    xrCoreState().nextAnimationFrame += 1;
    const id = xrCoreState().nextAnimationFrame;
    record.callbacks.set(id, callback);
    Promise.resolve().then(() => {
      const selected = record.callbacks.get(id);
      if (selected === undefined || record.ended) return;
      record.callbacks.delete(id);
      const frame = createFrame(record.object);
      Reflect.apply(selected, record.object, [monotonicNow(), frame]);
      requireRecord(frame).active = false;
    });
    return id;
  }
  if (name === "cancelAnimationFrame") {
    record.callbacks.delete(Number(args[0]));
    return;
  }
  if (name === "requestReferenceSpace") {
    const type = `${args[0]}`;
    const supported = [
      "viewer",
      "local",
      "local-floor",
      "bounded-floor",
      "unbounded",
    ];
    if (!supported.includes(type)) {
      return Promise.reject(new DOMException(
        "Reference space is unsupported.",
        "NotSupportedError",
      ));
    }
    return Promise.resolve(createReferenceSpace(
      type,
      new XRRigidTransform(),
      type === "bounded-floor",
    ));
  }
  if (name === "updateRenderState") {
    record.renderState = createRenderState({
      ...renderStateInit(record.renderState),
      ...(args[0] ?? {}),
    });
    return;
  }
  if (name === "pauseDepthSensing") {
    record.depthActive = false;
    return;
  }
  if (name === "resumeDepthSensing") {
    record.depthActive = true;
    return;
  }
  if (name === "requestHitTestSource" || name === "requestHitTestSourceForTransientInput") {
    return Promise.reject(new DOMException(
      "No physical XR tracking source is available.",
      "NotSupportedError",
    ));
  }
  if (name === "requestLightProbe") {
    return Promise.reject(new DOMException(
      "No physical XR light probe is available.",
      "NotSupportedError",
    ));
  }
  if (name === "initiateRoomCapture") return Promise.resolve(false);
}

function frameOperation(record, name, args) {
  if (!record.active) throw new DOMException("XRFrame is inactive", "InvalidStateError");
  if (name === "getPose") {
    requireRecord(args[0]);
    requireKind(args[1], "referenceSpace");
    return createPose(new XRRigidTransform(), false);
  }
  if (name === "getViewerPose") {
    requireKind(args[0], "referenceSpace");
    return createViewerPose(record.session);
  }
  if (name === "fillPoses") {
    const spaces = [...args[0]];
    const baseSpace = args[1];
    requireKind(baseSpace, "referenceSpace");
    const target = args[2];
    for (let index = 0; index < spaces.length; index += 1) {
      requireRecord(spaces[index]);
      target.set(identityMatrix(), index * 16);
    }
    return true;
  }
  if (name === "fillJointRadii") {
    const spaces = [...args[0]];
    const target = args[1];
    spaces.forEach((space, index) => {
      requireRecord(space);
      target[index] = 0.01;
    });
    return true;
  }
  if ([
    "getHitTestResults",
    "getHitTestResultsForTransientInput",
  ].includes(name)) return [];
  if (name === "getDepthInformation" || name === "getLightEstimate") return null;
  if (name === "getJointPose") return null;
  if (name === "createAnchor") {
    return Promise.reject(new DOMException(
      "Anchors require a physical XR device.",
      "NotSupportedError",
    ));
  }
}

function createFrame(session) {
  const frame = Object.create(XRFrame.prototype);
  state.set(frame, {
    kind: "frame",
    session,
    trackedAnchors: xrCoreState().anchorSetFactory(),
    detectedPlanes: xrCoreState().planeSetFactory(),
    active: true,
  });
  return frame;
}

function createReferenceSpace(type, originOffset, bounded) {
  const Constructor = bounded ? XRBoundedReferenceSpace : XRReferenceSpace;
  const space = Object.create(Constructor.prototype);
  initializeEventTarget(space);
  state.set(space, {
    kind: "referenceSpace",
    type,
    originOffset,
    bounded,
    boundsGeometry: bounded
      ? Object.freeze([
        point({ x: -1, z: -1 }, -1, 0, -1, 1),
        point({ x: 1, z: -1 }, 1, 0, -1, 1),
        point({ x: 1, z: 1 }, 1, 0, 1, 1),
        point({ x: -1, z: 1 }, -1, 0, 1, 1),
      ])
      : undefined,
    handlers: createHandlers(["onreset"]),
  });
  return space;
}

function initializeRigidTransform(value, positionInput, orientationInput) {
  const position = point(positionInput, 0, 0, 0, 1);
  const orientation = point(orientationInput, 0, 0, 0, 1);
  const matrix = identityMatrix();
  matrix[12] = position.x;
  matrix[13] = position.y;
  matrix[14] = position.z;
  state.set(value, {
    kind: "rigidTransform",
    position,
    orientation,
    matrix,
    inverse: null,
  });
  Object.defineProperty(state.get(value), "inverse", {
    get() {
      const inverse = new XRRigidTransform(
        { x: -position.x, y: -position.y, z: -position.z },
        {
          x: -orientation.x,
          y: -orientation.y,
          z: -orientation.z,
          w: orientation.w,
        },
      );
      Object.defineProperty(state.get(inverse), "inverse", {
        value,
        configurable: true,
      });
      return inverse;
    },
    configurable: true,
  });
}

function createPose(transform, emulatedPosition) {
  const pose = Object.create(XRPose.prototype);
  state.set(pose, {
    kind: "pose",
    transform,
    emulatedPosition,
  });
  return pose;
}

function createViewerPose(session) {
  const pose = Object.create(XRViewerPose.prototype);
  const mode = requireKind(session, "session").mode;
  const eyes = mode === "inline" ? ["none"] : ["left", "right"];
  state.set(pose, {
    kind: "viewerPose",
    transform: new XRRigidTransform(),
    emulatedPosition: false,
    views: Object.freeze(eyes.map((eye, index) => createView(eye, index))),
  });
  return pose;
}

function createView(eye, index) {
  const view = Object.create(XRView.prototype);
  state.set(view, {
    kind: "view",
    eye,
    recommendedViewportScale: 1,
    isFirstPersonObserver: false,
    camera: null,
    index,
    projectionMatrix: identityMatrix(),
    transform: new XRRigidTransform({
      x: eye === "left" ? -0.032 : eye === "right" ? 0.032 : 0,
    }),
    requestedViewportScale: null,
  });
  return view;
}

function createRenderState(init) {
  const value = Object.create(XRRenderState.prototype);
  state.set(value, {
    kind: "renderState",
    depthNear: Number(init.depthNear ?? 0.1),
    depthFar: Number(init.depthFar ?? 1000),
    inlineVerticalFieldOfView: init.inlineVerticalFieldOfView ?? Math.PI / 2,
    baseLayer: init.baseLayer ?? null,
    layers: Object.freeze([...(init.layers ?? [])]),
  });
  return value;
}

function renderStateInit(value) {
  const record = requireKind(value, "renderState");
  return {
    depthNear: record.depthNear,
    depthFar: record.depthFar,
    inlineVerticalFieldOfView: record.inlineVerticalFieldOfView,
    baseLayer: record.baseLayer,
    layers: record.layers,
  };
}

function createInputSourceArray() {
  const value = Object.create(XRInputSourceArray.prototype);
  state.set(value, { kind: "inputSourceArray", values: [] });
  return value;
}

function arrayOperation(values, object, name, args) {
  if (name === "entries") return values.entries();
  if (name === "keys") return values.keys();
  if (name === "values") return values.values();
  if (name === "forEach") {
    values.forEach((item, index) => {
      Reflect.apply(args[0], args[1], [item, index, object]);
    });
  }
}

function initializeXREvent(value, type, init, kind, fields) {
  if (value === undefined) throw new TypeError("Constructor requires new");
  if (init === null || typeof init !== "object") {
    throw new TypeError("XR event init is required");
  }
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, { kind, ...fields });
}

function emit(record, type, handlerName, event = new Event(type)) {
  Promise.resolve().then(() => {
    record.object.dispatchEvent(event);
    const handler = record.handlers.get(handlerName);
    if (handler !== null) Reflect.apply(handler, record.object, [event]);
  });
}

function point(input, x, y, z, w) {
  return new DOMPointReadOnly(
    Number(input?.x ?? x),
    Number(input?.y ?? y),
    Number(input?.z ?? z),
    Number(input?.w ?? w),
  );
}

function identityMatrix() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

function rayMatrix(origin) {
  const matrix = identityMatrix();
  matrix[12] = origin.x;
  matrix[13] = origin.y;
  matrix[14] = origin.z;
  return matrix;
}

function createHandlers(names) {
  return new Map(names.map(name => [name, null]));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireKind(value, kind) {
  const record = requireRecord(value);
  if (record.kind !== kind) throw new TypeError("Illegal invocation");
  return record;
}

function requireActiveSession(record) {
  if (record.ended) throw new DOMException("XRSession has ended", "InvalidStateError");
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
