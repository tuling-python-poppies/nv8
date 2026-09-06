import { initializeEventTarget } from "../event/event-target-state.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeDOMException } from "../event/dom-exception-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  createWGSLLanguageFeatures,
} from "../wgsl-language-features/wgsl-language-features-runtime.js";

import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// GPU gpuState().profile 与 GPU 单例原先是模块级状态，会跨 Realm 共享适配器指纹。
const gpuSlot = createRealmSlot(() => ({
  profile: null,
  gpuSingleton: null,
}), "gpu-runtime");

function gpuState() {
  return gpuSlot.get(globalThis);
}
const defaultProfile = Object.freeze({
  vendor: "nvidia",
  architecture: "",
  device: "NVIDIA GeForce RTX 3060 Ti",
  description: "",
  subgroupMinSize: 32,
  subgroupMaxSize: 32,
  isFallbackAdapter: false,
  features: Object.freeze(["texture-compression-bc"]),
  limits: Object.freeze({
    maxTextureDimension1D: 8192,
    maxTextureDimension2D: 8192,
    maxTextureDimension3D: 2048,
    maxTextureArrayLayers: 256,
    maxBindGroups: 4,
    maxBindGroupsPlusVertexBuffers: 24,
    maxBindingsPerBindGroup: 1000,
    maxDynamicUniformBuffersPerPipelineLayout: 8,
    maxDynamicStorageBuffersPerPipelineLayout: 4,
    maxSampledTexturesPerShaderStage: 16,
    maxSamplersPerShaderStage: 16,
    maxStorageBuffersPerShaderStage: 8,
    maxStorageTexturesPerShaderStage: 4,
    maxUniformBuffersPerShaderStage: 12,
    maxUniformBufferBindingSize: 65536,
    maxStorageBufferBindingSize: 134217728,
    minUniformBufferOffsetAlignment: 256,
    minStorageBufferOffsetAlignment: 256,
    maxVertexBuffers: 8,
    maxBufferSize: 268435456,
    maxVertexAttributes: 16,
    maxVertexBufferArrayStride: 2048,
    maxInterStageShaderVariables: 16,
    maxColorAttachments: 8,
    maxColorAttachmentBytesPerSample: 32,
    maxComputeWorkgroupStorageSize: 16384,
    maxComputeInvocationsPerWorkgroup: 256,
    maxComputeWorkgroupSizeX: 256,
    maxComputeWorkgroupSizeY: 256,
    maxComputeWorkgroupSizeZ: 64,
    maxComputeWorkgroupsPerDimension: 65535,
    maxImmediateSize: 0,
    maxStorageBuffersInFragmentStage: 8,
    maxStorageTexturesInFragmentStage: 4,
    maxStorageBuffersInVertexStage: 8,
    maxStorageTexturesInVertexStage: 4,
  }),
});

export function GPU() { illegalConstructor("GPU", new.target); }
export function GPUAdapter() { illegalConstructor("GPUAdapter", new.target); }
export function GPUAdapterInfo() { illegalConstructor("GPUAdapterInfo", new.target); }
export function GPUBuffer() { illegalConstructor("GPUBuffer", new.target); }
export function GPUCanvasContext() { illegalConstructor("GPUCanvasContext", new.target); }
export function GPUDevice() { illegalConstructor("GPUDevice", new.target); }
export function GPUDeviceLostInfo() { illegalConstructor("GPUDeviceLostInfo", new.target); }
export function GPUQueue() { illegalConstructor("GPUQueue", new.target); }
export function GPUShaderModule() { illegalConstructor("GPUShaderModule", new.target); }
export function GPUSupportedFeatures() { illegalConstructor("GPUSupportedFeatures", new.target); }
export function GPUSupportedLimits() { illegalConstructor("GPUSupportedLimits", new.target); }
export function GPUTexture() { illegalConstructor("GPUTexture", new.target); }
export function GPUTextureView() { illegalConstructor("GPUTextureView", new.target); }
export function GPUBindGroup() { illegalConstructor("GPUBindGroup", new.target); }
export function GPUBindGroupLayout() { illegalConstructor("GPUBindGroupLayout", new.target); }
export function GPUCommandBuffer() { illegalConstructor("GPUCommandBuffer", new.target); }
export function GPUCommandEncoder() { illegalConstructor("GPUCommandEncoder", new.target); }
export function GPUComputePassEncoder() { illegalConstructor("GPUComputePassEncoder", new.target); }
export function GPUComputePipeline() { illegalConstructor("GPUComputePipeline", new.target); }
export function GPUError() { illegalConstructor("GPUError", new.target); }
export function GPUPipelineLayout() { illegalConstructor("GPUPipelineLayout", new.target); }
export function GPUQuerySet() { illegalConstructor("GPUQuerySet", new.target); }
export function GPURenderBundle() { illegalConstructor("GPURenderBundle", new.target); }
export function GPURenderBundleEncoder() { illegalConstructor("GPURenderBundleEncoder", new.target); }
export function GPURenderPassEncoder() { illegalConstructor("GPURenderPassEncoder", new.target); }
export function GPURenderPipeline() { illegalConstructor("GPURenderPipeline", new.target); }
export function GPUSampler() { illegalConstructor("GPUSampler", new.target); }
export function GPUExternalTexture() { illegalConstructor("GPUExternalTexture", new.target); }
export function GPUCompilationInfo() { illegalConstructor("GPUCompilationInfo", new.target); }
export function GPUCompilationMessage() { illegalConstructor("GPUCompilationMessage", new.target); }

export function GPUInternalError(message) {
  constructGPUError(this, new.target, message, "GPUInternalError");
}

export function GPUOutOfMemoryError(message) {
  constructGPUError(this, new.target, message, "GPUOutOfMemoryError");
}

export function GPUValidationError(message) {
  constructGPUError(this, new.target, message, "GPUValidationError");
}

export function GPUPipelineError(message) {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'GPUPipelineError': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  const normalized = `${message ?? ""}`;
  initializeDOMException(this, normalized, "OperationError");
  state.set(this, {
    kind: "pipelineError",
    reason: `${arguments[1]?.reason ?? "validation"}`,
  });
}

export function GPUUncapturedErrorEvent(type, init) {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'GPUUncapturedErrorEvent': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  if (arguments.length < 2 || init === null || typeof init !== "object") {
    throw new TypeError("GPUUncapturedErrorEvent requires an event init object");
  }
  initializeEvent(this, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(this, {
    kind: "uncapturedErrorEvent",
    error: init.error,
  });
}

for (const constructor of [
  GPU,
  GPUAdapter,
  GPUAdapterInfo,
  GPUBuffer,
  GPUCanvasContext,
  GPUDevice,
  GPUDeviceLostInfo,
  GPUQueue,
  GPUShaderModule,
  GPUSupportedFeatures,
  GPUSupportedLimits,
  GPUTexture,
  GPUTextureView,
  GPUBindGroup,
  GPUBindGroupLayout,
  GPUCommandBuffer,
  GPUCommandEncoder,
  GPUComputePassEncoder,
  GPUComputePipeline,
  GPUError,
  GPUInternalError,
  GPUOutOfMemoryError,
  GPUPipelineError,
  GPUPipelineLayout,
  GPUQuerySet,
  GPURenderBundle,
  GPURenderBundleEncoder,
  GPURenderPassEncoder,
  GPURenderPipeline,
  GPUSampler,
  GPUExternalTexture,
  GPUCompilationInfo,
  GPUCompilationMessage,
  GPUUncapturedErrorEvent,
  GPUValidationError,
]) registerNativeFunction(constructor, constructor.name);

export function configureGPUProfile(value) {
  const input = value?.webgpu ?? value ?? defaultProfile;
  gpuState().profile = Object.freeze({
    vendor: `${input.vendor}`,
    architecture: `${input.architecture}`,
    device: `${input.device}`,
    description: `${input.description}`,
    subgroupMinSize: Number(input.subgroupMinSize),
    subgroupMaxSize: Number(input.subgroupMaxSize),
    isFallbackAdapter: Boolean(input.isFallbackAdapter),
    features: Object.freeze([...input.features].map(value => `${value}`)),
    limits: Object.freeze({ ...input.limits }),
  });
  gpuState().gpuSingleton = null;
}

export function createGPU() {
  if (gpuState().gpuSingleton !== null) return gpuState().gpuSingleton;
  if (gpuState().profile === null) throw new Error("GPU gpuState().profile was not configured");
  gpuState().gpuSingleton = createRecord(GPU, "gpu", {});
  return gpuState().gpuSingleton;
}

export function gpuProperty(gpu, name) {
  requireRecord(gpu, "gpu");
  if (name === "wgslLanguageFeatures") {
    return createWGSLLanguageFeatures();
  }
  return undefined;
}

export function gpuGetPreferredCanvasFormat(gpu) {
  requireRecord(gpu, "gpu");
  return "bgra8unorm";
}

export function gpuRequestAdapter(gpu) {
  requireRecord(gpu, "gpu");
  const options = arguments[1] ?? {};
  if (
    options.powerPreference !== undefined
    && !["low-power", "high-performance"].includes(`${options.powerPreference}`)
  ) {
    return Promise.reject(new TypeError(
      "The powerPreference value is invalid.",
    ));
  }
  return Promise.resolve(createAdapter(Boolean(options.forceFallbackAdapter)));
}

export function recordProperty(value, name, expected) {
  const record = requireRecord(value, expected);
  return record[name];
}

export function setRecordLabel(value, label, expected) {
  requireRecord(value, expected).label = `${label}`;
}

export function adapterRequestDevice(adapter) {
  const record = requireRecord(adapter, "adapter");
  const descriptor = arguments[1] ?? {};
  const requiredFeatures = [...(descriptor.requiredFeatures ?? [])]
    .map(value => `${value}`);
  for (const feature of requiredFeatures) {
    if (!record.features.has(feature)) {
      return Promise.reject(new DOMException(
        `Unsupported GPU feature: ${feature}`,
        "OperationError",
      ));
    }
  }
  const selectedLimits = { ...profile.limits };
  for (const name of Object.keys(descriptor.requiredLimits ?? {})) {
    const requested = Number(descriptor.requiredLimits[name]);
    if (!(name in selectedLimits) || requested > selectedLimits[name]) {
      return Promise.reject(new DOMException(
        `Unsupported GPU limit: ${name}`,
        "OperationError",
      ));
    }
    selectedLimits[name] = requested;
  }
  return Promise.resolve(createDevice(
    requiredFeatures,
    selectedLimits,
    descriptor.label,
  ));
}

export function supportedFeatureOperation(value, name, args) {
  const record = requireRecord(value, "features");
  if (name === "size") return record.values.size;
  if (name === "has") return record.values.has(`${args[0]}`);
  if (name === "keys" || name === "values") return record.values.values();
  if (name === "entries") return record.values.entries();
  if (name === "forEach") {
    const callback = args[0];
    const thisArg = args[1];
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    for (const feature of record.values) {
      Reflect.apply(callback, thisArg, [feature, feature, value]);
    }
    return;
  }
  throw new TypeError("Unsupported feature operation");
}

export function deviceHandler(device, name) {
  return requireRecord(device, "device").handlers.get(name) ?? null;
}

export function setDeviceHandler(device, name, value) {
  requireRecord(device, "device").handlers.set(
    name,
    typeof value === "function" ? value : null,
  );
}

export function deviceOperation(device, name, args) {
  const record = requireRecord(device, "device");
  if (record.destroyed && name !== "destroy") {
    throw new DOMException("The GPUDevice is lost.", "OperationError");
  }
  switch (name) {
    case "createBuffer":
      return createBuffer(record, requireDescriptor(args, name));
    case "createTexture":
      return createTexture(record, requireDescriptor(args, name));
    case "createShaderModule":
      return createShaderModule(record, requireDescriptor(args, name));
    case "createSampler":
      return createOpaque(GPUSampler, "sampler", args[0] ?? {});
    case "createBindGroup":
      return createOpaque(GPUBindGroup, "bindGroup", requireDescriptor(args, name));
    case "createBindGroupLayout":
      return createOpaque(
        GPUBindGroupLayout,
        "bindGroupLayout",
        requireDescriptor(args, name),
      );
    case "createPipelineLayout":
      return createOpaque(
        GPUPipelineLayout,
        "pipelineLayout",
        requireDescriptor(args, name),
      );
    case "createComputePipeline":
      return createOpaque(
        GPUComputePipeline,
        "computePipeline",
        requireDescriptor(args, name),
      );
    case "createComputePipelineAsync":
      return Promise.resolve(deviceOperation(
        device,
        "createComputePipeline",
        args,
      ));
    case "createRenderPipeline":
      return createOpaque(
        GPURenderPipeline,
        "renderPipeline",
        requireDescriptor(args, name),
      );
    case "createRenderPipelineAsync":
      return Promise.resolve(deviceOperation(
        device,
        "createRenderPipeline",
        args,
      ));
    case "createCommandEncoder":
      return createOpaque(GPUCommandEncoder, "commandEncoder", args[0] ?? {});
    case "createRenderBundleEncoder":
      return createOpaque(
        GPURenderBundleEncoder,
        "renderBundleEncoder",
        requireDescriptor(args, name),
      );
    case "createQuerySet":
      return createOpaque(GPUQuerySet, "querySet", requireDescriptor(args, name));
    case "importExternalTexture":
      return createOpaque(
        GPUExternalTexture,
        "externalTexture",
        requireDescriptor(args, name),
      );
    case "pushErrorScope": {
      const filter = `${args[0]}`;
      if (!["validation", "out-of-memory", "internal"].includes(filter)) {
        throw new TypeError("Invalid GPU error filter");
      }
      record.errorScopes.push(filter);
      return;
    }
    case "popErrorScope":
      if (record.errorScopes.length === 0) {
        return Promise.reject(new DOMException(
          "No GPU error scope is available.",
          "OperationError",
        ));
      }
      record.errorScopes.pop();
      return Promise.resolve(null);
    case "destroy":
      destroyDevice(record);
      return;
    default:
      throw new TypeError(`Unsupported GPUDevice operation: ${name}`);
  }
}

export function bufferOperation(buffer, name, args) {
  const record = requireRecord(buffer, "buffer");
  switch (name) {
    case "destroy":
      record.destroyed = true;
      record.mapState = "unmapped";
      record.bytes.fill(0);
      return;
    case "mapAsync":
      return mapBuffer(record, args);
    case "getMappedRange":
      return mappedRange(record, args);
    case "unmap":
      unmapBuffer(record);
      return;
    default:
      throw new TypeError(`Unsupported GPUBuffer operation: ${name}`);
  }
}

export function queueOperation(queue, name, args) {
  const record = requireRecord(queue, "queue");
  if (record.device.destroyed) {
    throw new DOMException("The GPUDevice is lost.", "OperationError");
  }
  switch (name) {
    case "onSubmittedWorkDone":
      return Promise.resolve();
    case "submit":
      record.submissions += [...(args[0] ?? [])].length;
      return;
    case "writeBuffer":
      writeBuffer(args);
      return;
    case "writeTexture":
    case "copyExternalImageToTexture":
      record.writes += 1;
      return;
    default:
      throw new TypeError(`Unsupported GPUQueue operation: ${name}`);
  }
}

export function textureOperation(texture, name, args) {
  const record = requireRecord(texture, "texture");
  if (name === "destroy") {
    record.destroyed = true;
    return;
  }
  if (name === "createView") {
    if (record.destroyed) {
      throw new DOMException("The GPUTexture was destroyed.", "OperationError");
    }
    const descriptor = args[0] ?? {};
    return createRecord(GPUTextureView, "textureView", {
      texture,
      label: `${descriptor.label ?? ""}`,
    });
  }
  throw new TypeError(`Unsupported GPUTexture operation: ${name}`);
}

export function gpuResourceOperation(value, name, args, expected) {
  const record = requireRecord(value, expected);
  if (expected === "querySet") {
    if (name === "destroy") {
      record.destroyed = true;
      return;
    }
  }
  if (expected === "computePipeline" || expected === "renderPipeline") {
    if (name === "getBindGroupLayout") {
      const index = Number(args[0]);
      if (!Number.isSafeInteger(index) || index < 0) {
        throw new RangeError("Bind group layout index is invalid");
      }
      if (!record.bindGroupLayouts.has(index)) {
        record.bindGroupLayouts.set(index, createOpaque(
          GPUBindGroupLayout,
          "bindGroupLayout",
          { label: `${record.label}-bind-group-layout-${index}` },
        ));
      }
      return record.bindGroupLayouts.get(index);
    }
  }
  if (expected === "commandEncoder") {
    requireOpenEncoder(record);
    if (name === "beginComputePass") {
      return createOpaque(GPUComputePassEncoder, "computePassEncoder", {
        ...(args[0] ?? {}),
        parent: record,
      });
    }
    if (name === "beginRenderPass") {
      const descriptor = requireDescriptor(args, name);
      return createOpaque(GPURenderPassEncoder, "renderPassEncoder", {
        ...descriptor,
        parent: record,
      });
    }
    if (name === "finish") {
      record.ended = true;
      return createOpaque(GPUCommandBuffer, "commandBuffer", {
        ...(args[0] ?? {}),
        commands: Object.freeze([...record.commands]),
      });
    }
    record.commands.push(Object.freeze({
      name,
      arguments: Object.freeze([...args]),
    }));
    return;
  }
  if (
    expected === "computePassEncoder"
    || expected === "renderPassEncoder"
    || expected === "renderBundleEncoder"
  ) {
    if (record.ended) {
      throw new DOMException("The GPU encoder has ended.", "InvalidStateError");
    }
    if (name === "end") {
      record.ended = true;
      record.parent?.commands.push(Object.freeze({
        name: expected,
        commands: Object.freeze([...record.commands]),
      }));
      return;
    }
    if (name === "finish") {
      record.ended = true;
      return createOpaque(GPURenderBundle, "renderBundle", {
        ...(args[0] ?? {}),
        commands: Object.freeze([...record.commands]),
      });
    }
    record.commands.push(Object.freeze({
      name,
      arguments: Object.freeze([...args]),
    }));
    return;
  }
  throw new TypeError(`Unsupported ${expected} operation: ${name}`);
}

export function shaderModuleCompilationInfo(module) {
  requireRecord(module, "shaderModule");
  return Promise.resolve(createRecord(GPUCompilationInfo, "compilationInfo", {
    messages: Object.freeze([]),
  }));
}

export function createGPUCanvasContext(canvas) {
  return createRecord(GPUCanvasContext, "canvasContext", {
    canvas,
    configuration: null,
    currentTexture: null,
  });
}

export function canvasContextOperation(context, name, args) {
  const record = requireRecord(context, "canvasContext");
  switch (name) {
    case "configure": {
      const descriptor = requireDescriptor(args, name);
      requireRecord(descriptor.device, "device");
      const format = `${descriptor.format}`;
      if (!["bgra8unorm", "rgba8unorm", "rgba16float"].includes(format)) {
        throw new TypeError("Unsupported GPU canvas format");
      }
      record.configuration = Object.freeze({
        device: descriptor.device,
        format,
        usage: Number(descriptor.usage ?? 0x10),
        alphaMode: `${descriptor.alphaMode ?? "opaque"}`,
        colorSpace: `${descriptor.colorSpace ?? "srgb"}`,
        toneMapping: Object.freeze({
          mode: `${descriptor.toneMapping?.mode ?? "standard"}`,
        }),
        viewFormats: Object.freeze([
          ...(descriptor.viewFormats ?? []),
        ].map(value => `${value}`)),
      });
      record.currentTexture = null;
      return;
    }
    case "getConfiguration":
      return record.configuration;
    case "getCurrentTexture":
      if (record.configuration === null) {
        throw new DOMException(
          "The GPUCanvasContext is not configured.",
          "InvalidStateError",
        );
      }
      if (record.currentTexture === null) {
        record.currentTexture = createTexture(
          requireRecord(record.configuration.device, "device"),
          {
            size: [
              Number(record.canvas.width ?? 1),
              Number(record.canvas.height ?? 1),
              1,
            ],
            format: record.configuration.format,
            usage: record.configuration.usage,
            label: "canvas-current-texture",
          },
        );
      }
      return record.currentTexture;
    case "unconfigure":
      record.currentTexture?.destroy?.();
      record.currentTexture = null;
      record.configuration = null;
      return;
    default:
      throw new TypeError(`Unsupported GPUCanvasContext operation: ${name}`);
  }
}

function createAdapter(forceFallback) {
  const features = createSupportedFeatures(gpuState().profile.features);
  const limits = createSupportedLimits(gpuState().profile.limits);
  const info = createRecord(GPUAdapterInfo, "adapterInfo", {
    vendor: gpuState().profile.vendor,
    architecture: gpuState().profile.architecture,
    device: gpuState().profile.device,
    description: gpuState().profile.description,
    subgroupMinSize: gpuState().profile.subgroupMinSize,
    subgroupMaxSize: gpuState().profile.subgroupMaxSize,
    isFallbackAdapter: forceFallback || gpuState().profile.isFallbackAdapter,
  });
  return createRecord(GPUAdapter, "adapter", {
    features,
    limits,
    info,
  });
}

function createDevice(features, limits, label) {
  let resolveLost;
  const lost = new Promise(resolve => {
    resolveLost = resolve;
  });
  const device = createRecord(GPUDevice, "device", {
    features: createSupportedFeatures(features),
    limits: createSupportedLimits(limits),
    adapterInfo: createRecord(GPUAdapterInfo, "adapterInfo", {
      vendor: gpuState().profile.vendor,
      architecture: gpuState().profile.architecture,
      device: gpuState().profile.device,
      description: gpuState().profile.description,
      subgroupMinSize: gpuState().profile.subgroupMinSize,
      subgroupMaxSize: gpuState().profile.subgroupMaxSize,
      isFallbackAdapter: gpuState().profile.isFallbackAdapter,
    }),
    lost,
    resolveLost,
    queue: null,
    handlers: new Map(),
    label: `${label ?? ""}`,
    destroyed: false,
    errorScopes: [],
  }, true);
  const record = requireRecord(device, "device");
  record.queue = createRecord(GPUQueue, "queue", {
    device: record,
    label: "",
    submissions: 0,
    writes: 0,
  });
  return device;
}

function createBuffer(device, descriptor) {
  const size = Number(descriptor.size);
  const usage = Number(descriptor.usage);
  if (!Number.isSafeInteger(size) || size < 0 || size > device.limits.maxBufferSize) {
    throw new RangeError("GPUBuffer size is outside the supported range");
  }
  if (!Number.isSafeInteger(usage) || usage <= 0) {
    throw new TypeError("GPUBuffer usage must be a non-zero integer");
  }
  return createRecord(GPUBuffer, "buffer", {
    device,
    size,
    usage,
    mapState: descriptor.mappedAtCreation ? "mapped" : "unmapped",
    label: `${descriptor.label ?? ""}`,
    bytes: new Uint8Array(size),
    mappings: [],
    destroyed: false,
  });
}

function createTexture(device, descriptor) {
  const [width, height, depthOrArrayLayers] = textureSize(descriptor.size);
  const format = `${descriptor.format}`;
  if (format === "undefined") throw new TypeError("GPUTexture format is required");
  return createRecord(GPUTexture, "texture", {
    device,
    width,
    height,
    depthOrArrayLayers,
    mipLevelCount: Number(descriptor.mipLevelCount ?? 1),
    sampleCount: Number(descriptor.sampleCount ?? 1),
    dimension: `${descriptor.dimension ?? "2d"}`,
    format,
    usage: Number(descriptor.usage),
    label: `${descriptor.label ?? ""}`,
    textureBindingViewDimension: `${descriptor.dimension ?? "2d"}`,
    destroyed: false,
  });
}

function createShaderModule(device, descriptor) {
  return createRecord(GPUShaderModule, "shaderModule", {
    device,
    code: `${descriptor.code}`,
    label: `${descriptor.label ?? ""}`,
  });
}

function createSupportedFeatures(values) {
  return createRecord(GPUSupportedFeatures, "features", {
    values: new Set(values),
  });
}

function createSupportedLimits(values) {
  return createRecord(GPUSupportedLimits, "limits", { ...values });
}

function createOpaque(constructor, kind, descriptor) {
  const values = {
    descriptor: Object.freeze({ ...descriptor }),
    label: `${descriptor.label ?? ""}`,
  };
  if (["computePipeline", "renderPipeline"].includes(kind)) {
    values.bindGroupLayouts = new Map();
  }
  if (
    ["commandEncoder", "computePassEncoder", "renderPassEncoder", "renderBundleEncoder"]
      .includes(kind)
  ) {
    values.commands = [];
    values.ended = false;
    values.parent = descriptor.parent ?? null;
  }
  if (kind === "querySet") {
    values.type = `${descriptor.type}`;
    values.count = Number(descriptor.count);
    values.destroyed = false;
  }
  return createRecord(constructor, kind, values);
}

function mapBuffer(record, args) {
  if (record.destroyed || record.mapState !== "unmapped") {
    return Promise.reject(new DOMException(
      "The GPUBuffer is not available for mapping.",
      "OperationError",
    ));
  }
  const mode = Number(args[0]);
  if (mode !== 1 && mode !== 2) {
    return Promise.reject(new TypeError("GPUMapMode must be READ or WRITE"));
  }
  const offset = Number(args[1] ?? 0);
  const size = Number(args[2] ?? record.size - offset);
  validateRange(record, offset, size);
  record.mapState = "pending";
  return Promise.resolve().then(() => {
    if (record.destroyed) {
      throw new DOMException("The GPUBuffer was destroyed.", "AbortError");
    }
    record.mapState = "mapped";
    record.mapOffset = offset;
    record.mapSize = size;
  });
}

function mappedRange(record, args) {
  if (record.destroyed || record.mapState !== "mapped") {
    throw new DOMException("The GPUBuffer is not mapped.", "InvalidStateError");
  }
  const offset = Number(args[0] ?? record.mapOffset ?? 0);
  const size = Number(args[1] ?? (
    (record.mapOffset ?? 0) + (record.mapSize ?? record.size) - offset
  ));
  validateRange(record, offset, size);
  const buffer = new ArrayBuffer(size);
  new Uint8Array(buffer).set(record.bytes.subarray(offset, offset + size));
  record.mappings.push({ offset, buffer });
  return buffer;
}

function unmapBuffer(record) {
  if (record.destroyed) return;
  for (const mapping of record.mappings) {
    record.bytes.set(new Uint8Array(mapping.buffer), mapping.offset);
    try {
      ArrayBuffer.prototype.transfer.call(mapping.buffer, 0);
    } catch {
      // A previously detached mapped range needs no further action.
    }
  }
  record.mappings.splice(0);
  record.mapState = "unmapped";
}

function writeBuffer(args) {
  const buffer = args[0];
  const record = requireRecord(buffer, "buffer");
  if (record.destroyed) {
    throw new DOMException("The GPUBuffer was destroyed.", "OperationError");
  }
  const bufferOffset = Number(args[1]);
  const source = sourceBytes(args[2]);
  const dataOffset = Number(args[3] ?? 0);
  const size = Number(args[4] ?? source.byteLength - dataOffset);
  validateRange(record, bufferOffset, size);
  if (
    !Number.isSafeInteger(dataOffset)
    || dataOffset < 0
    || dataOffset + size > source.byteLength
  ) {
    throw new RangeError("GPUQueue source range is invalid");
  }
  record.bytes.set(source.subarray(dataOffset, dataOffset + size), bufferOffset);
}

function sourceBytes(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  throw new TypeError("GPUQueue data must be an ArrayBuffer or view");
}

function destroyDevice(record) {
  if (record.destroyed) return;
  record.destroyed = true;
  const info = createRecord(GPUDeviceLostInfo, "deviceLostInfo", {
    reason: "destroyed",
    message: "The device was destroyed.",
  });
  record.resolveLost(info);
}

function textureSize(value) {
  if (Array.isArray(value)) {
    return [
      positiveDimension(value[0]),
      positiveDimension(value[1] ?? 1),
      positiveDimension(value[2] ?? 1),
    ];
  }
  const input = value ?? {};
  return [
    positiveDimension(input.width),
    positiveDimension(input.height ?? 1),
    positiveDimension(input.depthOrArrayLayers ?? 1),
  ];
}

function positiveDimension(value) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new RangeError("GPU texture dimensions must be positive integers");
  }
  return number;
}

function validateRange(record, offset, size) {
  if (
    !Number.isSafeInteger(offset)
    || !Number.isSafeInteger(size)
    || offset < 0
    || size < 0
    || offset + size > record.size
  ) {
    throw new RangeError("GPUBuffer range is invalid");
  }
}

function createRecord(constructor, kind, values, eventTarget = false) {
  const value = Object.create(constructor.prototype);
  if (eventTarget) initializeEventTarget(value);
  state.set(value, { kind, ...values });
  return value;
}

function requireRecord(value, expected) {
  const record = state.get(value);
  if (record === undefined || record.kind !== expected) {
    throw new TypeError("Illegal invocation");
  }
  return record;
}

function requireDescriptor(args, name) {
  if (args.length === 0 || args[0] === null || typeof args[0] !== "object") {
    throw new TypeError(`${name} requires a descriptor object`);
  }
  return args[0];
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

function constructGPUError(value, newTarget, message, name) {
  if (newTarget === undefined) {
    throw new TypeError(
      `Failed to construct '${name}': Please use the 'new' operator, this DOM object constructor cannot be called as a function.`,
    );
  }
  state.set(value, {
    kind: "gpuError",
    message: `${message ?? ""}`,
  });
}

function requireOpenEncoder(record) {
  if (record.ended) {
    throw new DOMException("The GPUCommandEncoder has finished.", "InvalidStateError");
  }
}
