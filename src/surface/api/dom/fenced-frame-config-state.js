const fencedFrameConfigState = new WeakMap();

export function createFencedFrameConfig() {
  const config = Object.create(FencedFrameConfig.prototype);
  fencedFrameConfigState.set(config, { sharedStorageContext: "" });
  return config;
}

export function requireFencedFrameConfig(config) {
  const state = fencedFrameConfigState.get(config);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function isFencedFrameConfig(config) {
  return fencedFrameConfigState.has(config);
}

import { FencedFrameConfig } from "./fenced-frame-config-constructor.js";
