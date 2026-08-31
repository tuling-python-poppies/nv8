const pointState = new WeakMap();

export function initializeDOMPoint(point, x = 0, y = 0, z = 0, w = 1) {
  pointState.set(point, {
    x: numberOrDefault(x, 0),
    y: numberOrDefault(y, 0),
    z: numberOrDefault(z, 0),
    w: numberOrDefault(w, 1),
  });
}

export function requireDOMPoint(point) {
  const state = pointState.get(point);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function pointFromValue(value = {}) {
  if (value === null || typeof value !== "object") {
    return { x: 0, y: 0, z: 0, w: 1 };
  }
  return {
    x: numberOrDefault(value.x, 0),
    y: numberOrDefault(value.y, 0),
    z: numberOrDefault(value.z, 0),
    w: numberOrDefault(value.w, 1),
  };
}

function numberOrDefault(value, fallback) {
  return value === undefined ? fallback : Number(value);
}
