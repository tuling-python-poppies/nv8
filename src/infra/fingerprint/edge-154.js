// Edge 154 (Chromium 154) fingerprint
// UA build: 154.0.4258.53 — matches the local Edge 154 release channel
import { GPU_IDENTITIES } from "./gpu-profiles.js";
import {
  neutralExternalDevices,
  neutralMediaDevices,
} from "./neutral-device-capabilities.js";

// Use a plausible shipped GPU identity, not the collector machine's exact GPU.
const selectedGpu = GPU_IDENTITIES[1];

const navigatorProfile = Object.freeze({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36 Edg/154.0.0.0",
  platform: "Win32",
  languages: Object.freeze(["zh-CN", "zh"]),
  language: "zh-CN",
  hardwareConcurrency: 16,
  deviceMemory: 8,
  cpuPerformance: 4,
  vendorSub: "",
  productSub: "20030107",
  vendor: "Google Inc.",
  maxTouchPoints: 0,
  doNotTrack: null,
  cookieEnabled: true,
  appCodeName: "Mozilla",
  appName: "Netscape",
  product: "Gecko",
  webdriver: false,
  pdfViewerEnabled: true,
  userAgentData: Object.freeze({
    architecture: "x86",
    bitness: "64",
    model: "",
    platformVersion: "19.0.0",
    uaFullVersion: "154.0.4258.53",
    wow64: false,
    formFactors: Object.freeze(["Desktop"]),
    mobile: false,
  }),
  plugins: Object.freeze([
    { name: "PDF Viewer",              filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "Chrome PDF Viewer",       filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "Chromium PDF Viewer",     filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "Microsoft Edge PDF Viewer", filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "WebKit built-in PDF",     filename: "internal-pdf-viewer", description: "Portable Document Format" },
  ]),
  mimeTypes: Object.freeze([
    { type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" },
    { type: "text/pdf",        suffixes: "pdf", description: "Portable Document Format" },
  ]),
});

const screenProfile = Object.freeze({
  width: 1920,
  height: 1080,
  availWidth: 1920,
  availHeight: 1040,
  colorDepth: 24,
  pixelDepth: 24,
  devicePixelRatio: 1,
  availLeft: 0,
  availTop: 0,
  isExtended: false,
});

const renderingProfile = Object.freeze({
  webglVendor: selectedGpu.webglVendor,
  webglRenderer: selectedGpu.webglRenderer,
  webgpu: Object.freeze({
    ...selectedGpu.webgpu,
    features: Object.freeze([
      "depth-clip-control",
      "texture-compression-bc",
      "timestamp-query",
      "indirect-first-instance",
      "shader-f16",
      "bgra8unorm-storage",
      "float32-filterable",
    ]),
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
  }),
});

const timingProfile = Object.freeze({
  timeOriginMs: null,
  wallClockOffsetMs: 0,
  dateNowResolutionMs: 0,
  performanceResolutionMs: 0.1,
  performanceJitterMs: 0,
  jitterSeed: 0x4e5639,
  minimumTimerDelayMs: 0,
  animationFrameIntervalMs: 16,
});

const capabilityProfile = Object.freeze({
  network: Object.freeze({
    online: true,
    effectiveType: "4g",
    rtt: 50,
    downlink: 866.7,
    saveData: false,
  }),
  serviceWorker: Object.freeze({
    enabled: true,
  }),
  media: Object.freeze({
    audioCodecs: Object.freeze([
      "opus",
      "vorbis",
      "mp4a",
      "flac",
      "pcm",
      "mp3",
    ]),
    videoCodecs: Object.freeze([
      "vp8",
      "vp09",
      "av01",
      "avc1",
      "hvc1",
      "hev1",
    ]),
    imageTypes: Object.freeze([
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/avif",
    ]),
    powerEfficient: true,
    captureEnabled: false,
    devices: neutralMediaDevices,
  }),
  sensors: Object.freeze({
    accelerometer: null,
    gravitySensor: null,
    linearAccelerationSensor: null,
    gyroscope: null,
    absoluteOrientationSensor: null,
    relativeOrientationSensor: null,
  }),
  externalDevices: neutralExternalDevices,
});

export const edge154Fingerprint = Object.freeze({
  browserMajorVersion: 154,
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  navigator: navigatorProfile,
  screen: screenProfile,
  rendering: renderingProfile,
  timing: timingProfile,
  capabilities: capabilityProfile,
});
