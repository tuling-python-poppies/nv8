import { DOMException } from "../event/dom-exception-constructor.js";
import {
  getAttributeValue,
  setAttributeValue,
} from "../dom/element-state.js";
import { createMediaStream } from "../media/media-stream-state.js";
import {
  createCanvasCaptureMediaStreamTrack,
} from "./canvas-capture-media-stream-track-state.js";
import {
  createCanvasRenderingContext2D,
} from "./canvas-rendering-context-2d-constructor.js";
import {
  createImageBitmapRenderingContext,
  snapshotImageBitmapRenderingContext,
} from "./image-bitmap-rendering-context-runtime.js";
import {
  resizeCanvas2DContext,
  snapshotCanvas2DContext,
} from "./canvas-2d-context-state.js";
import { createOffscreenCanvas } from "./offscreen-canvas-constructor.js";
import { resizeOffscreenCanvas } from "./offscreen-canvas-state.js";
import { createGPUCanvasContext } from "../gpu/gpu-runtime.js";
import {
  createWebGLContext,
  resizeWebGLContext,
  snapshotWebGLContext,
} from "../webgl/webgl-runtime.js";

const canvasState = new WeakMap();

export function initializeHTMLCanvasElement(canvas) {
  canvasState.set(canvas, {
    contextType: null,
    context2d: null,
    contextBitmapRenderer: null,
    contextWebGL: null,
    contextWebGPU: null,
    transferred: false,
    offscreen: null,
    synchronizedWidth: 300,
    synchronizedHeight: 150,
  });
}

export function requireHTMLCanvasElement(canvas) {
  const state = canvasState.get(canvas);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function htmlCanvasDimension(canvas, name) {
  const fallback = name === "width" ? 300 : 150;
  const value = parseDimension(getAttributeValue(canvas, name), fallback);
  synchronizeCanvas(canvas, name, value);
  return value;
}

export function setHTMLCanvasDimension(canvas, name, value) {
  const dimension = Number(value) >>> 0;
  setAttributeValue(canvas, name, `${dimension}`);
  synchronizeCanvas(canvas, name, dimension, true);
}

export function getHTMLCanvasContext(canvas, type, options) {
  const state = requireHTMLCanvasElement(canvas);
  synchronizeAll(canvas);
  if (state.transferred) {
    throw new DOMException(
      "Cannot get a context after control has been transferred",
      "InvalidStateError",
    );
  }
  const requested = `${type}`;
  const normalized = requested === "experimental-webgl" ? "webgl" : requested;
  if (!["2d", "bitmaprenderer", "webgl", "webgl2", "webgpu"].includes(normalized)) {
    return null;
  }
  if (state.contextType !== null && state.contextType !== normalized) return null;
  state.contextType = normalized;
  if (normalized === "webgpu") {
    if (state.contextWebGPU === null) {
      state.contextWebGPU = createGPUCanvasContext(canvas);
    }
    return state.contextWebGPU;
  }
  if (normalized === "bitmaprenderer") {
    if (state.contextBitmapRenderer === null) {
      state.contextBitmapRenderer = createImageBitmapRenderingContext(canvas);
    }
    return state.contextBitmapRenderer;
  }
  if (normalized === "webgl" || normalized === "webgl2") {
    if (state.contextWebGL === null) {
      state.contextWebGL = createWebGLContext(
        canvas,
        state.synchronizedWidth,
        state.synchronizedHeight,
        normalized === "webgl2" ? 2 : 1,
        options === undefined ? {} : Object(options),
      );
    }
    return state.contextWebGL;
  }
  if (normalized !== "2d") return null;
  if (state.context2d === null) {
    state.context2d = createCanvasRenderingContext2D(
      canvas,
      state.synchronizedWidth,
      state.synchronizedHeight,
      options === undefined ? {} : Object(options),
    );
  }
  return state.context2d;
}

export function snapshotHTMLCanvas(canvas) {
  const state = requireHTMLCanvasElement(canvas);
  synchronizeAll(canvas);
  if (state.context2d !== null) return snapshotCanvas2DContext(state.context2d);
  if (state.contextBitmapRenderer !== null) {
    return snapshotImageBitmapRenderingContext(
      state.contextBitmapRenderer,
      state.synchronizedWidth,
      state.synchronizedHeight,
    );
  }
  if (state.contextWebGL !== null) return snapshotWebGLContext(state.contextWebGL);
  return {
    width: state.synchronizedWidth,
    height: state.synchronizedHeight,
    pixels: new Uint8ClampedArray(
      state.synchronizedWidth * state.synchronizedHeight * 4,
    ),
  };
}

export function transferHTMLCanvasControl(canvas) {
  const state = requireHTMLCanvasElement(canvas);
  synchronizeAll(canvas);
  if (state.transferred || state.contextType !== null) {
    throw new DOMException(
      "Cannot transfer control from a canvas that has a context or was already transferred",
      "InvalidStateError",
    );
  }
  const offscreen = createOffscreenCanvas(
    state.synchronizedWidth,
    state.synchronizedHeight,
  );
  state.transferred = true;
  state.offscreen = offscreen;
  return offscreen;
}

export function captureHTMLCanvasStream(canvas, frameRate) {
  const state = requireHTMLCanvasElement(canvas);
  if (state.transferred) {
    throw new DOMException(
      "Cannot capture a canvas after control has been transferred",
      "InvalidStateError",
    );
  }
  if (frameRate !== undefined && Number(frameRate) < 0) {
    throw new DOMException(
      "The frame rate cannot be negative",
      "NotSupportedError",
    );
  }
  const track = createCanvasCaptureMediaStreamTrack(canvas);
  return createMediaStream([track]);
}

function synchronizeAll(canvas) {
  htmlCanvasDimension(canvas, "width");
  htmlCanvasDimension(canvas, "height");
}

function synchronizeCanvas(canvas, name, value, force = false) {
  const state = requireHTMLCanvasElement(canvas);
  const key = name === "width" ? "synchronizedWidth" : "synchronizedHeight";
  if (!force && state[key] === value) return;
  state[key] = value;
  if (state.context2d !== null) {
    resizeCanvas2DContext(
      state.context2d,
      state.synchronizedWidth,
      state.synchronizedHeight,
    );
  }
  if (state.contextWebGL !== null) {
    resizeWebGLContext(
      state.contextWebGL,
      state.synchronizedWidth,
      state.synchronizedHeight,
    );
  }
  if (state.offscreen !== null) {
    resizeOffscreenCanvas(state.offscreen, name, value);
  }
}

function parseDimension(value, fallback) {
  if (value === null) return fallback;
  const match = /^\s*(\d+)/u.exec(value);
  if (match === null) return fallback;
  const number = Number(match[1]);
  return number <= 0xffffffff ? number : fallback;
}
