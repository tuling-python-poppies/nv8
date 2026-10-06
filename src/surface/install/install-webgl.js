// WebGL 安装器：按真实 Edge 采集基准展开的安装语句。
// 直接编辑本文件；导出由 `npm run check:generated` 校验。
import { Event } from "../api/event/event-constructor.js";
import {
  WebGL2RenderingContext,
  WebGLActiveInfo,
  WebGLBuffer,
  WebGLContextEvent,
  WebGLFramebuffer,
  WebGLObject,
  WebGLProgram,
  WebGLQuery,
  WebGLRenderbuffer,
  WebGLRenderingContext,
  WebGLSampler,
  WebGLShader,
  WebGLShaderPrecisionFormat,
  WebGLSync,
  WebGLTexture,
  WebGLTransformFeedback,
  WebGLUniformLocation,
  WebGLVertexArrayObject,
  webglConstructors,
  webglContextProperty,
  setWebGLContextProperty,
  webglOperation,
  webglValueProperty,
} from "../api/webgl/webgl-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const resourceConstructors = [
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
];

export function installWebGL() {

    delete webglConstructors[0].prototype.constructor;
    defineGlobalConstructor(webglConstructors[0].name, webglConstructors[0]);

    delete webglConstructors[1].prototype.constructor;
    defineGlobalConstructor(webglConstructors[1].name, webglConstructors[1]);

    delete webglConstructors[2].prototype.constructor;
    defineGlobalConstructor(webglConstructors[2].name, webglConstructors[2]);

    delete webglConstructors[3].prototype.constructor;
    defineGlobalConstructor(webglConstructors[3].name, webglConstructors[3]);

    delete webglConstructors[4].prototype.constructor;
    defineGlobalConstructor(webglConstructors[4].name, webglConstructors[4]);

    delete webglConstructors[5].prototype.constructor;
    defineGlobalConstructor(webglConstructors[5].name, webglConstructors[5]);

    delete webglConstructors[6].prototype.constructor;
    defineGlobalConstructor(webglConstructors[6].name, webglConstructors[6]);

    delete webglConstructors[7].prototype.constructor;
    defineGlobalConstructor(webglConstructors[7].name, webglConstructors[7]);

    delete webglConstructors[8].prototype.constructor;
    defineGlobalConstructor(webglConstructors[8].name, webglConstructors[8]);

    delete webglConstructors[9].prototype.constructor;
    defineGlobalConstructor(webglConstructors[9].name, webglConstructors[9]);

    delete webglConstructors[10].prototype.constructor;
    defineGlobalConstructor(webglConstructors[10].name, webglConstructors[10]);

    delete webglConstructors[11].prototype.constructor;
    defineGlobalConstructor(webglConstructors[11].name, webglConstructors[11]);

    delete webglConstructors[12].prototype.constructor;
    defineGlobalConstructor(webglConstructors[12].name, webglConstructors[12]);

    delete webglConstructors[13].prototype.constructor;
    defineGlobalConstructor(webglConstructors[13].name, webglConstructors[13]);

    delete webglConstructors[14].prototype.constructor;
    defineGlobalConstructor(webglConstructors[14].name, webglConstructors[14]);

    delete webglConstructors[15].prototype.constructor;
    defineGlobalConstructor(webglConstructors[15].name, webglConstructors[15]);

    delete webglConstructors[16].prototype.constructor;
    defineGlobalConstructor(webglConstructors[16].name, webglConstructors[16]);

    delete webglConstructors[17].prototype.constructor;
    defineGlobalConstructor(webglConstructors[17].name, webglConstructors[17]);

    {
      Object.setPrototypeOf(resourceConstructors[1].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[1], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[2].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[2], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[3].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[3], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[4].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[4], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[5].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[5], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[6].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[6], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[7].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[7], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[8].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[8], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[9].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[9], WebGLObject);
    }

    {
      Object.setPrototypeOf(resourceConstructors[10].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[10], WebGLObject);
    }

  // resourceConstructors[11]（WebGLUniformLocation）按规范不继承 WebGLObject，
  // 这里没有要执行的安装步骤；迁移前的空 do/while 块已删除。

      Object.setPrototypeOf(resourceConstructors[12].prototype, WebGLObject.prototype);
      Object.setPrototypeOf(resourceConstructors[12], WebGLObject);

  Object.setPrototypeOf(WebGLContextEvent.prototype, Event.prototype);
  Object.setPrototypeOf(WebGLContextEvent, Event);

  {

    {
      installContextAccessor(WebGLRenderingContext, "canvas");
    }

    {
      installContextAccessor(WebGLRenderingContext, "drawingBufferWidth");
    }

    {
      installContextAccessor(WebGLRenderingContext, "drawingBufferHeight");
    }

    {
      installContextAccessor(WebGLRenderingContext, "drawingBufferColorSpace");
    }

    {
      installContextAccessor(WebGLRenderingContext, "unpackColorSpace");
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_BUFFER_BIT", 256);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BUFFER_BIT", 1024);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "COLOR_BUFFER_BIT", 16384);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "POINTS", 0);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINES", 1);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINE_LOOP", 2);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINE_STRIP", 3);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TRIANGLES", 4);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TRIANGLE_STRIP", 5);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TRIANGLE_FAN", 6);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ZERO", 0);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ONE", 1);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SRC_COLOR", 768);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ONE_MINUS_SRC_COLOR", 769);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SRC_ALPHA", 770);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ONE_MINUS_SRC_ALPHA", 771);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DST_ALPHA", 772);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ONE_MINUS_DST_ALPHA", 773);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DST_COLOR", 774);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ONE_MINUS_DST_COLOR", 775);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SRC_ALPHA_SATURATE", 776);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FUNC_ADD", 32774);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_EQUATION", 32777);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_EQUATION_RGB", 32777);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_EQUATION_ALPHA", 34877);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FUNC_SUBTRACT", 32778);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FUNC_REVERSE_SUBTRACT", 32779);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_DST_RGB", 32968);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_SRC_RGB", 32969);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_DST_ALPHA", 32970);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_SRC_ALPHA", 32971);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CONSTANT_COLOR", 32769);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ONE_MINUS_CONSTANT_COLOR", 32770);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CONSTANT_ALPHA", 32771);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ONE_MINUS_CONSTANT_ALPHA", 32772);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND_COLOR", 32773);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ARRAY_BUFFER", 34962);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ELEMENT_ARRAY_BUFFER", 34963);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ARRAY_BUFFER_BINDING", 34964);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ELEMENT_ARRAY_BUFFER_BINDING", 34965);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STREAM_DRAW", 35040);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STATIC_DRAW", 35044);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DYNAMIC_DRAW", 35048);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BUFFER_SIZE", 34660);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BUFFER_USAGE", 34661);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CURRENT_VERTEX_ATTRIB", 34342);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRONT", 1028);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BACK", 1029);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRONT_AND_BACK", 1032);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_2D", 3553);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CULL_FACE", 2884);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLEND", 3042);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DITHER", 3024);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_TEST", 2960);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_TEST", 2929);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SCISSOR_TEST", 3089);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "POLYGON_OFFSET_FILL", 32823);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLE_ALPHA_TO_COVERAGE", 32926);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLE_COVERAGE", 32928);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NO_ERROR", 0);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INVALID_ENUM", 1280);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INVALID_VALUE", 1281);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INVALID_OPERATION", 1282);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "OUT_OF_MEMORY", 1285);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CW", 2304);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CCW", 2305);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINE_WIDTH", 2849);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ALIASED_POINT_SIZE_RANGE", 33901);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ALIASED_LINE_WIDTH_RANGE", 33902);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CULL_FACE_MODE", 2885);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRONT_FACE", 2886);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_RANGE", 2928);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_WRITEMASK", 2930);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_CLEAR_VALUE", 2931);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_FUNC", 2932);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_CLEAR_VALUE", 2961);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_FUNC", 2962);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_FAIL", 2964);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_PASS_DEPTH_FAIL", 2965);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_PASS_DEPTH_PASS", 2966);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_REF", 2967);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_VALUE_MASK", 2963);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_WRITEMASK", 2968);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BACK_FUNC", 34816);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BACK_FAIL", 34817);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BACK_PASS_DEPTH_FAIL", 34818);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BACK_PASS_DEPTH_PASS", 34819);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BACK_REF", 36003);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BACK_VALUE_MASK", 36004);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BACK_WRITEMASK", 36005);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VIEWPORT", 2978);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SCISSOR_BOX", 3088);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "COLOR_CLEAR_VALUE", 3106);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "COLOR_WRITEMASK", 3107);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNPACK_ALIGNMENT", 3317);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "PACK_ALIGNMENT", 3333);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_TEXTURE_SIZE", 3379);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_VIEWPORT_DIMS", 3386);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SUBPIXEL_BITS", 3408);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RED_BITS", 3410);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "GREEN_BITS", 3411);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BLUE_BITS", 3412);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ALPHA_BITS", 3413);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_BITS", 3414);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_BITS", 3415);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "POLYGON_OFFSET_UNITS", 10752);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "POLYGON_OFFSET_FACTOR", 32824);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_BINDING_2D", 32873);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLE_BUFFERS", 32936);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLES", 32937);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLE_COVERAGE_VALUE", 32938);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLE_COVERAGE_INVERT", 32939);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "COMPRESSED_TEXTURE_FORMATS", 34467);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DONT_CARE", 4352);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FASTEST", 4353);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NICEST", 4354);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "GENERATE_MIPMAP_HINT", 33170);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BYTE", 5120);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNSIGNED_BYTE", 5121);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SHORT", 5122);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNSIGNED_SHORT", 5123);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INT", 5124);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNSIGNED_INT", 5125);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FLOAT", 5126);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_COMPONENT", 6402);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ALPHA", 6406);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RGB", 6407);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RGBA", 6408);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LUMINANCE", 6409);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LUMINANCE_ALPHA", 6410);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNSIGNED_SHORT_4_4_4_4", 32819);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNSIGNED_SHORT_5_5_5_1", 32820);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNSIGNED_SHORT_5_6_5", 33635);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAGMENT_SHADER", 35632);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_SHADER", 35633);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_VERTEX_ATTRIBS", 34921);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_VERTEX_UNIFORM_VECTORS", 36347);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_VARYING_VECTORS", 36348);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_COMBINED_TEXTURE_IMAGE_UNITS", 35661);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_VERTEX_TEXTURE_IMAGE_UNITS", 35660);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_TEXTURE_IMAGE_UNITS", 34930);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_FRAGMENT_UNIFORM_VECTORS", 36349);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SHADER_TYPE", 35663);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DELETE_STATUS", 35712);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINK_STATUS", 35714);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VALIDATE_STATUS", 35715);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ATTACHED_SHADERS", 35717);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ACTIVE_UNIFORMS", 35718);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ACTIVE_ATTRIBUTES", 35721);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SHADING_LANGUAGE_VERSION", 35724);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CURRENT_PROGRAM", 35725);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NEVER", 512);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LESS", 513);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "EQUAL", 514);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LEQUAL", 515);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "GREATER", 516);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NOTEQUAL", 517);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "GEQUAL", 518);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ALWAYS", 519);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "KEEP", 7680);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "REPLACE", 7681);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INCR", 7682);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DECR", 7683);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INVERT", 5386);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INCR_WRAP", 34055);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DECR_WRAP", 34056);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VENDOR", 7936);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERER", 7937);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERSION", 7938);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NEAREST", 9728);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINEAR", 9729);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NEAREST_MIPMAP_NEAREST", 9984);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINEAR_MIPMAP_NEAREST", 9985);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NEAREST_MIPMAP_LINEAR", 9986);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LINEAR_MIPMAP_LINEAR", 9987);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_MAG_FILTER", 10240);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_MIN_FILTER", 10241);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_WRAP_S", 10242);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_WRAP_T", 10243);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE", 5890);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP", 34067);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_BINDING_CUBE_MAP", 34068);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_X", 34069);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_X", 34070);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_Y", 34071);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_Y", 34072);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_Z", 34073);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_Z", 34074);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_CUBE_MAP_TEXTURE_SIZE", 34076);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE0", 33984);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE1", 33985);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE2", 33986);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE3", 33987);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE4", 33988);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE5", 33989);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE6", 33990);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE7", 33991);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE8", 33992);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE9", 33993);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE10", 33994);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE11", 33995);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE12", 33996);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE13", 33997);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE14", 33998);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE15", 33999);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE16", 34000);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE17", 34001);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE18", 34002);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE19", 34003);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE20", 34004);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE21", 34005);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE22", 34006);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE23", 34007);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE24", 34008);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE25", 34009);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE26", 34010);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE27", 34011);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE28", 34012);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE29", 34013);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE30", 34014);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "TEXTURE31", 34015);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "ACTIVE_TEXTURE", 34016);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "REPEAT", 10497);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CLAMP_TO_EDGE", 33071);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MIRRORED_REPEAT", 33648);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FLOAT_VEC2", 35664);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FLOAT_VEC3", 35665);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FLOAT_VEC4", 35666);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INT_VEC2", 35667);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INT_VEC3", 35668);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INT_VEC4", 35669);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BOOL", 35670);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BOOL_VEC2", 35671);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BOOL_VEC3", 35672);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BOOL_VEC4", 35673);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FLOAT_MAT2", 35674);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FLOAT_MAT3", 35675);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FLOAT_MAT4", 35676);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLER_2D", 35678);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "SAMPLER_CUBE", 35680);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_ENABLED", 34338);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_SIZE", 34339);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_STRIDE", 34340);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_TYPE", 34341);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_NORMALIZED", 34922);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_POINTER", 34373);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", 34975);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "IMPLEMENTATION_COLOR_READ_TYPE", 35738);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "IMPLEMENTATION_COLOR_READ_FORMAT", 35739);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "COMPILE_STATUS", 35713);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LOW_FLOAT", 36336);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MEDIUM_FLOAT", 36337);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "HIGH_FLOAT", 36338);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "LOW_INT", 36339);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MEDIUM_INT", 36340);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "HIGH_INT", 36341);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER", 36160);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER", 36161);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RGBA4", 32854);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RGB5_A1", 32855);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RGB565", 36194);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_COMPONENT16", 33189);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_INDEX8", 36168);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_STENCIL", 34041);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_WIDTH", 36162);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_HEIGHT", 36163);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_INTERNAL_FORMAT", 36164);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_RED_SIZE", 36176);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_GREEN_SIZE", 36177);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_BLUE_SIZE", 36178);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_ALPHA_SIZE", 36179);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_DEPTH_SIZE", 36180);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_STENCIL_SIZE", 36181);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", 36048);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", 36049);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", 36050);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", 36051);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "COLOR_ATTACHMENT0", 36064);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_ATTACHMENT", 36096);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "STENCIL_ATTACHMENT", 36128);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "DEPTH_STENCIL_ATTACHMENT", 33306);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "NONE", 0);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_COMPLETE", 36053);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", 36054);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", 36055);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", 36057);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_UNSUPPORTED", 36061);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "FRAMEBUFFER_BINDING", 36006);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RENDERBUFFER_BINDING", 36007);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "MAX_RENDERBUFFER_SIZE", 34024);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "INVALID_FRAMEBUFFER_OPERATION", 1286);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNPACK_FLIP_Y_WEBGL", 37440);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNPACK_PREMULTIPLY_ALPHA_WEBGL", 37441);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "CONTEXT_LOST_WEBGL", 37442);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "UNPACK_COLORSPACE_CONVERSION_WEBGL", 37443);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "BROWSER_DEFAULT_WEBGL", 37444);
    }

    {
      installContextMethod(WebGLRenderingContext, "activeTexture", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "attachShader", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "bindAttribLocation", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "bindRenderbuffer", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "blendColor", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "blendEquation", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "blendEquationSeparate", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "blendFunc", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "blendFuncSeparate", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "bufferData", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "bufferSubData", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "checkFramebufferStatus", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "compileShader", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "compressedTexImage2D", 7);
    }

    {
      installContextMethod(WebGLRenderingContext, "compressedTexSubImage2D", 8);
    }

    {
      installContextMethod(WebGLRenderingContext, "copyTexImage2D", 8);
    }

    {
      installContextMethod(WebGLRenderingContext, "copyTexSubImage2D", 8);
    }

    {
      installContextMethod(WebGLRenderingContext, "createBuffer", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "createFramebuffer", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "createProgram", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "createRenderbuffer", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "createShader", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "createTexture", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "cullFace", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "deleteBuffer", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "deleteFramebuffer", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "deleteProgram", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "deleteRenderbuffer", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "deleteShader", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "deleteTexture", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "depthFunc", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "depthMask", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "depthRange", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "detachShader", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "disable", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "enable", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "finish", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "flush", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "framebufferRenderbuffer", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "framebufferTexture2D", 5);
    }

    {
      installContextMethod(WebGLRenderingContext, "frontFace", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "generateMipmap", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "getActiveAttrib", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getActiveUniform", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getAttachedShaders", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "getAttribLocation", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getBufferParameter", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getContextAttributes", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "getError", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "getExtension", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "getFramebufferAttachmentParameter", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "getParameter", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "getProgramInfoLog", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "getProgramParameter", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getRenderbufferParameter", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getShaderInfoLog", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "getShaderParameter", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getShaderPrecisionFormat", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getShaderSource", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "getSupportedExtensions", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "getTexParameter", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getUniform", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getUniformLocation", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getVertexAttrib", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "getVertexAttribOffset", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "hint", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "isBuffer", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "isContextLost", 0);
    }

    {
      installContextMethod(WebGLRenderingContext, "isEnabled", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "isFramebuffer", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "isProgram", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "isRenderbuffer", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "isShader", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "isTexture", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "lineWidth", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "linkProgram", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "pixelStorei", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "polygonOffset", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "readPixels", 7);
    }

    {
      installContextMethod(WebGLRenderingContext, "renderbufferStorage", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "sampleCoverage", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "shaderSource", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "stencilFunc", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "stencilFuncSeparate", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "stencilMask", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "stencilMaskSeparate", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "stencilOp", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "stencilOpSeparate", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "texImage2D", 6);
    }

    {
      installContextMethod(WebGLRenderingContext, "texParameterf", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "texParameteri", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "texSubImage2D", 7);
    }

    {
      installContextMethod(WebGLRenderingContext, "useProgram", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "validateProgram", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "bindBuffer", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "bindFramebuffer", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "bindTexture", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "clear", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "clearColor", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "clearDepth", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "clearStencil", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "colorMask", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "disableVertexAttribArray", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "drawArrays", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "drawElements", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "enableVertexAttribArray", 1);
    }

    {
      installContextMethod(WebGLRenderingContext, "scissor", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform1f", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform1fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform1i", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform1iv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform2f", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform2fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform2i", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform2iv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform3f", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform3fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform3i", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform3iv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform4f", 5);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform4fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform4i", 5);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniform4iv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniformMatrix2fv", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniformMatrix3fv", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "uniformMatrix4fv", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib1f", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib1fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib2f", 3);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib2fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib3f", 4);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib3fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib4f", 5);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttrib4fv", 2);
    }

    {
      installContextMethod(WebGLRenderingContext, "vertexAttribPointer", 6);
    }

    {
      installContextMethod(WebGLRenderingContext, "viewport", 4);
    }

    {
      installContextAccessor(WebGLRenderingContext, "drawingBufferFormat");
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RGB8", 32849);
    }

    {
      defineConstant(WebGLRenderingContext.prototype, "RGBA8", 32856);
    }

    {
      installContextMethod(WebGLRenderingContext, "drawingBufferStorage", 3);
    }

    {
      defineConstructorBacklink(WebGLRenderingContext.prototype, WebGLRenderingContext);
    }

    {
      installContextMethod(WebGLRenderingContext, "makeXRCompatible", 0);
    }

    {
      defineToStringTag(WebGLRenderingContext.prototype, WebGLRenderingContext.name);
    }

    defineConstant(WebGLRenderingContext, "DEPTH_BUFFER_BIT", 256);

    defineConstant(WebGLRenderingContext, "STENCIL_BUFFER_BIT", 1024);

    defineConstant(WebGLRenderingContext, "COLOR_BUFFER_BIT", 16384);

    defineConstant(WebGLRenderingContext, "POINTS", 0);

    defineConstant(WebGLRenderingContext, "LINES", 1);

    defineConstant(WebGLRenderingContext, "LINE_LOOP", 2);

    defineConstant(WebGLRenderingContext, "LINE_STRIP", 3);

    defineConstant(WebGLRenderingContext, "TRIANGLES", 4);

    defineConstant(WebGLRenderingContext, "TRIANGLE_STRIP", 5);

    defineConstant(WebGLRenderingContext, "TRIANGLE_FAN", 6);

    defineConstant(WebGLRenderingContext, "ZERO", 0);

    defineConstant(WebGLRenderingContext, "ONE", 1);

    defineConstant(WebGLRenderingContext, "SRC_COLOR", 768);

    defineConstant(WebGLRenderingContext, "ONE_MINUS_SRC_COLOR", 769);

    defineConstant(WebGLRenderingContext, "SRC_ALPHA", 770);

    defineConstant(WebGLRenderingContext, "ONE_MINUS_SRC_ALPHA", 771);

    defineConstant(WebGLRenderingContext, "DST_ALPHA", 772);

    defineConstant(WebGLRenderingContext, "ONE_MINUS_DST_ALPHA", 773);

    defineConstant(WebGLRenderingContext, "DST_COLOR", 774);

    defineConstant(WebGLRenderingContext, "ONE_MINUS_DST_COLOR", 775);

    defineConstant(WebGLRenderingContext, "SRC_ALPHA_SATURATE", 776);

    defineConstant(WebGLRenderingContext, "FUNC_ADD", 32774);

    defineConstant(WebGLRenderingContext, "BLEND_EQUATION", 32777);

    defineConstant(WebGLRenderingContext, "BLEND_EQUATION_RGB", 32777);

    defineConstant(WebGLRenderingContext, "BLEND_EQUATION_ALPHA", 34877);

    defineConstant(WebGLRenderingContext, "FUNC_SUBTRACT", 32778);

    defineConstant(WebGLRenderingContext, "FUNC_REVERSE_SUBTRACT", 32779);

    defineConstant(WebGLRenderingContext, "BLEND_DST_RGB", 32968);

    defineConstant(WebGLRenderingContext, "BLEND_SRC_RGB", 32969);

    defineConstant(WebGLRenderingContext, "BLEND_DST_ALPHA", 32970);

    defineConstant(WebGLRenderingContext, "BLEND_SRC_ALPHA", 32971);

    defineConstant(WebGLRenderingContext, "CONSTANT_COLOR", 32769);

    defineConstant(WebGLRenderingContext, "ONE_MINUS_CONSTANT_COLOR", 32770);

    defineConstant(WebGLRenderingContext, "CONSTANT_ALPHA", 32771);

    defineConstant(WebGLRenderingContext, "ONE_MINUS_CONSTANT_ALPHA", 32772);

    defineConstant(WebGLRenderingContext, "BLEND_COLOR", 32773);

    defineConstant(WebGLRenderingContext, "ARRAY_BUFFER", 34962);

    defineConstant(WebGLRenderingContext, "ELEMENT_ARRAY_BUFFER", 34963);

    defineConstant(WebGLRenderingContext, "ARRAY_BUFFER_BINDING", 34964);

    defineConstant(WebGLRenderingContext, "ELEMENT_ARRAY_BUFFER_BINDING", 34965);

    defineConstant(WebGLRenderingContext, "STREAM_DRAW", 35040);

    defineConstant(WebGLRenderingContext, "STATIC_DRAW", 35044);

    defineConstant(WebGLRenderingContext, "DYNAMIC_DRAW", 35048);

    defineConstant(WebGLRenderingContext, "BUFFER_SIZE", 34660);

    defineConstant(WebGLRenderingContext, "BUFFER_USAGE", 34661);

    defineConstant(WebGLRenderingContext, "CURRENT_VERTEX_ATTRIB", 34342);

    defineConstant(WebGLRenderingContext, "FRONT", 1028);

    defineConstant(WebGLRenderingContext, "BACK", 1029);

    defineConstant(WebGLRenderingContext, "FRONT_AND_BACK", 1032);

    defineConstant(WebGLRenderingContext, "TEXTURE_2D", 3553);

    defineConstant(WebGLRenderingContext, "CULL_FACE", 2884);

    defineConstant(WebGLRenderingContext, "BLEND", 3042);

    defineConstant(WebGLRenderingContext, "DITHER", 3024);

    defineConstant(WebGLRenderingContext, "STENCIL_TEST", 2960);

    defineConstant(WebGLRenderingContext, "DEPTH_TEST", 2929);

    defineConstant(WebGLRenderingContext, "SCISSOR_TEST", 3089);

    defineConstant(WebGLRenderingContext, "POLYGON_OFFSET_FILL", 32823);

    defineConstant(WebGLRenderingContext, "SAMPLE_ALPHA_TO_COVERAGE", 32926);

    defineConstant(WebGLRenderingContext, "SAMPLE_COVERAGE", 32928);

    defineConstant(WebGLRenderingContext, "NO_ERROR", 0);

    defineConstant(WebGLRenderingContext, "INVALID_ENUM", 1280);

    defineConstant(WebGLRenderingContext, "INVALID_VALUE", 1281);

    defineConstant(WebGLRenderingContext, "INVALID_OPERATION", 1282);

    defineConstant(WebGLRenderingContext, "OUT_OF_MEMORY", 1285);

    defineConstant(WebGLRenderingContext, "CW", 2304);

    defineConstant(WebGLRenderingContext, "CCW", 2305);

    defineConstant(WebGLRenderingContext, "LINE_WIDTH", 2849);

    defineConstant(WebGLRenderingContext, "ALIASED_POINT_SIZE_RANGE", 33901);

    defineConstant(WebGLRenderingContext, "ALIASED_LINE_WIDTH_RANGE", 33902);

    defineConstant(WebGLRenderingContext, "CULL_FACE_MODE", 2885);

    defineConstant(WebGLRenderingContext, "FRONT_FACE", 2886);

    defineConstant(WebGLRenderingContext, "DEPTH_RANGE", 2928);

    defineConstant(WebGLRenderingContext, "DEPTH_WRITEMASK", 2930);

    defineConstant(WebGLRenderingContext, "DEPTH_CLEAR_VALUE", 2931);

    defineConstant(WebGLRenderingContext, "DEPTH_FUNC", 2932);

    defineConstant(WebGLRenderingContext, "STENCIL_CLEAR_VALUE", 2961);

    defineConstant(WebGLRenderingContext, "STENCIL_FUNC", 2962);

    defineConstant(WebGLRenderingContext, "STENCIL_FAIL", 2964);

    defineConstant(WebGLRenderingContext, "STENCIL_PASS_DEPTH_FAIL", 2965);

    defineConstant(WebGLRenderingContext, "STENCIL_PASS_DEPTH_PASS", 2966);

    defineConstant(WebGLRenderingContext, "STENCIL_REF", 2967);

    defineConstant(WebGLRenderingContext, "STENCIL_VALUE_MASK", 2963);

    defineConstant(WebGLRenderingContext, "STENCIL_WRITEMASK", 2968);

    defineConstant(WebGLRenderingContext, "STENCIL_BACK_FUNC", 34816);

    defineConstant(WebGLRenderingContext, "STENCIL_BACK_FAIL", 34817);

    defineConstant(WebGLRenderingContext, "STENCIL_BACK_PASS_DEPTH_FAIL", 34818);

    defineConstant(WebGLRenderingContext, "STENCIL_BACK_PASS_DEPTH_PASS", 34819);

    defineConstant(WebGLRenderingContext, "STENCIL_BACK_REF", 36003);

    defineConstant(WebGLRenderingContext, "STENCIL_BACK_VALUE_MASK", 36004);

    defineConstant(WebGLRenderingContext, "STENCIL_BACK_WRITEMASK", 36005);

    defineConstant(WebGLRenderingContext, "VIEWPORT", 2978);

    defineConstant(WebGLRenderingContext, "SCISSOR_BOX", 3088);

    defineConstant(WebGLRenderingContext, "COLOR_CLEAR_VALUE", 3106);

    defineConstant(WebGLRenderingContext, "COLOR_WRITEMASK", 3107);

    defineConstant(WebGLRenderingContext, "UNPACK_ALIGNMENT", 3317);

    defineConstant(WebGLRenderingContext, "PACK_ALIGNMENT", 3333);

    defineConstant(WebGLRenderingContext, "MAX_TEXTURE_SIZE", 3379);

    defineConstant(WebGLRenderingContext, "MAX_VIEWPORT_DIMS", 3386);

    defineConstant(WebGLRenderingContext, "SUBPIXEL_BITS", 3408);

    defineConstant(WebGLRenderingContext, "RED_BITS", 3410);

    defineConstant(WebGLRenderingContext, "GREEN_BITS", 3411);

    defineConstant(WebGLRenderingContext, "BLUE_BITS", 3412);

    defineConstant(WebGLRenderingContext, "ALPHA_BITS", 3413);

    defineConstant(WebGLRenderingContext, "DEPTH_BITS", 3414);

    defineConstant(WebGLRenderingContext, "STENCIL_BITS", 3415);

    defineConstant(WebGLRenderingContext, "POLYGON_OFFSET_UNITS", 10752);

    defineConstant(WebGLRenderingContext, "POLYGON_OFFSET_FACTOR", 32824);

    defineConstant(WebGLRenderingContext, "TEXTURE_BINDING_2D", 32873);

    defineConstant(WebGLRenderingContext, "SAMPLE_BUFFERS", 32936);

    defineConstant(WebGLRenderingContext, "SAMPLES", 32937);

    defineConstant(WebGLRenderingContext, "SAMPLE_COVERAGE_VALUE", 32938);

    defineConstant(WebGLRenderingContext, "SAMPLE_COVERAGE_INVERT", 32939);

    defineConstant(WebGLRenderingContext, "COMPRESSED_TEXTURE_FORMATS", 34467);

    defineConstant(WebGLRenderingContext, "DONT_CARE", 4352);

    defineConstant(WebGLRenderingContext, "FASTEST", 4353);

    defineConstant(WebGLRenderingContext, "NICEST", 4354);

    defineConstant(WebGLRenderingContext, "GENERATE_MIPMAP_HINT", 33170);

    defineConstant(WebGLRenderingContext, "BYTE", 5120);

    defineConstant(WebGLRenderingContext, "UNSIGNED_BYTE", 5121);

    defineConstant(WebGLRenderingContext, "SHORT", 5122);

    defineConstant(WebGLRenderingContext, "UNSIGNED_SHORT", 5123);

    defineConstant(WebGLRenderingContext, "INT", 5124);

    defineConstant(WebGLRenderingContext, "UNSIGNED_INT", 5125);

    defineConstant(WebGLRenderingContext, "FLOAT", 5126);

    defineConstant(WebGLRenderingContext, "DEPTH_COMPONENT", 6402);

    defineConstant(WebGLRenderingContext, "ALPHA", 6406);

    defineConstant(WebGLRenderingContext, "RGB", 6407);

    defineConstant(WebGLRenderingContext, "RGBA", 6408);

    defineConstant(WebGLRenderingContext, "LUMINANCE", 6409);

    defineConstant(WebGLRenderingContext, "LUMINANCE_ALPHA", 6410);

    defineConstant(WebGLRenderingContext, "UNSIGNED_SHORT_4_4_4_4", 32819);

    defineConstant(WebGLRenderingContext, "UNSIGNED_SHORT_5_5_5_1", 32820);

    defineConstant(WebGLRenderingContext, "UNSIGNED_SHORT_5_6_5", 33635);

    defineConstant(WebGLRenderingContext, "FRAGMENT_SHADER", 35632);

    defineConstant(WebGLRenderingContext, "VERTEX_SHADER", 35633);

    defineConstant(WebGLRenderingContext, "MAX_VERTEX_ATTRIBS", 34921);

    defineConstant(WebGLRenderingContext, "MAX_VERTEX_UNIFORM_VECTORS", 36347);

    defineConstant(WebGLRenderingContext, "MAX_VARYING_VECTORS", 36348);

    defineConstant(WebGLRenderingContext, "MAX_COMBINED_TEXTURE_IMAGE_UNITS", 35661);

    defineConstant(WebGLRenderingContext, "MAX_VERTEX_TEXTURE_IMAGE_UNITS", 35660);

    defineConstant(WebGLRenderingContext, "MAX_TEXTURE_IMAGE_UNITS", 34930);

    defineConstant(WebGLRenderingContext, "MAX_FRAGMENT_UNIFORM_VECTORS", 36349);

    defineConstant(WebGLRenderingContext, "SHADER_TYPE", 35663);

    defineConstant(WebGLRenderingContext, "DELETE_STATUS", 35712);

    defineConstant(WebGLRenderingContext, "LINK_STATUS", 35714);

    defineConstant(WebGLRenderingContext, "VALIDATE_STATUS", 35715);

    defineConstant(WebGLRenderingContext, "ATTACHED_SHADERS", 35717);

    defineConstant(WebGLRenderingContext, "ACTIVE_UNIFORMS", 35718);

    defineConstant(WebGLRenderingContext, "ACTIVE_ATTRIBUTES", 35721);

    defineConstant(WebGLRenderingContext, "SHADING_LANGUAGE_VERSION", 35724);

    defineConstant(WebGLRenderingContext, "CURRENT_PROGRAM", 35725);

    defineConstant(WebGLRenderingContext, "NEVER", 512);

    defineConstant(WebGLRenderingContext, "LESS", 513);

    defineConstant(WebGLRenderingContext, "EQUAL", 514);

    defineConstant(WebGLRenderingContext, "LEQUAL", 515);

    defineConstant(WebGLRenderingContext, "GREATER", 516);

    defineConstant(WebGLRenderingContext, "NOTEQUAL", 517);

    defineConstant(WebGLRenderingContext, "GEQUAL", 518);

    defineConstant(WebGLRenderingContext, "ALWAYS", 519);

    defineConstant(WebGLRenderingContext, "KEEP", 7680);

    defineConstant(WebGLRenderingContext, "REPLACE", 7681);

    defineConstant(WebGLRenderingContext, "INCR", 7682);

    defineConstant(WebGLRenderingContext, "DECR", 7683);

    defineConstant(WebGLRenderingContext, "INVERT", 5386);

    defineConstant(WebGLRenderingContext, "INCR_WRAP", 34055);

    defineConstant(WebGLRenderingContext, "DECR_WRAP", 34056);

    defineConstant(WebGLRenderingContext, "VENDOR", 7936);

    defineConstant(WebGLRenderingContext, "RENDERER", 7937);

    defineConstant(WebGLRenderingContext, "VERSION", 7938);

    defineConstant(WebGLRenderingContext, "NEAREST", 9728);

    defineConstant(WebGLRenderingContext, "LINEAR", 9729);

    defineConstant(WebGLRenderingContext, "NEAREST_MIPMAP_NEAREST", 9984);

    defineConstant(WebGLRenderingContext, "LINEAR_MIPMAP_NEAREST", 9985);

    defineConstant(WebGLRenderingContext, "NEAREST_MIPMAP_LINEAR", 9986);

    defineConstant(WebGLRenderingContext, "LINEAR_MIPMAP_LINEAR", 9987);

    defineConstant(WebGLRenderingContext, "TEXTURE_MAG_FILTER", 10240);

    defineConstant(WebGLRenderingContext, "TEXTURE_MIN_FILTER", 10241);

    defineConstant(WebGLRenderingContext, "TEXTURE_WRAP_S", 10242);

    defineConstant(WebGLRenderingContext, "TEXTURE_WRAP_T", 10243);

    defineConstant(WebGLRenderingContext, "TEXTURE", 5890);

    defineConstant(WebGLRenderingContext, "TEXTURE_CUBE_MAP", 34067);

    defineConstant(WebGLRenderingContext, "TEXTURE_BINDING_CUBE_MAP", 34068);

    defineConstant(WebGLRenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_X", 34069);

    defineConstant(WebGLRenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_X", 34070);

    defineConstant(WebGLRenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_Y", 34071);

    defineConstant(WebGLRenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_Y", 34072);

    defineConstant(WebGLRenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_Z", 34073);

    defineConstant(WebGLRenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_Z", 34074);

    defineConstant(WebGLRenderingContext, "MAX_CUBE_MAP_TEXTURE_SIZE", 34076);

    defineConstant(WebGLRenderingContext, "TEXTURE0", 33984);

    defineConstant(WebGLRenderingContext, "TEXTURE1", 33985);

    defineConstant(WebGLRenderingContext, "TEXTURE2", 33986);

    defineConstant(WebGLRenderingContext, "TEXTURE3", 33987);

    defineConstant(WebGLRenderingContext, "TEXTURE4", 33988);

    defineConstant(WebGLRenderingContext, "TEXTURE5", 33989);

    defineConstant(WebGLRenderingContext, "TEXTURE6", 33990);

    defineConstant(WebGLRenderingContext, "TEXTURE7", 33991);

    defineConstant(WebGLRenderingContext, "TEXTURE8", 33992);

    defineConstant(WebGLRenderingContext, "TEXTURE9", 33993);

    defineConstant(WebGLRenderingContext, "TEXTURE10", 33994);

    defineConstant(WebGLRenderingContext, "TEXTURE11", 33995);

    defineConstant(WebGLRenderingContext, "TEXTURE12", 33996);

    defineConstant(WebGLRenderingContext, "TEXTURE13", 33997);

    defineConstant(WebGLRenderingContext, "TEXTURE14", 33998);

    defineConstant(WebGLRenderingContext, "TEXTURE15", 33999);

    defineConstant(WebGLRenderingContext, "TEXTURE16", 34000);

    defineConstant(WebGLRenderingContext, "TEXTURE17", 34001);

    defineConstant(WebGLRenderingContext, "TEXTURE18", 34002);

    defineConstant(WebGLRenderingContext, "TEXTURE19", 34003);

    defineConstant(WebGLRenderingContext, "TEXTURE20", 34004);

    defineConstant(WebGLRenderingContext, "TEXTURE21", 34005);

    defineConstant(WebGLRenderingContext, "TEXTURE22", 34006);

    defineConstant(WebGLRenderingContext, "TEXTURE23", 34007);

    defineConstant(WebGLRenderingContext, "TEXTURE24", 34008);

    defineConstant(WebGLRenderingContext, "TEXTURE25", 34009);

    defineConstant(WebGLRenderingContext, "TEXTURE26", 34010);

    defineConstant(WebGLRenderingContext, "TEXTURE27", 34011);

    defineConstant(WebGLRenderingContext, "TEXTURE28", 34012);

    defineConstant(WebGLRenderingContext, "TEXTURE29", 34013);

    defineConstant(WebGLRenderingContext, "TEXTURE30", 34014);

    defineConstant(WebGLRenderingContext, "TEXTURE31", 34015);

    defineConstant(WebGLRenderingContext, "ACTIVE_TEXTURE", 34016);

    defineConstant(WebGLRenderingContext, "REPEAT", 10497);

    defineConstant(WebGLRenderingContext, "CLAMP_TO_EDGE", 33071);

    defineConstant(WebGLRenderingContext, "MIRRORED_REPEAT", 33648);

    defineConstant(WebGLRenderingContext, "FLOAT_VEC2", 35664);

    defineConstant(WebGLRenderingContext, "FLOAT_VEC3", 35665);

    defineConstant(WebGLRenderingContext, "FLOAT_VEC4", 35666);

    defineConstant(WebGLRenderingContext, "INT_VEC2", 35667);

    defineConstant(WebGLRenderingContext, "INT_VEC3", 35668);

    defineConstant(WebGLRenderingContext, "INT_VEC4", 35669);

    defineConstant(WebGLRenderingContext, "BOOL", 35670);

    defineConstant(WebGLRenderingContext, "BOOL_VEC2", 35671);

    defineConstant(WebGLRenderingContext, "BOOL_VEC3", 35672);

    defineConstant(WebGLRenderingContext, "BOOL_VEC4", 35673);

    defineConstant(WebGLRenderingContext, "FLOAT_MAT2", 35674);

    defineConstant(WebGLRenderingContext, "FLOAT_MAT3", 35675);

    defineConstant(WebGLRenderingContext, "FLOAT_MAT4", 35676);

    defineConstant(WebGLRenderingContext, "SAMPLER_2D", 35678);

    defineConstant(WebGLRenderingContext, "SAMPLER_CUBE", 35680);

    defineConstant(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_ENABLED", 34338);

    defineConstant(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_SIZE", 34339);

    defineConstant(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_STRIDE", 34340);

    defineConstant(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_TYPE", 34341);

    defineConstant(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_NORMALIZED", 34922);

    defineConstant(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_POINTER", 34373);

    defineConstant(WebGLRenderingContext, "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", 34975);

    defineConstant(WebGLRenderingContext, "IMPLEMENTATION_COLOR_READ_TYPE", 35738);

    defineConstant(WebGLRenderingContext, "IMPLEMENTATION_COLOR_READ_FORMAT", 35739);

    defineConstant(WebGLRenderingContext, "COMPILE_STATUS", 35713);

    defineConstant(WebGLRenderingContext, "LOW_FLOAT", 36336);

    defineConstant(WebGLRenderingContext, "MEDIUM_FLOAT", 36337);

    defineConstant(WebGLRenderingContext, "HIGH_FLOAT", 36338);

    defineConstant(WebGLRenderingContext, "LOW_INT", 36339);

    defineConstant(WebGLRenderingContext, "MEDIUM_INT", 36340);

    defineConstant(WebGLRenderingContext, "HIGH_INT", 36341);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER", 36160);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER", 36161);

    defineConstant(WebGLRenderingContext, "RGBA4", 32854);

    defineConstant(WebGLRenderingContext, "RGB5_A1", 32855);

    defineConstant(WebGLRenderingContext, "RGB565", 36194);

    defineConstant(WebGLRenderingContext, "DEPTH_COMPONENT16", 33189);

    defineConstant(WebGLRenderingContext, "STENCIL_INDEX8", 36168);

    defineConstant(WebGLRenderingContext, "DEPTH_STENCIL", 34041);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_WIDTH", 36162);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_HEIGHT", 36163);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_INTERNAL_FORMAT", 36164);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_RED_SIZE", 36176);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_GREEN_SIZE", 36177);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_BLUE_SIZE", 36178);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_ALPHA_SIZE", 36179);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_DEPTH_SIZE", 36180);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_STENCIL_SIZE", 36181);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", 36048);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", 36049);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", 36050);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", 36051);

    defineConstant(WebGLRenderingContext, "COLOR_ATTACHMENT0", 36064);

    defineConstant(WebGLRenderingContext, "DEPTH_ATTACHMENT", 36096);

    defineConstant(WebGLRenderingContext, "STENCIL_ATTACHMENT", 36128);

    defineConstant(WebGLRenderingContext, "DEPTH_STENCIL_ATTACHMENT", 33306);

    defineConstant(WebGLRenderingContext, "NONE", 0);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_COMPLETE", 36053);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", 36054);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", 36055);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", 36057);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_UNSUPPORTED", 36061);

    defineConstant(WebGLRenderingContext, "FRAMEBUFFER_BINDING", 36006);

    defineConstant(WebGLRenderingContext, "RENDERBUFFER_BINDING", 36007);

    defineConstant(WebGLRenderingContext, "MAX_RENDERBUFFER_SIZE", 34024);

    defineConstant(WebGLRenderingContext, "INVALID_FRAMEBUFFER_OPERATION", 1286);

    defineConstant(WebGLRenderingContext, "UNPACK_FLIP_Y_WEBGL", 37440);

    defineConstant(WebGLRenderingContext, "UNPACK_PREMULTIPLY_ALPHA_WEBGL", 37441);

    defineConstant(WebGLRenderingContext, "CONTEXT_LOST_WEBGL", 37442);

    defineConstant(WebGLRenderingContext, "UNPACK_COLORSPACE_CONVERSION_WEBGL", 37443);

    defineConstant(WebGLRenderingContext, "BROWSER_DEFAULT_WEBGL", 37444);

    defineConstant(WebGLRenderingContext, "RGB8", 32849);

    defineConstant(WebGLRenderingContext, "RGBA8", 32856);

}
  {

    {
      installContextAccessor(WebGL2RenderingContext, "canvas");
    }

    {
      installContextAccessor(WebGL2RenderingContext, "drawingBufferWidth");
    }

    {
      installContextAccessor(WebGL2RenderingContext, "drawingBufferHeight");
    }

    {
      installContextAccessor(WebGL2RenderingContext, "drawingBufferColorSpace");
    }

    {
      installContextAccessor(WebGL2RenderingContext, "unpackColorSpace");
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_BUFFER_BIT", 256);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BUFFER_BIT", 1024);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_BUFFER_BIT", 16384);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "POINTS", 0);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINES", 1);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINE_LOOP", 2);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINE_STRIP", 3);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRIANGLES", 4);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRIANGLE_STRIP", 5);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRIANGLE_FAN", 6);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ZERO", 0);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ONE", 1);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SRC_COLOR", 768);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ONE_MINUS_SRC_COLOR", 769);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SRC_ALPHA", 770);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ONE_MINUS_SRC_ALPHA", 771);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DST_ALPHA", 772);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ONE_MINUS_DST_ALPHA", 773);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DST_COLOR", 774);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ONE_MINUS_DST_COLOR", 775);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SRC_ALPHA_SATURATE", 776);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FUNC_ADD", 32774);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_EQUATION", 32777);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_EQUATION_RGB", 32777);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_EQUATION_ALPHA", 34877);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FUNC_SUBTRACT", 32778);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FUNC_REVERSE_SUBTRACT", 32779);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_DST_RGB", 32968);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_SRC_RGB", 32969);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_DST_ALPHA", 32970);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_SRC_ALPHA", 32971);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CONSTANT_COLOR", 32769);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ONE_MINUS_CONSTANT_COLOR", 32770);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CONSTANT_ALPHA", 32771);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ONE_MINUS_CONSTANT_ALPHA", 32772);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND_COLOR", 32773);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ARRAY_BUFFER", 34962);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ELEMENT_ARRAY_BUFFER", 34963);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ARRAY_BUFFER_BINDING", 34964);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ELEMENT_ARRAY_BUFFER_BINDING", 34965);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STREAM_DRAW", 35040);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STATIC_DRAW", 35044);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DYNAMIC_DRAW", 35048);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BUFFER_SIZE", 34660);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BUFFER_USAGE", 34661);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CURRENT_VERTEX_ATTRIB", 34342);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRONT", 1028);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BACK", 1029);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRONT_AND_BACK", 1032);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_2D", 3553);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CULL_FACE", 2884);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLEND", 3042);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DITHER", 3024);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_TEST", 2960);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_TEST", 2929);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SCISSOR_TEST", 3089);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "POLYGON_OFFSET_FILL", 32823);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLE_ALPHA_TO_COVERAGE", 32926);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLE_COVERAGE", 32928);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NO_ERROR", 0);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INVALID_ENUM", 1280);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INVALID_VALUE", 1281);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INVALID_OPERATION", 1282);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "OUT_OF_MEMORY", 1285);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CW", 2304);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CCW", 2305);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINE_WIDTH", 2849);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ALIASED_POINT_SIZE_RANGE", 33901);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ALIASED_LINE_WIDTH_RANGE", 33902);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CULL_FACE_MODE", 2885);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRONT_FACE", 2886);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_RANGE", 2928);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_WRITEMASK", 2930);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_CLEAR_VALUE", 2931);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_FUNC", 2932);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_CLEAR_VALUE", 2961);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_FUNC", 2962);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_FAIL", 2964);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_PASS_DEPTH_FAIL", 2965);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_PASS_DEPTH_PASS", 2966);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_REF", 2967);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_VALUE_MASK", 2963);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_WRITEMASK", 2968);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BACK_FUNC", 34816);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BACK_FAIL", 34817);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BACK_PASS_DEPTH_FAIL", 34818);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BACK_PASS_DEPTH_PASS", 34819);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BACK_REF", 36003);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BACK_VALUE_MASK", 36004);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BACK_WRITEMASK", 36005);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VIEWPORT", 2978);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SCISSOR_BOX", 3088);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_CLEAR_VALUE", 3106);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_WRITEMASK", 3107);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_ALIGNMENT", 3317);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PACK_ALIGNMENT", 3333);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_TEXTURE_SIZE", 3379);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VIEWPORT_DIMS", 3386);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SUBPIXEL_BITS", 3408);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RED_BITS", 3410);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "GREEN_BITS", 3411);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BLUE_BITS", 3412);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ALPHA_BITS", 3413);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_BITS", 3414);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_BITS", 3415);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "POLYGON_OFFSET_UNITS", 10752);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "POLYGON_OFFSET_FACTOR", 32824);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_BINDING_2D", 32873);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLE_BUFFERS", 32936);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLES", 32937);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLE_COVERAGE_VALUE", 32938);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLE_COVERAGE_INVERT", 32939);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COMPRESSED_TEXTURE_FORMATS", 34467);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DONT_CARE", 4352);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FASTEST", 4353);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NICEST", 4354);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "GENERATE_MIPMAP_HINT", 33170);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BYTE", 5120);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_BYTE", 5121);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SHORT", 5122);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_SHORT", 5123);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT", 5124);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT", 5125);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT", 5126);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_COMPONENT", 6402);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ALPHA", 6406);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB", 6407);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA", 6408);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LUMINANCE", 6409);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LUMINANCE_ALPHA", 6410);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_SHORT_4_4_4_4", 32819);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_SHORT_5_5_5_1", 32820);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_SHORT_5_6_5", 33635);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAGMENT_SHADER", 35632);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_SHADER", 35633);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VERTEX_ATTRIBS", 34921);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VERTEX_UNIFORM_VECTORS", 36347);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VARYING_VECTORS", 36348);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_COMBINED_TEXTURE_IMAGE_UNITS", 35661);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VERTEX_TEXTURE_IMAGE_UNITS", 35660);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_TEXTURE_IMAGE_UNITS", 34930);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_FRAGMENT_UNIFORM_VECTORS", 36349);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SHADER_TYPE", 35663);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DELETE_STATUS", 35712);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINK_STATUS", 35714);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VALIDATE_STATUS", 35715);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ATTACHED_SHADERS", 35717);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ACTIVE_UNIFORMS", 35718);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ACTIVE_ATTRIBUTES", 35721);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SHADING_LANGUAGE_VERSION", 35724);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CURRENT_PROGRAM", 35725);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NEVER", 512);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LESS", 513);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "EQUAL", 514);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LEQUAL", 515);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "GREATER", 516);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NOTEQUAL", 517);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "GEQUAL", 518);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ALWAYS", 519);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "KEEP", 7680);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "REPLACE", 7681);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INCR", 7682);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DECR", 7683);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INVERT", 5386);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INCR_WRAP", 34055);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DECR_WRAP", 34056);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VENDOR", 7936);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERER", 7937);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERSION", 7938);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NEAREST", 9728);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINEAR", 9729);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NEAREST_MIPMAP_NEAREST", 9984);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINEAR_MIPMAP_NEAREST", 9985);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NEAREST_MIPMAP_LINEAR", 9986);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LINEAR_MIPMAP_LINEAR", 9987);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_MAG_FILTER", 10240);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_MIN_FILTER", 10241);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_WRAP_S", 10242);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_WRAP_T", 10243);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE", 5890);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_CUBE_MAP", 34067);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_BINDING_CUBE_MAP", 34068);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_X", 34069);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_X", 34070);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_Y", 34071);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_Y", 34072);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_CUBE_MAP_POSITIVE_Z", 34073);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_CUBE_MAP_NEGATIVE_Z", 34074);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_CUBE_MAP_TEXTURE_SIZE", 34076);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE0", 33984);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE1", 33985);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE2", 33986);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE3", 33987);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE4", 33988);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE5", 33989);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE6", 33990);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE7", 33991);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE8", 33992);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE9", 33993);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE10", 33994);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE11", 33995);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE12", 33996);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE13", 33997);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE14", 33998);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE15", 33999);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE16", 34000);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE17", 34001);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE18", 34002);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE19", 34003);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE20", 34004);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE21", 34005);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE22", 34006);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE23", 34007);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE24", 34008);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE25", 34009);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE26", 34010);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE27", 34011);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE28", 34012);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE29", 34013);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE30", 34014);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE31", 34015);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ACTIVE_TEXTURE", 34016);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "REPEAT", 10497);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CLAMP_TO_EDGE", 33071);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MIRRORED_REPEAT", 33648);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_VEC2", 35664);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_VEC3", 35665);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_VEC4", 35666);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_VEC2", 35667);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_VEC3", 35668);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_VEC4", 35669);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BOOL", 35670);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BOOL_VEC2", 35671);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BOOL_VEC3", 35672);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BOOL_VEC4", 35673);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT2", 35674);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT3", 35675);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT4", 35676);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_2D", 35678);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_CUBE", 35680);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_ENABLED", 34338);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_SIZE", 34339);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_STRIDE", 34340);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_TYPE", 34341);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_NORMALIZED", 34922);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_POINTER", 34373);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", 34975);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "IMPLEMENTATION_COLOR_READ_TYPE", 35738);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "IMPLEMENTATION_COLOR_READ_FORMAT", 35739);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COMPILE_STATUS", 35713);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LOW_FLOAT", 36336);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MEDIUM_FLOAT", 36337);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "HIGH_FLOAT", 36338);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "LOW_INT", 36339);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MEDIUM_INT", 36340);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "HIGH_INT", 36341);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER", 36160);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER", 36161);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA4", 32854);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB5_A1", 32855);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB565", 36194);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_COMPONENT16", 33189);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_INDEX8", 36168);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_STENCIL", 34041);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_WIDTH", 36162);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_HEIGHT", 36163);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_INTERNAL_FORMAT", 36164);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_RED_SIZE", 36176);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_GREEN_SIZE", 36177);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_BLUE_SIZE", 36178);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_ALPHA_SIZE", 36179);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_DEPTH_SIZE", 36180);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_STENCIL_SIZE", 36181);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", 36048);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", 36049);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", 36050);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", 36051);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT0", 36064);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_ATTACHMENT", 36096);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL_ATTACHMENT", 36128);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_STENCIL_ATTACHMENT", 33306);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "NONE", 0);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_COMPLETE", 36053);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", 36054);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", 36055);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", 36057);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_UNSUPPORTED", 36061);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_BINDING", 36006);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_BINDING", 36007);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_RENDERBUFFER_SIZE", 34024);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INVALID_FRAMEBUFFER_OPERATION", 1286);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_FLIP_Y_WEBGL", 37440);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_PREMULTIPLY_ALPHA_WEBGL", 37441);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CONTEXT_LOST_WEBGL", 37442);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_COLORSPACE_CONVERSION_WEBGL", 37443);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "BROWSER_DEFAULT_WEBGL", 37444);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "READ_BUFFER", 3074);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_ROW_LENGTH", 3314);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_SKIP_ROWS", 3315);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_SKIP_PIXELS", 3316);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PACK_ROW_LENGTH", 3330);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PACK_SKIP_ROWS", 3331);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PACK_SKIP_PIXELS", 3332);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR", 6144);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH", 6145);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STENCIL", 6146);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RED", 6403);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB8", 32849);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA8", 32856);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB10_A2", 32857);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_BINDING_3D", 32874);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_SKIP_IMAGES", 32877);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNPACK_IMAGE_HEIGHT", 32878);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_3D", 32879);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_WRAP_R", 32882);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_3D_TEXTURE_SIZE", 32883);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_2_10_10_10_REV", 33640);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_ELEMENTS_VERTICES", 33000);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_ELEMENTS_INDICES", 33001);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_MIN_LOD", 33082);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_MAX_LOD", 33083);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_BASE_LEVEL", 33084);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_MAX_LEVEL", 33085);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MIN", 32775);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX", 32776);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_COMPONENT24", 33190);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_TEXTURE_LOD_BIAS", 34045);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_COMPARE_MODE", 34892);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_COMPARE_FUNC", 34893);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CURRENT_QUERY", 34917);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "QUERY_RESULT", 34918);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "QUERY_RESULT_AVAILABLE", 34919);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STREAM_READ", 35041);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STREAM_COPY", 35042);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STATIC_READ", 35045);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "STATIC_COPY", 35046);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DYNAMIC_READ", 35049);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DYNAMIC_COPY", 35050);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_DRAW_BUFFERS", 34852);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER0", 34853);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER1", 34854);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER2", 34855);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER3", 34856);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER4", 34857);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER5", 34858);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER6", 34859);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER7", 34860);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER8", 34861);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER9", 34862);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER10", 34863);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER11", 34864);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER12", 34865);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER13", 34866);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER14", 34867);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_BUFFER15", 34868);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_FRAGMENT_UNIFORM_COMPONENTS", 35657);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VERTEX_UNIFORM_COMPONENTS", 35658);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_3D", 35679);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_2D_SHADOW", 35682);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAGMENT_SHADER_DERIVATIVE_HINT", 35723);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PIXEL_PACK_BUFFER", 35051);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PIXEL_UNPACK_BUFFER", 35052);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PIXEL_PACK_BUFFER_BINDING", 35053);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "PIXEL_UNPACK_BUFFER_BINDING", 35055);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT2x3", 35685);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT2x4", 35686);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT3x2", 35687);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT3x4", 35688);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT4x2", 35689);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_MAT4x3", 35690);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SRGB", 35904);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SRGB8", 35905);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SRGB8_ALPHA8", 35907);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COMPARE_REF_TO_TEXTURE", 34894);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA32F", 34836);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB32F", 34837);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA16F", 34842);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB16F", 34843);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_INTEGER", 35069);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_ARRAY_TEXTURE_LAYERS", 35071);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MIN_PROGRAM_TEXEL_OFFSET", 35076);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_PROGRAM_TEXEL_OFFSET", 35077);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VARYING_COMPONENTS", 35659);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_2D_ARRAY", 35866);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_BINDING_2D_ARRAY", 35869);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R11F_G11F_B10F", 35898);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_10F_11F_11F_REV", 35899);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB9_E5", 35901);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_5_9_9_9_REV", 35902);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_BUFFER_MODE", 35967);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS", 35968);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_VARYINGS", 35971);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_BUFFER_START", 35972);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_BUFFER_SIZE", 35973);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN", 35976);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RASTERIZER_DISCARD", 35977);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS", 35978);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS", 35979);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INTERLEAVED_ATTRIBS", 35980);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SEPARATE_ATTRIBS", 35981);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_BUFFER", 35982);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_BUFFER_BINDING", 35983);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA32UI", 36208);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB32UI", 36209);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA16UI", 36214);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB16UI", 36215);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA8UI", 36220);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB8UI", 36221);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA32I", 36226);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB32I", 36227);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA16I", 36232);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB16I", 36233);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA8I", 36238);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB8I", 36239);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RED_INTEGER", 36244);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB_INTEGER", 36248);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA_INTEGER", 36249);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_2D_ARRAY", 36289);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_2D_ARRAY_SHADOW", 36292);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_CUBE_SHADOW", 36293);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_VEC2", 36294);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_VEC3", 36295);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_VEC4", 36296);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_SAMPLER_2D", 36298);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_SAMPLER_3D", 36299);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_SAMPLER_CUBE", 36300);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_SAMPLER_2D_ARRAY", 36303);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_SAMPLER_2D", 36306);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_SAMPLER_3D", 36307);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_SAMPLER_CUBE", 36308);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH_COMPONENT32F", 36012);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH32F_STENCIL8", 36013);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FLOAT_32_UNSIGNED_INT_24_8_REV", 36269);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING", 33296);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE", 33297);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_RED_SIZE", 33298);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE", 33299);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE", 33300);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE", 33301);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE", 33302);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE", 33303);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_DEFAULT", 33304);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_INT_24_8", 34042);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DEPTH24_STENCIL8", 35056);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNED_NORMALIZED", 35863);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_FRAMEBUFFER_BINDING", 36006);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "READ_FRAMEBUFFER", 36008);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "DRAW_FRAMEBUFFER", 36009);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "READ_FRAMEBUFFER_BINDING", 36010);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RENDERBUFFER_SAMPLES", 36011);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER", 36052);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_COLOR_ATTACHMENTS", 36063);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT1", 36065);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT2", 36066);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT3", 36067);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT4", 36068);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT5", 36069);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT6", 36070);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT7", 36071);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT8", 36072);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT9", 36073);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT10", 36074);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT11", 36075);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT12", 36076);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT13", 36077);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT14", 36078);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COLOR_ATTACHMENT15", 36079);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE", 36182);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_SAMPLES", 36183);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "HALF_FLOAT", 5131);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG", 33319);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG_INTEGER", 33320);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R8", 33321);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG8", 33323);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R16F", 33325);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R32F", 33326);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG16F", 33327);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG32F", 33328);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R8I", 33329);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R8UI", 33330);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R16I", 33331);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R16UI", 33332);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R32I", 33333);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R32UI", 33334);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG8I", 33335);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG8UI", 33336);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG16I", 33337);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG16UI", 33338);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG32I", 33339);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG32UI", 33340);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ARRAY_BINDING", 34229);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "R8_SNORM", 36756);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RG8_SNORM", 36757);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB8_SNORM", 36758);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGBA8_SNORM", 36759);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SIGNED_NORMALIZED", 36764);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COPY_READ_BUFFER", 36662);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COPY_WRITE_BUFFER", 36663);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COPY_READ_BUFFER_BINDING", 36662);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "COPY_WRITE_BUFFER_BINDING", 36663);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BUFFER", 35345);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BUFFER_BINDING", 35368);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BUFFER_START", 35369);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BUFFER_SIZE", 35370);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VERTEX_UNIFORM_BLOCKS", 35371);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_FRAGMENT_UNIFORM_BLOCKS", 35373);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_COMBINED_UNIFORM_BLOCKS", 35374);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_UNIFORM_BUFFER_BINDINGS", 35375);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_UNIFORM_BLOCK_SIZE", 35376);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS", 35377);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS", 35379);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BUFFER_OFFSET_ALIGNMENT", 35380);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ACTIVE_UNIFORM_BLOCKS", 35382);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_TYPE", 35383);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_SIZE", 35384);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BLOCK_INDEX", 35386);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_OFFSET", 35387);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_ARRAY_STRIDE", 35388);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_MATRIX_STRIDE", 35389);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_IS_ROW_MAJOR", 35390);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BLOCK_BINDING", 35391);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BLOCK_DATA_SIZE", 35392);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BLOCK_ACTIVE_UNIFORMS", 35394);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES", 35395);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER", 35396);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER", 35398);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INVALID_INDEX", 4294967295);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_VERTEX_OUTPUT_COMPONENTS", 37154);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_FRAGMENT_INPUT_COMPONENTS", 37157);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_SERVER_WAIT_TIMEOUT", 37137);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "OBJECT_TYPE", 37138);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SYNC_CONDITION", 37139);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SYNC_STATUS", 37140);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SYNC_FLAGS", 37141);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SYNC_FENCE", 37142);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SYNC_GPU_COMMANDS_COMPLETE", 37143);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "UNSIGNALED", 37144);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SIGNALED", 37145);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ALREADY_SIGNALED", 37146);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TIMEOUT_EXPIRED", 37147);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "CONDITION_SATISFIED", 37148);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "WAIT_FAILED", 37149);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SYNC_FLUSH_COMMANDS_BIT", 1);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "VERTEX_ATTRIB_ARRAY_DIVISOR", 35070);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ANY_SAMPLES_PASSED", 35887);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "ANY_SAMPLES_PASSED_CONSERVATIVE", 36202);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "SAMPLER_BINDING", 35097);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "RGB10_A2UI", 36975);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "INT_2_10_10_10_REV", 36255);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK", 36386);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_PAUSED", 36387);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_ACTIVE", 36388);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TRANSFORM_FEEDBACK_BINDING", 36389);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_IMMUTABLE_FORMAT", 37167);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_ELEMENT_INDEX", 36203);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TEXTURE_IMMUTABLE_LEVELS", 33503);
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "TIMEOUT_IGNORED", (-1));
    }

    {
      defineConstant(WebGL2RenderingContext.prototype, "MAX_CLIENT_WAIT_TIMEOUT_WEBGL", 37447);
    }

    {
      installContextMethod(WebGL2RenderingContext, "activeTexture", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "attachShader", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "beginQuery", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "beginTransformFeedback", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindAttribLocation", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindBufferBase", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindBufferRange", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindRenderbuffer", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindSampler", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindTransformFeedback", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindVertexArray", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "blendColor", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "blendEquation", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "blendEquationSeparate", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "blendFunc", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "blendFuncSeparate", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "blitFramebuffer", 10);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bufferData", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bufferSubData", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "checkFramebufferStatus", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clientWaitSync", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "compileShader", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "compressedTexImage2D", 7);
    }

    {
      installContextMethod(WebGL2RenderingContext, "compressedTexImage3D", 8);
    }

    {
      installContextMethod(WebGL2RenderingContext, "compressedTexSubImage2D", 8);
    }

    {
      installContextMethod(WebGL2RenderingContext, "compressedTexSubImage3D", 10);
    }

    {
      installContextMethod(WebGL2RenderingContext, "copyBufferSubData", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "copyTexImage2D", 8);
    }

    {
      installContextMethod(WebGL2RenderingContext, "copyTexSubImage2D", 8);
    }

    {
      installContextMethod(WebGL2RenderingContext, "copyTexSubImage3D", 9);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createBuffer", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createFramebuffer", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createProgram", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createQuery", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createRenderbuffer", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createSampler", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createShader", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createTexture", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createTransformFeedback", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "createVertexArray", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "cullFace", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteBuffer", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteFramebuffer", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteProgram", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteQuery", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteRenderbuffer", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteSampler", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteShader", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteSync", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteTexture", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteTransformFeedback", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "deleteVertexArray", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "depthFunc", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "depthMask", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "depthRange", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "detachShader", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "disable", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "drawArraysInstanced", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "drawElementsInstanced", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "drawRangeElements", 6);
    }

    {
      installContextMethod(WebGL2RenderingContext, "enable", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "endQuery", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "endTransformFeedback", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "fenceSync", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "finish", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "flush", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "framebufferRenderbuffer", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "framebufferTexture2D", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "framebufferTextureLayer", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "frontFace", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "generateMipmap", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getActiveAttrib", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getActiveUniform", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getActiveUniformBlockName", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getActiveUniformBlockParameter", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getActiveUniforms", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getAttachedShaders", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getAttribLocation", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getBufferParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getBufferSubData", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getContextAttributes", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getError", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getExtension", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getFragDataLocation", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getFramebufferAttachmentParameter", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getIndexedParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getInternalformatParameter", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getParameter", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getProgramInfoLog", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getProgramParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getQuery", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getQueryParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getRenderbufferParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getSamplerParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getShaderInfoLog", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getShaderParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getShaderPrecisionFormat", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getShaderSource", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getSupportedExtensions", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getSyncParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getTexParameter", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getTransformFeedbackVarying", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getUniform", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getUniformBlockIndex", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getUniformIndices", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getUniformLocation", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getVertexAttrib", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "getVertexAttribOffset", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "hint", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "invalidateFramebuffer", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "invalidateSubFramebuffer", 6);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isBuffer", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isContextLost", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isEnabled", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isFramebuffer", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isProgram", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isQuery", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isRenderbuffer", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isSampler", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isShader", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isSync", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isTexture", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isTransformFeedback", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "isVertexArray", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "lineWidth", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "linkProgram", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "pauseTransformFeedback", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "pixelStorei", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "polygonOffset", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "readBuffer", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "readPixels", 7);
    }

    {
      installContextMethod(WebGL2RenderingContext, "renderbufferStorage", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "renderbufferStorageMultisample", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "resumeTransformFeedback", 0);
    }

    {
      installContextMethod(WebGL2RenderingContext, "sampleCoverage", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "samplerParameterf", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "samplerParameteri", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "shaderSource", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "stencilFunc", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "stencilFuncSeparate", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "stencilMask", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "stencilMaskSeparate", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "stencilOp", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "stencilOpSeparate", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texImage2D", 6);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texImage3D", 10);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texParameterf", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texParameteri", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texStorage2D", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texStorage3D", 6);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texSubImage2D", 7);
    }

    {
      installContextMethod(WebGL2RenderingContext, "texSubImage3D", 11);
    }

    {
      installContextMethod(WebGL2RenderingContext, "transformFeedbackVaryings", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform1ui", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform2ui", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform3ui", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform4ui", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformBlockBinding", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "useProgram", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "validateProgram", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttribDivisor", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttribI4i", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttribI4ui", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttribIPointer", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "waitSync", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindBuffer", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindFramebuffer", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "bindTexture", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clear", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clearBufferfi", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clearBufferfv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clearBufferiv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clearBufferuiv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clearColor", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clearDepth", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "clearStencil", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "colorMask", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "disableVertexAttribArray", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "drawArrays", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "drawBuffers", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "drawElements", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "enableVertexAttribArray", 1);
    }

    {
      installContextMethod(WebGL2RenderingContext, "scissor", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform1f", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform1fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform1i", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform1iv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform1uiv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform2f", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform2fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform2i", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform2iv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform2uiv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform3f", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform3fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform3i", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform3iv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform3uiv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform4f", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform4fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform4i", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform4iv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniform4uiv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix2fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix2x3fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix2x4fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix3fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix3x2fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix3x4fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix4fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix4x2fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "uniformMatrix4x3fv", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib1f", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib1fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib2f", 3);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib2fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib3f", 4);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib3fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib4f", 5);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttrib4fv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttribI4iv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttribI4uiv", 2);
    }

    {
      installContextMethod(WebGL2RenderingContext, "vertexAttribPointer", 6);
    }

    {
      installContextMethod(WebGL2RenderingContext, "viewport", 4);
    }

    {
      installContextAccessor(WebGL2RenderingContext, "drawingBufferFormat");
    }

    {
      installContextMethod(WebGL2RenderingContext, "drawingBufferStorage", 3);
    }

    {
      defineConstructorBacklink(WebGL2RenderingContext.prototype, WebGL2RenderingContext);
    }

    {
      installContextMethod(WebGL2RenderingContext, "makeXRCompatible", 0);
    }

    {
      defineToStringTag(WebGL2RenderingContext.prototype, WebGL2RenderingContext.name);
    }

    defineConstant(WebGL2RenderingContext, "DEPTH_BUFFER_BIT", 256);

    defineConstant(WebGL2RenderingContext, "STENCIL_BUFFER_BIT", 1024);

    defineConstant(WebGL2RenderingContext, "COLOR_BUFFER_BIT", 16384);

    defineConstant(WebGL2RenderingContext, "POINTS", 0);

    defineConstant(WebGL2RenderingContext, "LINES", 1);

    defineConstant(WebGL2RenderingContext, "LINE_LOOP", 2);

    defineConstant(WebGL2RenderingContext, "LINE_STRIP", 3);

    defineConstant(WebGL2RenderingContext, "TRIANGLES", 4);

    defineConstant(WebGL2RenderingContext, "TRIANGLE_STRIP", 5);

    defineConstant(WebGL2RenderingContext, "TRIANGLE_FAN", 6);

    defineConstant(WebGL2RenderingContext, "ZERO", 0);

    defineConstant(WebGL2RenderingContext, "ONE", 1);

    defineConstant(WebGL2RenderingContext, "SRC_COLOR", 768);

    defineConstant(WebGL2RenderingContext, "ONE_MINUS_SRC_COLOR", 769);

    defineConstant(WebGL2RenderingContext, "SRC_ALPHA", 770);

    defineConstant(WebGL2RenderingContext, "ONE_MINUS_SRC_ALPHA", 771);

    defineConstant(WebGL2RenderingContext, "DST_ALPHA", 772);

    defineConstant(WebGL2RenderingContext, "ONE_MINUS_DST_ALPHA", 773);

    defineConstant(WebGL2RenderingContext, "DST_COLOR", 774);

    defineConstant(WebGL2RenderingContext, "ONE_MINUS_DST_COLOR", 775);

    defineConstant(WebGL2RenderingContext, "SRC_ALPHA_SATURATE", 776);

    defineConstant(WebGL2RenderingContext, "FUNC_ADD", 32774);

    defineConstant(WebGL2RenderingContext, "BLEND_EQUATION", 32777);

    defineConstant(WebGL2RenderingContext, "BLEND_EQUATION_RGB", 32777);

    defineConstant(WebGL2RenderingContext, "BLEND_EQUATION_ALPHA", 34877);

    defineConstant(WebGL2RenderingContext, "FUNC_SUBTRACT", 32778);

    defineConstant(WebGL2RenderingContext, "FUNC_REVERSE_SUBTRACT", 32779);

    defineConstant(WebGL2RenderingContext, "BLEND_DST_RGB", 32968);

    defineConstant(WebGL2RenderingContext, "BLEND_SRC_RGB", 32969);

    defineConstant(WebGL2RenderingContext, "BLEND_DST_ALPHA", 32970);

    defineConstant(WebGL2RenderingContext, "BLEND_SRC_ALPHA", 32971);

    defineConstant(WebGL2RenderingContext, "CONSTANT_COLOR", 32769);

    defineConstant(WebGL2RenderingContext, "ONE_MINUS_CONSTANT_COLOR", 32770);

    defineConstant(WebGL2RenderingContext, "CONSTANT_ALPHA", 32771);

    defineConstant(WebGL2RenderingContext, "ONE_MINUS_CONSTANT_ALPHA", 32772);

    defineConstant(WebGL2RenderingContext, "BLEND_COLOR", 32773);

    defineConstant(WebGL2RenderingContext, "ARRAY_BUFFER", 34962);

    defineConstant(WebGL2RenderingContext, "ELEMENT_ARRAY_BUFFER", 34963);

    defineConstant(WebGL2RenderingContext, "ARRAY_BUFFER_BINDING", 34964);

    defineConstant(WebGL2RenderingContext, "ELEMENT_ARRAY_BUFFER_BINDING", 34965);

    defineConstant(WebGL2RenderingContext, "STREAM_DRAW", 35040);

    defineConstant(WebGL2RenderingContext, "STATIC_DRAW", 35044);

    defineConstant(WebGL2RenderingContext, "DYNAMIC_DRAW", 35048);

    defineConstant(WebGL2RenderingContext, "BUFFER_SIZE", 34660);

    defineConstant(WebGL2RenderingContext, "BUFFER_USAGE", 34661);

    defineConstant(WebGL2RenderingContext, "CURRENT_VERTEX_ATTRIB", 34342);

    defineConstant(WebGL2RenderingContext, "FRONT", 1028);

    defineConstant(WebGL2RenderingContext, "BACK", 1029);

    defineConstant(WebGL2RenderingContext, "FRONT_AND_BACK", 1032);

    defineConstant(WebGL2RenderingContext, "TEXTURE_2D", 3553);

    defineConstant(WebGL2RenderingContext, "CULL_FACE", 2884);

    defineConstant(WebGL2RenderingContext, "BLEND", 3042);

    defineConstant(WebGL2RenderingContext, "DITHER", 3024);

    defineConstant(WebGL2RenderingContext, "STENCIL_TEST", 2960);

    defineConstant(WebGL2RenderingContext, "DEPTH_TEST", 2929);

    defineConstant(WebGL2RenderingContext, "SCISSOR_TEST", 3089);

    defineConstant(WebGL2RenderingContext, "POLYGON_OFFSET_FILL", 32823);

    defineConstant(WebGL2RenderingContext, "SAMPLE_ALPHA_TO_COVERAGE", 32926);

    defineConstant(WebGL2RenderingContext, "SAMPLE_COVERAGE", 32928);

    defineConstant(WebGL2RenderingContext, "NO_ERROR", 0);

    defineConstant(WebGL2RenderingContext, "INVALID_ENUM", 1280);

    defineConstant(WebGL2RenderingContext, "INVALID_VALUE", 1281);

    defineConstant(WebGL2RenderingContext, "INVALID_OPERATION", 1282);

    defineConstant(WebGL2RenderingContext, "OUT_OF_MEMORY", 1285);

    defineConstant(WebGL2RenderingContext, "CW", 2304);

    defineConstant(WebGL2RenderingContext, "CCW", 2305);

    defineConstant(WebGL2RenderingContext, "LINE_WIDTH", 2849);

    defineConstant(WebGL2RenderingContext, "ALIASED_POINT_SIZE_RANGE", 33901);

    defineConstant(WebGL2RenderingContext, "ALIASED_LINE_WIDTH_RANGE", 33902);

    defineConstant(WebGL2RenderingContext, "CULL_FACE_MODE", 2885);

    defineConstant(WebGL2RenderingContext, "FRONT_FACE", 2886);

    defineConstant(WebGL2RenderingContext, "DEPTH_RANGE", 2928);

    defineConstant(WebGL2RenderingContext, "DEPTH_WRITEMASK", 2930);

    defineConstant(WebGL2RenderingContext, "DEPTH_CLEAR_VALUE", 2931);

    defineConstant(WebGL2RenderingContext, "DEPTH_FUNC", 2932);

    defineConstant(WebGL2RenderingContext, "STENCIL_CLEAR_VALUE", 2961);

    defineConstant(WebGL2RenderingContext, "STENCIL_FUNC", 2962);

    defineConstant(WebGL2RenderingContext, "STENCIL_FAIL", 2964);

    defineConstant(WebGL2RenderingContext, "STENCIL_PASS_DEPTH_FAIL", 2965);

    defineConstant(WebGL2RenderingContext, "STENCIL_PASS_DEPTH_PASS", 2966);

    defineConstant(WebGL2RenderingContext, "STENCIL_REF", 2967);

    defineConstant(WebGL2RenderingContext, "STENCIL_VALUE_MASK", 2963);

    defineConstant(WebGL2RenderingContext, "STENCIL_WRITEMASK", 2968);

    defineConstant(WebGL2RenderingContext, "STENCIL_BACK_FUNC", 34816);

    defineConstant(WebGL2RenderingContext, "STENCIL_BACK_FAIL", 34817);

    defineConstant(WebGL2RenderingContext, "STENCIL_BACK_PASS_DEPTH_FAIL", 34818);

    defineConstant(WebGL2RenderingContext, "STENCIL_BACK_PASS_DEPTH_PASS", 34819);

    defineConstant(WebGL2RenderingContext, "STENCIL_BACK_REF", 36003);

    defineConstant(WebGL2RenderingContext, "STENCIL_BACK_VALUE_MASK", 36004);

    defineConstant(WebGL2RenderingContext, "STENCIL_BACK_WRITEMASK", 36005);

    defineConstant(WebGL2RenderingContext, "VIEWPORT", 2978);

    defineConstant(WebGL2RenderingContext, "SCISSOR_BOX", 3088);

    defineConstant(WebGL2RenderingContext, "COLOR_CLEAR_VALUE", 3106);

    defineConstant(WebGL2RenderingContext, "COLOR_WRITEMASK", 3107);

    defineConstant(WebGL2RenderingContext, "UNPACK_ALIGNMENT", 3317);

    defineConstant(WebGL2RenderingContext, "PACK_ALIGNMENT", 3333);

    defineConstant(WebGL2RenderingContext, "MAX_TEXTURE_SIZE", 3379);

    defineConstant(WebGL2RenderingContext, "MAX_VIEWPORT_DIMS", 3386);

    defineConstant(WebGL2RenderingContext, "SUBPIXEL_BITS", 3408);

    defineConstant(WebGL2RenderingContext, "RED_BITS", 3410);

    defineConstant(WebGL2RenderingContext, "GREEN_BITS", 3411);

    defineConstant(WebGL2RenderingContext, "BLUE_BITS", 3412);

    defineConstant(WebGL2RenderingContext, "ALPHA_BITS", 3413);

    defineConstant(WebGL2RenderingContext, "DEPTH_BITS", 3414);

    defineConstant(WebGL2RenderingContext, "STENCIL_BITS", 3415);

    defineConstant(WebGL2RenderingContext, "POLYGON_OFFSET_UNITS", 10752);

    defineConstant(WebGL2RenderingContext, "POLYGON_OFFSET_FACTOR", 32824);

    defineConstant(WebGL2RenderingContext, "TEXTURE_BINDING_2D", 32873);

    defineConstant(WebGL2RenderingContext, "SAMPLE_BUFFERS", 32936);

    defineConstant(WebGL2RenderingContext, "SAMPLES", 32937);

    defineConstant(WebGL2RenderingContext, "SAMPLE_COVERAGE_VALUE", 32938);

    defineConstant(WebGL2RenderingContext, "SAMPLE_COVERAGE_INVERT", 32939);

    defineConstant(WebGL2RenderingContext, "COMPRESSED_TEXTURE_FORMATS", 34467);

    defineConstant(WebGL2RenderingContext, "DONT_CARE", 4352);

    defineConstant(WebGL2RenderingContext, "FASTEST", 4353);

    defineConstant(WebGL2RenderingContext, "NICEST", 4354);

    defineConstant(WebGL2RenderingContext, "GENERATE_MIPMAP_HINT", 33170);

    defineConstant(WebGL2RenderingContext, "BYTE", 5120);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_BYTE", 5121);

    defineConstant(WebGL2RenderingContext, "SHORT", 5122);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_SHORT", 5123);

    defineConstant(WebGL2RenderingContext, "INT", 5124);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT", 5125);

    defineConstant(WebGL2RenderingContext, "FLOAT", 5126);

    defineConstant(WebGL2RenderingContext, "DEPTH_COMPONENT", 6402);

    defineConstant(WebGL2RenderingContext, "ALPHA", 6406);

    defineConstant(WebGL2RenderingContext, "RGB", 6407);

    defineConstant(WebGL2RenderingContext, "RGBA", 6408);

    defineConstant(WebGL2RenderingContext, "LUMINANCE", 6409);

    defineConstant(WebGL2RenderingContext, "LUMINANCE_ALPHA", 6410);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_SHORT_4_4_4_4", 32819);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_SHORT_5_5_5_1", 32820);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_SHORT_5_6_5", 33635);

    defineConstant(WebGL2RenderingContext, "FRAGMENT_SHADER", 35632);

    defineConstant(WebGL2RenderingContext, "VERTEX_SHADER", 35633);

    defineConstant(WebGL2RenderingContext, "MAX_VERTEX_ATTRIBS", 34921);

    defineConstant(WebGL2RenderingContext, "MAX_VERTEX_UNIFORM_VECTORS", 36347);

    defineConstant(WebGL2RenderingContext, "MAX_VARYING_VECTORS", 36348);

    defineConstant(WebGL2RenderingContext, "MAX_COMBINED_TEXTURE_IMAGE_UNITS", 35661);

    defineConstant(WebGL2RenderingContext, "MAX_VERTEX_TEXTURE_IMAGE_UNITS", 35660);

    defineConstant(WebGL2RenderingContext, "MAX_TEXTURE_IMAGE_UNITS", 34930);

    defineConstant(WebGL2RenderingContext, "MAX_FRAGMENT_UNIFORM_VECTORS", 36349);

    defineConstant(WebGL2RenderingContext, "SHADER_TYPE", 35663);

    defineConstant(WebGL2RenderingContext, "DELETE_STATUS", 35712);

    defineConstant(WebGL2RenderingContext, "LINK_STATUS", 35714);

    defineConstant(WebGL2RenderingContext, "VALIDATE_STATUS", 35715);

    defineConstant(WebGL2RenderingContext, "ATTACHED_SHADERS", 35717);

    defineConstant(WebGL2RenderingContext, "ACTIVE_UNIFORMS", 35718);

    defineConstant(WebGL2RenderingContext, "ACTIVE_ATTRIBUTES", 35721);

    defineConstant(WebGL2RenderingContext, "SHADING_LANGUAGE_VERSION", 35724);

    defineConstant(WebGL2RenderingContext, "CURRENT_PROGRAM", 35725);

    defineConstant(WebGL2RenderingContext, "NEVER", 512);

    defineConstant(WebGL2RenderingContext, "LESS", 513);

    defineConstant(WebGL2RenderingContext, "EQUAL", 514);

    defineConstant(WebGL2RenderingContext, "LEQUAL", 515);

    defineConstant(WebGL2RenderingContext, "GREATER", 516);

    defineConstant(WebGL2RenderingContext, "NOTEQUAL", 517);

    defineConstant(WebGL2RenderingContext, "GEQUAL", 518);

    defineConstant(WebGL2RenderingContext, "ALWAYS", 519);

    defineConstant(WebGL2RenderingContext, "KEEP", 7680);

    defineConstant(WebGL2RenderingContext, "REPLACE", 7681);

    defineConstant(WebGL2RenderingContext, "INCR", 7682);

    defineConstant(WebGL2RenderingContext, "DECR", 7683);

    defineConstant(WebGL2RenderingContext, "INVERT", 5386);

    defineConstant(WebGL2RenderingContext, "INCR_WRAP", 34055);

    defineConstant(WebGL2RenderingContext, "DECR_WRAP", 34056);

    defineConstant(WebGL2RenderingContext, "VENDOR", 7936);

    defineConstant(WebGL2RenderingContext, "RENDERER", 7937);

    defineConstant(WebGL2RenderingContext, "VERSION", 7938);

    defineConstant(WebGL2RenderingContext, "NEAREST", 9728);

    defineConstant(WebGL2RenderingContext, "LINEAR", 9729);

    defineConstant(WebGL2RenderingContext, "NEAREST_MIPMAP_NEAREST", 9984);

    defineConstant(WebGL2RenderingContext, "LINEAR_MIPMAP_NEAREST", 9985);

    defineConstant(WebGL2RenderingContext, "NEAREST_MIPMAP_LINEAR", 9986);

    defineConstant(WebGL2RenderingContext, "LINEAR_MIPMAP_LINEAR", 9987);

    defineConstant(WebGL2RenderingContext, "TEXTURE_MAG_FILTER", 10240);

    defineConstant(WebGL2RenderingContext, "TEXTURE_MIN_FILTER", 10241);

    defineConstant(WebGL2RenderingContext, "TEXTURE_WRAP_S", 10242);

    defineConstant(WebGL2RenderingContext, "TEXTURE_WRAP_T", 10243);

    defineConstant(WebGL2RenderingContext, "TEXTURE", 5890);

    defineConstant(WebGL2RenderingContext, "TEXTURE_CUBE_MAP", 34067);

    defineConstant(WebGL2RenderingContext, "TEXTURE_BINDING_CUBE_MAP", 34068);

    defineConstant(WebGL2RenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_X", 34069);

    defineConstant(WebGL2RenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_X", 34070);

    defineConstant(WebGL2RenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_Y", 34071);

    defineConstant(WebGL2RenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_Y", 34072);

    defineConstant(WebGL2RenderingContext, "TEXTURE_CUBE_MAP_POSITIVE_Z", 34073);

    defineConstant(WebGL2RenderingContext, "TEXTURE_CUBE_MAP_NEGATIVE_Z", 34074);

    defineConstant(WebGL2RenderingContext, "MAX_CUBE_MAP_TEXTURE_SIZE", 34076);

    defineConstant(WebGL2RenderingContext, "TEXTURE0", 33984);

    defineConstant(WebGL2RenderingContext, "TEXTURE1", 33985);

    defineConstant(WebGL2RenderingContext, "TEXTURE2", 33986);

    defineConstant(WebGL2RenderingContext, "TEXTURE3", 33987);

    defineConstant(WebGL2RenderingContext, "TEXTURE4", 33988);

    defineConstant(WebGL2RenderingContext, "TEXTURE5", 33989);

    defineConstant(WebGL2RenderingContext, "TEXTURE6", 33990);

    defineConstant(WebGL2RenderingContext, "TEXTURE7", 33991);

    defineConstant(WebGL2RenderingContext, "TEXTURE8", 33992);

    defineConstant(WebGL2RenderingContext, "TEXTURE9", 33993);

    defineConstant(WebGL2RenderingContext, "TEXTURE10", 33994);

    defineConstant(WebGL2RenderingContext, "TEXTURE11", 33995);

    defineConstant(WebGL2RenderingContext, "TEXTURE12", 33996);

    defineConstant(WebGL2RenderingContext, "TEXTURE13", 33997);

    defineConstant(WebGL2RenderingContext, "TEXTURE14", 33998);

    defineConstant(WebGL2RenderingContext, "TEXTURE15", 33999);

    defineConstant(WebGL2RenderingContext, "TEXTURE16", 34000);

    defineConstant(WebGL2RenderingContext, "TEXTURE17", 34001);

    defineConstant(WebGL2RenderingContext, "TEXTURE18", 34002);

    defineConstant(WebGL2RenderingContext, "TEXTURE19", 34003);

    defineConstant(WebGL2RenderingContext, "TEXTURE20", 34004);

    defineConstant(WebGL2RenderingContext, "TEXTURE21", 34005);

    defineConstant(WebGL2RenderingContext, "TEXTURE22", 34006);

    defineConstant(WebGL2RenderingContext, "TEXTURE23", 34007);

    defineConstant(WebGL2RenderingContext, "TEXTURE24", 34008);

    defineConstant(WebGL2RenderingContext, "TEXTURE25", 34009);

    defineConstant(WebGL2RenderingContext, "TEXTURE26", 34010);

    defineConstant(WebGL2RenderingContext, "TEXTURE27", 34011);

    defineConstant(WebGL2RenderingContext, "TEXTURE28", 34012);

    defineConstant(WebGL2RenderingContext, "TEXTURE29", 34013);

    defineConstant(WebGL2RenderingContext, "TEXTURE30", 34014);

    defineConstant(WebGL2RenderingContext, "TEXTURE31", 34015);

    defineConstant(WebGL2RenderingContext, "ACTIVE_TEXTURE", 34016);

    defineConstant(WebGL2RenderingContext, "REPEAT", 10497);

    defineConstant(WebGL2RenderingContext, "CLAMP_TO_EDGE", 33071);

    defineConstant(WebGL2RenderingContext, "MIRRORED_REPEAT", 33648);

    defineConstant(WebGL2RenderingContext, "FLOAT_VEC2", 35664);

    defineConstant(WebGL2RenderingContext, "FLOAT_VEC3", 35665);

    defineConstant(WebGL2RenderingContext, "FLOAT_VEC4", 35666);

    defineConstant(WebGL2RenderingContext, "INT_VEC2", 35667);

    defineConstant(WebGL2RenderingContext, "INT_VEC3", 35668);

    defineConstant(WebGL2RenderingContext, "INT_VEC4", 35669);

    defineConstant(WebGL2RenderingContext, "BOOL", 35670);

    defineConstant(WebGL2RenderingContext, "BOOL_VEC2", 35671);

    defineConstant(WebGL2RenderingContext, "BOOL_VEC3", 35672);

    defineConstant(WebGL2RenderingContext, "BOOL_VEC4", 35673);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT2", 35674);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT3", 35675);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT4", 35676);

    defineConstant(WebGL2RenderingContext, "SAMPLER_2D", 35678);

    defineConstant(WebGL2RenderingContext, "SAMPLER_CUBE", 35680);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_ENABLED", 34338);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_SIZE", 34339);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_STRIDE", 34340);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_TYPE", 34341);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_NORMALIZED", 34922);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_POINTER", 34373);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", 34975);

    defineConstant(WebGL2RenderingContext, "IMPLEMENTATION_COLOR_READ_TYPE", 35738);

    defineConstant(WebGL2RenderingContext, "IMPLEMENTATION_COLOR_READ_FORMAT", 35739);

    defineConstant(WebGL2RenderingContext, "COMPILE_STATUS", 35713);

    defineConstant(WebGL2RenderingContext, "LOW_FLOAT", 36336);

    defineConstant(WebGL2RenderingContext, "MEDIUM_FLOAT", 36337);

    defineConstant(WebGL2RenderingContext, "HIGH_FLOAT", 36338);

    defineConstant(WebGL2RenderingContext, "LOW_INT", 36339);

    defineConstant(WebGL2RenderingContext, "MEDIUM_INT", 36340);

    defineConstant(WebGL2RenderingContext, "HIGH_INT", 36341);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER", 36160);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER", 36161);

    defineConstant(WebGL2RenderingContext, "RGBA4", 32854);

    defineConstant(WebGL2RenderingContext, "RGB5_A1", 32855);

    defineConstant(WebGL2RenderingContext, "RGB565", 36194);

    defineConstant(WebGL2RenderingContext, "DEPTH_COMPONENT16", 33189);

    defineConstant(WebGL2RenderingContext, "STENCIL_INDEX8", 36168);

    defineConstant(WebGL2RenderingContext, "DEPTH_STENCIL", 34041);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_WIDTH", 36162);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_HEIGHT", 36163);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_INTERNAL_FORMAT", 36164);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_RED_SIZE", 36176);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_GREEN_SIZE", 36177);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_BLUE_SIZE", 36178);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_ALPHA_SIZE", 36179);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_DEPTH_SIZE", 36180);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_STENCIL_SIZE", 36181);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", 36048);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", 36049);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", 36050);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", 36051);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT0", 36064);

    defineConstant(WebGL2RenderingContext, "DEPTH_ATTACHMENT", 36096);

    defineConstant(WebGL2RenderingContext, "STENCIL_ATTACHMENT", 36128);

    defineConstant(WebGL2RenderingContext, "DEPTH_STENCIL_ATTACHMENT", 33306);

    defineConstant(WebGL2RenderingContext, "NONE", 0);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_COMPLETE", 36053);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", 36054);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", 36055);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", 36057);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_UNSUPPORTED", 36061);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_BINDING", 36006);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_BINDING", 36007);

    defineConstant(WebGL2RenderingContext, "MAX_RENDERBUFFER_SIZE", 34024);

    defineConstant(WebGL2RenderingContext, "INVALID_FRAMEBUFFER_OPERATION", 1286);

    defineConstant(WebGL2RenderingContext, "UNPACK_FLIP_Y_WEBGL", 37440);

    defineConstant(WebGL2RenderingContext, "UNPACK_PREMULTIPLY_ALPHA_WEBGL", 37441);

    defineConstant(WebGL2RenderingContext, "CONTEXT_LOST_WEBGL", 37442);

    defineConstant(WebGL2RenderingContext, "UNPACK_COLORSPACE_CONVERSION_WEBGL", 37443);

    defineConstant(WebGL2RenderingContext, "BROWSER_DEFAULT_WEBGL", 37444);

    defineConstant(WebGL2RenderingContext, "READ_BUFFER", 3074);

    defineConstant(WebGL2RenderingContext, "UNPACK_ROW_LENGTH", 3314);

    defineConstant(WebGL2RenderingContext, "UNPACK_SKIP_ROWS", 3315);

    defineConstant(WebGL2RenderingContext, "UNPACK_SKIP_PIXELS", 3316);

    defineConstant(WebGL2RenderingContext, "PACK_ROW_LENGTH", 3330);

    defineConstant(WebGL2RenderingContext, "PACK_SKIP_ROWS", 3331);

    defineConstant(WebGL2RenderingContext, "PACK_SKIP_PIXELS", 3332);

    defineConstant(WebGL2RenderingContext, "COLOR", 6144);

    defineConstant(WebGL2RenderingContext, "DEPTH", 6145);

    defineConstant(WebGL2RenderingContext, "STENCIL", 6146);

    defineConstant(WebGL2RenderingContext, "RED", 6403);

    defineConstant(WebGL2RenderingContext, "RGB8", 32849);

    defineConstant(WebGL2RenderingContext, "RGBA8", 32856);

    defineConstant(WebGL2RenderingContext, "RGB10_A2", 32857);

    defineConstant(WebGL2RenderingContext, "TEXTURE_BINDING_3D", 32874);

    defineConstant(WebGL2RenderingContext, "UNPACK_SKIP_IMAGES", 32877);

    defineConstant(WebGL2RenderingContext, "UNPACK_IMAGE_HEIGHT", 32878);

    defineConstant(WebGL2RenderingContext, "TEXTURE_3D", 32879);

    defineConstant(WebGL2RenderingContext, "TEXTURE_WRAP_R", 32882);

    defineConstant(WebGL2RenderingContext, "MAX_3D_TEXTURE_SIZE", 32883);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_2_10_10_10_REV", 33640);

    defineConstant(WebGL2RenderingContext, "MAX_ELEMENTS_VERTICES", 33000);

    defineConstant(WebGL2RenderingContext, "MAX_ELEMENTS_INDICES", 33001);

    defineConstant(WebGL2RenderingContext, "TEXTURE_MIN_LOD", 33082);

    defineConstant(WebGL2RenderingContext, "TEXTURE_MAX_LOD", 33083);

    defineConstant(WebGL2RenderingContext, "TEXTURE_BASE_LEVEL", 33084);

    defineConstant(WebGL2RenderingContext, "TEXTURE_MAX_LEVEL", 33085);

    defineConstant(WebGL2RenderingContext, "MIN", 32775);

    defineConstant(WebGL2RenderingContext, "MAX", 32776);

    defineConstant(WebGL2RenderingContext, "DEPTH_COMPONENT24", 33190);

    defineConstant(WebGL2RenderingContext, "MAX_TEXTURE_LOD_BIAS", 34045);

    defineConstant(WebGL2RenderingContext, "TEXTURE_COMPARE_MODE", 34892);

    defineConstant(WebGL2RenderingContext, "TEXTURE_COMPARE_FUNC", 34893);

    defineConstant(WebGL2RenderingContext, "CURRENT_QUERY", 34917);

    defineConstant(WebGL2RenderingContext, "QUERY_RESULT", 34918);

    defineConstant(WebGL2RenderingContext, "QUERY_RESULT_AVAILABLE", 34919);

    defineConstant(WebGL2RenderingContext, "STREAM_READ", 35041);

    defineConstant(WebGL2RenderingContext, "STREAM_COPY", 35042);

    defineConstant(WebGL2RenderingContext, "STATIC_READ", 35045);

    defineConstant(WebGL2RenderingContext, "STATIC_COPY", 35046);

    defineConstant(WebGL2RenderingContext, "DYNAMIC_READ", 35049);

    defineConstant(WebGL2RenderingContext, "DYNAMIC_COPY", 35050);

    defineConstant(WebGL2RenderingContext, "MAX_DRAW_BUFFERS", 34852);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER0", 34853);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER1", 34854);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER2", 34855);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER3", 34856);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER4", 34857);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER5", 34858);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER6", 34859);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER7", 34860);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER8", 34861);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER9", 34862);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER10", 34863);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER11", 34864);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER12", 34865);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER13", 34866);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER14", 34867);

    defineConstant(WebGL2RenderingContext, "DRAW_BUFFER15", 34868);

    defineConstant(WebGL2RenderingContext, "MAX_FRAGMENT_UNIFORM_COMPONENTS", 35657);

    defineConstant(WebGL2RenderingContext, "MAX_VERTEX_UNIFORM_COMPONENTS", 35658);

    defineConstant(WebGL2RenderingContext, "SAMPLER_3D", 35679);

    defineConstant(WebGL2RenderingContext, "SAMPLER_2D_SHADOW", 35682);

    defineConstant(WebGL2RenderingContext, "FRAGMENT_SHADER_DERIVATIVE_HINT", 35723);

    defineConstant(WebGL2RenderingContext, "PIXEL_PACK_BUFFER", 35051);

    defineConstant(WebGL2RenderingContext, "PIXEL_UNPACK_BUFFER", 35052);

    defineConstant(WebGL2RenderingContext, "PIXEL_PACK_BUFFER_BINDING", 35053);

    defineConstant(WebGL2RenderingContext, "PIXEL_UNPACK_BUFFER_BINDING", 35055);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT2x3", 35685);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT2x4", 35686);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT3x2", 35687);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT3x4", 35688);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT4x2", 35689);

    defineConstant(WebGL2RenderingContext, "FLOAT_MAT4x3", 35690);

    defineConstant(WebGL2RenderingContext, "SRGB", 35904);

    defineConstant(WebGL2RenderingContext, "SRGB8", 35905);

    defineConstant(WebGL2RenderingContext, "SRGB8_ALPHA8", 35907);

    defineConstant(WebGL2RenderingContext, "COMPARE_REF_TO_TEXTURE", 34894);

    defineConstant(WebGL2RenderingContext, "RGBA32F", 34836);

    defineConstant(WebGL2RenderingContext, "RGB32F", 34837);

    defineConstant(WebGL2RenderingContext, "RGBA16F", 34842);

    defineConstant(WebGL2RenderingContext, "RGB16F", 34843);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_INTEGER", 35069);

    defineConstant(WebGL2RenderingContext, "MAX_ARRAY_TEXTURE_LAYERS", 35071);

    defineConstant(WebGL2RenderingContext, "MIN_PROGRAM_TEXEL_OFFSET", 35076);

    defineConstant(WebGL2RenderingContext, "MAX_PROGRAM_TEXEL_OFFSET", 35077);

    defineConstant(WebGL2RenderingContext, "MAX_VARYING_COMPONENTS", 35659);

    defineConstant(WebGL2RenderingContext, "TEXTURE_2D_ARRAY", 35866);

    defineConstant(WebGL2RenderingContext, "TEXTURE_BINDING_2D_ARRAY", 35869);

    defineConstant(WebGL2RenderingContext, "R11F_G11F_B10F", 35898);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_10F_11F_11F_REV", 35899);

    defineConstant(WebGL2RenderingContext, "RGB9_E5", 35901);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_5_9_9_9_REV", 35902);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_BUFFER_MODE", 35967);

    defineConstant(WebGL2RenderingContext, "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS", 35968);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_VARYINGS", 35971);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_BUFFER_START", 35972);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_BUFFER_SIZE", 35973);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN", 35976);

    defineConstant(WebGL2RenderingContext, "RASTERIZER_DISCARD", 35977);

    defineConstant(WebGL2RenderingContext, "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS", 35978);

    defineConstant(WebGL2RenderingContext, "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS", 35979);

    defineConstant(WebGL2RenderingContext, "INTERLEAVED_ATTRIBS", 35980);

    defineConstant(WebGL2RenderingContext, "SEPARATE_ATTRIBS", 35981);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_BUFFER", 35982);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_BUFFER_BINDING", 35983);

    defineConstant(WebGL2RenderingContext, "RGBA32UI", 36208);

    defineConstant(WebGL2RenderingContext, "RGB32UI", 36209);

    defineConstant(WebGL2RenderingContext, "RGBA16UI", 36214);

    defineConstant(WebGL2RenderingContext, "RGB16UI", 36215);

    defineConstant(WebGL2RenderingContext, "RGBA8UI", 36220);

    defineConstant(WebGL2RenderingContext, "RGB8UI", 36221);

    defineConstant(WebGL2RenderingContext, "RGBA32I", 36226);

    defineConstant(WebGL2RenderingContext, "RGB32I", 36227);

    defineConstant(WebGL2RenderingContext, "RGBA16I", 36232);

    defineConstant(WebGL2RenderingContext, "RGB16I", 36233);

    defineConstant(WebGL2RenderingContext, "RGBA8I", 36238);

    defineConstant(WebGL2RenderingContext, "RGB8I", 36239);

    defineConstant(WebGL2RenderingContext, "RED_INTEGER", 36244);

    defineConstant(WebGL2RenderingContext, "RGB_INTEGER", 36248);

    defineConstant(WebGL2RenderingContext, "RGBA_INTEGER", 36249);

    defineConstant(WebGL2RenderingContext, "SAMPLER_2D_ARRAY", 36289);

    defineConstant(WebGL2RenderingContext, "SAMPLER_2D_ARRAY_SHADOW", 36292);

    defineConstant(WebGL2RenderingContext, "SAMPLER_CUBE_SHADOW", 36293);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_VEC2", 36294);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_VEC3", 36295);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_VEC4", 36296);

    defineConstant(WebGL2RenderingContext, "INT_SAMPLER_2D", 36298);

    defineConstant(WebGL2RenderingContext, "INT_SAMPLER_3D", 36299);

    defineConstant(WebGL2RenderingContext, "INT_SAMPLER_CUBE", 36300);

    defineConstant(WebGL2RenderingContext, "INT_SAMPLER_2D_ARRAY", 36303);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_SAMPLER_2D", 36306);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_SAMPLER_3D", 36307);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_SAMPLER_CUBE", 36308);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311);

    defineConstant(WebGL2RenderingContext, "DEPTH_COMPONENT32F", 36012);

    defineConstant(WebGL2RenderingContext, "DEPTH32F_STENCIL8", 36013);

    defineConstant(WebGL2RenderingContext, "FLOAT_32_UNSIGNED_INT_24_8_REV", 36269);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING", 33296);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE", 33297);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_RED_SIZE", 33298);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE", 33299);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE", 33300);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE", 33301);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE", 33302);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE", 33303);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_DEFAULT", 33304);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_INT_24_8", 34042);

    defineConstant(WebGL2RenderingContext, "DEPTH24_STENCIL8", 35056);

    defineConstant(WebGL2RenderingContext, "UNSIGNED_NORMALIZED", 35863);

    defineConstant(WebGL2RenderingContext, "DRAW_FRAMEBUFFER_BINDING", 36006);

    defineConstant(WebGL2RenderingContext, "READ_FRAMEBUFFER", 36008);

    defineConstant(WebGL2RenderingContext, "DRAW_FRAMEBUFFER", 36009);

    defineConstant(WebGL2RenderingContext, "READ_FRAMEBUFFER_BINDING", 36010);

    defineConstant(WebGL2RenderingContext, "RENDERBUFFER_SAMPLES", 36011);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER", 36052);

    defineConstant(WebGL2RenderingContext, "MAX_COLOR_ATTACHMENTS", 36063);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT1", 36065);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT2", 36066);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT3", 36067);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT4", 36068);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT5", 36069);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT6", 36070);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT7", 36071);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT8", 36072);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT9", 36073);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT10", 36074);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT11", 36075);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT12", 36076);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT13", 36077);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT14", 36078);

    defineConstant(WebGL2RenderingContext, "COLOR_ATTACHMENT15", 36079);

    defineConstant(WebGL2RenderingContext, "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE", 36182);

    defineConstant(WebGL2RenderingContext, "MAX_SAMPLES", 36183);

    defineConstant(WebGL2RenderingContext, "HALF_FLOAT", 5131);

    defineConstant(WebGL2RenderingContext, "RG", 33319);

    defineConstant(WebGL2RenderingContext, "RG_INTEGER", 33320);

    defineConstant(WebGL2RenderingContext, "R8", 33321);

    defineConstant(WebGL2RenderingContext, "RG8", 33323);

    defineConstant(WebGL2RenderingContext, "R16F", 33325);

    defineConstant(WebGL2RenderingContext, "R32F", 33326);

    defineConstant(WebGL2RenderingContext, "RG16F", 33327);

    defineConstant(WebGL2RenderingContext, "RG32F", 33328);

    defineConstant(WebGL2RenderingContext, "R8I", 33329);

    defineConstant(WebGL2RenderingContext, "R8UI", 33330);

    defineConstant(WebGL2RenderingContext, "R16I", 33331);

    defineConstant(WebGL2RenderingContext, "R16UI", 33332);

    defineConstant(WebGL2RenderingContext, "R32I", 33333);

    defineConstant(WebGL2RenderingContext, "R32UI", 33334);

    defineConstant(WebGL2RenderingContext, "RG8I", 33335);

    defineConstant(WebGL2RenderingContext, "RG8UI", 33336);

    defineConstant(WebGL2RenderingContext, "RG16I", 33337);

    defineConstant(WebGL2RenderingContext, "RG16UI", 33338);

    defineConstant(WebGL2RenderingContext, "RG32I", 33339);

    defineConstant(WebGL2RenderingContext, "RG32UI", 33340);

    defineConstant(WebGL2RenderingContext, "VERTEX_ARRAY_BINDING", 34229);

    defineConstant(WebGL2RenderingContext, "R8_SNORM", 36756);

    defineConstant(WebGL2RenderingContext, "RG8_SNORM", 36757);

    defineConstant(WebGL2RenderingContext, "RGB8_SNORM", 36758);

    defineConstant(WebGL2RenderingContext, "RGBA8_SNORM", 36759);

    defineConstant(WebGL2RenderingContext, "SIGNED_NORMALIZED", 36764);

    defineConstant(WebGL2RenderingContext, "COPY_READ_BUFFER", 36662);

    defineConstant(WebGL2RenderingContext, "COPY_WRITE_BUFFER", 36663);

    defineConstant(WebGL2RenderingContext, "COPY_READ_BUFFER_BINDING", 36662);

    defineConstant(WebGL2RenderingContext, "COPY_WRITE_BUFFER_BINDING", 36663);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BUFFER", 35345);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BUFFER_BINDING", 35368);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BUFFER_START", 35369);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BUFFER_SIZE", 35370);

    defineConstant(WebGL2RenderingContext, "MAX_VERTEX_UNIFORM_BLOCKS", 35371);

    defineConstant(WebGL2RenderingContext, "MAX_FRAGMENT_UNIFORM_BLOCKS", 35373);

    defineConstant(WebGL2RenderingContext, "MAX_COMBINED_UNIFORM_BLOCKS", 35374);

    defineConstant(WebGL2RenderingContext, "MAX_UNIFORM_BUFFER_BINDINGS", 35375);

    defineConstant(WebGL2RenderingContext, "MAX_UNIFORM_BLOCK_SIZE", 35376);

    defineConstant(WebGL2RenderingContext, "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS", 35377);

    defineConstant(WebGL2RenderingContext, "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS", 35379);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BUFFER_OFFSET_ALIGNMENT", 35380);

    defineConstant(WebGL2RenderingContext, "ACTIVE_UNIFORM_BLOCKS", 35382);

    defineConstant(WebGL2RenderingContext, "UNIFORM_TYPE", 35383);

    defineConstant(WebGL2RenderingContext, "UNIFORM_SIZE", 35384);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BLOCK_INDEX", 35386);

    defineConstant(WebGL2RenderingContext, "UNIFORM_OFFSET", 35387);

    defineConstant(WebGL2RenderingContext, "UNIFORM_ARRAY_STRIDE", 35388);

    defineConstant(WebGL2RenderingContext, "UNIFORM_MATRIX_STRIDE", 35389);

    defineConstant(WebGL2RenderingContext, "UNIFORM_IS_ROW_MAJOR", 35390);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BLOCK_BINDING", 35391);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BLOCK_DATA_SIZE", 35392);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BLOCK_ACTIVE_UNIFORMS", 35394);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES", 35395);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER", 35396);

    defineConstant(WebGL2RenderingContext, "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER", 35398);

    defineConstant(WebGL2RenderingContext, "INVALID_INDEX", 4294967295);

    defineConstant(WebGL2RenderingContext, "MAX_VERTEX_OUTPUT_COMPONENTS", 37154);

    defineConstant(WebGL2RenderingContext, "MAX_FRAGMENT_INPUT_COMPONENTS", 37157);

    defineConstant(WebGL2RenderingContext, "MAX_SERVER_WAIT_TIMEOUT", 37137);

    defineConstant(WebGL2RenderingContext, "OBJECT_TYPE", 37138);

    defineConstant(WebGL2RenderingContext, "SYNC_CONDITION", 37139);

    defineConstant(WebGL2RenderingContext, "SYNC_STATUS", 37140);

    defineConstant(WebGL2RenderingContext, "SYNC_FLAGS", 37141);

    defineConstant(WebGL2RenderingContext, "SYNC_FENCE", 37142);

    defineConstant(WebGL2RenderingContext, "SYNC_GPU_COMMANDS_COMPLETE", 37143);

    defineConstant(WebGL2RenderingContext, "UNSIGNALED", 37144);

    defineConstant(WebGL2RenderingContext, "SIGNALED", 37145);

    defineConstant(WebGL2RenderingContext, "ALREADY_SIGNALED", 37146);

    defineConstant(WebGL2RenderingContext, "TIMEOUT_EXPIRED", 37147);

    defineConstant(WebGL2RenderingContext, "CONDITION_SATISFIED", 37148);

    defineConstant(WebGL2RenderingContext, "WAIT_FAILED", 37149);

    defineConstant(WebGL2RenderingContext, "SYNC_FLUSH_COMMANDS_BIT", 1);

    defineConstant(WebGL2RenderingContext, "VERTEX_ATTRIB_ARRAY_DIVISOR", 35070);

    defineConstant(WebGL2RenderingContext, "ANY_SAMPLES_PASSED", 35887);

    defineConstant(WebGL2RenderingContext, "ANY_SAMPLES_PASSED_CONSERVATIVE", 36202);

    defineConstant(WebGL2RenderingContext, "SAMPLER_BINDING", 35097);

    defineConstant(WebGL2RenderingContext, "RGB10_A2UI", 36975);

    defineConstant(WebGL2RenderingContext, "INT_2_10_10_10_REV", 36255);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK", 36386);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_PAUSED", 36387);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_ACTIVE", 36388);

    defineConstant(WebGL2RenderingContext, "TRANSFORM_FEEDBACK_BINDING", 36389);

    defineConstant(WebGL2RenderingContext, "TEXTURE_IMMUTABLE_FORMAT", 37167);

    defineConstant(WebGL2RenderingContext, "MAX_ELEMENT_INDEX", 36203);

    defineConstant(WebGL2RenderingContext, "TEXTURE_IMMUTABLE_LEVELS", 33503);

    defineConstant(WebGL2RenderingContext, "TIMEOUT_IGNORED", (-1));

    defineConstant(WebGL2RenderingContext, "MAX_CLIENT_WAIT_TIMEOUT_WEBGL", 37447);

}
  finish(WebGLObject);

    finish(resourceConstructors[1]);

    finish(resourceConstructors[2]);

    finish(resourceConstructors[3]);

    finish(resourceConstructors[4]);

    finish(resourceConstructors[5]);

    finish(resourceConstructors[6]);

    finish(resourceConstructors[7]);

    finish(resourceConstructors[8]);

    finish(resourceConstructors[9]);

    finish(resourceConstructors[10]);

    finish(resourceConstructors[11]);

    finish(resourceConstructors[12]);

  {
  {
    const getter = {
      [`get ${("size")}`]() {
        return webglValueProperty(this, "size", "activeInfo");
      },
    }[`get ${("size")}`];
    registerNativeGetter(getter, "size");
    definePrototypeGetter(WebGLActiveInfo.prototype, "size", getter);
  }
{
    const getter = {
      [`get ${("type")}`]() {
        return webglValueProperty(this, "type", "activeInfo");
      },
    }[`get ${("type")}`];
    registerNativeGetter(getter, "type");
    definePrototypeGetter(WebGLActiveInfo.prototype, "type", getter);
  }
{
    const getter = {
      [`get ${("name")}`]() {
        return webglValueProperty(this, "name", "activeInfo");
      },
    }[`get ${("name")}`];
    registerNativeGetter(getter, "name");
    definePrototypeGetter(WebGLActiveInfo.prototype, "name", getter);
  }
  finish(WebGLActiveInfo);
}
  {
  {
    const getter = {
      [`get ${("rangeMin")}`]() {
        return webglValueProperty(this, "rangeMin", "precisionFormat");
      },
    }[`get ${("rangeMin")}`];
    registerNativeGetter(getter, "rangeMin");
    definePrototypeGetter(WebGLShaderPrecisionFormat.prototype, "rangeMin", getter);
  }
{
    const getter = {
      [`get ${("rangeMax")}`]() {
        return webglValueProperty(this, "rangeMax", "precisionFormat");
      },
    }[`get ${("rangeMax")}`];
    registerNativeGetter(getter, "rangeMax");
    definePrototypeGetter(WebGLShaderPrecisionFormat.prototype, "rangeMax", getter);
  }
{
    const getter = {
      [`get ${("precision")}`]() {
        return webglValueProperty(this, "precision", "precisionFormat");
      },
    }[`get ${("precision")}`];
    registerNativeGetter(getter, "precision");
    definePrototypeGetter(WebGLShaderPrecisionFormat.prototype, "precision", getter);
  }
  finish(WebGLShaderPrecisionFormat);
}
  {
  {
    const getter = {
      [`get ${("statusMessage")}`]() {
        return webglValueProperty(this, "statusMessage", "contextEvent");
      },
    }[`get ${("statusMessage")}`];
    registerNativeGetter(getter, "statusMessage");
    definePrototypeGetter(WebGLContextEvent.prototype, "statusMessage", getter);
  }
  finish(WebGLContextEvent);
}
}

function installContextAccessor(Constructor, name) {
    const getter = {
      [`get ${name}`]() {
        return webglContextProperty(this, name);
      },
    }[`get ${name}`];
    registerNativeGetter(getter, name);
    if (["drawingBufferColorSpace", "unpackColorSpace"].includes(name)) {
      const setter = {
        [`set ${name}`](value) {
          setWebGLContextProperty(this, name, value);
        },
      }[`set ${name}`];
      registerNativeFunction(setter, `set ${name}`);
      definePrototypeAccessor(Constructor.prototype, name, getter, setter);
    } else {
      definePrototypeGetter(Constructor.prototype, name, getter);
    }
}

function installContextMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return webglOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function finish(Constructor) {
  defineConstructorBacklink(Constructor.prototype, Constructor);
  defineToStringTag(Constructor.prototype, Constructor.name);
}

function defineConstant(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    enumerable: true,
  });
}
