import { edge150Fingerprint } from "../infra/fingerprint/edge-150.js";
import {
  TRUSTED_SCRIPT_POLICY,
  TRUSTED_SCRIPT_POLICY_ALIASES,
} from "../engine/core/evidence-contract.js";

// 接受契约策略名与历史别名（如 registered-only）
const ACCEPTED_TRUST_POLICIES = Object.freeze([
  ...Object.values(TRUSTED_SCRIPT_POLICY),
  ...Object.keys(TRUSTED_SCRIPT_POLICY_ALIASES),
]);

const DEFAULT_PAGE = Object.freeze({
  url: "https://sandbox.test/",
  html: "<!doctype html><html><head></head><body></body></html>",
  referrer: "",
  contentType: "text/html",
});

const DEFAULT_LIMITS = Object.freeze({
  timeoutMs: 1_000,
  maxHeapBytes: 512 * 1024 * 1024,
  maxSourceBytes: 1024 * 1024,
  maxHtmlBytes: 4 * 1024 * 1024,
  maxOutputBytes: 1024 * 1024,
  maxPayloadBytes: 8 * 1024 * 1024,
  maxFrameQueueBytes: 32 * 1024 * 1024,
  maxValueDepth: 32,
  maxArrayLength: 100_000,
  maxFieldCount: 10_000,
  maxStringBytes: 4 * 1024 * 1024,
  maxBytesLength: 4 * 1024 * 1024,
  maxRealms: 12,
  // Worker 额度独立于 iframe / Worklet 额度；默认高水位保持既有
  // `maxRealms` 行为，显式设置后才启用更细的治理。
  maxWorkerRealms: 4096,
  maxWorkerConnections: 4096,
  maxWorkerDepth: 64,
  // 预热的空白子 Realm 数。**默认 0**，见 docs/adr/0004-dynamic-iframe-timing.md。
  //
  // 开启后 `create()` 会在页面脚本执行**之前**建好这些 Realm，于是
  // `document.body.appendChild(iframe)` 之后 `contentWindow` 同步可用——
  // 反爬脚本「从干净 iframe 取原生函数」的写法是同步的，池空就等于没修。
  //
  // 默认关闭是刻意的：每个池位实测 254ms 且占一个子 Realm 的堆额度。
  // NV8 每个目标本来就有自己的 Profile / evidence / replay，按目标付这笔钱
  // 才合理；而全局默认开会让所有人的冷启动翻倍。
  prewarmChildRealms: 0,
});

const DEFAULT_TRACE = Object.freeze({
  enabled: false,
  mirrorToConsole: false,
  maxEntries: 100_000,
});

const DEFAULT_NETWORK_CAPTURE = Object.freeze({
  enabled: true,
  maxEntries: 1_000,
  maxBodyBytes: 1024 * 1024,
  maxHeaderBytes: 64 * 1024,
  maxTotalBytes: 4 * 1024 * 1024,
});

const DEFAULT_EXECUTION = Object.freeze({
  backend: "child-process",
});

function finiteInteger(value, fallback, name, minimum, maximum) {
  const selected = value ?? fallback;
  if (
    !Number.isSafeInteger(selected)
    || selected < minimum
    || selected > maximum
  ) {
    throw new RangeError(`${name} must be an integer from ${minimum} to ${maximum}`);
  }
  return selected;
}

function finiteNumber(value, fallback, name, minimum, maximum) {
  const selected = value ?? fallback;
  if (
    typeof selected !== "number"
    || !Number.isFinite(selected)
    || selected < minimum
    || selected > maximum
  ) {
    throw new RangeError(`${name} must be a number from ${minimum} to ${maximum}`);
  }
  return selected;
}

function stringOption(value, fallback, name, maxBytes) {
  const selected = value ?? fallback;
  if (typeof selected !== "string") {
    throw new TypeError(`${name} must be a string`);
  }
  if (Buffer.byteLength(selected, "utf8") > maxBytes) {
    throw new RangeError(`${name} exceeds its byte limit`);
  }
  return selected;
}

function timeZoneOption(value, fallback, name) {
  const selected = stringOption(value, fallback, name, 1024);
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: selected,
    }).resolvedOptions();
  } catch {
    throw new RangeError(`${name} must be a valid IANA time zone`);
  }
  return selected;
}

function booleanOption(value, fallback, name) {
  const selected = value ?? fallback;
  if (typeof selected !== "boolean") {
    throw new TypeError(`${name} must be boolean`);
  }
  return selected;
}

function objectOption(value, fallback, name) {
  const selected = value ?? fallback;
  if (
    selected === null
    || typeof selected !== "object"
    || Array.isArray(selected)
  ) {
    throw new TypeError(`${name} must be an object`);
  }
  return selected;
}

function stringArrayOption(value, fallback, name, maximum = 256) {
  const selected = value ?? fallback;
  if (
    !Array.isArray(selected)
    || selected.length > maximum
    || selected.some(item => typeof item !== "string")
  ) {
    throw new TypeError(`${name} must be a string array with at most ${maximum} entries`);
  }
  return Object.freeze(selected.map(item =>
    stringOption(item, undefined, `${name}[]`, 16 * 1024)));
}

function normalizeMediaDevice(value, index) {
  const input = objectOption(
    value,
    undefined,
    `fingerprint.capabilities.media.devices[${index}]`,
  );
  const kind = stringOption(
    input.kind,
    undefined,
    `fingerprint.capabilities.media.devices[${index}].kind`,
    64,
  );
  if (!["audioinput", "audiooutput", "videoinput"].includes(kind)) {
    throw new TypeError(
      `fingerprint.capabilities.media.devices[${index}].kind is invalid`,
    );
  }
  const capabilities = objectOption(
    input.capabilities ?? {},
    {},
    `fingerprint.capabilities.media.devices[${index}].capabilities`,
  );
  return Object.freeze({
    deviceId: stringOption(
      input.deviceId,
      `device-${index + 1}`,
      `fingerprint.capabilities.media.devices[${index}].deviceId`,
      16 * 1024,
    ),
    kind,
    label: stringOption(
      input.label,
      "",
      `fingerprint.capabilities.media.devices[${index}].label`,
      16 * 1024,
    ),
    groupId: stringOption(
      input.groupId,
      "",
      `fingerprint.capabilities.media.devices[${index}].groupId`,
      16 * 1024,
    ),
    capabilities: Object.freeze({ ...capabilities }),
  });
}

function nullableSensorNumber(value, name) {
  if (value === null || value === undefined) return null;
  return finiteNumber(value, undefined, name, -Number.MAX_VALUE, Number.MAX_VALUE);
}

function normalizeSensor(value, fallback, name) {
  const selected = value === undefined ? fallback : value;
  if (selected === null) return null;
  const input = objectOption(selected, undefined, name);
  const quaternion = input.quaternion ?? null;
  if (
    quaternion !== null
    && (
      !Array.isArray(quaternion)
      || quaternion.length !== 4
      || quaternion.some(item =>
        typeof item !== "number" || !Number.isFinite(item))
    )
  ) {
    throw new TypeError(`${name}.quaternion must be null or four finite numbers`);
  }
  return Object.freeze({
    x: nullableSensorNumber(input.x, `${name}.x`),
    y: nullableSensorNumber(input.y, `${name}.y`),
    z: nullableSensorNumber(input.z, `${name}.z`),
    quaternion: quaternion === null
      ? null
      : Object.freeze([...quaternion]),
    frequency: finiteNumber(
      input.frequency,
      60,
      `${name}.frequency`,
      0.001,
      100_000,
    ),
  });
}

function normalizeExternalDeviceList(value, fallback, name, mapper) {
  const selected = value ?? fallback;
  if (!Array.isArray(selected) || selected.length > 256) {
    throw new TypeError(`${name} must be an array with at most 256 entries`);
  }
  return Object.freeze(selected.map((item, index) =>
    mapper(objectOption(item, undefined, `${name}[${index}]`), index)));
}

/**
 * 构造 `capabilities.media`。
 *
 * 在返回对象字面量里调用，字段顺序（audioCodecs → videoCodecs → imageTypes →
 * powerEfficient → captureEnabled → devices）与拆分前一致。
 */
function normalizeMediaFields(media, fallbackMedia, mediaDevices) {
  return Object.freeze({
    audioCodecs: stringArrayOption(
      media.audioCodecs,
      fallbackMedia.audioCodecs,
      "fingerprint.capabilities.media.audioCodecs",
    ),
    videoCodecs: stringArrayOption(
      media.videoCodecs,
      fallbackMedia.videoCodecs,
      "fingerprint.capabilities.media.videoCodecs",
    ),
    imageTypes: stringArrayOption(
      media.imageTypes,
      fallbackMedia.imageTypes,
      "fingerprint.capabilities.media.imageTypes",
    ),
    powerEfficient: booleanOption(
      media.powerEfficient,
      fallbackMedia.powerEfficient,
      "fingerprint.capabilities.media.powerEfficient",
    ),
    captureEnabled: booleanOption(
      media.captureEnabled,
      fallbackMedia.captureEnabled,
      "fingerprint.capabilities.media.captureEnabled",
    ),
    devices: Object.freeze(mediaDevices.map(normalizeMediaDevice)),
  });
}

/**
 * 构造 `capabilities.externalDevices`。
 *
 * `bluetooth` / `hid` / `serial` / `usb` 已在前段用 objectOption 校验并合并基线，
 * 这里只做字段级归一化；顺序与拆分前一致（bluetooth → hid → serial → usb）。
 */
function normalizeExternalDevicesFields(bluetooth, hid, serial, usb, fallbackExternal) {
  return Object.freeze({
    bluetooth: Object.freeze({
      available: booleanOption(
        bluetooth.available,
        fallbackExternal.bluetooth.available,
        "fingerprint.capabilities.externalDevices.bluetooth.available",
      ),
      devices: normalizeExternalDeviceList(
        bluetooth.devices,
        fallbackExternal.bluetooth.devices,
        "fingerprint.capabilities.externalDevices.bluetooth.devices",
        (item, index) => Object.freeze({
          id: stringOption(
            item.id,
            `bluetooth-${index + 1}`,
            `fingerprint.capabilities.externalDevices.bluetooth.devices[${index}].id`,
            16 * 1024,
          ),
          name: stringOption(
            item.name,
            "",
            `fingerprint.capabilities.externalDevices.bluetooth.devices[${index}].name`,
            16 * 1024,
          ),
        }),
      ),
    }),
    hid: Object.freeze({
      devices: normalizeExternalDeviceList(
        hid.devices,
        fallbackExternal.hid.devices,
        "fingerprint.capabilities.externalDevices.hid.devices",
        (item, index) => Object.freeze({
          vendorId: finiteInteger(
            item.vendorId,
            0,
            `fingerprint.capabilities.externalDevices.hid.devices[${index}].vendorId`,
            0,
            0xffff,
          ),
          productId: finiteInteger(
            item.productId,
            0,
            `fingerprint.capabilities.externalDevices.hid.devices[${index}].productId`,
            0,
            0xffff,
          ),
          productName: stringOption(
            item.productName,
            "",
            `fingerprint.capabilities.externalDevices.hid.devices[${index}].productName`,
            16 * 1024,
          ),
        }),
      ),
    }),
    serial: Object.freeze({
      ports: normalizeExternalDeviceList(
        serial.ports,
        fallbackExternal.serial.ports,
        "fingerprint.capabilities.externalDevices.serial.ports",
        (item, index) => Object.freeze({
          usbVendorId: finiteInteger(
            item.usbVendorId,
            0,
            `fingerprint.capabilities.externalDevices.serial.ports[${index}].usbVendorId`,
            0,
            0xffff,
          ),
          usbProductId: finiteInteger(
            item.usbProductId,
            0,
            `fingerprint.capabilities.externalDevices.serial.ports[${index}].usbProductId`,
            0,
            0xffff,
          ),
          label: stringOption(
            item.label,
            "",
            `fingerprint.capabilities.externalDevices.serial.ports[${index}].label`,
            16 * 1024,
          ),
        }),
      ),
    }),
    usb: Object.freeze({
      devices: normalizeExternalDeviceList(
        usb.devices,
        fallbackExternal.usb.devices,
        "fingerprint.capabilities.externalDevices.usb.devices",
        (item, index) => Object.freeze({
          vendorId: finiteInteger(
            item.vendorId,
            0,
            `fingerprint.capabilities.externalDevices.usb.devices[${index}].vendorId`,
            0,
            0xffff,
          ),
          productId: finiteInteger(
            item.productId,
            0,
            `fingerprint.capabilities.externalDevices.usb.devices[${index}].productId`,
            0,
            0xffff,
          ),
          manufacturerName: stringOption(
            item.manufacturerName,
            "",
            `fingerprint.capabilities.externalDevices.usb.devices[${index}].manufacturerName`,
            16 * 1024,
          ),
          productName: stringOption(
            item.productName,
            "",
            `fingerprint.capabilities.externalDevices.usb.devices[${index}].productName`,
            16 * 1024,
          ),
          serialNumber: stringOption(
            item.serialNumber,
            "",
            `fingerprint.capabilities.externalDevices.usb.devices[${index}].serialNumber`,
            16 * 1024,
          ),
        }),
      ),
    }),
  });
}

function normalizeCapabilityProfile(value) {
  const fallback = edge150Fingerprint.capabilities;
  const input = objectOption(
    value ?? fallback,
    fallback,
    "fingerprint.capabilities",
  );
  const network = objectOption(
    input.network,
    fallback.network,
    "fingerprint.capabilities.network",
  );
  const serviceWorker = objectOption(
    input.serviceWorker,
    fallback.serviceWorker,
    "fingerprint.capabilities.serviceWorker",
  );
  const media = objectOption(
    input.media,
    fallback.media,
    "fingerprint.capabilities.media",
  );
  const sensors = objectOption(
    input.sensors,
    fallback.sensors,
    "fingerprint.capabilities.sensors",
  );
  const externalDevices = objectOption(
    input.externalDevices,
    fallback.externalDevices,
    "fingerprint.capabilities.externalDevices",
  );
  const mediaDevices = media.devices ?? fallback.media.devices;
  if (!Array.isArray(mediaDevices) || mediaDevices.length > 256) {
    throw new TypeError(
      "fingerprint.capabilities.media.devices must be an array with at most 256 entries",
    );
  }
  const effectiveType = stringOption(
    network.effectiveType,
    fallback.network.effectiveType,
    "fingerprint.capabilities.network.effectiveType",
    64,
  );
  if (!["slow-2g", "2g", "3g", "4g"].includes(effectiveType)) {
    throw new TypeError(
      "fingerprint.capabilities.network.effectiveType is invalid",
    );
  }
  const bluetooth = objectOption(
    externalDevices.bluetooth,
    fallback.externalDevices.bluetooth,
    "fingerprint.capabilities.externalDevices.bluetooth",
  );
  const hid = objectOption(
    externalDevices.hid,
    fallback.externalDevices.hid,
    "fingerprint.capabilities.externalDevices.hid",
  );
  const serial = objectOption(
    externalDevices.serial,
    fallback.externalDevices.serial,
    "fingerprint.capabilities.externalDevices.serial",
  );
  const usb = objectOption(
    externalDevices.usb,
    fallback.externalDevices.usb,
    "fingerprint.capabilities.externalDevices.usb",
  );
  return Object.freeze({
    network: Object.freeze({
      online: booleanOption(
        network.online,
        fallback.network.online,
        "fingerprint.capabilities.network.online",
      ),
      effectiveType,
      rtt: finiteNumber(
        network.rtt,
        fallback.network.rtt,
        "fingerprint.capabilities.network.rtt",
        0,
        1_000_000,
      ),
      downlink: finiteNumber(
        network.downlink,
        fallback.network.downlink,
        "fingerprint.capabilities.network.downlink",
        0,
        1_000_000,
      ),
      saveData: booleanOption(
        network.saveData,
        fallback.network.saveData,
        "fingerprint.capabilities.network.saveData",
      ),
    }),
    serviceWorker: Object.freeze({
      enabled: booleanOption(
        serviceWorker.enabled,
        fallback.serviceWorker.enabled,
        "fingerprint.capabilities.serviceWorker.enabled",
      ),
    }),
    media: normalizeMediaFields(media, fallback.media, mediaDevices),
    sensors: Object.freeze(Object.fromEntries(
      Object.keys(fallback.sensors).map(sensorName => [
        sensorName,
        normalizeSensor(
          sensors[sensorName],
          fallback.sensors[sensorName],
          `fingerprint.capabilities.sensors.${sensorName}`,
        ),
      ]),
    )),
    externalDevices: normalizeExternalDevicesFields(
      bluetooth,
      hid,
      serial,
      usb,
      fallback.externalDevices,
    ),
  });
}

function normalizeEvidence(evidence) {
  if (evidence === undefined || evidence === null) return null;
  const input = typeof evidence === "string"
    ? { bundlePath: evidence }
    : objectOption(evidence, {}, "evidence");
  const bundlePath = stringOption(
    input.bundlePath,
    "",
    "evidence.bundlePath",
    64 * 1024,
  );
  if (bundlePath.length === 0) {
    throw new TypeError("evidence.bundlePath must not be empty");
  }
  const trustedScriptPolicy = stringOption(
    input.trustedScriptPolicy,
    TRUSTED_SCRIPT_POLICY.ENTRYPOINTS_ONLY,
    "evidence.trustedScriptPolicy",
    64,
  );
  if (!ACCEPTED_TRUST_POLICIES.includes(trustedScriptPolicy)) {
    throw new RangeError(
      `evidence.trustedScriptPolicy must be one of ${ACCEPTED_TRUST_POLICIES.join(", ")}`,
    );
  }
  const signaturePolicy = stringOption(
    input.signaturePolicy,
    "optional",
    "evidence.signaturePolicy",
    32,
  );
  if (!["optional", "required", "disabled"].includes(signaturePolicy)) {
    throw new RangeError(
      "evidence.signaturePolicy must be optional, required, or disabled",
    );
  }
  return Object.freeze({
    bundlePath,
    trustedScriptPolicy,
    scriptAllowlist: stringArrayOption(
      input.scriptAllowlist,
      [],
      "evidence.scriptAllowlist",
      256,
    ),
    usePage: booleanOption(input.usePage, true, "evidence.usePage"),
    executeScripts: booleanOption(
      input.executeScripts,
      true,
      "evidence.executeScripts",
    ),
    useNetworkReplay: booleanOption(
      input.useNetworkReplay,
      true,
      "evidence.useNetworkReplay",
    ),
    signaturePolicy,
    trustedKeys: normalizeTrustedKeys(input.trustedKeys),
  });
}

/**
 * 公共路径的 trustedKeys 必须能跨 IPC/线程边界传输，因此只接受
 * `{ keyId: pemOrDerString }`；KeyObject 实例请使用进程内 createNv8 入口。
 */
function normalizeTrustedKeys(input) {
  if (input === undefined || input === null) return null;
  if (typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("evidence.trustedKeys must be an object of keyId -> PEM string");
  }
  const entries = Object.entries(input);
  if (entries.length === 0) {
    throw new TypeError("evidence.trustedKeys must not be empty");
  }
  if (entries.length > 16) {
    throw new RangeError("evidence.trustedKeys supports at most 16 keys");
  }
  const output = {};
  for (const [keyId, key] of entries) {
    if (!/^[A-Za-z0-9._:-]{1,128}$/.test(keyId)) {
      throw new TypeError(
        "evidence.trustedKeys keyId must be 1-128 safe identifier characters",
      );
    }
    if (typeof key !== "string" || key.length === 0) {
      throw new TypeError(
        `evidence.trustedKeys["${keyId}"] must be a non-empty PEM/DER string`,
      );
    }
    if (Buffer.byteLength(key, "utf8") > 16 * 1024) {
      throw new RangeError(`evidence.trustedKeys["${keyId}"] exceeds its byte limit`);
    }
    output[keyId] = key;
  }
  return Object.freeze(output);
}

function normalizePage(page, limits) {
  let input;
  if (page === undefined || page === null) {
    input = DEFAULT_PAGE;
  } else if (typeof page === "string") {
    // 字符串是 `{ url }` 的简写，与 `Sandbox.navigate()` 的既有语义一致。
    input = { url: page };
  } else if (typeof page === "object" && !Array.isArray(page)) {
    input = page;
  } else {
    // 此前非法输入被逐字段回退成默认页：页面静默停在 sandbox.test 上，
    // 调用方却以为换页成功。宁可显式失败。
    throw new TypeError("page must be a string, an object, or undefined");
  }
  return Object.freeze({
    url: stringOption(input.url, DEFAULT_PAGE.url, "page.url", 64 * 1024),
    html: stringOption(input.html, DEFAULT_PAGE.html, "page.html", limits.maxHtmlBytes),
    referrer: stringOption(input.referrer, DEFAULT_PAGE.referrer, "page.referrer", 64 * 1024),
    contentType: stringOption(
      input.contentType,
      DEFAULT_PAGE.contentType,
      "page.contentType",
      1024,
    ),
  });
}

function nullableStringOption(value, fallback, name, maxBytes) {
  if (value === null || (value === undefined && fallback === null)) return null;
  return stringOption(value, fallback, name, maxBytes);
}

function normalizeUserAgentData(value, fallback) {
  const input = objectOption(value, fallback, "fingerprint.navigator.userAgentData");
  return Object.freeze({
    architecture: stringOption(
      input.architecture,
      fallback.architecture,
      "fingerprint.navigator.userAgentData.architecture",
      1024,
    ),
    bitness: stringOption(
      input.bitness,
      fallback.bitness,
      "fingerprint.navigator.userAgentData.bitness",
      1024,
    ),
    model: stringOption(
      input.model,
      fallback.model,
      "fingerprint.navigator.userAgentData.model",
      1024,
    ),
    platformVersion: stringOption(
      input.platformVersion,
      fallback.platformVersion,
      "fingerprint.navigator.userAgentData.platformVersion",
      1024,
    ),
    wow64: booleanOption(
      input.wow64,
      fallback.wow64,
      "fingerprint.navigator.userAgentData.wow64",
    ),
    formFactors: stringArrayOption(
      input.formFactors,
      fallback.formFactors,
      "fingerprint.navigator.userAgentData.formFactors",
      16,
    ),
    mobile: booleanOption(
      input.mobile,
      fallback.mobile ?? false,
      "fingerprint.navigator.userAgentData.mobile",
    ),
    uaFullVersion: nullableStringOption(
      input.uaFullVersion,
      fallback.uaFullVersion ?? null,
      "fingerprint.navigator.userAgentData.uaFullVersion",
      256,
    ),
  });
}

function normalizeMimeTypeRecord(value, index, name) {
  const input = objectOption(value, undefined, `${name}[${index}]`);
  return Object.freeze({
    type: stringOption(
      input.type,
      "",
      `${name}[${index}].type`,
      16 * 1024,
    ),
    suffixes: stringOption(
      input.suffixes,
      "",
      `${name}[${index}].suffixes`,
      16 * 1024,
    ),
    description: stringOption(
      input.description,
      "",
      `${name}[${index}].description`,
      16 * 1024,
    ),
    pluginName: stringOption(
      input.pluginName,
      "",
      `${name}[${index}].pluginName`,
      16 * 1024,
    ),
  });
}

function normalizePluginProfile(value, fallback, name) {
  const selected = value ?? fallback ?? [];
  if (!Array.isArray(selected) || selected.length > 64) {
    throw new TypeError(`${name} must be an array with at most 64 entries`);
  }
  return Object.freeze(selected.map((entry, index) => {
    const input = objectOption(entry, undefined, `${name}[${index}]`);
    const mimeTypes = input.mimeTypes ?? [];
    if (!Array.isArray(mimeTypes) || mimeTypes.length > 64) {
      throw new TypeError(`${name}[${index}].mimeTypes must be an array with at most 64 entries`);
    }
    return Object.freeze({
      name: stringOption(input.name, "", `${name}[${index}].name`, 16 * 1024),
      filename: stringOption(input.filename, "", `${name}[${index}].filename`, 16 * 1024),
      description: stringOption(
        input.description,
        "",
        `${name}[${index}].description`,
        16 * 1024,
      ),
      mimeTypes: Object.freeze(mimeTypes.map((item, mimeIndex) =>
        normalizeMimeTypeRecord(
          item,
          mimeIndex,
          `${name}[${index}].mimeTypes`,
        ))),
    });
  }));
}

function normalizeMimeTypeProfile(value, fallback, name) {
  const selected = value ?? fallback ?? [];
  if (!Array.isArray(selected) || selected.length > 128) {
    throw new TypeError(`${name} must be an array with at most 128 entries`);
  }
  return Object.freeze(selected.map((entry, index) =>
    normalizeMimeTypeRecord(entry, index, name)));
}

function normalizeNavigatorMetadata(navigator, fallback, userAgent) {
  const userAgentData = normalizeUserAgentData(
    navigator.userAgentData,
    fallback.userAgentData,
  );
  return Object.freeze({
    vendorSub: stringOption(
      navigator.vendorSub,
      fallback.vendorSub,
      "fingerprint.navigator.vendorSub",
      1024,
    ),
    productSub: stringOption(
      navigator.productSub,
      fallback.productSub,
      "fingerprint.navigator.productSub",
      1024,
    ),
    vendor: stringOption(
      navigator.vendor,
      fallback.vendor,
      "fingerprint.navigator.vendor",
      1024,
    ),
    maxTouchPoints: finiteInteger(
      navigator.maxTouchPoints,
      fallback.maxTouchPoints,
      "fingerprint.navigator.maxTouchPoints",
      0,
      32,
    ),
    doNotTrack: nullableStringOption(
      navigator.doNotTrack,
      fallback.doNotTrack,
      "fingerprint.navigator.doNotTrack",
      64,
    ),
    cookieEnabled: booleanOption(
      navigator.cookieEnabled,
      fallback.cookieEnabled,
      "fingerprint.navigator.cookieEnabled",
    ),
    appCodeName: stringOption(
      navigator.appCodeName,
      fallback.appCodeName,
      "fingerprint.navigator.appCodeName",
      1024,
    ),
    appName: stringOption(
      navigator.appName,
      fallback.appName,
      "fingerprint.navigator.appName",
      1024,
    ),
    appVersion: stringOption(
      navigator.appVersion,
      userAgent.startsWith("Mozilla/")
        ? userAgent.slice("Mozilla/".length)
        : userAgent,
      "fingerprint.navigator.appVersion",
      16 * 1024,
    ),
    product: stringOption(
      navigator.product,
      fallback.product,
      "fingerprint.navigator.product",
      1024,
    ),
    webdriver: booleanOption(
      navigator.webdriver,
      fallback.webdriver,
      "fingerprint.navigator.webdriver",
    ),
    pdfViewerEnabled: booleanOption(
      navigator.pdfViewerEnabled,
      fallback.pdfViewerEnabled,
      "fingerprint.navigator.pdfViewerEnabled",
    ),
    userAgentData,
    plugins: normalizePluginProfile(
      navigator.plugins,
      fallback.plugins,
      "fingerprint.navigator.plugins",
    ),
    mimeTypes: normalizeMimeTypeProfile(
      navigator.mimeTypes,
      fallback.mimeTypes,
      "fingerprint.navigator.mimeTypes",
    ),
  });
}

function normalizeTimingProfile(value) {
  const fallback = edge150Fingerprint.timing;
  const input = objectOption(value, fallback, "fingerprint.timing");
  const timeOriginMs = input.timeOriginMs === null || input.timeOriginMs === undefined
    ? null
    : finiteNumber(
      input.timeOriginMs,
      undefined,
      "fingerprint.timing.timeOriginMs",
      0,
      Number.MAX_SAFE_INTEGER,
    );
  return Object.freeze({
    timeOriginMs,
    wallClockOffsetMs: finiteNumber(
      input.wallClockOffsetMs,
      fallback.wallClockOffsetMs,
      "fingerprint.timing.wallClockOffsetMs",
      -Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ),
    dateNowResolutionMs: finiteInteger(
      input.dateNowResolutionMs,
      fallback.dateNowResolutionMs,
      "fingerprint.timing.dateNowResolutionMs",
      0,
      60_000,
    ),
    performanceResolutionMs: finiteNumber(
      input.performanceResolutionMs,
      fallback.performanceResolutionMs,
      "fingerprint.timing.performanceResolutionMs",
      0,
      60_000,
    ),
    performanceJitterMs: finiteNumber(
      input.performanceJitterMs,
      fallback.performanceJitterMs,
      "fingerprint.timing.performanceJitterMs",
      0,
      1_000,
    ),
    jitterSeed: finiteInteger(
      input.jitterSeed,
      fallback.jitterSeed,
      "fingerprint.timing.jitterSeed",
      0,
      0xffffffff,
    ),
    minimumTimerDelayMs: finiteInteger(
      input.minimumTimerDelayMs,
      fallback.minimumTimerDelayMs,
      "fingerprint.timing.minimumTimerDelayMs",
      0,
      60_000,
    ),
    animationFrameIntervalMs: finiteNumber(
      input.animationFrameIntervalMs,
      fallback.animationFrameIntervalMs,
      "fingerprint.timing.animationFrameIntervalMs",
      1,
      1_000,
    ),
  });
}

/**
 * 校验并归一化 `rendering.webgpu` 中**连续**的一段：limit 白名单、limit
 * 数值区间、subgroup 区间。
 *
 * `vendor` / `architecture` 等字段的校验仍留在 `normalizeFingerprint` 的
 * 返回对象里——这样拆分前后的求值顺序与错误优先级逐位一致，只是把内聚的
 * WebGPU 预校验段落移进了具名函数。
 *
 * @param {object} rendering 已合并基线的 `fingerprint.rendering`
 * @returns {{webgpu: object, webgpuFeatures: string[], normalizedWebgpuLimits: object,
 *   subgroupMinSize: number, subgroupMaxSize: number}}
 */
function normalizeWebgpuConfig(rendering) {
  const baseline = edge150Fingerprint.rendering.webgpu;
  const webgpu = rendering.webgpu ?? baseline;
  if (webgpu === null || typeof webgpu !== "object" || Array.isArray(webgpu)) {
    throw new TypeError("fingerprint.rendering.webgpu must be an object");
  }
  const webgpuFeatures = webgpu.features ?? baseline.features;
  if (
    !Array.isArray(webgpuFeatures)
    || webgpuFeatures.some(value => typeof value !== "string")
  ) {
    throw new TypeError(
      "fingerprint.rendering.webgpu.features must be a string array",
    );
  }
  const webgpuLimits = webgpu.limits ?? {};
  if (
    webgpuLimits === null
    || typeof webgpuLimits !== "object"
    || Array.isArray(webgpuLimits)
  ) {
    throw new TypeError("fingerprint.rendering.webgpu.limits must be an object");
  }
  const supportedLimitNames = Object.keys(baseline.limits);
  for (const name of Object.keys(webgpuLimits)) {
    if (!supportedLimitNames.includes(name)) {
      throw new TypeError(`Unsupported WebGPU limit in fingerprint: ${name}`);
    }
  }
  const normalizedWebgpuLimits = Object.fromEntries(
    supportedLimitNames.map(name => [
      name,
      finiteInteger(
        webgpuLimits[name],
        baseline.limits[name],
        `fingerprint.rendering.webgpu.limits.${name}`,
        0,
        Number.MAX_SAFE_INTEGER,
      ),
    ]),
  );
  const subgroupMinSize = finiteInteger(
    webgpu.subgroupMinSize,
    baseline.subgroupMinSize,
    "fingerprint.rendering.webgpu.subgroupMinSize",
    1,
    1024,
  );
  const subgroupMaxSize = finiteInteger(
    webgpu.subgroupMaxSize,
    baseline.subgroupMaxSize,
    "fingerprint.rendering.webgpu.subgroupMaxSize",
    1,
    1024,
  );
  if (subgroupMinSize > subgroupMaxSize) {
    throw new RangeError(
      "fingerprint.rendering.webgpu subgroupMinSize exceeds subgroupMaxSize",
    );
  }
  return { webgpu, webgpuFeatures, normalizedWebgpuLimits, subgroupMinSize, subgroupMaxSize };
}

/**
 * 先归一化 `screen` 的宽高与色深，供后面的 `pixelDepth` 兜底引用**已归一化**
 * 的 `colorDepth`（旧实现引用未处理的 `screen.colorDepth`，用户只传
 * width/height 时会抛 RangeError）。
 */
function normalizeScreenBase(screen) {
  const baseline = edge150Fingerprint.screen;
  return {
    width: finiteInteger(screen.width, baseline.width, "fingerprint.screen.width", 1, 100_000),
    height: finiteInteger(screen.height, baseline.height, "fingerprint.screen.height", 1, 100_000),
    colorDepth: finiteInteger(
      screen.colorDepth,
      baseline.colorDepth,
      "fingerprint.screen.colorDepth",
      1,
      128,
    ),
  };
}

/**
 * 构造 `fingerprint.navigator`。
 *
 * 在返回对象的字面量里调用，字段校验顺序与拆分前逐位一致；`navigatorMetadata`
 * 仍在函数前段提前算好（`userAgent` 校验之前），这里只是接手字面量的部分。
 */
function normalizeNavigatorFields(
  navigator,
  userAgent,
  languages,
  navigatorProvided,
  explicitLocale,
  navigatorMetadata,
) {
  return Object.freeze({
    userAgent,
    platform: stringOption(navigator.platform, "Win32", "fingerprint.navigator.platform", 1024),
    languages: Object.freeze([...languages]),
    language: stringOption(
      navigatorProvided
        ? navigator.language
        : explicitLocale ?? navigator.language,
      languages[0] ?? "zh-CN",
      "fingerprint.navigator.language",
      1024,
    ),
    hardwareConcurrency: finiteInteger(
      navigator.hardwareConcurrency,
      16,
      "fingerprint.navigator.hardwareConcurrency",
      1,
      1024,
    ),
    deviceMemory: finiteInteger(
      navigator.deviceMemory,
      8,
      "fingerprint.navigator.deviceMemory",
      1,
      1024,
    ),
    ...navigatorMetadata,
  });
}

/**
 * 构造 `fingerprint.screen`。
 *
 * `avail*` 按字段回退**基线**，而不是悄悄跟随用户覆盖的 width/height：
 * 基线 availHeight=1040（任务栏）而 height=1080，跟随 width/height 会
 * 在缺省时也偏离基线。
 */
function normalizeScreenFields(screenWidth, screenHeight, screenColorDepth, screen) {
  const baseline = edge150Fingerprint.screen;
  return Object.freeze({
    width: screenWidth,
    height: screenHeight,
    availWidth: finiteInteger(
      screen.availWidth,
      baseline.availWidth,
      "fingerprint.screen.availWidth",
      1,
      100_000,
    ),
    availHeight: finiteInteger(
      screen.availHeight,
      baseline.availHeight,
      "fingerprint.screen.availHeight",
      1,
      100_000,
    ),
    colorDepth: screenColorDepth,
    pixelDepth: finiteInteger(
      screen.pixelDepth,
      screenColorDepth,
      "fingerprint.screen.pixelDepth",
      1,
      128,
    ),
    devicePixelRatio: finiteNumber(
      screen.devicePixelRatio,
      1,
      "fingerprint.screen.devicePixelRatio",
      0.1,
      16,
    ),
    availLeft: finiteInteger(
      screen.availLeft,
      0,
      "fingerprint.screen.availLeft",
      -100_000,
      100_000,
    ),
    availTop: finiteInteger(
      screen.availTop,
      0,
      "fingerprint.screen.availTop",
      -100_000,
      100_000,
    ),
    isExtended: booleanOption(
      screen.isExtended,
      false,
      "fingerprint.screen.isExtended",
    ),
  });
}

/** 构造 `fingerprint.rendering`（含 WebGPU 字面量，校验顺序不变）。 */
function normalizeRenderingFields(rendering, webgpuConfig) {
  const {
    webgpu,
    webgpuFeatures,
    normalizedWebgpuLimits,
    subgroupMinSize,
    subgroupMaxSize,
  } = webgpuConfig;
  return Object.freeze({
    webglVendor: stringOption(
      rendering.webglVendor,
      edge150Fingerprint.rendering.webglVendor,
      "fingerprint.rendering.webglVendor",
      16 * 1024,
    ),
    webglRenderer: stringOption(
      rendering.webglRenderer,
      edge150Fingerprint.rendering.webglRenderer,
      "fingerprint.rendering.webglRenderer",
      16 * 1024,
    ),
    webgpu: Object.freeze({
      vendor: stringOption(
        webgpu.vendor,
        edge150Fingerprint.rendering.webgpu.vendor,
        "fingerprint.rendering.webgpu.vendor",
        16 * 1024,
      ),
      architecture: stringOption(
        webgpu.architecture,
        edge150Fingerprint.rendering.webgpu.architecture,
        "fingerprint.rendering.webgpu.architecture",
        16 * 1024,
      ),
      device: stringOption(
        webgpu.device,
        edge150Fingerprint.rendering.webgpu.device,
        "fingerprint.rendering.webgpu.device",
        16 * 1024,
      ),
      description: stringOption(
        webgpu.description,
        edge150Fingerprint.rendering.webgpu.description,
        "fingerprint.rendering.webgpu.description",
        16 * 1024,
      ),
      subgroupMinSize,
      subgroupMaxSize,
      isFallbackAdapter: Boolean(webgpu.isFallbackAdapter),
      features: Object.freeze(webgpuFeatures.map((value) => stringOption(
        value,
        undefined,
        "fingerprint.rendering.webgpu.features[]",
        1024,
      ))),
      limits: Object.freeze(normalizedWebgpuLimits),
    }),
  });
}

function normalizeFingerprint(fingerprint) {
  const input = fingerprint ?? edge150Fingerprint;
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("fingerprint must be a JavaScript object");
  }
  const navigator = input.navigator ?? edge150Fingerprint.navigator;
  const screen = input.screen ?? edge150Fingerprint.screen;
  const rendering = input.rendering ?? edge150Fingerprint.rendering;
  if (navigator === null || typeof navigator !== "object") {
    throw new TypeError("fingerprint.navigator must be an object");
  }
  if (screen === null || typeof screen !== "object") {
    throw new TypeError("fingerprint.screen must be an object");
  }
  if (rendering === null || typeof rendering !== "object") {
    throw new TypeError("fingerprint.rendering must be an object");
  }
  const {
    webgpu,
    webgpuFeatures,
    normalizedWebgpuLimits,
    subgroupMinSize,
    subgroupMaxSize,
  } = normalizeWebgpuConfig(rendering);
  const browserMajorVersion = finiteInteger(
    input.browserMajorVersion,
    150,
    "fingerprint.browserMajorVersion",
    150,
    152,
  );
  // `navigator` 是局部覆盖与基线的合并入口：只要调用方没有整体提供 navigator，
  // `fingerprint.locale` 就驱动 `navigator.language` / `navigator.languages`，
  // 而不是让它们停在基线值上（此前 `locale` 归一化后被完全忽略）。
  // 显式提供的 navigator 永远优先，避免两处语言声明互相打架。
  const navigatorProvided = input.navigator !== undefined && input.navigator !== null;
  const explicitLocale = input.locale;
  const languages = !navigatorProvided && explicitLocale !== undefined
    ? [explicitLocale]
    : navigator.languages;
  if (!Array.isArray(languages) || languages.some((value) => typeof value !== "string")) {
    throw new TypeError("fingerprint.navigator.languages must be a string array");
  }
  // 兜底必须用**合并后的基线 UA**。此前的字面量既没有 `Edg/` 也没有平台段，
  // 只覆盖 locale / screen / timezone 就会把 Edge 身份退化成裸 Chrome 串，
  // 与 `userAgentData.brands` 声明的 Microsoft Edge 自相矛盾。
  const userAgent = stringOption(
    navigator.userAgent ?? edge150Fingerprint.navigator.userAgent,
    undefined,
    "fingerprint.navigator.userAgent",
    16 * 1024,
  );
  const navigatorMetadata = normalizeNavigatorMetadata(
    navigator,
    edge150Fingerprint.navigator,
    userAgent,
  );
  const timing = normalizeTimingProfile(input.timing);
  // UA 校验分两条。
  //
  // 此前这里要求 UA **不能**含 `Edg/`，但同一个项目里 `src/profiles/` 的
  // `browserProfileForEdgeVersion150` 的 UA 恰恰**包含** `Edg/150`，
  // 且 `userAgentData.brands` 一直声明 `Microsoft Edge`。三处要求互相矛盾。
  //
  // 现在改为：`Edg/` 可选（保持向后兼容），但一旦出现，其主版本必须与
  // `Chrome/` 主版本一致——UA 说 Chrome 151 而 Edg 说 150 才是真正的破绽。
  if (!userAgent.includes(`Chrome/${browserMajorVersion}.`)) {
    throw new TypeError(
      `fingerprint userAgent must describe Chrome ${browserMajorVersion}`,
    );
  }
  const edgeToken = /\bEdg\/(\d+)\./.exec(userAgent);
  if (edgeToken !== null && Number(edgeToken[1]) !== browserMajorVersion) {
    throw new TypeError(
      `fingerprint userAgent has Edg/${edgeToken[1]} but Chrome/${browserMajorVersion};`
      + " the Edge and Chrome majors must match",
    );
  }
  // 屏幕字段先各自归一化，后面的 fallback 才能引用**已归一化**的值：
  // `pixelDepth` 兜底曾经直接用未处理的 `screen.colorDepth`，用户只传
  // width/height 时它是 undefined，`finiteInteger` 抛 RangeError。
  const {
    width: screenWidth,
    height: screenHeight,
    colorDepth: screenColorDepth,
  } = normalizeScreenBase(screen);
  return Object.freeze({
    browserMajorVersion,
    locale: stringOption(input.locale, "zh-CN", "fingerprint.locale", 1024),
    timezone: timeZoneOption(
      input.timezone,
      edge150Fingerprint.timezone,
      "fingerprint.timezone",
    ),
    navigator: normalizeNavigatorFields(
      navigator,
      userAgent,
      languages,
      navigatorProvided,
      explicitLocale,
      navigatorMetadata,
    ),
    screen: normalizeScreenFields(
      screenWidth,
      screenHeight,
      screenColorDepth,
      screen,
    ),
    rendering: normalizeRenderingFields(rendering, {
      webgpu,
      webgpuFeatures,
      normalizedWebgpuLimits,
      subgroupMinSize,
      subgroupMaxSize,
    }),
    timing,
    capabilities: normalizeCapabilityProfile(input.capabilities),
  });
}

/**
 * replay 匹配策略。消费端（`surface/api/fetch/fetch-replay.js` 与
 * `collection/evidence/network-replay.js`）按字符串精确比较，未登记的字符串
 * 会让所有请求都匹配失败——静默的语义漂移，所以在入口就拒绝。
 */
const REPLAY_MATCH_STRATEGIES = Object.freeze([
  "method-url",
  "method-url-body",
  "method-url-body-sha256",
  "exact",
]);

/**
 * 消费端的 `isAvailable` 支持 `'once'`、`'unlimited'` 和非负整数；
 * `repeat: 1.5` / `'2'` 这类值会被 `Number(...)` 悄悄转成另一套语义。
 */
function replayRepeatOption(value, name) {
  const selected = value ?? "once";
  if (selected === "once" || selected === "unlimited") return selected;
  if (Number.isSafeInteger(selected) && selected >= 0) return selected;
  throw new TypeError(
    `${name} must be "once", "unlimited", or a non-negative integer`,
  );
}

function replaySequenceOption(value, name) {
  if (value === undefined || value === null) return undefined;
  if (Number.isSafeInteger(value) && value >= 0) return value;
  throw new TypeError(`${name} must be a non-negative integer`);
}

function replayMatchingOption(value, name) {
  if (value === undefined || value === null) return null;
  if (typeof value === "string" && REPLAY_MATCH_STRATEGIES.includes(value)) {
    return value;
  }
  throw new TypeError(
    `${name} must be one of ${REPLAY_MATCH_STRATEGIES.join(", ")}`,
  );
}

function normalizeReplay(replay, limits) {
  const input = replay ?? [];
  if (!Array.isArray(input)) throw new TypeError("replay must be an array");
  if (input.length > 10_000) throw new RangeError("replay exceeds 10000 entries");
  let bodyBytes = 0;
  const records = input.map((entry, index) => {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      throw new TypeError(`replay[${index}] must be an object`);
    }
    const method = stringOption(
      entry.method,
      "GET",
      `replay[${index}].method`,
      64,
    ).toUpperCase();
    const url = new URL(stringOption(
      entry.url,
      undefined,
      `replay[${index}].url`,
      64 * 1024,
    )).href;
    const status = finiteInteger(
      entry.status,
      200,
      `replay[${index}].status`,
      200,
      599,
    );
    const statusText = stringOption(
      entry.statusText,
      "",
      `replay[${index}].statusText`,
      8 * 1024,
    );
    const body = stringOption(
      entry.body,
      "",
      `replay[${index}].body`,
      limits.maxPayloadBytes,
    );
    bodyBytes += Buffer.byteLength(body, "utf8");
    if (bodyBytes > limits.maxPayloadBytes) {
      throw new RangeError("replay bodies exceed limits.maxPayloadBytes");
    }
    const headerInput = entry.headers ?? {};
    if (
      headerInput === null
      || typeof headerInput !== "object"
      || Array.isArray(headerInput)
    ) {
      throw new TypeError(`replay[${index}].headers must be an object`);
    }
    const headers = Object.create(null);
    for (const name of Object.keys(headerInput)) {
      headers[stringOption(name, undefined, "replay header name", 1024)] =
        stringOption(
          headerInput[name],
          undefined,
          `replay[${index}].headers.${name}`,
          64 * 1024,
        );
    }
    const requestHeaders = entry.requestHeaders ?? null;
    const requestBody = entry.requestBody ?? null;
    const requestBodySha256 = entry.requestBodySha256 ?? null;
    if (
      requestBodySha256 !== null
      && (typeof requestBodySha256 !== "string" || !/^[a-f0-9]{64}$/i.test(requestBodySha256))
    ) {
      throw new TypeError(`replay[${index}].requestBodySha256 must be a SHA-256 hex string`);
    }
    return Object.freeze({
      method,
      url,
      status,
      statusText,
      headers: Object.freeze(headers),
      requestHeaders,
      requestBody,
      requestBodySha256: requestBodySha256?.toLowerCase() ?? null,
      repeat: replayRepeatOption(entry.repeat, `replay[${index}].repeat`),
      sequence: replaySequenceOption(entry.sequence, `replay[${index}].sequence`),
      matching: replayMatchingOption(entry.matching, `replay[${index}].matching`),
      body,
      redirected: Boolean(entry.redirected),
      type: stringOption(entry.type, "basic", `replay[${index}].type`, 64),
    });
  });
  const keys = new Set();
  for (const record of records) {
    const key = `${record.method}\0${record.url}`;
    const allowsMultiple = record.repeat !== "once"
      || record.sequence !== undefined
      || record.requestBody !== null
      || record.requestBodySha256 !== null
      || record.matching !== null;
    if (keys.has(key) && !allowsMultiple) {
      throw new TypeError(`Duplicate replay entry: ${record.method} ${record.url}`);
    }
    keys.add(key);
  }
  return Object.freeze(records);
}

/**
 * 归一化 `limits`。
 *
 * 与 execution / proxyTrace / networkCapture 相互独立，且是入口最先求值的
 * 部分（`networkCapture` 的上限引用 `maxPayloadBytes`）。调用点保持在原位，
 * 校验顺序与错误优先级不变。
 */
function normalizeLimits(inputLimits) {
  return Object.freeze({
    maxBatchConcurrency: finiteInteger(inputLimits.maxBatchConcurrency, 4, 'limits.maxBatchConcurrency', 1, 256),
    timeoutMs: finiteInteger(
      inputLimits.timeoutMs,
      DEFAULT_LIMITS.timeoutMs,
      "limits.timeoutMs",
      1,
      300_000,
    ),
    maxHeapBytes: finiteInteger(
      inputLimits.maxHeapBytes,
      DEFAULT_LIMITS.maxHeapBytes,
      "limits.maxHeapBytes",
      32 * 1024 * 1024,
      16 * 1024 * 1024 * 1024,
    ),
    maxSourceBytes: finiteInteger(
      inputLimits.maxSourceBytes,
      DEFAULT_LIMITS.maxSourceBytes,
      "limits.maxSourceBytes",
      1,
      64 * 1024 * 1024,
    ),
    maxHtmlBytes: finiteInteger(
      inputLimits.maxHtmlBytes,
      DEFAULT_LIMITS.maxHtmlBytes,
      "limits.maxHtmlBytes",
      1,
      64 * 1024 * 1024,
    ),
    maxOutputBytes: finiteInteger(
      inputLimits.maxOutputBytes,
      DEFAULT_LIMITS.maxOutputBytes,
      "limits.maxOutputBytes",
      1,
      64 * 1024 * 1024,
    ),
    maxPayloadBytes: finiteInteger(
      inputLimits.maxPayloadBytes,
      DEFAULT_LIMITS.maxPayloadBytes,
      "limits.maxPayloadBytes",
      1024,
      128 * 1024 * 1024,
    ),
    maxFrameQueueBytes: finiteInteger(
      inputLimits.maxFrameQueueBytes,
      DEFAULT_LIMITS.maxFrameQueueBytes,
      "limits.maxFrameQueueBytes",
      1024,
      512 * 1024 * 1024,
    ),
    maxValueDepth: finiteInteger(
      inputLimits.maxValueDepth,
      DEFAULT_LIMITS.maxValueDepth,
      "limits.maxValueDepth",
      1,
      256,
    ),
    maxArrayLength: finiteInteger(
      inputLimits.maxArrayLength,
      DEFAULT_LIMITS.maxArrayLength,
      "limits.maxArrayLength",
      1,
      10_000_000,
    ),
    maxFieldCount: finiteInteger(
      inputLimits.maxFieldCount,
      DEFAULT_LIMITS.maxFieldCount,
      "limits.maxFieldCount",
      1,
      1_000_000,
    ),
    maxStringBytes: finiteInteger(
      inputLimits.maxStringBytes,
      DEFAULT_LIMITS.maxStringBytes,
      "limits.maxStringBytes",
      1,
      128 * 1024 * 1024,
    ),
    maxBytesLength: finiteInteger(
      inputLimits.maxBytesLength,
      DEFAULT_LIMITS.maxBytesLength,
      "limits.maxBytesLength",
      1,
      128 * 1024 * 1024,
    ),
    maxRealms: finiteInteger(
      inputLimits.maxRealms,
      DEFAULT_LIMITS.maxRealms,
      "limits.maxRealms",
      1,
      4096,
    ),
    maxWorkerRealms: finiteInteger(
      inputLimits.maxWorkerRealms,
      DEFAULT_LIMITS.maxWorkerRealms,
      "limits.maxWorkerRealms",
      0,
      4096,
    ),
    maxWorkerConnections: finiteInteger(
      inputLimits.maxWorkerConnections,
      DEFAULT_LIMITS.maxWorkerConnections,
      "limits.maxWorkerConnections",
      0,
      16_384,
    ),
    maxWorkerDepth: finiteInteger(
      inputLimits.maxWorkerDepth,
      DEFAULT_LIMITS.maxWorkerDepth,
      "limits.maxWorkerDepth",
      0,
      256,
    ),
    // 上限刻意压得很低（8）：池位是**真实的** Realm，占真实的堆。
    // 512MB 默认堆实测只装得下 11 个子 Realm，池深超过个位数就等于把额度
    // 全给了预热，业务 iframe 反而建不出来。
    prewarmChildRealms: finiteInteger(
      inputLimits.prewarmChildRealms,
      DEFAULT_LIMITS.prewarmChildRealms,
      "limits.prewarmChildRealms",
      0,
      8,
    ),
  });
}

/** 归一化 `proxyTrace`；类型检查与拆分前一样放在对象构造之后。 */
function normalizeProxyTrace(inputTrace) {
  const proxyTrace = Object.freeze({
    enabled: inputTrace.enabled ?? DEFAULT_TRACE.enabled,
    mirrorToConsole: inputTrace.mirrorToConsole ?? DEFAULT_TRACE.mirrorToConsole,
    maxEntries: finiteInteger(
      inputTrace.maxEntries,
      DEFAULT_TRACE.maxEntries,
      "proxyTrace.maxEntries",
      1,
      1_000_000,
    ),
  });
  if (typeof proxyTrace.enabled !== "boolean") {
    throw new TypeError("proxyTrace.enabled must be boolean");
  }
  if (typeof proxyTrace.mirrorToConsole !== "boolean") {
    throw new TypeError("proxyTrace.mirrorToConsole must be boolean");
  }
  return proxyTrace;
}

/**
 * 归一化 `networkCapture`。
 *
 * `maxTotalBytes` 的兜底上限受 `limits.maxPayloadBytes` 的 75% 约束，
 * `maxBodyBytes` / `maxHeaderBytes` 再受 `maxTotalBytes` 约束。
 */
function normalizeNetworkCapture(inputNetworkCapture, limits) {
  if (
    inputNetworkCapture === null
    || typeof inputNetworkCapture !== "object"
    || Array.isArray(inputNetworkCapture)
  ) {
    throw new TypeError("networkCapture must be an object");
  }
  const maximumCaptureBytes = Math.max(
    1,
    Math.floor(limits.maxPayloadBytes * 0.75),
  );
  const networkCapture = Object.freeze({
    enabled: inputNetworkCapture.enabled ?? DEFAULT_NETWORK_CAPTURE.enabled,
    maxEntries: finiteInteger(
      inputNetworkCapture.maxEntries,
      DEFAULT_NETWORK_CAPTURE.maxEntries,
      "networkCapture.maxEntries",
      1,
      100_000,
    ),
    maxTotalBytes: finiteInteger(
      inputNetworkCapture.maxTotalBytes,
      Math.min(
        DEFAULT_NETWORK_CAPTURE.maxTotalBytes,
        maximumCaptureBytes,
      ),
      "networkCapture.maxTotalBytes",
      1,
      maximumCaptureBytes,
    ),
    maxBodyBytes: 0,
    maxHeaderBytes: 0,
  });
  if (typeof networkCapture.enabled !== "boolean") {
    throw new TypeError("networkCapture.enabled must be boolean");
  }
  return Object.freeze({
    ...networkCapture,
    maxBodyBytes: finiteInteger(
      inputNetworkCapture.maxBodyBytes,
      Math.min(
        DEFAULT_NETWORK_CAPTURE.maxBodyBytes,
        networkCapture.maxTotalBytes,
      ),
      "networkCapture.maxBodyBytes",
      0,
      networkCapture.maxTotalBytes,
    ),
    maxHeaderBytes: finiteInteger(
      inputNetworkCapture.maxHeaderBytes,
      Math.min(
        DEFAULT_NETWORK_CAPTURE.maxHeaderBytes,
        networkCapture.maxTotalBytes,
      ),
      "networkCapture.maxHeaderBytes",
      0,
      networkCapture.maxTotalBytes,
    ),
  });
}

/** 归一化 `execution`（后端选择）。 */
function normalizeExecution(inputExecution) {
  if (
    inputExecution === null
    || typeof inputExecution !== "object"
    || Array.isArray(inputExecution)
  ) {
    throw new TypeError("execution must be an object");
  }
  const backend = inputExecution.backend ?? DEFAULT_EXECUTION.backend;
  if (!["child-process", "worker-thread"].includes(backend)) {
    throw new RangeError(
      "execution.backend must be child-process or worker-thread",
    );
  }
  const restart = inputExecution.restart ?? "fail-fast";
  if (restart !== "fail-fast" && restart !== "restart") {
    throw new RangeError("execution.restart must be fail-fast or restart");
  }
  return Object.freeze({ backend, restart });
}

/**
 * `EdgeSandbox` 支持的顶层配置键。
 *
 * 未知键必须报错而不是静默丢弃：`proxyTrac` 这类拼写错误会让调用方以为
 * 配置生效（trace 其实没开），且全程没有任何信号。
 */
const RUNTIME_OPTION_KEYS = Object.freeze([
  "onCrash",
  "limits",
  "execution",
  "evidence",
  "page",
  "fingerprint",
  "proxyTrace",
  "networkCapture",
  "replay",
]);
const RUNTIME_OPTION_KEY_SET = new Set(RUNTIME_OPTION_KEYS);

export function normalizeRuntimeOptions(options = {}) {
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("EdgeSandbox options must be an object");
  }
  for (const key of Object.keys(options)) {
    if (!RUNTIME_OPTION_KEY_SET.has(key)) {
      throw new TypeError(
        `EdgeSandbox option "${key}" is not supported; supported options: ${RUNTIME_OPTION_KEYS.join(", ")}`,
      );
    }
  }
  // 求值顺序与拆分前一致：limits → proxyTrace → networkCapture → execution，
  // 四者都在 evidence / page / fingerprint 校验之前完成。
  const limits = normalizeLimits(options.limits ?? {});
  const proxyTrace = normalizeProxyTrace(options.proxyTrace ?? {});
  const normalizedNetworkCapture = normalizeNetworkCapture(
    options.networkCapture ?? {},
    limits,
  );
  const execution = normalizeExecution(options.execution ?? {});
  if (options.onCrash !== undefined && options.onCrash !== null && typeof options.onCrash !== 'function') {
    throw new TypeError('onCrash must be a function');
  }
  return Object.freeze({
    onCrash: options.onCrash ?? null,
    limits,
    execution,
    evidence: normalizeEvidence(options.evidence),
    page: normalizePage(options.page, limits),
    fingerprint: normalizeFingerprint(options.fingerprint),
    proxyTrace,
    networkCapture: normalizedNetworkCapture,
    replay: normalizeReplay(options.replay, limits),
  });
}

export function normalizeSource(source, limits, name = "source") {
  if (typeof source !== "string") {
    throw new TypeError(`${name} must be a string`);
  }
  if (Buffer.byteLength(source, "utf8") > limits.maxSourceBytes) {
    throw new RangeError(`${name} exceeds limits.maxSourceBytes`);
  }
  return source;
}
