const contextState = new WeakMap();

export function defaultCanvasDrawingState() {
  return {
    lang: "inherit",
    font: "10px sans-serif",
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "ltr",
    fontKerning: "auto",
    fontStretch: "normal",
    fontVariantCaps: "normal",
    letterSpacing: "0px",
    textRendering: "auto",
    wordSpacing: "0px",
    globalCompositeOperation: "source-over",
    filter: "none",
    imageSmoothingQuality: "low",
    strokeStyle: "#000000",
    fillStyle: "#000000",
    shadowColor: "rgba(0, 0, 0, 0)",
    lineCap: "butt",
    lineJoin: "miter",
    globalAlpha: 1,
    imageSmoothingEnabled: true,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    lineWidth: 1,
    miterLimit: 10,
    lineDashOffset: 0,
    lineDash: [],
    transform: [1, 0, 0, 1, 0, 0],
  };
}

export function initializeCanvas2DContext(
  context,
  canvas,
  width,
  height,
  options = {},
) {
  const normalizedWidth = Number(width) >>> 0;
  const normalizedHeight = Number(height) >>> 0;
  contextState.set(context, {
    canvas,
    width: normalizedWidth,
    height: normalizedHeight,
    pixels: new Uint8ClampedArray(normalizedWidth * normalizedHeight * 4),
    drawing: defaultCanvasDrawingState(),
    stack: [],
    path: [],
    alpha: options.alpha === undefined ? true : Boolean(options.alpha),
    colorSpace: options.colorSpace === undefined ? "srgb" : `${options.colorSpace}`,
    colorType: options.colorType === undefined ? "unorm8" : `${options.colorType}`,
    desynchronized: Boolean(options.desynchronized),
    willReadFrequently: Boolean(options.willReadFrequently),
  });
}

export function requireCanvas2DContext(context) {
  const state = contextState.get(context);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function resizeCanvas2DContext(context, width, height) {
  const state = requireCanvas2DContext(context);
  state.width = Number(width) >>> 0;
  state.height = Number(height) >>> 0;
  state.pixels = new Uint8ClampedArray(state.width * state.height * 4);
  state.drawing = defaultCanvasDrawingState();
  state.stack = [];
  state.path = [];
}

export function snapshotCanvas2DContext(context) {
  const state = requireCanvas2DContext(context);
  return {
    width: state.width,
    height: state.height,
    pixels: new Uint8ClampedArray(state.pixels),
  };
}

export function multiply2D(left, right) {
  return [
    left[0] * right[0] + left[2] * right[1],
    left[1] * right[0] + left[3] * right[1],
    left[0] * right[2] + left[2] * right[3],
    left[1] * right[2] + left[3] * right[3],
    left[0] * right[4] + left[2] * right[5] + left[4],
    left[1] * right[4] + left[3] * right[5] + left[5],
  ];
}

export function normalizeCanvasColor(value) {
  const normalized = `${value}`.trim().toLowerCase();
  const named = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    blue: "#0000ff",
    green: "#008000",
  };
  return named[normalized] ?? normalized;
}

export function canvasColorBytes(style, alpha = 1) {
  if (typeof style !== "string") return [0, 0, 0, Math.round(alpha * 255)];
  const color = normalizeCanvasColor(style);
  if (/^#[0-9a-f]{6}$/u.test(color)) {
    return [
      Number.parseInt(color.slice(1, 3), 16),
      Number.parseInt(color.slice(3, 5), 16),
      Number.parseInt(color.slice(5, 7), 16),
      Math.round(alpha * 255),
    ];
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/u.exec(color);
  if (rgb !== null) {
    return [
      Math.min(255, Number(rgb[1])),
      Math.min(255, Number(rgb[2])),
      Math.min(255, Number(rgb[3])),
      Math.round(alpha * (rgb[4] === undefined ? 1 : Number(rgb[4])) * 255),
    ];
  }
  return [0, 0, 0, Math.round(alpha * 255)];
}

export function paintCanvasRect(state, x, y, width, height, color) {
  let x0 = Math.floor(Number(x));
  let y0 = Math.floor(Number(y));
  let x1 = Math.ceil(Number(x) + Number(width));
  let y1 = Math.ceil(Number(y) + Number(height));
  if (x1 < x0) [x0, x1] = [x1, x0];
  if (y1 < y0) [y0, y1] = [y1, y0];
  x0 = Math.max(0, x0);
  y0 = Math.max(0, y0);
  x1 = Math.min(state.width, Math.max(0, x1));
  y1 = Math.min(state.height, Math.max(0, y1));
  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      state.pixels.set(color, (py * state.width + px) * 4);
    }
  }
}
