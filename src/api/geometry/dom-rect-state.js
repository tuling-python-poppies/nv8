const rectState = new WeakMap();

export function initializeDOMRect(rect, x = 0, y = 0, width = 0, height = 0) {
  rectState.set(rect, {
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
  });
}

export function requireDOMRect(rect) {
  const state = rectState.get(rect);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function rectFromValue(value = {}) {
  return [
    value.x === undefined ? 0 : Number(value.x),
    value.y === undefined ? 0 : Number(value.y),
    value.width === undefined ? 0 : Number(value.width),
    value.height === undefined ? 0 : Number(value.height),
  ];
}
