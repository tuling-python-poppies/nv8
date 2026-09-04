import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { WEBGL_SURFACES } from "./webgl-surface.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// WebGL webglState().profile 原先是模块级状态，会跨宿主图 Realm 共享渲染器指纹。
const webglSlot = createRealmSlot(() => ({
  profile: null,
}), "webgl-runtime");

function webglState() {
  return webglSlot.get(globalThis);
}

const contextState = new WeakMap();
const resourceState = new WeakMap();
const valueState = new WeakMap();


/**
 * 没有 profile 注入时的兜底 GPU 值。
 *
 * 必须与 `src/fingerprint/edge-150.js` 的 `renderingProfile` 保持一致——
 * 同一个沙箱里 GPU 型号不该有两个来源。曾经这里是 RTX 3060 Ti 而 profile 是
 * RTX 5060，取决于调用方有没有传 profile 会拿到不同 GPU。
 * `tests/webgl-parity-test.js` 断言两者一致。
 *
 * 这两个值只用于 UNMASKED_* 参数；masked VENDOR/RENDERER 是固定的
 * "WebKit" / "WebKit WebGL"，见 getParameter()。
 */
const defaultProfile = Object.freeze({
  webglVendor: "Google Inc. (NVIDIA)",
  webglRenderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 Direct3D11)",
});

export function WebGLRenderingContext() { illegalConstructor("WebGLRenderingContext"); }
export function WebGL2RenderingContext() { illegalConstructor("WebGL2RenderingContext"); }
export function WebGLObject() { illegalConstructor("WebGLObject"); }
export function WebGLBuffer() { illegalConstructor("WebGLBuffer"); }
export function WebGLFramebuffer() { illegalConstructor("WebGLFramebuffer"); }
export function WebGLProgram() { illegalConstructor("WebGLProgram"); }
export function WebGLQuery() { illegalConstructor("WebGLQuery"); }
export function WebGLRenderbuffer() { illegalConstructor("WebGLRenderbuffer"); }
export function WebGLSampler() { illegalConstructor("WebGLSampler"); }
export function WebGLShader() { illegalConstructor("WebGLShader"); }
export function WebGLSync() { illegalConstructor("WebGLSync"); }
export function WebGLTexture() { illegalConstructor("WebGLTexture"); }
export function WebGLTransformFeedback() { illegalConstructor("WebGLTransformFeedback"); }
export function WebGLUniformLocation() { illegalConstructor("WebGLUniformLocation"); }
export function WebGLVertexArrayObject() { illegalConstructor("WebGLVertexArrayObject"); }
export function WebGLActiveInfo() { illegalConstructor("WebGLActiveInfo"); }
export function WebGLShaderPrecisionFormat() {
  illegalConstructor("WebGLShaderPrecisionFormat");
}

export function WebGLContextEvent(type) {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'WebGLContextEvent': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to construct 'WebGLContextEvent': 1 argument required, but only 0 present.",
    );
  }
  const init = arguments[1] === null || arguments[1] === undefined
    ? {}
    : Object(arguments[1]);
  initializeEvent(this, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  valueState.set(this, {
    kind: "contextEvent",
    statusMessage: init.statusMessage === undefined ? "" : `${init.statusMessage}`,
  });
}

export const webglConstructors = Object.freeze([
  WebGLRenderingContext,
  WebGL2RenderingContext,
  WebGLObject,
  WebGLBuffer,
  WebGLFramebuffer,
  WebGLProgram,
  WebGLQuery,
  WebGLRenderbuffer,
  WebGLSampler,
  WebGLShader,
  WebGLSync,
  WebGLTexture,
  WebGLTransformFeedback,
  WebGLUniformLocation,
  WebGLVertexArrayObject,
  WebGLActiveInfo,
  WebGLShaderPrecisionFormat,
  WebGLContextEvent,
]);

for (const constructor of webglConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

const resourceConstructors = Object.freeze({
  buffer: WebGLBuffer,
  framebuffer: WebGLFramebuffer,
  program: WebGLProgram,
  query: WebGLQuery,
  renderbuffer: WebGLRenderbuffer,
  sampler: WebGLSampler,
  shader: WebGLShader,
  sync: WebGLSync,
  texture: WebGLTexture,
  transformFeedback: WebGLTransformFeedback,
  vertexArray: WebGLVertexArrayObject,
});

const constants1 = new Map(WEBGL_SURFACES.WebGLRenderingContext.constants);
const constants2 = new Map(WEBGL_SURFACES.WebGL2RenderingContext.constants);

export function configureWebGLProfile(value) {
  const input = value ?? defaultProfile;
  webglState().profile = Object.freeze({
    webglVendor: `${input.webglVendor ?? defaultProfile.webglVendor}`,
    webglRenderer: `${input.webglRenderer ?? defaultProfile.webglRenderer}`,
  });
}

export function createWebGLContext(canvas, width, height, version, options = {}) {
  if (webglState().profile === null) throw new Error("WebGL webglState().profile was not configured");
  const Constructor = version === 2
    ? WebGL2RenderingContext
    : WebGLRenderingContext;
  const context = Object.create(Constructor.prototype);
  const attributes = normalizeAttributes(options, version);
  const pixelWidth = dimension(width);
  const pixelHeight = dimension(height);
  contextState.set(context, {
    canvas,
    version,
    width: pixelWidth,
    height: pixelHeight,
    attributes,
    colorSpace: "srgb",
    unpackColorSpace: "srgb",
    lost: false,
    error: 0,
    enabled: new Set([constantFor(version, "DITHER")]),
    bindings: new Map(),
    indexedBindings: new Map(),
    activeTexture: constantFor(version, "TEXTURE0"),
    textureUnits: new Map(),
    clearColor: [0, 0, 0, 0],
    clearDepth: 1,
    clearStencil: 0,
    colorMask: [true, true, true, true],
    depthMask: true,
    viewport: [0, 0, pixelWidth, pixelHeight],
    scissor: [0, 0, pixelWidth, pixelHeight],
    pixels: new Uint8ClampedArray(pixelWidth * pixelHeight * 4),
    currentProgram: null,
    extensions: new Map(),
    parameters: new Map(),
    vertexArray: null,
    transformFeedback: null,
    query: null,
    operationCount: 0,
  });
  return context;
}

export function resizeWebGLContext(context, width, height) {
  const state = requireContext(context);
  state.width = dimension(width);
  state.height = dimension(height);
  state.viewport = [0, 0, state.width, state.height];
  state.scissor = [0, 0, state.width, state.height];
  state.pixels = new Uint8ClampedArray(state.width * state.height * 4);
}

export function snapshotWebGLContext(context) {
  const state = requireContext(context);
  return {
    width: state.width,
    height: state.height,
    pixels: new Uint8ClampedArray(state.pixels),
  };
}

export function webglContextProperty(context, name) {
  const state = requireContext(context);
  switch (name) {
    case "canvas": return state.canvas;
    case "drawingBufferWidth": return state.lost ? 0 : state.width;
    case "drawingBufferHeight": return state.lost ? 0 : state.height;
    case "drawingBufferColorSpace": return state.colorSpace;
    case "unpackColorSpace": return state.unpackColorSpace;
    case "drawingBufferFormat":
      return Object.freeze({
        colorSpace: state.colorSpace,
        colorType: "unorm8",
        depth: state.attributes.depth,
        stencil: state.attributes.stencil,
      });
    default: return undefined;
  }
}

export function setWebGLContextProperty(context, name, value) {
  const state = requireContext(context);
  const normalized = `${value}`;
  if (!["srgb", "display-p3"].includes(normalized)) {
    throw new TypeError(`The provided value '${normalized}' is not a valid color space.`);
  }
  if (name === "drawingBufferColorSpace") state.colorSpace = normalized;
  if (name === "unpackColorSpace") state.unpackColorSpace = normalized;
}

export function webglValueProperty(value, name, expectedKind) {
  const record = valueState.get(value);
  if (record?.kind !== expectedKind) throw new TypeError("Illegal invocation");
  return record[name];
}

export function webglOperation(context, name, args) {
  const state = requireContext(context);
  state.operationCount += 1;
  if (state.lost && !["getError", "isContextLost", "getExtension"].includes(name)) {
    return lostDefault(name);
  }
  switch (name) {
    case "getContextAttributes": return { ...state.attributes };
    case "isContextLost": return state.lost;
    case "getError": return takeError(state);
    case "getSupportedExtensions": return supportedExtensions(state.version);
    case "getExtension": return getExtension(context, state, args[0]);
    case "getParameter": return getParameter(state, Number(args[0]));
    case "activeTexture":
      state.activeTexture = Number(args[0]);
      return;
    case "enable":
      state.enabled.add(Number(args[0]));
      return;
    case "disable":
      state.enabled.delete(Number(args[0]));
      return;
    case "isEnabled": return state.enabled.has(Number(args[0]));
    case "viewport":
      state.viewport = intVector(args, 4);
      return;
    case "scissor":
      state.scissor = intVector(args, 4);
      return;
    case "clearColor":
      state.clearColor = args.slice(0, 4).map(clampUnit);
      return;
    case "clearDepth":
      state.clearDepth = clampUnit(args[0]);
      return;
    case "clearStencil":
      state.clearStencil = Number(args[0]) | 0;
      return;
    case "colorMask":
      state.colorMask = args.slice(0, 4).map(Boolean);
      return;
    case "depthMask":
      state.depthMask = Boolean(args[0]);
      return;
    case "clear":
      clearBuffers(state, Number(args[0]));
      return;
    case "readPixels":
      readPixels(state, args);
      return;
    case "createBuffer": return createResource(context, "buffer");
    case "createFramebuffer": return createResource(context, "framebuffer");
    case "createProgram": return createResource(context, "program");
    case "createQuery": return createResource(context, "query");
    case "createRenderbuffer": return createResource(context, "renderbuffer");
    case "createSampler": return createResource(context, "sampler");
    case "createShader": return createResource(context, "shader", {
      shaderType: Number(args[0]),
    });
    case "createTexture": return createResource(context, "texture");
    case "createTransformFeedback":
      return createResource(context, "transformFeedback");
    case "createVertexArray": return createResource(context, "vertexArray");
    case "fenceSync": return createResource(context, "sync", {
      condition: Number(args[0]),
      flags: Number(args[1]),
      signaled: true,
    });
    case "deleteBuffer": return deleteResource(context, args[0], "buffer");
    case "deleteFramebuffer":
      return deleteResource(context, args[0], "framebuffer");
    case "deleteProgram": return deleteResource(context, args[0], "program");
    case "deleteQuery": return deleteResource(context, args[0], "query");
    case "deleteRenderbuffer":
      return deleteResource(context, args[0], "renderbuffer");
    case "deleteSampler": return deleteResource(context, args[0], "sampler");
    case "deleteShader": return deleteResource(context, args[0], "shader");
    case "deleteSync": return deleteResource(context, args[0], "sync");
    case "deleteTexture": return deleteResource(context, args[0], "texture");
    case "deleteTransformFeedback":
      return deleteResource(context, args[0], "transformFeedback");
    case "deleteVertexArray":
      return deleteResource(context, args[0], "vertexArray");
    case "isBuffer": return isResource(context, args[0], "buffer");
    case "isFramebuffer": return isResource(context, args[0], "framebuffer");
    case "isProgram": return isResource(context, args[0], "program");
    case "isQuery": return isResource(context, args[0], "query");
    case "isRenderbuffer": return isResource(context, args[0], "renderbuffer");
    case "isSampler": return isResource(context, args[0], "sampler");
    case "isShader": return isResource(context, args[0], "shader");
    case "isSync": return isResource(context, args[0], "sync");
    case "isTexture": return isResource(context, args[0], "texture");
    case "isTransformFeedback":
      return isResource(context, args[0], "transformFeedback");
    case "isVertexArray": return isResource(context, args[0], "vertexArray");
    case "bindBuffer":
    case "bindFramebuffer":
    case "bindRenderbuffer":
    case "bindTexture":
      return bindResource(context, state, Number(args[0]), args[1]);
    case "bindSampler":
      return bindIndexedResource(context, state, "sampler", args[0], args[1]);
    case "bindTransformFeedback":
      checkedResource(
        context,
        args[1],
        "transformFeedback",
        true,
      );
      state.transformFeedback = args[1] ?? null;
      return;
    case "bindVertexArray":
      checkedResource(context, args[0], "vertexArray", true);
      state.vertexArray = args[0] ?? null;
      return;
    case "bufferData": return bufferData(context, state, args);
    case "bufferSubData": return bufferSubData(context, state, args);
    case "getBufferParameter": return getBufferParameter(state, args);
    case "shaderSource": return shaderSource(context, args);
    case "getShaderSource": return shaderRecord(context, args[0]).source;
    case "compileShader": return compileShader(context, args[0]);
    case "getShaderParameter": return getShaderParameter(context, args);
    case "getShaderInfoLog": return shaderRecord(context, args[0]).infoLog;
    case "attachShader": return attachShader(context, args);
    case "detachShader": return detachShader(context, args);
    case "getAttachedShaders":
      return [...programRecord(context, args[0]).attached];
    case "bindAttribLocation":
      return bindAttribLocation(context, args);
    case "linkProgram": return linkProgram(context, args[0]);
    case "validateProgram": return validateProgram(context, args[0]);
    case "getProgramParameter": return getProgramParameter(context, args);
    case "getProgramInfoLog": return programRecord(context, args[0]).infoLog;
    case "useProgram":
      state.currentProgram = checkedResource(context, args[0], "program", true);
      return;
    case "getAttribLocation": return getAttribLocation(context, args);
    case "getUniformLocation": return getUniformLocation(context, args);
    case "getUniform": return getUniform(context, args);
    case "getActiveAttrib": return getActiveInfo(context, args, "attribute");
    case "getActiveUniform": return getActiveInfo(context, args, "uniform");
    case "getShaderPrecisionFormat":
      return createPrecisionFormat(Number(args[1]));
    case "checkFramebufferStatus":
      return constantFor(state.version, "FRAMEBUFFER_COMPLETE");
    case "pixelStorei":
    case "texParameterf":
    case "texParameteri":
    case "samplerParameterf":
    case "samplerParameteri":
    case "hint":
      state.parameters.set(`${name}:${Number(args[0])}:${Number(args[1])}`, args[2]);
      return;
    case "getTexParameter":
    case "getSamplerParameter":
      return state.parameters.get(
        `${name === "getTexParameter" ? "texParameteri" : "samplerParameteri"}:${Number(args[0])}:${Number(args[1])}`,
      ) ?? 0;
    case "beginQuery":
      checkedResource(context, args[1], "query");
      state.query = args[1];
      resourceState.get(args[1]).active = true;
      return;
    case "endQuery":
      if (state.query !== null) resourceState.get(state.query).active = false;
      return;
    case "getQuery":
      return state.query;
    case "getQueryParameter":
      return getQueryParameter(context, args);
    case "clientWaitSync":
      checkedResource(context, args[0], "sync");
      return constantFor(state.version, "ALREADY_SIGNALED");
    case "getSyncParameter": return getSyncParameter(context, args);
    case "waitSync":
    case "finish":
    case "flush":
      return;
    case "makeXRCompatible":
      state.attributes.xrCompatible = true;
      return Promise.resolve();
    default:
      if (name.startsWith("uniform")) return setUniform(state, name, args);
      return genericResult(name);
  }
}

function getParameter(state, parameter) {
  const c = name => constantFor(state.version, name);
  // masked VENDOR / RENDERER 是 Chromium 的**固定值**，与 GPU 无关。
  //
  // 与真实 Edge 151 采集对比（fixtures/fingerprint/edge-real.json）：
  //   gl.getParameter(gl.VENDOR)   → "WebKit"
  //   gl.getParameter(gl.RENDERER) → "WebKit WebGL"
  //
  // GPU 信息只通过 WEBGL_debug_renderer_info 扩展的 UNMASKED_* 参数暴露
  // （见下方 0x9245/0x9246）。把 GPU 字符串放在 masked 参数上是明确可检测的
  // 偏差：真实浏览器里这两个值在任何机器上都相同。
  if (parameter === c("VENDOR")) return "WebKit";
  if (parameter === c("RENDERER")) return "WebKit WebGL";
  if (parameter === c("VERSION")) {
    return state.version === 2
      ? "WebGL 2.0 (OpenGL ES 3.0 Chromium)"
      : "WebGL 1.0 (OpenGL ES 2.0 Chromium)";
  }
  if (parameter === c("SHADING_LANGUAGE_VERSION")) {
    return state.version === 2
      ? "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)"
      : "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)";
  }
  // UNMASKED_VENDOR_WEBGL / UNMASKED_RENDERER_WEBGL —— 真正的 GPU 信息
  if (parameter === 0x9245) return webglState().profile.webglVendor;
  if (parameter === 0x9246) return webglState().profile.webglRenderer;
  if (parameter === c("VIEWPORT")) return new Int32Array(state.viewport);
  if (parameter === c("SCISSOR_BOX")) return new Int32Array(state.scissor);
  if (parameter === c("COLOR_CLEAR_VALUE")) {
    return new Float32Array(state.clearColor);
  }
  if (parameter === c("DEPTH_CLEAR_VALUE")) return state.clearDepth;
  if (parameter === c("STENCIL_CLEAR_VALUE")) return state.clearStencil;
  if (parameter === c("COLOR_WRITEMASK")) return [...state.colorMask];
  if (parameter === c("DEPTH_WRITEMASK")) return state.depthMask;
  if (parameter === c("CURRENT_PROGRAM")) return state.currentProgram;
  if (parameter === c("ACTIVE_TEXTURE")) return state.activeTexture;
  if (parameter === c("VERTEX_ARRAY_BINDING")) return state.vertexArray;
  if (parameter === c("TRANSFORM_FEEDBACK_BINDING")) {
    return state.transformFeedback;
  }
  if (parameter === c("ALIASED_LINE_WIDTH_RANGE")) {
    return new Float32Array([1, 1]);
  }
  if (parameter === c("ALIASED_POINT_SIZE_RANGE")) {
    return new Float32Array([1, 1024]);
  }
  const numericLimits = new Map([
    [c("MAX_TEXTURE_SIZE"), 16384],
    [c("MAX_CUBE_MAP_TEXTURE_SIZE"), 16384],
    [c("MAX_RENDERBUFFER_SIZE"), 16384],
    [c("MAX_VIEWPORT_DIMS"), new Int32Array([32767, 32767])],
    [c("MAX_VERTEX_ATTRIBS"), 16],
    [c("MAX_COMBINED_TEXTURE_IMAGE_UNITS"), 32],
    [c("MAX_TEXTURE_IMAGE_UNITS"), 16],
    [c("MAX_VERTEX_TEXTURE_IMAGE_UNITS"), 16],
    [c("MAX_DRAW_BUFFERS"), 8],
    [c("MAX_COLOR_ATTACHMENTS"), 8],
    [c("MAX_SAMPLES"), 8],
    [c("MAX_3D_TEXTURE_SIZE"), 2048],
    [c("MAX_ARRAY_TEXTURE_LAYERS"), 2048],
  ]);
  if (numericLimits.has(parameter)) return numericLimits.get(parameter);
  if (state.bindings.has(parameter)) return state.bindings.get(parameter);
  return null;
}

function getExtension(context, state, requestedName) {
  const name = `${requestedName}`.toLowerCase();
  const supported = supportedExtensions(state.version);
  const canonical = supported.find(value => value.toLowerCase() === name);
  if (canonical === undefined) return null;
  if (state.extensions.has(canonical)) return state.extensions.get(canonical);
  let extension = {};
  if (canonical === "WEBGL_debug_renderer_info") {
    extension = {
      UNMASKED_VENDOR_WEBGL: 0x9245,
      UNMASKED_RENDERER_WEBGL: 0x9246,
    };
  } else if (canonical === "WEBGL_lose_context") {
    extension = {
      loseContext() {
        loseContext(context, state);
      },
      restoreContext() {
        restoreContext(context, state);
      },
    };
    registerNativeFunction(extension.loseContext, "loseContext");
    registerNativeFunction(extension.restoreContext, "restoreContext");
  } else if (canonical === "OES_vertex_array_object") {
    extension = {
      VERTEX_ARRAY_BINDING_OES: 0x85b5,
      createVertexArrayOES() {
        return createResource(context, "vertexArray");
      },
      deleteVertexArrayOES(value) {
        deleteResource(context, value, "vertexArray");
      },
      isVertexArrayOES(value) {
        return isResource(context, value, "vertexArray");
      },
      bindVertexArrayOES(value) {
        checkedResource(context, value, "vertexArray", true);
        state.vertexArray = value ?? null;
      },
    };
    for (const methodName of [
      "createVertexArrayOES",
      "deleteVertexArrayOES",
      "isVertexArrayOES",
      "bindVertexArrayOES",
    ]) registerNativeFunction(extension[methodName], methodName);
  }
  Object.defineProperty(extension, Symbol.toStringTag, {
    value: canonical,
    configurable: true,
  });
  state.extensions.set(canonical, extension);
  return extension;
}

function supportedExtensions(version) {
  const common = [
    "ANGLE_instanced_arrays",
    "EXT_blend_minmax",
    "EXT_color_buffer_half_float",
    "EXT_float_blend",
    "EXT_texture_filter_anisotropic",
    "OES_element_index_uint",
    "OES_fbo_render_mipmap",
    "OES_standard_derivatives",
    "OES_texture_float",
    "OES_texture_float_linear",
    "OES_texture_half_float",
    "OES_texture_half_float_linear",
    "OES_vertex_array_object",
    "WEBGL_color_buffer_float",
    "WEBGL_compressed_texture_s3tc",
    "WEBGL_debug_renderer_info",
    "WEBGL_debug_shaders",
    "WEBGL_depth_texture",
    "WEBGL_draw_buffers",
    "WEBGL_lose_context",
    "WEBGL_multi_draw",
  ];
  if (version === 2) {
    return [
      "EXT_color_buffer_float",
      "EXT_disjoint_timer_query_webgl2",
      "EXT_float_blend",
      "EXT_texture_filter_anisotropic",
      "OES_draw_buffers_indexed",
      "OES_texture_float_linear",
      "WEBGL_compressed_texture_s3tc",
      "WEBGL_debug_renderer_info",
      "WEBGL_debug_shaders",
      "WEBGL_lose_context",
      "WEBGL_multi_draw",
    ];
  }
  return common;
}

function createResource(context, kind, extra = {}) {
  const object = Object.create(resourceConstructors[kind].prototype);
  resourceState.set(object, {
    kind,
    context,
    deleted: false,
    data: new Uint8Array(),
    usage: 0,
    source: "",
    compiled: false,
    infoLog: "",
    attached: new Set(),
    linked: false,
    validated: false,
    attributes: new Map(),
    uniforms: new Map(),
    uniformLocations: new Map(),
    ...extra,
  });
  return object;
}

function bindResource(context, state, target, resource) {
  const expected = bindingKind(target, state.version);
  if (expected !== null) checkedResource(context, resource, expected, true);
  state.bindings.set(target, resource ?? null);
  if (expected === "texture") {
    state.textureUnits.set(`${state.activeTexture}:${target}`, resource ?? null);
  }
}

function bindIndexedResource(context, state, kind, index, resource) {
  checkedResource(context, resource, kind, true);
  state.indexedBindings.set(`${kind}:${Number(index)}`, resource ?? null);
}

function bindingKind(target, version) {
  const c = name => constantFor(version, name);
  if ([
    c("ARRAY_BUFFER"),
    c("ELEMENT_ARRAY_BUFFER"),
    c("COPY_READ_BUFFER"),
    c("COPY_WRITE_BUFFER"),
    c("PIXEL_PACK_BUFFER"),
    c("PIXEL_UNPACK_BUFFER"),
    c("TRANSFORM_FEEDBACK_BUFFER"),
    c("UNIFORM_BUFFER"),
  ].includes(target)) return "buffer";
  if ([c("TEXTURE_2D"), c("TEXTURE_CUBE_MAP"), c("TEXTURE_3D"), c("TEXTURE_2D_ARRAY")].includes(target)) {
    return "texture";
  }
  if ([c("FRAMEBUFFER"), c("READ_FRAMEBUFFER"), c("DRAW_FRAMEBUFFER")].includes(target)) {
    return "framebuffer";
  }
  if (target === c("RENDERBUFFER")) return "renderbuffer";
  return null;
}

function bufferData(context, state, args) {
  const target = Number(args[0]);
  const buffer = state.bindings.get(target);
  if (!isResource(context, buffer, "buffer")) return setError(state, "INVALID_OPERATION");
  const record = resourceState.get(buffer);
  record.usage = Number(args[2]);
  record.data = sourceBytes(args[1]);
}

function bufferSubData(context, state, args) {
  const target = Number(args[0]);
  const buffer = state.bindings.get(target);
  if (!isResource(context, buffer, "buffer")) return setError(state, "INVALID_OPERATION");
  const record = resourceState.get(buffer);
  const offset = Math.max(0, Number(args[1]) >>> 0);
  const bytes = sourceBytes(args[2]);
  if (offset + bytes.length > record.data.length) {
    setError(state, "INVALID_VALUE");
    return;
  }
  record.data.set(bytes, offset);
}

function getBufferParameter(state, args) {
  const record = resourceState.get(state.bindings.get(Number(args[0])));
  if (record?.kind !== "buffer" || record.deleted) return null;
  if (Number(args[1]) === constantFor(state.version, "BUFFER_SIZE")) {
    return record.data.byteLength;
  }
  if (Number(args[1]) === constantFor(state.version, "BUFFER_USAGE")) {
    return record.usage;
  }
  return null;
}

function shaderSource(context, args) {
  shaderRecord(context, args[0]).source = `${args[1]}`;
}

function compileShader(context, shader) {
  const record = shaderRecord(context, shader);
  record.compiled = /\bvoid\s+main\s*\(/u.test(record.source);
  record.infoLog = record.compiled
    ? ""
    : "ERROR: 0:1: 'main' : function is missing";
}

function getShaderParameter(context, args) {
  const record = shaderRecord(context, args[0]);
  const parameter = Number(args[1]);
  const version = requireContext(context).version;
  if (parameter === constantFor(version, "COMPILE_STATUS")) return record.compiled;
  if (parameter === constantFor(version, "DELETE_STATUS")) return record.deleted;
  if (parameter === constantFor(version, "SHADER_TYPE")) return record.shaderType;
  return null;
}

function attachShader(context, args) {
  const program = programRecord(context, args[0]);
  shaderRecord(context, args[1]);
  program.attached.add(args[1]);
}

function detachShader(context, args) {
  programRecord(context, args[0]).attached.delete(args[1]);
}

function bindAttribLocation(context, args) {
  programRecord(context, args[0]).attributes.set(`${args[2]}`, Number(args[1]));
}

function linkProgram(context, program) {
  const record = programRecord(context, program);
  const shaders = [...record.attached].map(shader => shaderRecord(context, shader));
  record.linked = shaders.length > 0 && shaders.every(shader => shader.compiled);
  record.infoLog = record.linked ? "" : "Program link failed: shader compilation failed.";
}

function validateProgram(context, program) {
  const record = programRecord(context, program);
  record.validated = record.linked;
}

function getProgramParameter(context, args) {
  const record = programRecord(context, args[0]);
  const parameter = Number(args[1]);
  const version = requireContext(context).version;
  if (parameter === constantFor(version, "LINK_STATUS")) return record.linked;
  if (parameter === constantFor(version, "VALIDATE_STATUS")) return record.validated;
  if (parameter === constantFor(version, "DELETE_STATUS")) return record.deleted;
  if (parameter === constantFor(version, "ATTACHED_SHADERS")) {
    return record.attached.size;
  }
  if (parameter === constantFor(version, "ACTIVE_ATTRIBUTES")) {
    return record.attributes.size;
  }
  if (parameter === constantFor(version, "ACTIVE_UNIFORMS")) {
    return record.uniformLocations.size;
  }
  return null;
}

function getAttribLocation(context, args) {
  const record = programRecord(context, args[0]);
  const name = `${args[1]}`;
  if (!record.linked) return -1;
  if (!record.attributes.has(name)) record.attributes.set(name, record.attributes.size);
  return record.attributes.get(name);
}

function getUniformLocation(context, args) {
  const record = programRecord(context, args[0]);
  if (!record.linked) return null;
  const name = `${args[1]}`;
  if (record.uniformLocations.has(name)) return record.uniformLocations.get(name);
  const location = Object.create(WebGLUniformLocation.prototype);
  valueState.set(location, {
    kind: "uniformLocation",
    context,
    program: args[0],
    name,
  });
  record.uniformLocations.set(name, location);
  return location;
}

function setUniform(state, name, args) {
  const location = args[0];
  if (location === null) return;
  const locationRecord = valueState.get(location);
  if (locationRecord?.kind !== "uniformLocation" || locationRecord.context === undefined) {
    throw new TypeError("Illegal invocation");
  }
  const program = resourceState.get(locationRecord.program);
  const values = args.slice(1).map(value => {
    if (ArrayBuffer.isView(value)) return Array.from(value);
    return value;
  });
  program.uniforms.set(locationRecord.name, values.length === 1 ? values[0] : values);
  state.operationCount += 1;
}

function getUniform(context, args) {
  const program = programRecord(context, args[0]);
  const location = valueState.get(args[1]);
  if (location?.kind !== "uniformLocation" || location.program !== args[0]) return null;
  return program.uniforms.get(location.name) ?? null;
}

function getActiveInfo(context, args, kind) {
  const program = programRecord(context, args[0]);
  const entries = kind === "attribute"
    ? [...program.attributes.keys()]
    : [...program.uniformLocations.keys()];
  const name = entries[Number(args[1])];
  if (name === undefined) return null;
  const object = Object.create(WebGLActiveInfo.prototype);
  valueState.set(object, {
    kind: "activeInfo",
    size: 1,
    type: constantFor(requireContext(context).version, "FLOAT"),
    name,
  });
  return object;
}

function createPrecisionFormat(precisionType) {
  const object = Object.create(WebGLShaderPrecisionFormat.prototype);
  const high = precisionType === 0x8df2 || precisionType === 0x8df5;
  valueState.set(object, {
    kind: "precisionFormat",
    rangeMin: high ? 127 : 14,
    rangeMax: high ? 127 : 14,
    precision: high ? 23 : 10,
  });
  return object;
}

function getQueryParameter(context, args) {
  const record = checkedResource(context, args[0], "query");
  const parameter = Number(args[1]);
  const version = requireContext(context).version;
  if (parameter === constantFor(version, "QUERY_RESULT_AVAILABLE")) {
    return !record.active;
  }
  if (parameter === constantFor(version, "QUERY_RESULT")) return 1;
  return null;
}

function getSyncParameter(context, args) {
  const record = checkedResource(context, args[0], "sync");
  const parameter = Number(args[1]);
  const version = requireContext(context).version;
  if (parameter === constantFor(version, "SYNC_STATUS")) {
    return constantFor(version, record.signaled ? "SIGNALED" : "UNSIGNALED");
  }
  if (parameter === constantFor(version, "SYNC_CONDITION")) return record.condition;
  if (parameter === constantFor(version, "SYNC_FLAGS")) return record.flags;
  if (parameter === constantFor(version, "OBJECT_TYPE")) {
    return constantFor(version, "SYNC_FENCE");
  }
  return null;
}

function clearBuffers(state, mask) {
  if ((mask & constantFor(state.version, "COLOR_BUFFER_BIT")) === 0) return;
  const color = state.clearColor.map(value => Math.round(value * 255));
  for (let offset = 0; offset < state.pixels.length; offset += 4) {
    for (let channel = 0; channel < 4; channel += 1) {
      if (state.colorMask[channel]) state.pixels[offset + channel] = color[channel];
    }
  }
}

function readPixels(state, args) {
  const width = Math.max(0, Number(args[2]) | 0);
  const height = Math.max(0, Number(args[3]) | 0);
  const destination = args[6] ?? args[7];
  if (!ArrayBuffer.isView(destination)) {
    setError(state, "INVALID_VALUE");
    return;
  }
  const count = Math.min(destination.byteLength, width * height * 4);
  const source = state.pixels.subarray(0, count);
  new Uint8Array(
    destination.buffer,
    destination.byteOffset,
    destination.byteLength,
  ).set(source.subarray(0, destination.byteLength));
}

function loseContext(context, state) {
  if (state.lost) return;
  state.lost = true;
  dispatchContextEvent(state.canvas, "webglcontextlost", "context lost");
}

function restoreContext(context, state) {
  if (!state.lost) return;
  state.lost = false;
  state.error = 0;
  dispatchContextEvent(state.canvas, "webglcontextrestored", "");
}

function dispatchContextEvent(canvas, type, statusMessage) {
  if (typeof canvas?.dispatchEvent !== "function") return;
  canvas.dispatchEvent(new WebGLContextEvent(type, {
    cancelable: type === "webglcontextlost",
    statusMessage,
  }));
}

function deleteResource(context, resource, kind) {
  if (resource === null || resource === undefined) return;
  const record = checkedResource(context, resource, kind);
  record.deleted = true;
}

function isResource(context, resource, kind) {
  const record = resourceState.get(resource);
  return record?.kind === kind && record.context === context && !record.deleted;
}

function checkedResource(context, resource, kind, nullable = false) {
  if (nullable && (resource === null || resource === undefined)) return null;
  const record = resourceState.get(resource);
  if (record?.kind !== kind || record.context !== context || record.deleted) {
    throw new TypeError("The object does not belong to this WebGL context.");
  }
  return record;
}

function shaderRecord(context, shader) {
  return checkedResource(context, shader, "shader");
}

function programRecord(context, program) {
  return checkedResource(context, program, "program");
}

function requireContext(context) {
  const record = contextState.get(context);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function normalizeAttributes(options, version) {
  const input = options === null || options === undefined ? {} : Object(options);
  const powerPreference = `${input.powerPreference ?? "default"}`;
  return {
    alpha: input.alpha === undefined ? true : Boolean(input.alpha),
    depth: input.depth === undefined ? true : Boolean(input.depth),
    stencil: Boolean(input.stencil),
    antialias: input.antialias === undefined ? true : Boolean(input.antialias),
    premultipliedAlpha: input.premultipliedAlpha === undefined
      ? true
      : Boolean(input.premultipliedAlpha),
    preserveDrawingBuffer: Boolean(input.preserveDrawingBuffer),
    powerPreference: ["default", "high-performance", "low-power"].includes(powerPreference)
      ? powerPreference
      : "default",
    failIfMajorPerformanceCaveat: Boolean(input.failIfMajorPerformanceCaveat),
    desynchronized: Boolean(input.desynchronized),
    xrCompatible: Boolean(input.xrCompatible),
    version,
  };
}

function sourceBytes(value) {
  if (typeof value === "number") return new Uint8Array(Math.max(0, value) >>> 0);
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  return new Uint8Array();
}

function takeError(state) {
  const error = state.error;
  state.error = 0;
  return error;
}

function setError(state, name) {
  if (state.error === 0) state.error = constantFor(state.version, name);
}

function constantFor(version, name) {
  return (version === 2 ? constants2 : constants1).get(name);
}

function genericResult(name) {
  if (name === "getFragDataLocation" || name === "getUniformBlockIndex") return -1;
  if (name.startsWith("get")) return null;
  if (name.startsWith("is")) return false;
  return undefined;
}

function lostDefault(name) {
  if (name.startsWith("is")) return name === "isContextLost";
  if (name.startsWith("get") || name.startsWith("create")) return null;
  return undefined;
}

function intVector(args, length) {
  return args.slice(0, length).map(value => Number(value) | 0);
}

function clampUnit(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.min(1, Math.max(0, number));
}

function dimension(value) {
  return Math.max(0, Math.min(0xffffffff, Number(value) >>> 0));
}

function illegalConstructor(name) {
  throw new TypeError(`Failed to construct '${name}': Illegal constructor`);
}
