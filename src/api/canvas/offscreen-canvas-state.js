import { initializeEventTarget } from "../event/event-target-state.js";
import { createBlob } from "../file/blob-state.js";
import { encodeCanvasPng } from "./canvas-png.js";
import {
  createOffscreenCanvasRenderingContext2D,
} from "./offscreen-canvas-rendering-context-2d-constructor.js";
import {
  resizeCanvas2DContext,
  snapshotCanvas2DContext,
} from "./canvas-2d-context-state.js";
import { createImageBitmap } from "./image-bitmap-state.js";
import {
  createImageBitmapRenderingContext,
  snapshotImageBitmapRenderingContext,
} from "./image-bitmap-rendering-context-runtime.js";
import { createGPUCanvasContext } from "../gpu/gpu-runtime.js";
import {
  createWebGLContext,
  resizeWebGLContext,
  snapshotWebGLContext,
} from "../webgl/webgl-runtime.js";

const offscreenCanvasState = new WeakMap();

export function initializeOffscreenCanvas(canvas, width, height) {
  initializeEventTarget(canvas);
  offscreenCanvasState.set(canvas, {
    width: canvasDimension(width),
    height: canvasDimension(height),
    oncontextlost: null,
    oncontextrestored: null,
    contextType: null,
    context2d: null,
    contextBitmapRenderer: null,
    contextWebGL: null,
    contextWebGPU: null,
  });
}

export function requireOffscreenCanvas(canvas) {
  const state = offscreenCanvasState.get(canvas);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function resizeOffscreenCanvas(canvas, dimension, value) {
  const state = requireOffscreenCanvas(canvas);
  state[dimension] = canvasDimension(value);
  if (state.context2d !== null) {
    resizeCanvas2DContext(state.context2d, state.width, state.height);
  }
  if (state.contextWebGL !== null) {
    resizeWebGLContext(state.contextWebGL, state.width, state.height);
  }
}

export function setOffscreenCanvasHandler(canvas, name, value) {
  const state = requireOffscreenCanvas(canvas);
  state[name] = value === null || value === undefined ? null : value;
}

export function getOffscreenCanvasContext(canvas, type, options) {
  const state = requireOffscreenCanvas(canvas);
  const normalized = `${type}` === "experimental-webgl" ? "webgl" : `${type}`;
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
        state.width,
        state.height,
        normalized === "webgl2" ? 2 : 1,
        options === undefined ? {} : Object(options),
      );
    }
    return state.contextWebGL;
  }
  if (normalized !== "2d") return null;
  if (state.context2d === null) {
    state.context2d = createOffscreenCanvasRenderingContext2D(
      canvas,
      state.width,
      state.height,
      options === undefined ? {} : Object(options),
    );
  }
  return state.context2d;
}

export function snapshotOffscreenCanvas(canvas) {
  const state = requireOffscreenCanvas(canvas);
  if (state.context2d !== null) return snapshotCanvas2DContext(state.context2d);
  if (state.contextBitmapRenderer !== null) {
    return snapshotImageBitmapRenderingContext(
      state.contextBitmapRenderer,
      state.width,
      state.height,
    );
  }
  if (state.contextWebGL !== null) return snapshotWebGLContext(state.contextWebGL);
  return {
    width: state.width,
    height: state.height,
    pixels: new Uint8ClampedArray(state.width * state.height * 4),
  };
}

export function offscreenCanvasBlob(canvas, options) {
  const snapshot = snapshotOffscreenCanvas(canvas);
  const requested = options?.type === undefined
    ? "image/png"
    : `${options.type}`.toLowerCase();
  const type = ["image/png", "image/jpeg", "image/webp"].includes(requested)
    ? requested
    : "image/png";
  const bytes = type === "image/png"
    ? encodeCanvasPng(snapshot.width, snapshot.height, snapshot.pixels)
    : canvasFallbackBytes(snapshot, type);
  return createBlob(bytes, type);
}

export function offscreenCanvasBitmap(canvas) {
  const snapshot = snapshotOffscreenCanvas(canvas);
  return createImageBitmap(snapshot.width, snapshot.height, snapshot.pixels);
}

function canvasDimension(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 0xffffffff) {
    throw new TypeError("The canvas dimension is outside the unsigned long range");
  }
  return Math.floor(number);
}

function canvasFallbackBytes(snapshot, type) {
  const prefix = type === "image/jpeg" ? "OFFSCREEN-JPEG" : "OFFSCREEN-WEBP";
  const result = new Uint8Array(prefix.length + 8 + snapshot.pixels.length);
  for (let index = 0; index < prefix.length; index += 1) {
    result[index] = prefix.charCodeAt(index);
  }
  const view = new DataView(result.buffer);
  view.setUint32(prefix.length, snapshot.width, true);
  view.setUint32(prefix.length + 4, snapshot.height, true);
  result.set(snapshot.pixels, prefix.length + 8);
  return result;
}
