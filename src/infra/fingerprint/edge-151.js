// Edge 151 (Chromium 151) fingerprint
// UA build: 151.0.4129.101 — 与运行时高熵表 navigator-ua-data-state.js 的
// 151 登记一致（单一事实源）。此前的 151.0.7849.46 与运行时输出矛盾。

const navigatorProfile = Object.freeze({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0",
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
    uaFullVersion: "151.0.4129.101",
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
  webglVendor: "Google Inc. (NVIDIA)",
  webglRenderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 Direct3D11)",
  webgpu: Object.freeze({
    vendor: "nvidia",
    architecture: "",
    device: "NVIDIA GeForce RTX 5060",
    description: "NVIDIA driver 32.0.15.8097",
    subgroupMinSize: 32,
    subgroupMaxSize: 32,
    isFallbackAdapter: false,
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
  performanceResolutionMs: 0,
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
    devices: Object.freeze([
      Object.freeze({
        deviceId: "host-audio-output-1",
        kind: "audiooutput",
        label: "扬声器 (网易虚拟音频设备)",
        groupId: "host-audio-output",
      }),
      Object.freeze({
        deviceId: "host-audio-output-2",
        kind: "audiooutput",
        label: "扬声器 (ToDesk Virtual Audio)",
        groupId: "host-audio-output",
      }),
      Object.freeze({
        deviceId: "host-audio-output-3",
        kind: "audiooutput",
        label: "VX2479-4K-HD (NVIDIA High Definition Audio)",
        groupId: "host-audio-output",
      }),
      Object.freeze({
        deviceId: "host-audio-input-1",
        kind: "audioinput",
        label: "麦克风 (ToDesk Virtual Audio)",
        groupId: "host-audio-input",
      }),
      Object.freeze({
        deviceId: "host-audio-input-2",
        kind: "audioinput",
        label: "麦克风阵列 (网易虚拟音频设备)",
        groupId: "host-audio-input",
      }),
    ]),
  }),
  sensors: Object.freeze({
    accelerometer: null,
    gravitySensor: null,
    linearAccelerationSensor: null,
    gyroscope: null,
    absoluteOrientationSensor: null,
    relativeOrientationSensor: null,
  }),
  externalDevices: Object.freeze({
    bluetooth: Object.freeze({
      available: true,
      devices: Object.freeze([
        Object.freeze({
          id: "host-bluetooth-1",
          name: "iQOO TWS Air3 Pro",
        }),
      ]),
    }),
    hid: Object.freeze({
      devices: Object.freeze([
        Object.freeze({
          vendorId: 0,
          productId: 1,
          productName: "USB 输入设备",
        }),
      ]),
    }),
    serial: Object.freeze({
      ports: Object.freeze([
        Object.freeze({
          usbVendorId: 0,
          usbProductId: 1,
          label: "通信端口 (COM1)",
        }),
      ]),
    }),
    usb: Object.freeze({
      devices: Object.freeze([
        Object.freeze({
          vendorId: 0x8086,
          productId: 0,
          manufacturerName: "Intel",
          productName: "USB 3.20 可扩展主机控制器",
          serialNumber: "",
        }),
      ]),
    }),
  }),
});

export const edge151Fingerprint = Object.freeze({
  browserMajorVersion: 151,
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  navigator: navigatorProfile,
  screen: screenProfile,
  rendering: renderingProfile,
  timing: timingProfile,
  capabilities: capabilityProfile,
});
