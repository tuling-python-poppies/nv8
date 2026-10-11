// Edge 150 profile；当前采集基准为真实 Edge 152（fixtures/fingerprint/edge-real.json）。
//
// 字段分两类，不能一概照抄采集结果：
//
// - **浏览器身份**（UA、brands、版本号、platform、vendor、productSub）
//   必须与真实 Edge 一致，否则自相矛盾会被检测。
// - **机器相关**（hardwareConcurrency、deviceMemory、languages、screen 尺寸）
//   是采集机器特有的。照抄会把指纹绑定到某台具体机器，反而更可疑。
//   这些保持为合理默认值，由调用方按需覆盖。
import {
  neutralExternalDevices,
  neutralMediaDevices,
} from "./neutral-device-capabilities.js";
import { GPU_IDENTITIES } from "./gpu-profiles.js";

const selectedGpu = GPU_IDENTITIES[1];

const navigatorProfile = Object.freeze({
  // `Edg/` 后缀是 Edge 的标志。此前缺失它——UA 说 Chrome、
  // userAgentData.brands 说 Microsoft Edge，两者自相矛盾。
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0",
  platform: "Win32",
  languages: Object.freeze(["zh-CN", "zh"]),
  language: "zh-CN",
  hardwareConcurrency: 16,
  deviceMemory: 8,
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
    // 来源：本机 `MicrosoftEdgeUpdate.log.bak`（EdgeUpdate 升级日志，UTF-16）
    // 记录的 Edge 150 最终补丁 150.0.4078.105。运行时表
    // `navigator-ua-data-state.js` 登记同一值，两边由
    // `tests/ua-full-version-consistency-test.js` 锁定一致性。
    uaFullVersion: "150.0.4078.105",
    wow64: false,
    formFactors: Object.freeze(["Desktop"]),
    mobile: false,
  }),
  plugins: Object.freeze([
    { name: "PDF Viewer", filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "Chrome PDF Viewer", filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "Chromium PDF Viewer", filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "Microsoft Edge PDF Viewer", filename: "internal-pdf-viewer", description: "Portable Document Format" },
    { name: "WebKit built-in PDF", filename: "internal-pdf-viewer", description: "Portable Document Format" },
  ]),
  mimeTypes: Object.freeze([
    { type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" },
    { type: "text/pdf", suffixes: "pdf", description: "Portable Document Format" },
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
  jitterSeed: 0x4e5638,
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

export const edge150Fingerprint = Object.freeze({
  browserMajorVersion: 150,
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  navigator: navigatorProfile,
  screen: screenProfile,
  rendering: renderingProfile,
  timing: timingProfile,
  capabilities: capabilityProfile,
});
