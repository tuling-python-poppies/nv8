import { DOMException } from "../event/dom-exception-constructor.js";
import { createDOMMatrix } from "../geometry/dom-matrix-constructor.js";
import { matrixFromValue } from "../geometry/dom-matrix-state.js";
import { createCanvasGradient } from "./canvas-gradient-state.js";
import { createCanvasPattern } from "./canvas-pattern-state.js";
import { timingProfile } from "../../scheduler/monotonic-clock.js";
import {
  canvasColorBytes,
  defaultCanvasDrawingState,
  multiply2D,
  paintCanvasRect,
} from "./canvas-2d-context-state.js";
import { createImageData, requireImageData } from "./image-data-state.js";
import { isPath2D, requirePath2D } from "./path-2d-state.js";
import { createTextMetrics } from "./text-metrics-state.js";

export function noResult() {}

export function createConicGradientOperation(state, args) {
  return createCanvasGradient("conic", args.slice(0, 3).map(Number));
}
export function createLinearGradientOperation(state, args) {
  return createCanvasGradient("linear", args.slice(0, 4).map(Number));
}
export function createRadialGradientOperation(state, args) {
  const values = args.slice(0, 6).map(Number);
  if (values[2] < 0 || values[5] < 0) {
    throw new DOMException("The radius provided is negative", "IndexSizeError");
  }
  return createCanvasGradient("radial", values);
}
export function createPatternOperation(state, args) {
  const source = args[0];
  if (source === null || (typeof source !== "object" && typeof source !== "function")) {
    throw new TypeError("The image source is invalid");
  }
  const repetition = args[1] === null || args[1] === undefined
    ? "repeat"
    : `${args[1]}`;
  return createCanvasPattern(source, repetition);
}
export function createImageDataOperation(state, args) {
  if (args[1] === undefined) {
    const source = requireImageData(args[0]);
    return createImageData(source.width, source.height);
  }
  const width = Math.abs(Number(args[0])) >>> 0;
  const height = Math.abs(Number(args[1])) >>> 0;
  if (width === 0 || height === 0) {
    throw new DOMException("ImageData dimensions must be non-zero", "IndexSizeError");
  }
  return createImageData(width, height);
}

export function fillRectOperation(state, args) {
  paintCanvasRect(
    state,
    args[0], args[1], args[2], args[3],
    canvasColorBytes(state.drawing.fillStyle, state.drawing.globalAlpha),
  );
}
export function clearRectOperation(state, args) {
  paintCanvasRect(state, args[0], args[1], args[2], args[3], [0, 0, 0, 0]);
}
export function strokeRectOperation(state, args) {
  const color = canvasColorBytes(
    state.drawing.strokeStyle,
    state.drawing.globalAlpha,
  );
  const line = state.drawing.lineWidth;
  paintCanvasRect(state, args[0], args[1], args[2], line, color);
  paintCanvasRect(state, args[0], Number(args[1]) + Number(args[3]) - line, args[2], line, color);
  paintCanvasRect(state, args[0], args[1], line, args[3], color);
  paintCanvasRect(state, Number(args[0]) + Number(args[2]) - line, args[1], line, args[3], color);
}
export function fillTextOperation(state, args) {
  const text = `${args[0]}`;
  const fontSize = parseFontSize(state.drawing.font);
  paintCanvasRect(
    state,
    Number(args[1]),
    Number(args[2]) - fontSize,
    [...text].length * fontSize * 0.6,
    fontSize,
    canvasColorBytes(state.drawing.fillStyle, state.drawing.globalAlpha),
  );
}
export function strokeTextOperation(state, args) {
  const text = `${args[0]}`;
  const fontSize = parseFontSize(state.drawing.font);
  const previous = state.drawing.fillStyle;
  state.drawing.fillStyle = state.drawing.strokeStyle;
  fillTextOperation(state, [text, args[1], args[2]]);
  state.drawing.fillStyle = previous;
}
export function getImageDataOperation(state, args) {
  const width = Math.abs(Number(args[2])) >>> 0;
  const height = Math.abs(Number(args[3])) >>> 0;
  if (width === 0 || height === 0) {
    throw new DOMException("The source dimensions are zero", "IndexSizeError");
  }
  const bytes = new Uint8ClampedArray(width * height * 4);
  const sx = Math.trunc(Number(args[0]));
  const sy = Math.trunc(Number(args[1]));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceX = sx + x;
      const sourceY = sy + y;
      if (sourceX >= 0 && sourceY >= 0 && sourceX < state.width && sourceY < state.height) {
        const source = (sourceY * state.width + sourceX) * 4;
        bytes.set(state.pixels.subarray(source, source + 4), (y * width + x) * 4);
      }
    }
  }
  // Per-session deterministic pixel noise: flip ±1 on ~1 in 64 non-alpha bytes.
  // Seeded by jitterSeed so fingerprint hash differs across sessions but is
  // reproducible within a single sandbox session.
  const seed = timingProfile().jitterSeed;
  let s = (seed ^ width ^ (height << 8)) >>> 0;
  for (let i = 0; i < bytes.length; i += 4) {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    if ((s & 0x3f) === 0) {
      const ch = s % 3; // R, G, or B channel only (not alpha)
      bytes[i + ch] = (bytes[i + ch] + ((s & 0x40) ? 1 : -1)) & 0xff;
    }
  }
  return createImageData(width, height, bytes, state.colorSpace);
}
export function putImageDataOperation(state, args) {
  const image = requireImageData(args[0]);
  const dx = Math.trunc(Number(args[1]));
  const dy = Math.trunc(Number(args[2]));
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const targetX = dx + x;
      const targetY = dy + y;
      if (targetX >= 0 && targetY >= 0 && targetX < state.width && targetY < state.height) {
        const source = (y * image.width + x) * 4;
        state.pixels.set(
          image.data.subarray(source, source + 4),
          (targetY * state.width + targetX) * 4,
        );
      }
    }
  }
}
export function drawImageOperation(state, args) {
  try {
    requireImageData(args[0]);
  } catch {
    return;
  }
  putImageDataOperation(state, [args[0], args[1], args[2]]);
}

export function getLineDashOperation(state) {
  return [...state.drawing.lineDash];
}
export function setLineDashOperation(state, args) {
  const dash = Array.from(args[0], Number);
  if (dash.some(value => !Number.isFinite(value) || value < 0)) {
    throw new DOMException(
      "Line dash values must be finite and non-negative",
      "IndexSizeError",
    );
  }
  state.drawing.lineDash = dash.length % 2 === 1 ? [...dash, ...dash] : dash;
}
export function getTransformOperation(state) {
  return createDOMMatrix(matrixFromValue(state.drawing.transform));
}
export function isContextLostOperation() {
  return false;
}
export function isPointInPathOperation(state, args) {
  const { path, offset } = selectedPath(state, args);
  const x = Number(args[offset]);
  const y = Number(args[offset + 1]);
  return path.some(command => (
    (command[0] === "rect" || command[0] === "roundRect")
    && x >= command[1] && x <= command[1] + command[3]
    && y >= command[2] && y <= command[2] + command[4]
  ));
}
export const isPointInStrokeOperation = isPointInPathOperation;
export function measureTextOperation(state, args) {
  const text = `${args[0]}`;
  const fontSize = parseFontSize(state.drawing.font);
  const width = [...text].length * fontSize * 0.6;
  return createTextMetrics({
    width,
    actualBoundingBoxLeft: 0,
    actualBoundingBoxRight: width,
    fontBoundingBoxAscent: fontSize * 0.8,
    fontBoundingBoxDescent: fontSize * 0.2,
    actualBoundingBoxAscent: fontSize * 0.8,
    actualBoundingBoxDescent: fontSize * 0.2,
    hangingBaseline: fontSize * 0.64,
    alphabeticBaseline: 0,
    ideographicBaseline: -fontSize * 0.2,
  });
}
export function resetOperation(state) {
  state.drawing = defaultCanvasDrawingState();
  state.stack = [];
  state.path = [];
  state.pixels.fill(0);
}
export function saveOperation(state) {
  state.stack.push(structuredCloneDrawingState(state.drawing));
}
export function restoreOperation(state) {
  const restored = state.stack.pop();
  if (restored !== undefined) state.drawing = restored;
}

export function beginPathOperation(state) {
  state.path = [];
}
export function closePathOperation(state) {
  state.path.push(["closePath"]);
}
export function appendPathOperation(name, count, booleanIndex = -1) {
  return (state, args) => {
    const values = args.slice(0, count).map((value, index) => (
      index === booleanIndex ? Boolean(value) : Number(value)
    ));
    if (
      (name === "arc" && values[2] < 0)
      || (name === "arcTo" && values[4] < 0)
      || (name === "ellipse" && (values[2] < 0 || values[3] < 0))
    ) {
      throw new DOMException("The radius provided is negative", "IndexSizeError");
    }
    state.path.push([name, ...values]);
  };
}
export function fillOperation(state, args) {
  const { path } = selectedPath(state, args);
  const color = canvasColorBytes(state.drawing.fillStyle, state.drawing.globalAlpha);
  for (const command of path) {
    if (command[0] === "rect" || command[0] === "roundRect") {
      paintCanvasRect(state, command[1], command[2], command[3], command[4], color);
    }
  }
}
export function strokeOperation(state, args) {
  const { path } = selectedPath(state, args);
  for (const command of path) {
    if (command[0] === "rect" || command[0] === "roundRect") {
      strokeRectOperation(state, command.slice(1, 5));
    }
  }
}

export function resetTransformOperation(state) {
  state.drawing.transform = [1, 0, 0, 1, 0, 0];
}
export function translateOperation(state, args) {
  state.drawing.transform = multiply2D(
    state.drawing.transform,
    [1, 0, 0, 1, Number(args[0]), Number(args[1])],
  );
}
export function scaleOperation(state, args) {
  state.drawing.transform = multiply2D(
    state.drawing.transform,
    [Number(args[0]), 0, 0, Number(args[1]), 0, 0],
  );
}
export function rotateOperation(state, args) {
  const angle = Number(args[0]);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  state.drawing.transform = multiply2D(
    state.drawing.transform,
    [cosine, sine, -sine, cosine, 0, 0],
  );
}
export function transformOperation(state, args) {
  state.drawing.transform = multiply2D(
    state.drawing.transform,
    args.slice(0, 6).map(Number),
  );
}
export function setTransformOperation(state, args) {
  if (args.length === 0) {
    resetTransformOperation(state);
    return;
  }
  const matrix = args.length === 1
    ? matrixFromValue(args[0])
    : matrixFromValue(args.slice(0, 6));
  state.drawing.transform = [
    matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13],
  ];
}
export function getContextAttributesOperation(state) {
  return {
    alpha: state.alpha,
    colorSpace: state.colorSpace,
    colorType: state.colorType,
    desynchronized: state.desynchronized,
    willReadFrequently: state.willReadFrequently,
  };
}

function selectedPath(state, args) {
  return isPath2D(args[0])
    ? { path: requirePath2D(args[0]), offset: 1 }
    : { path: state.path, offset: 0 };
}
function parseFontSize(font) {
  const match = /([\d.]+)px/u.exec(font);
  return match === null ? 10 : Number(match[1]);
}
function structuredCloneDrawingState(drawing) {
  return {
    ...drawing,
    lineDash: [...drawing.lineDash],
    transform: [...drawing.transform],
  };
}
