const fencedFrameConfigState = new WeakMap();

export function requireFencedFrameConfig(config) {
  const state = fencedFrameConfigState.get(config);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function isFencedFrameConfig(config) {
  return fencedFrameConfigState.has(config);
}
