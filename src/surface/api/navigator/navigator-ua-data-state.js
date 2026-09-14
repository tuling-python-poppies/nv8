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
 * 真实 Edge 151 与 152 的低熵 brands 形态不同：151 是
 * `Not=A?Brand/99`, `Microsoft Edge`, `Chromium`；本机 Edge 152 实测改为
 * `Chromium/152`, `Not?A_Brand/24`, `Microsoft Edge/152`。按 major 分支保留
 * 这个可观测版本差异。
 */
function brandList(major, full) {
  const builds = buildVersions(major);
  if (major >= "152") {
    return [
      { brand: "Chromium", version: full ? builds.chromium : major },
      { brand: "Not?A_Brand", version: full ? "24.0.0.0" : "24" },
      { brand: "Microsoft Edge", version: full ? builds.edge : major },
    ];
  }
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
 *
 * 150 的 edge build 来自本机 `MicrosoftEdgeUpdate.log.bak` 记录的 Edge 150
 * 最终补丁（150.0.4078.105）；Chromium 150 的 build 号本机没有任何证据
 * （无 GoogleUpdate 日志、仓库采集产物与 git 历史均无），显式登记为 null，
 * 由 `buildVersions` 回退到占位值，**不编造**。
 */
function buildVersions(major) {
  const known = {
    "150": { edge: "150.0.4078.105", chromium: null },
    // 采集自真实 Edge 151/152 的本机基准。
    "151": { edge: "151.0.4129.101", chromium: "151.0.7922.170" },
    "152": { edge: "152.0.4191.53", chromium: "152.0.7977.65" },
  };
  const entry = known[major];
  return {
    edge: entry?.edge ?? `${major}.0.0.0`,
    chromium: entry?.chromium ?? `${major}.0.0.0`,
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
