import { NavigatorUAData } from "./navigator-ua-data-constructor.js";
import { navigatorProfile } from "./navigator-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const uaDataSlot = createRealmSlot(() => ({
  singleton: null,
}), "uaData");

function uaDataRealmState() {
  return uaDataSlot.get(globalThis);
}

const uaDataState = new WeakSet();

export function createNavigatorUAData() {
  if (uaDataRealmState().singleton !== null) {
    return uaDataRealmState().singleton;
  }
  const value = Object.create(NavigatorUAData.prototype);
  uaDataState.add(value);
  uaDataRealmState().singleton = value;
  return value;
}

export function requireNavigatorUAData(value) {
  if (!uaDataState.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}

export function lowEntropyUaData() {
  const profile = navigatorProfile();
  const major = browserMajor(profile.userAgent);
  const configured = profile.userAgentData ?? {};
  return {
    brands: brandList(major, false),
    mobile: Boolean(configured.mobile),
    platform: platformName(profile.platform),
  };
}

export function highEntropyUaData(hints) {
  const profile = navigatorProfile();
  const major = browserMajor(profile.userAgent);
  const configured = profile.userAgentData ?? {};
  const output = lowEntropyUaData();
  for (const hint of hints) {
    switch (`${hint}`) {
      case "architecture":
        output.architecture = configured.architecture ?? "x86";
        break;
      case "bitness":
        output.bitness = configured.bitness ?? "64";
        break;
      case "model":
        output.model = configured.model ?? "";
        break;
      case "platformVersion":
        output.platformVersion = configured.platformVersion ?? "19.0.0";
        break;
      case "uaFullVersion":
        output.uaFullVersion = configured.uaFullVersion ?? buildVersion(major);
        break;
      case "fullVersionList":
        output.fullVersionList = brandList(major, true);
        break;
      case "wow64":
        output.wow64 = Boolean(configured.wow64);
        break;
      case "formFactors":
        output.formFactors = [...(configured.formFactors ?? ["Desktop"])]
        break;
      default:
        break;
    }
  }
  return output;
}

/**
 * 构造 `userAgentData.brands` / `fullVersionList`。
 *
 * 三处曾与真实 Edge 不符，均由 `scripts/collect-edge-fingerprint.mjs`
 * 从真实 Edge 151 采集后校正：
 *
 * 1. **顺序**。真实顺序是 GREASE → Microsoft Edge → Chromium；
 *    此前是 GREASE → Chromium → Microsoft Edge。
 * 2. **GREASE brand 名与版本**。真实是 `Not=A?Brand` / `99`；
 *    此前是 `Not A;Brand` / `8`（那是更早 Chromium 的形态）。
 * 3. **fullVersionList 里 Edge 与 Chromium 版本号不同**。真实为
 *    Edge `151.0.4129.101`、Chromium `151.0.7922.170`；此前两者相同，
 *    是很容易被识别的破绽。
 */
function brandList(major, full) {
  const builds = buildVersions(major);
  return [
    { brand: "Not=A?Brand", version: full ? "99.0.0.0" : "99" },
    { brand: "Microsoft Edge", version: full ? builds.edge : major },
    { brand: "Chromium", version: full ? builds.chromium : major },
  ];
}

/**
 * 各 major 版本对应的真实 build 号。
 *
 * Edge 与 Chromium 的 build 号**不同步**——Edge 有自己的发布线。
 * 未登记的版本回退到 `${major}.0.0.0`，那只是占位，应当补采集。
 */
function buildVersions(major) {
  const known = {
    // 采集自真实 Edge 151.0.4129.101（fixtures/fingerprint/edge-real.json）
    "151": { edge: "151.0.4129.101", chromium: "151.0.7922.170" },
  };
  return known[major] ?? {
    edge: `${major}.0.0.0`,
    chromium: `${major}.0.0.0`,
  };
}

function buildVersion(major) {
  return buildVersions(major).edge;
}

function browserMajor(userAgent) {
  return /Chrome\/(\d+)/u.exec(userAgent)?.[1] ?? "150";
}

function platformName(platform) {
  return platform.startsWith("Win") ? "Windows" : platform;
}
