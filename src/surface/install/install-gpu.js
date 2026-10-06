import { EventTarget } from "../api/event/event-target-constructor.js";
import { Event } from "../api/event/event-constructor.js";
import { DOMException } from "../api/event/dom-exception-constructor.js";
import {
  GPU,
  GPUAdapter,
  GPUAdapterInfo,
  GPUBindGroup,
  GPUBindGroupLayout,
  GPUBuffer,
  GPUCanvasContext,
  GPUCommandBuffer,
  GPUCommandEncoder,
  GPUCompilationInfo,
  GPUCompilationMessage,
  GPUComputePipeline,
  GPUComputePassEncoder,
  GPUDevice,
  GPUDeviceLostInfo,
  GPUError,
  GPUExternalTexture,
  GPUInternalError,
  GPUOutOfMemoryError,
  GPUPipelineError,
  GPUPipelineLayout,
  GPUQuerySet,
  GPUQueue,
  GPURenderBundle,
  GPURenderBundleEncoder,
  GPURenderPassEncoder,
  GPURenderPipeline,
  GPUSampler,
  GPUShaderModule,
  GPUSupportedFeatures,
  GPUSupportedLimits,
  GPUTexture,
  GPUTextureView,
  GPUUncapturedErrorEvent,
  GPUValidationError,
  adapterRequestDevice,
  bufferOperation,
  canvasContextOperation,
  deviceHandler,
  deviceOperation,
  gpuGetPreferredCanvasFormat,
  gpuProperty,
  gpuResourceOperation,
  gpuRequestAdapter,
  queueOperation,
  recordProperty,
  setDeviceHandler,
  setRecordLabel,
  shaderModuleCompilationInfo,
  supportedFeatureOperation,
  textureOperation,
} from "../api/gpu/gpu-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const limitNames = [
  "maxTextureDimension1D",
  "maxTextureDimension2D",
  "maxTextureDimension3D",
  "maxTextureArrayLayers",
  "maxBindGroups",
  "maxBindGroupsPlusVertexBuffers",
  "maxBindingsPerBindGroup",
  "maxDynamicUniformBuffersPerPipelineLayout",
  "maxDynamicStorageBuffersPerPipelineLayout",
  "maxSampledTexturesPerShaderStage",
  "maxSamplersPerShaderStage",
  "maxStorageBuffersPerShaderStage",
  "maxStorageTexturesPerShaderStage",
  "maxUniformBuffersPerShaderStage",
  "maxUniformBufferBindingSize",
  "maxStorageBufferBindingSize",
  "minUniformBufferOffsetAlignment",
  "minStorageBufferOffsetAlignment",
  "maxVertexBuffers",
  "maxBufferSize",
  "maxVertexAttributes",
  "maxVertexBufferArrayStride",
  "maxInterStageShaderVariables",
  "maxColorAttachments",
  "maxColorAttachmentBytesPerSample",
  "maxComputeWorkgroupStorageSize",
  "maxComputeInvocationsPerWorkgroup",
  "maxComputeWorkgroupSizeX",
  "maxComputeWorkgroupSizeY",
  "maxComputeWorkgroupSizeZ",
  "maxComputeWorkgroupsPerDimension",
  "maxImmediateSize",
];

export function installGPU() {
  const constructors = [
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
    GPUCompilationInfo,
    GPUCompilationMessage,
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
    GPUUncapturedErrorEvent,
    GPUValidationError,
  ];

    delete constructors[0].prototype.constructor;
    defineGlobalConstructor(constructors[0].name, constructors[0]);

    delete constructors[1].prototype.constructor;
    defineGlobalConstructor(constructors[1].name, constructors[1]);

    delete constructors[2].prototype.constructor;
    defineGlobalConstructor(constructors[2].name, constructors[2]);

    delete constructors[3].prototype.constructor;
    defineGlobalConstructor(constructors[3].name, constructors[3]);

    delete constructors[4].prototype.constructor;
    defineGlobalConstructor(constructors[4].name, constructors[4]);

    delete constructors[5].prototype.constructor;
    defineGlobalConstructor(constructors[5].name, constructors[5]);

    delete constructors[6].prototype.constructor;
    defineGlobalConstructor(constructors[6].name, constructors[6]);

    delete constructors[7].prototype.constructor;
    defineGlobalConstructor(constructors[7].name, constructors[7]);

    delete constructors[8].prototype.constructor;
    defineGlobalConstructor(constructors[8].name, constructors[8]);

    delete constructors[9].prototype.constructor;
    defineGlobalConstructor(constructors[9].name, constructors[9]);

    delete constructors[10].prototype.constructor;
    defineGlobalConstructor(constructors[10].name, constructors[10]);

    delete constructors[11].prototype.constructor;
    defineGlobalConstructor(constructors[11].name, constructors[11]);

    delete constructors[12].prototype.constructor;
    defineGlobalConstructor(constructors[12].name, constructors[12]);

    delete constructors[13].prototype.constructor;
    defineGlobalConstructor(constructors[13].name, constructors[13]);

    delete constructors[14].prototype.constructor;
    defineGlobalConstructor(constructors[14].name, constructors[14]);

    delete constructors[15].prototype.constructor;
    defineGlobalConstructor(constructors[15].name, constructors[15]);

    delete constructors[16].prototype.constructor;
    defineGlobalConstructor(constructors[16].name, constructors[16]);

    delete constructors[17].prototype.constructor;
    defineGlobalConstructor(constructors[17].name, constructors[17]);

    delete constructors[18].prototype.constructor;
    defineGlobalConstructor(constructors[18].name, constructors[18]);

    delete constructors[19].prototype.constructor;
    defineGlobalConstructor(constructors[19].name, constructors[19]);

    delete constructors[20].prototype.constructor;
    defineGlobalConstructor(constructors[20].name, constructors[20]);

    delete constructors[21].prototype.constructor;
    defineGlobalConstructor(constructors[21].name, constructors[21]);

    delete constructors[22].prototype.constructor;
    defineGlobalConstructor(constructors[22].name, constructors[22]);

    delete constructors[23].prototype.constructor;
    defineGlobalConstructor(constructors[23].name, constructors[23]);

    delete constructors[24].prototype.constructor;
    defineGlobalConstructor(constructors[24].name, constructors[24]);

    delete constructors[25].prototype.constructor;
    defineGlobalConstructor(constructors[25].name, constructors[25]);

    delete constructors[26].prototype.constructor;
    defineGlobalConstructor(constructors[26].name, constructors[26]);

    delete constructors[27].prototype.constructor;
    defineGlobalConstructor(constructors[27].name, constructors[27]);

    delete constructors[28].prototype.constructor;
    defineGlobalConstructor(constructors[28].name, constructors[28]);

    delete constructors[29].prototype.constructor;
    defineGlobalConstructor(constructors[29].name, constructors[29]);

    delete constructors[30].prototype.constructor;
    defineGlobalConstructor(constructors[30].name, constructors[30]);

    delete constructors[31].prototype.constructor;
    defineGlobalConstructor(constructors[31].name, constructors[31]);

    delete constructors[32].prototype.constructor;
    defineGlobalConstructor(constructors[32].name, constructors[32]);

    delete constructors[33].prototype.constructor;
    defineGlobalConstructor(constructors[33].name, constructors[33]);

    delete constructors[34].prototype.constructor;
    defineGlobalConstructor(constructors[34].name, constructors[34]);

  Object.setPrototypeOf(GPUDevice.prototype, EventTarget.prototype);
  Object.setPrototypeOf(GPUDevice, EventTarget);

    Object.setPrototypeOf(GPUInternalError.prototype, GPUError.prototype);
    Object.setPrototypeOf(GPUInternalError, GPUError);

    Object.setPrototypeOf(GPUOutOfMemoryError.prototype, GPUError.prototype);
    Object.setPrototypeOf(GPUOutOfMemoryError, GPUError);

    Object.setPrototypeOf(GPUValidationError.prototype, GPUError.prototype);
    Object.setPrototypeOf(GPUValidationError, GPUError);

  Object.setPrototypeOf(GPUPipelineError.prototype, DOMException.prototype);
  Object.setPrototypeOf(GPUPipelineError, DOMException);
  Object.setPrototypeOf(GPUUncapturedErrorEvent.prototype, Event.prototype);
  Object.setPrototypeOf(GPUUncapturedErrorEvent, Event);
  installGPUInterface();
  installAdapter();
  installAdapterInfo();
  installBuffer();
  installCanvasContext();
  installDevice();
  installDeviceLostInfo();
  installQueue();
  installShaderModule();
  installFeatures();
  installLimits();
  installTexture();
  installTextureView();
  installCompilationInfo();
  installCompilationMessage();
  installBindGroup();
  installBindGroupLayout();
  installCommandBuffer();
  installCommandEncoder();
  installComputePassEncoder();
  installComputePipeline();
  installGPUErrors();
  installExternalTexture();
  installPipelineLayout();
  installQuerySet();
  installRenderBundle();
  installRenderBundleEncoder();
  installRenderPassEncoder();
  installRenderPipeline();
  installSampler();
  installUncapturedErrorEvent();
  installConstants();
}

function installGPUInterface() {
  getter(GPU, "wgslLanguageFeatures", gpuProperty, "gpu");
  method(GPU, "getPreferredCanvasFormat", 0, gpuGetPreferredCanvasFormat);
  method(GPU, "requestAdapter", 0, gpuRequestAdapter);
  finish(GPU);
}

function installAdapter() {

    getter(GPUAdapter, "features", recordProperty, "adapter");

    getter(GPUAdapter, "limits", recordProperty, "adapter");

    getter(GPUAdapter, "info", recordProperty, "adapter");

  method(GPUAdapter, "requestDevice", 0, adapterRequestDevice);
  finish(GPUAdapter);
}

function installAdapterInfo() {
  getter(GPUAdapterInfo, "vendor", recordProperty, "adapterInfo");
getter(GPUAdapterInfo, "architecture", recordProperty, "adapterInfo");
getter(GPUAdapterInfo, "device", recordProperty, "adapterInfo");
getter(GPUAdapterInfo, "description", recordProperty, "adapterInfo");
getter(GPUAdapterInfo, "subgroupMinSize", recordProperty, "adapterInfo");
getter(GPUAdapterInfo, "subgroupMaxSize", recordProperty, "adapterInfo");
getter(GPUAdapterInfo, "isFallbackAdapter", recordProperty, "adapterInfo");
  finish(GPUAdapterInfo);
}

function installBuffer() {

    getter(GPUBuffer, "size", recordProperty, "buffer");

    getter(GPUBuffer, "usage", recordProperty, "buffer");

    getter(GPUBuffer, "mapState", recordProperty, "buffer");

  label(GPUBuffer, "buffer");
  operationMethod(GPUBuffer, "destroy", 0, bufferOperation);
operationMethod(GPUBuffer, "getMappedRange", 0, bufferOperation);
operationMethod(GPUBuffer, "mapAsync", 1, bufferOperation);
operationMethod(GPUBuffer, "unmap", 0, bufferOperation);
  finish(GPUBuffer);
}

function installCanvasContext() {
  getter(GPUCanvasContext, "canvas", recordProperty, "canvasContext");
  operationMethod(GPUCanvasContext, "configure", 1, canvasContextOperation);
operationMethod(GPUCanvasContext, "getConfiguration", 0, canvasContextOperation);
operationMethod(GPUCanvasContext, "getCurrentTexture", 0, canvasContextOperation);
operationMethod(GPUCanvasContext, "unconfigure", 0, canvasContextOperation);
  finish(GPUCanvasContext);
}

function installDevice() {
  getter(GPUDevice, "features", recordProperty, "device");
getter(GPUDevice, "limits", recordProperty, "device");
getter(GPUDevice, "adapterInfo", recordProperty, "device");
getter(GPUDevice, "lost", recordProperty, "device");
getter(GPUDevice, "queue", recordProperty, "device");
  handler(GPUDevice, "onuncapturederror");
  label(GPUDevice, "device");
  operationMethod(GPUDevice, "createBindGroup", 1, deviceOperation);
operationMethod(GPUDevice, "createBindGroupLayout", 1, deviceOperation);
operationMethod(GPUDevice, "createBuffer", 1, deviceOperation);
operationMethod(GPUDevice, "createCommandEncoder", 0, deviceOperation);
operationMethod(GPUDevice, "createComputePipeline", 1, deviceOperation);
operationMethod(GPUDevice, "createComputePipelineAsync", 1, deviceOperation);
operationMethod(GPUDevice, "createPipelineLayout", 1, deviceOperation);
operationMethod(GPUDevice, "createQuerySet", 1, deviceOperation);
operationMethod(GPUDevice, "createRenderBundleEncoder", 1, deviceOperation);
operationMethod(GPUDevice, "createRenderPipeline", 1, deviceOperation);
operationMethod(GPUDevice, "createRenderPipelineAsync", 1, deviceOperation);
operationMethod(GPUDevice, "createSampler", 0, deviceOperation);
operationMethod(GPUDevice, "createShaderModule", 1, deviceOperation);
operationMethod(GPUDevice, "createTexture", 1, deviceOperation);
operationMethod(GPUDevice, "destroy", 0, deviceOperation);
operationMethod(GPUDevice, "importExternalTexture", 1, deviceOperation);
operationMethod(GPUDevice, "popErrorScope", 0, deviceOperation);
operationMethod(GPUDevice, "pushErrorScope", 1, deviceOperation);
  finish(GPUDevice);
}

function installDeviceLostInfo() {
  getter(GPUDeviceLostInfo, "reason", recordProperty, "deviceLostInfo");
  getter(GPUDeviceLostInfo, "message", recordProperty, "deviceLostInfo");
  finish(GPUDeviceLostInfo);
}

function installQueue() {
  label(GPUQueue, "queue");
  operationMethod(GPUQueue, "copyExternalImageToTexture", 3, queueOperation);
operationMethod(GPUQueue, "onSubmittedWorkDone", 0, queueOperation);
operationMethod(GPUQueue, "submit", 1, queueOperation);
operationMethod(GPUQueue, "writeBuffer", 3, queueOperation);
operationMethod(GPUQueue, "writeTexture", 4, queueOperation);
  finish(GPUQueue);
}

function installShaderModule() {
  label(GPUShaderModule, "shaderModule");
  method(
    GPUShaderModule,
    "getCompilationInfo",
    0,
    shaderModuleCompilationInfo,
  );
  finish(GPUShaderModule);
}

function installFeatures() {
  getter(
    GPUSupportedFeatures,
    "size",
    (value, name) => supportedFeatureOperation(value, name, []),
  );
  const callbacks = new Map();
  {
    const callback = {
      ["entries"](...args) {
        return supportedFeatureOperation(this, "entries", args);
      },
    }["entries"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "entries");
    definePrototypeMethod(GPUSupportedFeatures.prototype, "entries", callback);
    callbacks.set("entries", callback);
  }
{
    const callback = {
      ["forEach"](...args) {
        return supportedFeatureOperation(this, "forEach", args);
      },
    }["forEach"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "forEach");
    definePrototypeMethod(GPUSupportedFeatures.prototype, "forEach", callback);
    callbacks.set("forEach", callback);
  }
{
    const callback = {
      ["has"](...args) {
        return supportedFeatureOperation(this, "has", args);
      },
    }["has"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "has");
    definePrototypeMethod(GPUSupportedFeatures.prototype, "has", callback);
    callbacks.set("has", callback);
  }
{
    const callback = {
      ["keys"](...args) {
        return supportedFeatureOperation(this, "keys", args);
      },
    }["keys"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "keys");
    definePrototypeMethod(GPUSupportedFeatures.prototype, "keys", callback);
    callbacks.set("keys", callback);
  }
{
    const callback = {
      ["values"](...args) {
        return supportedFeatureOperation(this, "values", args);
      },
    }["values"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "values");
    definePrototypeMethod(GPUSupportedFeatures.prototype, "values", callback);
    callbacks.set("values", callback);
  }
  defineConstructorBacklink(
    GPUSupportedFeatures.prototype,
    GPUSupportedFeatures,
  );
  defineToStringTag(
    GPUSupportedFeatures.prototype,
    "GPUSupportedFeatures",
  );
  Object.defineProperty(GPUSupportedFeatures.prototype, Symbol.iterator, {
    value: callbacks.get("values"),
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function installLimits() {

    getter(GPUSupportedLimits, "maxTextureDimension1D", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxTextureDimension2D", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxTextureDimension3D", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxTextureArrayLayers", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxBindGroups", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxBindGroupsPlusVertexBuffers", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxBindingsPerBindGroup", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxDynamicUniformBuffersPerPipelineLayout", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxDynamicStorageBuffersPerPipelineLayout", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxSampledTexturesPerShaderStage", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxSamplersPerShaderStage", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxStorageBuffersPerShaderStage", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxStorageTexturesPerShaderStage", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxUniformBuffersPerShaderStage", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxUniformBufferBindingSize", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxStorageBufferBindingSize", recordProperty, "limits");

    getter(GPUSupportedLimits, "minUniformBufferOffsetAlignment", recordProperty, "limits");

    getter(GPUSupportedLimits, "minStorageBufferOffsetAlignment", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxVertexBuffers", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxBufferSize", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxVertexAttributes", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxVertexBufferArrayStride", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxInterStageShaderVariables", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxColorAttachments", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxColorAttachmentBytesPerSample", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxComputeWorkgroupStorageSize", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxComputeInvocationsPerWorkgroup", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxComputeWorkgroupSizeX", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxComputeWorkgroupSizeY", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxComputeWorkgroupSizeZ", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxComputeWorkgroupsPerDimension", recordProperty, "limits");

    getter(GPUSupportedLimits, "maxImmediateSize", recordProperty, "limits");

  defineConstructorBacklink(GPUSupportedLimits.prototype, GPUSupportedLimits);
  getter(GPUSupportedLimits, "maxStorageBuffersInFragmentStage", recordProperty, "limits");
getter(GPUSupportedLimits, "maxStorageTexturesInFragmentStage", recordProperty, "limits");
getter(GPUSupportedLimits, "maxStorageBuffersInVertexStage", recordProperty, "limits");
getter(GPUSupportedLimits, "maxStorageTexturesInVertexStage", recordProperty, "limits");
  defineToStringTag(GPUSupportedLimits.prototype, "GPUSupportedLimits");
}

function installTexture() {
  getter(GPUTexture, "width", recordProperty, "texture");
getter(GPUTexture, "height", recordProperty, "texture");
getter(GPUTexture, "depthOrArrayLayers", recordProperty, "texture");
getter(GPUTexture, "mipLevelCount", recordProperty, "texture");
getter(GPUTexture, "sampleCount", recordProperty, "texture");
getter(GPUTexture, "dimension", recordProperty, "texture");
getter(GPUTexture, "format", recordProperty, "texture");
getter(GPUTexture, "usage", recordProperty, "texture");
  label(GPUTexture, "texture");
  operationMethod(GPUTexture, "createView", 0, textureOperation);
  operationMethod(GPUTexture, "destroy", 0, textureOperation);
  defineConstructorBacklink(GPUTexture.prototype, GPUTexture);
  getter(
    GPUTexture,
    "textureBindingViewDimension",
    recordProperty,
    "texture",
  );
  defineToStringTag(GPUTexture.prototype, "GPUTexture");
}

function installTextureView() {
  label(GPUTextureView, "textureView");
  finish(GPUTextureView);
}

function installCompilationInfo() {
  getter(GPUCompilationInfo, "messages", recordProperty, "compilationInfo");
  finish(GPUCompilationInfo);
}

function installCompilationMessage() {
  getter(GPUCompilationMessage, "message", recordProperty, "compilationMessage");
getter(GPUCompilationMessage, "type", recordProperty, "compilationMessage");
getter(GPUCompilationMessage, "lineNum", recordProperty, "compilationMessage");
getter(GPUCompilationMessage, "linePos", recordProperty, "compilationMessage");
getter(GPUCompilationMessage, "offset", recordProperty, "compilationMessage");
getter(GPUCompilationMessage, "length", recordProperty, "compilationMessage");
  finish(GPUCompilationMessage);
}

function installBindGroup() {
  label(GPUBindGroup, "bindGroup");
  finish(GPUBindGroup);
}

function installBindGroupLayout() {
  label(GPUBindGroupLayout, "bindGroupLayout");
  finish(GPUBindGroupLayout);
}

function installCommandBuffer() {
  label(GPUCommandBuffer, "commandBuffer");
  finish(GPUCommandBuffer);
}

function installCommandEncoder() {
  label(GPUCommandEncoder, "commandEncoder");
  {
  {
    const callback = {
      ["beginComputePass"](...args) {
        return gpuResourceOperation(this, "beginComputePass", args, "commandEncoder");
      },
    }["beginComputePass"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "beginComputePass");
    definePrototypeMethod(GPUCommandEncoder.prototype, "beginComputePass", callback);
  }
{
    const callback = {
      ["beginRenderPass"](...args) {
        return gpuResourceOperation(this, "beginRenderPass", args, "commandEncoder");
      },
    }["beginRenderPass"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "beginRenderPass");
    definePrototypeMethod(GPUCommandEncoder.prototype, "beginRenderPass", callback);
  }
{
    const callback = {
      ["copyBufferToTexture"](...args) {
        return gpuResourceOperation(this, "copyBufferToTexture", args, "commandEncoder");
      },
    }["copyBufferToTexture"];
    Object.defineProperty(callback, "length", {
      value: 3,
      configurable: true,
    });
    registerNativeFunction(callback, "copyBufferToTexture");
    definePrototypeMethod(GPUCommandEncoder.prototype, "copyBufferToTexture", callback);
  }
{
    const callback = {
      ["copyTextureToBuffer"](...args) {
        return gpuResourceOperation(this, "copyTextureToBuffer", args, "commandEncoder");
      },
    }["copyTextureToBuffer"];
    Object.defineProperty(callback, "length", {
      value: 3,
      configurable: true,
    });
    registerNativeFunction(callback, "copyTextureToBuffer");
    definePrototypeMethod(GPUCommandEncoder.prototype, "copyTextureToBuffer", callback);
  }
{
    const callback = {
      ["copyTextureToTexture"](...args) {
        return gpuResourceOperation(this, "copyTextureToTexture", args, "commandEncoder");
      },
    }["copyTextureToTexture"];
    Object.defineProperty(callback, "length", {
      value: 3,
      configurable: true,
    });
    registerNativeFunction(callback, "copyTextureToTexture");
    definePrototypeMethod(GPUCommandEncoder.prototype, "copyTextureToTexture", callback);
  }
{
    const callback = {
      ["finish"](...args) {
        return gpuResourceOperation(this, "finish", args, "commandEncoder");
      },
    }["finish"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "finish");
    definePrototypeMethod(GPUCommandEncoder.prototype, "finish", callback);
  }
{
    const callback = {
      ["insertDebugMarker"](...args) {
        return gpuResourceOperation(this, "insertDebugMarker", args, "commandEncoder");
      },
    }["insertDebugMarker"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "insertDebugMarker");
    definePrototypeMethod(GPUCommandEncoder.prototype, "insertDebugMarker", callback);
  }
{
    const callback = {
      ["pushDebugGroup"](...args) {
        return gpuResourceOperation(this, "pushDebugGroup", args, "commandEncoder");
      },
    }["pushDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "pushDebugGroup");
    definePrototypeMethod(GPUCommandEncoder.prototype, "pushDebugGroup", callback);
  }
{
    const callback = {
      ["clearBuffer"](...args) {
        return gpuResourceOperation(this, "clearBuffer", args, "commandEncoder");
      },
    }["clearBuffer"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "clearBuffer");
    definePrototypeMethod(GPUCommandEncoder.prototype, "clearBuffer", callback);
  }
{
    const callback = {
      ["copyBufferToBuffer"](...args) {
        return gpuResourceOperation(this, "copyBufferToBuffer", args, "commandEncoder");
      },
    }["copyBufferToBuffer"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "copyBufferToBuffer");
    definePrototypeMethod(GPUCommandEncoder.prototype, "copyBufferToBuffer", callback);
  }
{
    const callback = {
      ["popDebugGroup"](...args) {
        return gpuResourceOperation(this, "popDebugGroup", args, "commandEncoder");
      },
    }["popDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "popDebugGroup");
    definePrototypeMethod(GPUCommandEncoder.prototype, "popDebugGroup", callback);
  }
{
    const callback = {
      ["resolveQuerySet"](...args) {
        return gpuResourceOperation(this, "resolveQuerySet", args, "commandEncoder");
      },
    }["resolveQuerySet"];
    Object.defineProperty(callback, "length", {
      value: 5,
      configurable: true,
    });
    registerNativeFunction(callback, "resolveQuerySet");
    definePrototypeMethod(GPUCommandEncoder.prototype, "resolveQuerySet", callback);
  }
}
  finish(GPUCommandEncoder);
}

function installComputePassEncoder() {
  label(GPUComputePassEncoder, "computePassEncoder");
  {
  {
    const callback = {
      ["insertDebugMarker"](...args) {
        return gpuResourceOperation(this, "insertDebugMarker", args, "computePassEncoder");
      },
    }["insertDebugMarker"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "insertDebugMarker");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "insertDebugMarker", callback);
  }
{
    const callback = {
      ["pushDebugGroup"](...args) {
        return gpuResourceOperation(this, "pushDebugGroup", args, "computePassEncoder");
      },
    }["pushDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "pushDebugGroup");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "pushDebugGroup", callback);
  }
{
    const callback = {
      ["dispatchWorkgroups"](...args) {
        return gpuResourceOperation(this, "dispatchWorkgroups", args, "computePassEncoder");
      },
    }["dispatchWorkgroups"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "dispatchWorkgroups");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "dispatchWorkgroups", callback);
  }
{
    const callback = {
      ["dispatchWorkgroupsIndirect"](...args) {
        return gpuResourceOperation(this, "dispatchWorkgroupsIndirect", args, "computePassEncoder");
      },
    }["dispatchWorkgroupsIndirect"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "dispatchWorkgroupsIndirect");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "dispatchWorkgroupsIndirect", callback);
  }
{
    const callback = {
      ["end"](...args) {
        return gpuResourceOperation(this, "end", args, "computePassEncoder");
      },
    }["end"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "end");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "end", callback);
  }
{
    const callback = {
      ["popDebugGroup"](...args) {
        return gpuResourceOperation(this, "popDebugGroup", args, "computePassEncoder");
      },
    }["popDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "popDebugGroup");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "popDebugGroup", callback);
  }
{
    const callback = {
      ["setBindGroup"](...args) {
        return gpuResourceOperation(this, "setBindGroup", args, "computePassEncoder");
      },
    }["setBindGroup"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setBindGroup");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "setBindGroup", callback);
  }
{
    const callback = {
      ["setPipeline"](...args) {
        return gpuResourceOperation(this, "setPipeline", args, "computePassEncoder");
      },
    }["setPipeline"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "setPipeline");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "setPipeline", callback);
  }
{
    const callback = {
      ["writeTimestamp"](...args) {
        return gpuResourceOperation(this, "writeTimestamp", args, "computePassEncoder");
      },
    }["writeTimestamp"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "writeTimestamp");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "writeTimestamp", callback);
  }
{
    const callback = {
      ["setImmediates"](...args) {
        return gpuResourceOperation(this, "setImmediates", args, "computePassEncoder");
      },
    }["setImmediates"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setImmediates");
    definePrototypeMethod(GPUComputePassEncoder.prototype, "setImmediates", callback);
  }
}
  finish(GPUComputePassEncoder);
}

function installComputePipeline() {
  label(GPUComputePipeline, "computePipeline");
  {
    const callback = {
      ["getBindGroupLayout"](...args) {
        return gpuResourceOperation(this, "getBindGroupLayout", args, "computePipeline");
      },
    }["getBindGroupLayout"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "getBindGroupLayout");
    definePrototypeMethod(GPUComputePipeline.prototype, "getBindGroupLayout", callback);
  }
  finish(GPUComputePipeline);
}

function installGPUErrors() {
  getter(GPUError, "message", recordProperty, "gpuError");
  finish(GPUError);
  finish(GPUInternalError);
  finish(GPUOutOfMemoryError);
  getter(GPUPipelineError, "reason", recordProperty, "pipelineError");
  finish(GPUPipelineError);
  finish(GPUValidationError);
}

function installExternalTexture() {
  label(GPUExternalTexture, "externalTexture");
  finish(GPUExternalTexture);
}

function installPipelineLayout() {
  label(GPUPipelineLayout, "pipelineLayout");
  finish(GPUPipelineLayout);
}

function installQuerySet() {
  getter(GPUQuerySet, "type", recordProperty, "querySet");
  getter(GPUQuerySet, "count", recordProperty, "querySet");
  label(GPUQuerySet, "querySet");
  {
    const callback = {
      ["destroy"](...args) {
        return gpuResourceOperation(this, "destroy", args, "querySet");
      },
    }["destroy"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "destroy");
    definePrototypeMethod(GPUQuerySet.prototype, "destroy", callback);
  }
  finish(GPUQuerySet);
}

function installRenderBundle() {
  label(GPURenderBundle, "renderBundle");
  finish(GPURenderBundle);
}

function installRenderBundleEncoder() {
  label(GPURenderBundleEncoder, "renderBundleEncoder");
  {
  {
    const callback = {
      ["finish"](...args) {
        return gpuResourceOperation(this, "finish", args, "renderBundleEncoder");
      },
    }["finish"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "finish");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "finish", callback);
  }
{
    const callback = {
      ["insertDebugMarker"](...args) {
        return gpuResourceOperation(this, "insertDebugMarker", args, "renderBundleEncoder");
      },
    }["insertDebugMarker"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "insertDebugMarker");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "insertDebugMarker", callback);
  }
{
    const callback = {
      ["pushDebugGroup"](...args) {
        return gpuResourceOperation(this, "pushDebugGroup", args, "renderBundleEncoder");
      },
    }["pushDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "pushDebugGroup");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "pushDebugGroup", callback);
  }
{
    const callback = {
      ["setIndexBuffer"](...args) {
        return gpuResourceOperation(this, "setIndexBuffer", args, "renderBundleEncoder");
      },
    }["setIndexBuffer"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setIndexBuffer");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "setIndexBuffer", callback);
  }
{
    const callback = {
      ["draw"](...args) {
        return gpuResourceOperation(this, "draw", args, "renderBundleEncoder");
      },
    }["draw"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "draw");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "draw", callback);
  }
{
    const callback = {
      ["drawIndexed"](...args) {
        return gpuResourceOperation(this, "drawIndexed", args, "renderBundleEncoder");
      },
    }["drawIndexed"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "drawIndexed");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "drawIndexed", callback);
  }
{
    const callback = {
      ["drawIndexedIndirect"](...args) {
        return gpuResourceOperation(this, "drawIndexedIndirect", args, "renderBundleEncoder");
      },
    }["drawIndexedIndirect"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "drawIndexedIndirect");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "drawIndexedIndirect", callback);
  }
{
    const callback = {
      ["drawIndirect"](...args) {
        return gpuResourceOperation(this, "drawIndirect", args, "renderBundleEncoder");
      },
    }["drawIndirect"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "drawIndirect");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "drawIndirect", callback);
  }
{
    const callback = {
      ["popDebugGroup"](...args) {
        return gpuResourceOperation(this, "popDebugGroup", args, "renderBundleEncoder");
      },
    }["popDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "popDebugGroup");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "popDebugGroup", callback);
  }
{
    const callback = {
      ["setBindGroup"](...args) {
        return gpuResourceOperation(this, "setBindGroup", args, "renderBundleEncoder");
      },
    }["setBindGroup"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setBindGroup");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "setBindGroup", callback);
  }
{
    const callback = {
      ["setPipeline"](...args) {
        return gpuResourceOperation(this, "setPipeline", args, "renderBundleEncoder");
      },
    }["setPipeline"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "setPipeline");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "setPipeline", callback);
  }
{
    const callback = {
      ["setVertexBuffer"](...args) {
        return gpuResourceOperation(this, "setVertexBuffer", args, "renderBundleEncoder");
      },
    }["setVertexBuffer"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setVertexBuffer");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "setVertexBuffer", callback);
  }
{
    const callback = {
      ["setImmediates"](...args) {
        return gpuResourceOperation(this, "setImmediates", args, "renderBundleEncoder");
      },
    }["setImmediates"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setImmediates");
    definePrototypeMethod(GPURenderBundleEncoder.prototype, "setImmediates", callback);
  }
}
  finish(GPURenderBundleEncoder);
}

function installRenderPassEncoder() {
  label(GPURenderPassEncoder, "renderPassEncoder");
  {
  {
    const callback = {
      ["executeBundles"](...args) {
        return gpuResourceOperation(this, "executeBundles", args, "renderPassEncoder");
      },
    }["executeBundles"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "executeBundles");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "executeBundles", callback);
  }
{
    const callback = {
      ["insertDebugMarker"](...args) {
        return gpuResourceOperation(this, "insertDebugMarker", args, "renderPassEncoder");
      },
    }["insertDebugMarker"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "insertDebugMarker");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "insertDebugMarker", callback);
  }
{
    const callback = {
      ["pushDebugGroup"](...args) {
        return gpuResourceOperation(this, "pushDebugGroup", args, "renderPassEncoder");
      },
    }["pushDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "pushDebugGroup");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "pushDebugGroup", callback);
  }
{
    const callback = {
      ["setBlendConstant"](...args) {
        return gpuResourceOperation(this, "setBlendConstant", args, "renderPassEncoder");
      },
    }["setBlendConstant"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "setBlendConstant");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setBlendConstant", callback);
  }
{
    const callback = {
      ["setIndexBuffer"](...args) {
        return gpuResourceOperation(this, "setIndexBuffer", args, "renderPassEncoder");
      },
    }["setIndexBuffer"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setIndexBuffer");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setIndexBuffer", callback);
  }
{
    const callback = {
      ["beginOcclusionQuery"](...args) {
        return gpuResourceOperation(this, "beginOcclusionQuery", args, "renderPassEncoder");
      },
    }["beginOcclusionQuery"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "beginOcclusionQuery");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "beginOcclusionQuery", callback);
  }
{
    const callback = {
      ["draw"](...args) {
        return gpuResourceOperation(this, "draw", args, "renderPassEncoder");
      },
    }["draw"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "draw");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "draw", callback);
  }
{
    const callback = {
      ["drawIndexed"](...args) {
        return gpuResourceOperation(this, "drawIndexed", args, "renderPassEncoder");
      },
    }["drawIndexed"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "drawIndexed");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "drawIndexed", callback);
  }
{
    const callback = {
      ["drawIndexedIndirect"](...args) {
        return gpuResourceOperation(this, "drawIndexedIndirect", args, "renderPassEncoder");
      },
    }["drawIndexedIndirect"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "drawIndexedIndirect");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "drawIndexedIndirect", callback);
  }
{
    const callback = {
      ["drawIndirect"](...args) {
        return gpuResourceOperation(this, "drawIndirect", args, "renderPassEncoder");
      },
    }["drawIndirect"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "drawIndirect");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "drawIndirect", callback);
  }
{
    const callback = {
      ["end"](...args) {
        return gpuResourceOperation(this, "end", args, "renderPassEncoder");
      },
    }["end"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "end");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "end", callback);
  }
{
    const callback = {
      ["endOcclusionQuery"](...args) {
        return gpuResourceOperation(this, "endOcclusionQuery", args, "renderPassEncoder");
      },
    }["endOcclusionQuery"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "endOcclusionQuery");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "endOcclusionQuery", callback);
  }
{
    const callback = {
      ["popDebugGroup"](...args) {
        return gpuResourceOperation(this, "popDebugGroup", args, "renderPassEncoder");
      },
    }["popDebugGroup"];
    Object.defineProperty(callback, "length", {
      value: 0,
      configurable: true,
    });
    registerNativeFunction(callback, "popDebugGroup");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "popDebugGroup", callback);
  }
{
    const callback = {
      ["setBindGroup"](...args) {
        return gpuResourceOperation(this, "setBindGroup", args, "renderPassEncoder");
      },
    }["setBindGroup"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setBindGroup");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setBindGroup", callback);
  }
{
    const callback = {
      ["setPipeline"](...args) {
        return gpuResourceOperation(this, "setPipeline", args, "renderPassEncoder");
      },
    }["setPipeline"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "setPipeline");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setPipeline", callback);
  }
{
    const callback = {
      ["setScissorRect"](...args) {
        return gpuResourceOperation(this, "setScissorRect", args, "renderPassEncoder");
      },
    }["setScissorRect"];
    Object.defineProperty(callback, "length", {
      value: 4,
      configurable: true,
    });
    registerNativeFunction(callback, "setScissorRect");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setScissorRect", callback);
  }
{
    const callback = {
      ["setStencilReference"](...args) {
        return gpuResourceOperation(this, "setStencilReference", args, "renderPassEncoder");
      },
    }["setStencilReference"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "setStencilReference");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setStencilReference", callback);
  }
{
    const callback = {
      ["setVertexBuffer"](...args) {
        return gpuResourceOperation(this, "setVertexBuffer", args, "renderPassEncoder");
      },
    }["setVertexBuffer"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setVertexBuffer");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setVertexBuffer", callback);
  }
{
    const callback = {
      ["setViewport"](...args) {
        return gpuResourceOperation(this, "setViewport", args, "renderPassEncoder");
      },
    }["setViewport"];
    Object.defineProperty(callback, "length", {
      value: 6,
      configurable: true,
    });
    registerNativeFunction(callback, "setViewport");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setViewport", callback);
  }
{
    const callback = {
      ["writeTimestamp"](...args) {
        return gpuResourceOperation(this, "writeTimestamp", args, "renderPassEncoder");
      },
    }["writeTimestamp"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "writeTimestamp");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "writeTimestamp", callback);
  }
{
    const callback = {
      ["setImmediates"](...args) {
        return gpuResourceOperation(this, "setImmediates", args, "renderPassEncoder");
      },
    }["setImmediates"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "setImmediates");
    definePrototypeMethod(GPURenderPassEncoder.prototype, "setImmediates", callback);
  }
}
  finish(GPURenderPassEncoder);
}

function installRenderPipeline() {
  label(GPURenderPipeline, "renderPipeline");
  {
    const callback = {
      ["getBindGroupLayout"](...args) {
        return gpuResourceOperation(this, "getBindGroupLayout", args, "renderPipeline");
      },
    }["getBindGroupLayout"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "getBindGroupLayout");
    definePrototypeMethod(GPURenderPipeline.prototype, "getBindGroupLayout", callback);
  }
  finish(GPURenderPipeline);
}

function installSampler() {
  label(GPUSampler, "sampler");
  finish(GPUSampler);
}

function installUncapturedErrorEvent() {
  getter(
    GPUUncapturedErrorEvent,
    "error",
    recordProperty,
    "uncapturedErrorEvent",
  );
  finish(GPUUncapturedErrorEvent);
}

function getter(constructor, name, operation, expected) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return operation(this, name, expected);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  definePrototypeGetter(constructor.prototype, name, descriptor.get);
}

function label(constructor, expected) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get label() {
      return recordProperty(this, "label", expected);
    },
    set label(value) {
      setRecordLabel(this, value, expected);
    },
  }, "label");
  registerNativeGetter(descriptor.get, "label");
  registerNativeFunction(descriptor.set, "set label");
  definePrototypeAccessor(
    constructor.prototype,
    "label",
    descriptor.get,
    descriptor.set,
  );
}

function handler(constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return deviceHandler(this, name);
    },
    set [name](value) {
      setDeviceHandler(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  definePrototypeAccessor(
    constructor.prototype,
    name,
    descriptor.get,
    descriptor.set,
  );
}

function method(constructor, name, length, operation) {
  const callback = {
    [name](...args) {
      return Reflect.apply(operation, undefined, [this, ...args]);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(constructor.prototype, name, callback);
}

function operationMethod(constructor, name, length, operation) {
  const callback = {
    [name](...args) {
      return operation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(constructor.prototype, name, callback);
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}

function installConstants() {
  {
    const value = {};

      Object.defineProperty(value, "READ", {
        value: 1,
        enumerable: true,
      });

      Object.defineProperty(value, "WRITE", {
        value: 2,
        enumerable: true,
      });

    Object.defineProperty(value, Symbol.toStringTag, {
      value: "GPUMapMode",
      enumerable: false,
      configurable: true,
    });
    Object.freeze(value);
    Object.defineProperty(globalThis, "GPUMapMode", {
      value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
{
    const value = {};

      Object.defineProperty(value, "VERTEX", {
        value: 1,
        enumerable: true,
      });

      Object.defineProperty(value, "FRAGMENT", {
        value: 2,
        enumerable: true,
      });

      Object.defineProperty(value, "COMPUTE", {
        value: 4,
        enumerable: true,
      });

    Object.defineProperty(value, Symbol.toStringTag, {
      value: "GPUShaderStage",
      enumerable: false,
      configurable: true,
    });
    Object.freeze(value);
    Object.defineProperty(globalThis, "GPUShaderStage", {
      value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
{
    const value = {};

      Object.defineProperty(value, "MAP_READ", {
        value: 1,
        enumerable: true,
      });

      Object.defineProperty(value, "MAP_WRITE", {
        value: 2,
        enumerable: true,
      });

      Object.defineProperty(value, "COPY_SRC", {
        value: 4,
        enumerable: true,
      });

      Object.defineProperty(value, "COPY_DST", {
        value: 8,
        enumerable: true,
      });

      Object.defineProperty(value, "INDEX", {
        value: 16,
        enumerable: true,
      });

      Object.defineProperty(value, "VERTEX", {
        value: 32,
        enumerable: true,
      });

      Object.defineProperty(value, "UNIFORM", {
        value: 64,
        enumerable: true,
      });

      Object.defineProperty(value, "STORAGE", {
        value: 128,
        enumerable: true,
      });

      Object.defineProperty(value, "INDIRECT", {
        value: 256,
        enumerable: true,
      });

      Object.defineProperty(value, "QUERY_RESOLVE", {
        value: 512,
        enumerable: true,
      });

    Object.defineProperty(value, Symbol.toStringTag, {
      value: "GPUBufferUsage",
      enumerable: false,
      configurable: true,
    });
    Object.freeze(value);
    Object.defineProperty(globalThis, "GPUBufferUsage", {
      value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
{
    const value = {};

      Object.defineProperty(value, "COPY_SRC", {
        value: 1,
        enumerable: true,
      });

      Object.defineProperty(value, "COPY_DST", {
        value: 2,
        enumerable: true,
      });

      Object.defineProperty(value, "TEXTURE_BINDING", {
        value: 4,
        enumerable: true,
      });

      Object.defineProperty(value, "STORAGE_BINDING", {
        value: 8,
        enumerable: true,
      });

      Object.defineProperty(value, "RENDER_ATTACHMENT", {
        value: 16,
        enumerable: true,
      });

      Object.defineProperty(value, "TRANSIENT_ATTACHMENT", {
        value: 32,
        enumerable: true,
      });

    Object.defineProperty(value, Symbol.toStringTag, {
      value: "GPUTextureUsage",
      enumerable: false,
      configurable: true,
    });
    Object.freeze(value);
    Object.defineProperty(globalThis, "GPUTextureUsage", {
      value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
{
    const value = {};

      Object.defineProperty(value, "RED", {
        value: 1,
        enumerable: true,
      });

      Object.defineProperty(value, "GREEN", {
        value: 2,
        enumerable: true,
      });

      Object.defineProperty(value, "BLUE", {
        value: 4,
        enumerable: true,
      });

      Object.defineProperty(value, "ALPHA", {
        value: 8,
        enumerable: true,
      });

      Object.defineProperty(value, "ALL", {
        value: 15,
        enumerable: true,
      });

    Object.defineProperty(value, Symbol.toStringTag, {
      value: "GPUColorWrite",
      enumerable: false,
      configurable: true,
    });
    Object.freeze(value);
    Object.defineProperty(globalThis, "GPUColorWrite", {
      value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
}
