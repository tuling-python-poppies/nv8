import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { DOMPointReadOnly } from "../geometry/dom-point-read-only-constructor.js";
import {
  XRRigidTransform,
  createXRCorePose,
  createXRViewport,
  xrCoreRecord,
} from "./xr-core-runtime.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function XRDOMOverlayState() { illegalConstructor("XRDOMOverlayState"); }
export function XRLayer() { illegalConstructor("XRLayer"); }
export function XRWebGLBinding(session, context) {
  requireNew(new.target, "XRWebGLBinding");
  requireSession(session);
  requireWebGLContext(context);
  state.set(this, {
    kind: "binding",
    session,
    context,
    nativeProjectionScaleFactor: 1,
    usesDepthValues: false,
  });
}
export function XRAnchor() { illegalConstructor("XRAnchor"); }
export function XRAnchorSet() { illegalConstructor("XRAnchorSet"); }
export function XRCPUDepthInformation() { illegalConstructor("XRCPUDepthInformation"); }
export function XRCamera() { illegalConstructor("XRCamera"); }
export function XRDepthInformation() { illegalConstructor("XRDepthInformation"); }
export function XRHand() { illegalConstructor("XRHand"); }
export function XRHitTestResult() { illegalConstructor("XRHitTestResult"); }
export function XRHitTestSource() { illegalConstructor("XRHitTestSource"); }
export function XRInputSource() { illegalConstructor("XRInputSource"); }
export function XRInputSourceEvent(type, init) {
  initializeXREvent(this, type, init, "inputSourceEvent", {
    frame: init?.frame ?? null,
    inputSource: init?.inputSource ?? null,
  });
}
export function XRInputSourcesChangeEvent(type, init) {
  initializeXREvent(this, type, init, "inputSourcesChangeEvent", {
    session: init?.session ?? null,
    added: Object.freeze([...(init?.added ?? [])]),
    removed: Object.freeze([...(init?.removed ?? [])]),
  });
}
export function XRJointPose() { illegalConstructor("XRJointPose"); }
export function XRJointSpace() { illegalConstructor("XRJointSpace"); }
export function XRLightEstimate() { illegalConstructor("XRLightEstimate"); }
export function XRLightProbe() { illegalConstructor("XRLightProbe"); }
export function XRTransientInputHitTestResult() { illegalConstructor("XRTransientInputHitTestResult"); }
export function XRTransientInputHitTestSource() { illegalConstructor("XRTransientInputHitTestSource"); }
export function XRWebGLDepthInformation() { illegalConstructor("XRWebGLDepthInformation"); }
export function XRWebGLLayer(session, context) {
  requireNew(new.target, "XRWebGLLayer");
  requireSession(session);
  requireWebGLContext(context);
  const init = arguments[2] ?? {};
  const dimensions = contextDimensions(context);
  initializeEventTarget(this);
  state.set(this, {
    kind: "webglLayer",
    object: this,
    session,
    context,
    antialias: Boolean(init.antialias ?? true),
    ignoreDepthValues: Boolean(init.ignoreDepthValues),
    framebufferWidth: dimensions.width,
    framebufferHeight: dimensions.height,
    framebuffer: context.createFramebuffer(),
  });
}
export function XRCompositionLayer() { illegalConstructor("XRCompositionLayer"); }
export function XRProjectionLayer() { illegalConstructor("XRProjectionLayer"); }
export function XRCubeLayer() { illegalConstructor("XRCubeLayer"); }
export function XRCylinderLayer() { illegalConstructor("XRCylinderLayer"); }
export function XREquirectLayer() { illegalConstructor("XREquirectLayer"); }
export function XRLayerEvent(type, init) {
  initializeXREvent(this, type, init, "layerEvent", {
    layer: init?.layer ?? null,
  });
}
export function XRQuadLayer() { illegalConstructor("XRQuadLayer"); }
export function XRSubImage() { illegalConstructor("XRSubImage"); }
export function XRWebGLSubImage() { illegalConstructor("XRWebGLSubImage"); }
export function XRPlane() { illegalConstructor("XRPlane"); }
export function XRPlaneSet() { illegalConstructor("XRPlaneSet"); }
export function XRVisibilityMaskChangeEvent(type, init) {
  initializeXREvent(this, type, init, "visibilityMaskEvent", {
    session: init?.session ?? null,
    eye: `${init?.eye ?? "none"}`,
    index: Number(init?.index ?? 0),
    vertices: new Float32Array(init?.vertices ?? []),
    indices: new Uint32Array(init?.indices ?? []),
  });
}

export const xrExtensionConstructors = Object.freeze([
  XRDOMOverlayState, XRLayer, XRWebGLBinding, XRAnchor, XRAnchorSet,
  XRCPUDepthInformation, XRCamera, XRDepthInformation, XRHand, XRHitTestResult,
  XRHitTestSource, XRInputSource, XRInputSourceEvent,
  XRInputSourcesChangeEvent, XRJointPose, XRJointSpace, XRLightEstimate,
  XRLightProbe, XRTransientInputHitTestResult, XRTransientInputHitTestSource,
  XRWebGLDepthInformation, XRWebGLLayer, XRCompositionLayer,
  XRProjectionLayer, XRCubeLayer, XRCylinderLayer, XREquirectLayer,
  XRLayerEvent, XRQuadLayer, XRSubImage, XRWebGLSubImage, XRPlane, XRPlaneSet,
  XRVisibilityMaskChangeEvent,
]);
for (const constructor of xrExtensionConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createXRAnchorSet(values = []) {
  return createSetLike(XRAnchorSet, "anchorSet", values);
}

export function createXRPlaneSet(values = []) {
  return createSetLike(XRPlaneSet, "planeSet", values);
}

export function xrExtensionProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (["anchorSet", "planeSet", "hand"].includes(record.kind) && name === "size") {
    return record.values.size;
  }
  return record[name];
}

export function setXRExtensionProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if ([
    "blendTextureSourceAlpha", "forceMonoPresentation", "opacity",
    "fixedFoveation", "deltaPose", "transform", "radius", "centralAngle",
    "aspectRatio", "centralHorizontalAngle", "upperVerticalAngle",
    "lowerVerticalAngle", "width", "height",
  ].includes(name)) {
    record[name] = input;
  }
}

export function xrExtensionOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "binding") return bindingOperation(record, name, args);
  if (record.kind === "webglLayer" && name === "getViewport") {
    const view = xrCoreRecord(args[0]);
    if (view.kind !== "view") throw new TypeError("Expected XRView");
    const half = record.framebufferWidth / (view.eye === "none" ? 1 : 2);
    return createXRViewport(
      view.eye === "right" ? half : 0,
      0,
      half,
      record.framebufferHeight,
    );
  }
  if (["anchorSet", "planeSet"].includes(record.kind)) {
    return setOperation(record, value, name, args);
  }
  if (record.kind === "hand") return mapOperation(record, value, name, args);
  if (record.kind === "anchor" && name === "delete") {
    record.deleted = true;
    return;
  }
  if (record.kind.endsWith("HitTestSource") && name === "cancel") {
    record.canceled = true;
    return;
  }
  if (record.kind === "hitTestResult") {
    if (name === "getPose") return createXRCorePose();
    if (name === "createAnchor") return Promise.reject(new DOMException(
      "No physical anchor provider is available.",
      "NotSupportedError",
    ));
  }
  if (record.kind === "cpuDepth" && name === "getDepthInMeters") {
    const x = Math.trunc(Number(args[0]));
    const y = Math.trunc(Number(args[1]));
    if (x < 0 || y < 0 || x >= record.width || y >= record.height) {
      throw new RangeError("Depth coordinates are outside the image");
    }
    return record.data.getUint16((y * record.width + x) * 2, true)
      * record.rawValueToMeters;
  }
  if (record.kind.endsWith("Layer") && name === "destroy") {
    record.destroyed = true;
    record.needsRedraw = false;
    return;
  }
  throw new TypeError(`Unsupported XR extension operation: ${name}`);
}

export function xrExtensionIterator(value) {
  const record = requireRecord(value);
  if (record.kind === "hand") return record.values.entries();
  return record.values.values();
}

export function nativeFramebufferScaleFactor(session) {
  requireSession(session);
  return 1;
}

function bindingOperation(record, name, args) {
  if (name === "createProjectionLayer") {
    return createCompositionLayer(XRProjectionLayer, "projectionLayer", record, args[0] ?? {});
  }
  const constructors = {
    createCubeLayer: [XRCubeLayer, "cubeLayer"],
    createCylinderLayer: [XRCylinderLayer, "cylinderLayer"],
    createEquirectLayer: [XREquirectLayer, "equirectLayer"],
    createQuadLayer: [XRQuadLayer, "quadLayer"],
  };
  if (constructors[name] !== undefined) {
    const [Constructor, kind] = constructors[name];
    return createCompositionLayer(Constructor, kind, record, args[0] ?? {});
  }
  if (name === "getSubImage" || name === "getViewSubImage") {
    const layer = requireRecord(args[0]);
    if (!layer.kind.endsWith("Layer")) throw new TypeError("Expected XR layer");
    return createSubImage(record, layer, args[1]);
  }
  if (["getCameraImage", "getDepthInformation", "getReflectionCubeMap"].includes(name)) {
    return null;
  }
}

function createCompositionLayer(Constructor, kind, binding, init) {
  const layer = Object.create(Constructor.prototype);
  initializeEventTarget(layer);
  const dimensions = contextDimensions(binding.context);
  const common = {
    kind,
    object: layer,
    session: binding.session,
    context: binding.context,
    layout: `${init.layout ?? "stereo"}`,
    blendTextureSourceAlpha: Boolean(init.blendTextureSourceAlpha),
    forceMonoPresentation: Boolean(init.forceMonoPresentation),
    opacity: Number(init.opacity ?? 1),
    mipLevels: Number(init.mipLevels ?? 1),
    needsRedraw: true,
    destroyed: false,
    handlers: new Map([["onredraw", null]]),
  };
  const transform = init.transform instanceof XRRigidTransform
    ? init.transform
    : new XRRigidTransform();
  const specific = kind === "projectionLayer" ? {
    textureWidth: dimensions.width,
    textureHeight: dimensions.height,
    textureArrayLength: common.layout === "stereo" ? 2 : 1,
    ignoreDepthValues: Boolean(init.ignoreDepthValues),
    fixedFoveation: init.fixedFoveation ?? null,
    deltaPose: init.deltaPose ?? null,
  } : kind === "cubeLayer" ? {
    space: init.space ?? null,
    orientation: init.orientation ?? new DOMPointReadOnly(0, 0, 0, 1),
  } : kind === "cylinderLayer" ? {
    space: init.space ?? null,
    transform,
    radius: Number(init.radius ?? 2),
    centralAngle: Number(init.centralAngle ?? Math.PI / 2),
    aspectRatio: Number(init.aspectRatio ?? 2),
  } : kind === "equirectLayer" ? {
    space: init.space ?? null,
    transform,
    radius: Number(init.radius ?? 0),
    centralHorizontalAngle: Number(init.centralHorizontalAngle ?? Math.PI * 2),
    upperVerticalAngle: Number(init.upperVerticalAngle ?? Math.PI / 2),
    lowerVerticalAngle: Number(init.lowerVerticalAngle ?? -Math.PI / 2),
  } : {
    space: init.space ?? null,
    transform,
    width: Number(init.width ?? 1),
    height: Number(init.height ?? 1),
  };
  state.set(layer, { ...common, ...specific });
  return layer;
}

function createSubImage(binding, layer, view) {
  const dimensions = contextDimensions(binding.context);
  const eye = view === undefined ? "none" : xrCoreRecord(view).eye;
  const width = eye === "none" ? dimensions.width : dimensions.width / 2;
  const subImage = Object.create(XRWebGLSubImage.prototype);
  const createTexture = () => binding.context.createTexture();
  state.set(subImage, {
    kind: "webglSubImage",
    viewport: createXRViewport(
      eye === "right" ? width : 0,
      0,
      width,
      dimensions.height,
    ),
    colorTexture: createTexture(),
    depthStencilTexture: layer.ignoreDepthValues ? null : createTexture(),
    motionVectorTexture: null,
    imageIndex: eye === "right" ? 1 : 0,
    colorTextureWidth: width,
    colorTextureHeight: dimensions.height,
    depthStencilTextureWidth: width,
    depthStencilTextureHeight: dimensions.height,
    motionVectorTextureWidth: 0,
    motionVectorTextureHeight: 0,
  });
  return subImage;
}

function createSetLike(Constructor, kind, values) {
  const value = Object.create(Constructor.prototype);
  state.set(value, { kind, values: new Set(values) });
  return value;
}

function setOperation(record, object, name, args) {
  if (name === "entries") return record.values.entries();
  if (name === "keys" || name === "values") return record.values.values();
  if (name === "has") return record.values.has(args[0]);
  if (name === "forEach") {
    record.values.forEach(item => Reflect.apply(args[0], args[1], [item, item, object]));
  }
}

function mapOperation(record, object, name, args) {
  if (name === "entries") return record.values.entries();
  if (name === "keys") return record.values.keys();
  if (name === "values") return record.values.values();
  if (name === "get") return record.values.get(args[0]);
  if (name === "forEach") {
    record.values.forEach((item, key) => Reflect.apply(args[0], args[1], [item, key, object]));
  }
}

function initializeXREvent(value, type, init, kind, fields) {
  if (value === undefined) throw new TypeError("Constructor requires new");
  if (init === null || typeof init !== "object") throw new TypeError("Event init is required");
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, { kind, ...fields });
}

function contextDimensions(context) {
  return {
    width: Number(context.canvas?.width ?? 1),
    height: Number(context.canvas?.height ?? 1),
  };
}

function requireWebGLContext(context) {
  if (context === null || typeof context !== "object" || typeof context.createTexture !== "function") {
    throw new TypeError("Expected a WebGL rendering context");
  }
}

function requireSession(session) {
  const record = xrCoreRecord(session);
  if (record.kind !== "session" || record.ended) throw new TypeError("Expected active XRSession");
  return record;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) throw new TypeError(`Failed to construct '${name}': use new`);
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
