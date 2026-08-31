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
import { WEBGL_SURFACES } from "../api/webgl/webgl-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

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
  do {
    delete (((webglConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[0])).name, (((webglConstructors)[0])));
  } while (false);
do {
    delete (((webglConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[1])).name, (((webglConstructors)[1])));
  } while (false);
do {
    delete (((webglConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[2])).name, (((webglConstructors)[2])));
  } while (false);
do {
    delete (((webglConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[3])).name, (((webglConstructors)[3])));
  } while (false);
do {
    delete (((webglConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[4])).name, (((webglConstructors)[4])));
  } while (false);
do {
    delete (((webglConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[5])).name, (((webglConstructors)[5])));
  } while (false);
do {
    delete (((webglConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[6])).name, (((webglConstructors)[6])));
  } while (false);
do {
    delete (((webglConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[7])).name, (((webglConstructors)[7])));
  } while (false);
do {
    delete (((webglConstructors)[8])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[8])).name, (((webglConstructors)[8])));
  } while (false);
do {
    delete (((webglConstructors)[9])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[9])).name, (((webglConstructors)[9])));
  } while (false);
do {
    delete (((webglConstructors)[10])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[10])).name, (((webglConstructors)[10])));
  } while (false);
do {
    delete (((webglConstructors)[11])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[11])).name, (((webglConstructors)[11])));
  } while (false);
do {
    delete (((webglConstructors)[12])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[12])).name, (((webglConstructors)[12])));
  } while (false);
do {
    delete (((webglConstructors)[13])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[13])).name, (((webglConstructors)[13])));
  } while (false);
do {
    delete (((webglConstructors)[14])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[14])).name, (((webglConstructors)[14])));
  } while (false);
do {
    delete (((webglConstructors)[15])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[15])).name, (((webglConstructors)[15])));
  } while (false);
do {
    delete (((webglConstructors)[16])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[16])).name, (((webglConstructors)[16])));
  } while (false);
do {
    delete (((webglConstructors)[17])).prototype.constructor;
    defineGlobalConstructor((((webglConstructors)[17])).name, (((webglConstructors)[17])));
  } while (false);
  do {
    
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[1])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[1])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[2])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[2])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[3])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[3])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[4])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[4])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[5])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[5])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[6])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[6])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[7])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[7])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[8])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[8])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[9])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[9])), WebGLObject);
    }
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[10])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[10])), WebGLObject);
    }
  } while (false);
do {
    
  } while (false);
do {
    {
      Object.setPrototypeOf((((resourceConstructors)[12])).prototype, WebGLObject.prototype);
      Object.setPrototypeOf((((resourceConstructors)[12])), WebGLObject);
    }
  } while (false);
  Object.setPrototypeOf(WebGLContextEvent.prototype, Event.prototype);
  Object.setPrototypeOf(WebGLContextEvent, Event);

  {
  do {
    {
      installContextAccessor((WebGLRenderingContext), ("canvas"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGLRenderingContext), ("drawingBufferWidth"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGLRenderingContext), ("drawingBufferHeight"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGLRenderingContext), ("drawingBufferColorSpace"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGLRenderingContext), ("unpackColorSpace"));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_BUFFER_BIT"), (256));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BUFFER_BIT"), (1024));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("COLOR_BUFFER_BIT"), (16384));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("POINTS"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINES"), (1));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINE_LOOP"), (2));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINE_STRIP"), (3));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TRIANGLES"), (4));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TRIANGLE_STRIP"), (5));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TRIANGLE_FAN"), (6));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ZERO"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ONE"), (1));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SRC_COLOR"), (768));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ONE_MINUS_SRC_COLOR"), (769));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SRC_ALPHA"), (770));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ONE_MINUS_SRC_ALPHA"), (771));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DST_ALPHA"), (772));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ONE_MINUS_DST_ALPHA"), (773));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DST_COLOR"), (774));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ONE_MINUS_DST_COLOR"), (775));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SRC_ALPHA_SATURATE"), (776));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FUNC_ADD"), (32774));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_EQUATION"), (32777));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_EQUATION_RGB"), (32777));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_EQUATION_ALPHA"), (34877));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FUNC_SUBTRACT"), (32778));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FUNC_REVERSE_SUBTRACT"), (32779));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_DST_RGB"), (32968));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_SRC_RGB"), (32969));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_DST_ALPHA"), (32970));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_SRC_ALPHA"), (32971));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CONSTANT_COLOR"), (32769));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ONE_MINUS_CONSTANT_COLOR"), (32770));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CONSTANT_ALPHA"), (32771));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ONE_MINUS_CONSTANT_ALPHA"), (32772));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND_COLOR"), (32773));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ARRAY_BUFFER"), (34962));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ELEMENT_ARRAY_BUFFER"), (34963));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ARRAY_BUFFER_BINDING"), (34964));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ELEMENT_ARRAY_BUFFER_BINDING"), (34965));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STREAM_DRAW"), (35040));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STATIC_DRAW"), (35044));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DYNAMIC_DRAW"), (35048));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BUFFER_SIZE"), (34660));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BUFFER_USAGE"), (34661));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CURRENT_VERTEX_ATTRIB"), (34342));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRONT"), (1028));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BACK"), (1029));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRONT_AND_BACK"), (1032));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_2D"), (3553));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CULL_FACE"), (2884));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLEND"), (3042));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DITHER"), (3024));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_TEST"), (2960));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_TEST"), (2929));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SCISSOR_TEST"), (3089));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("POLYGON_OFFSET_FILL"), (32823));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLE_ALPHA_TO_COVERAGE"), (32926));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLE_COVERAGE"), (32928));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NO_ERROR"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INVALID_ENUM"), (1280));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INVALID_VALUE"), (1281));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INVALID_OPERATION"), (1282));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("OUT_OF_MEMORY"), (1285));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CW"), (2304));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CCW"), (2305));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINE_WIDTH"), (2849));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ALIASED_POINT_SIZE_RANGE"), (33901));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ALIASED_LINE_WIDTH_RANGE"), (33902));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CULL_FACE_MODE"), (2885));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRONT_FACE"), (2886));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_RANGE"), (2928));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_WRITEMASK"), (2930));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_CLEAR_VALUE"), (2931));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_FUNC"), (2932));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_CLEAR_VALUE"), (2961));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_FUNC"), (2962));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_FAIL"), (2964));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_PASS_DEPTH_FAIL"), (2965));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_PASS_DEPTH_PASS"), (2966));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_REF"), (2967));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_VALUE_MASK"), (2963));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_WRITEMASK"), (2968));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BACK_FUNC"), (34816));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BACK_FAIL"), (34817));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BACK_PASS_DEPTH_FAIL"), (34818));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BACK_PASS_DEPTH_PASS"), (34819));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BACK_REF"), (36003));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BACK_VALUE_MASK"), (36004));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BACK_WRITEMASK"), (36005));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VIEWPORT"), (2978));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SCISSOR_BOX"), (3088));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("COLOR_CLEAR_VALUE"), (3106));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("COLOR_WRITEMASK"), (3107));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNPACK_ALIGNMENT"), (3317));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("PACK_ALIGNMENT"), (3333));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_TEXTURE_SIZE"), (3379));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_VIEWPORT_DIMS"), (3386));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SUBPIXEL_BITS"), (3408));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RED_BITS"), (3410));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("GREEN_BITS"), (3411));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BLUE_BITS"), (3412));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ALPHA_BITS"), (3413));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_BITS"), (3414));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_BITS"), (3415));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("POLYGON_OFFSET_UNITS"), (10752));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("POLYGON_OFFSET_FACTOR"), (32824));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_BINDING_2D"), (32873));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLE_BUFFERS"), (32936));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLES"), (32937));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLE_COVERAGE_VALUE"), (32938));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLE_COVERAGE_INVERT"), (32939));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("COMPRESSED_TEXTURE_FORMATS"), (34467));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DONT_CARE"), (4352));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FASTEST"), (4353));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NICEST"), (4354));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("GENERATE_MIPMAP_HINT"), (33170));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BYTE"), (5120));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNSIGNED_BYTE"), (5121));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SHORT"), (5122));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNSIGNED_SHORT"), (5123));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INT"), (5124));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNSIGNED_INT"), (5125));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FLOAT"), (5126));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_COMPONENT"), (6402));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ALPHA"), (6406));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RGB"), (6407));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RGBA"), (6408));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LUMINANCE"), (6409));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LUMINANCE_ALPHA"), (6410));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNSIGNED_SHORT_4_4_4_4"), (32819));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNSIGNED_SHORT_5_5_5_1"), (32820));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNSIGNED_SHORT_5_6_5"), (33635));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAGMENT_SHADER"), (35632));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_SHADER"), (35633));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_VERTEX_ATTRIBS"), (34921));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_VERTEX_UNIFORM_VECTORS"), (36347));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_VARYING_VECTORS"), (36348));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_COMBINED_TEXTURE_IMAGE_UNITS"), (35661));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_VERTEX_TEXTURE_IMAGE_UNITS"), (35660));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_TEXTURE_IMAGE_UNITS"), (34930));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_FRAGMENT_UNIFORM_VECTORS"), (36349));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SHADER_TYPE"), (35663));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DELETE_STATUS"), (35712));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINK_STATUS"), (35714));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VALIDATE_STATUS"), (35715));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ATTACHED_SHADERS"), (35717));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ACTIVE_UNIFORMS"), (35718));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ACTIVE_ATTRIBUTES"), (35721));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SHADING_LANGUAGE_VERSION"), (35724));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CURRENT_PROGRAM"), (35725));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NEVER"), (512));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LESS"), (513));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("EQUAL"), (514));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LEQUAL"), (515));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("GREATER"), (516));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NOTEQUAL"), (517));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("GEQUAL"), (518));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ALWAYS"), (519));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("KEEP"), (7680));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("REPLACE"), (7681));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INCR"), (7682));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DECR"), (7683));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INVERT"), (5386));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INCR_WRAP"), (34055));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DECR_WRAP"), (34056));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VENDOR"), (7936));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERER"), (7937));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERSION"), (7938));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NEAREST"), (9728));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINEAR"), (9729));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NEAREST_MIPMAP_NEAREST"), (9984));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINEAR_MIPMAP_NEAREST"), (9985));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NEAREST_MIPMAP_LINEAR"), (9986));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LINEAR_MIPMAP_LINEAR"), (9987));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_MAG_FILTER"), (10240));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_MIN_FILTER"), (10241));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_WRAP_S"), (10242));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_WRAP_T"), (10243));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE"), (5890));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_CUBE_MAP"), (34067));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_BINDING_CUBE_MAP"), (34068));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_CUBE_MAP_POSITIVE_X"), (34069));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_CUBE_MAP_NEGATIVE_X"), (34070));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_CUBE_MAP_POSITIVE_Y"), (34071));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_CUBE_MAP_NEGATIVE_Y"), (34072));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_CUBE_MAP_POSITIVE_Z"), (34073));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE_CUBE_MAP_NEGATIVE_Z"), (34074));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_CUBE_MAP_TEXTURE_SIZE"), (34076));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE0"), (33984));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE1"), (33985));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE2"), (33986));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE3"), (33987));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE4"), (33988));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE5"), (33989));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE6"), (33990));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE7"), (33991));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE8"), (33992));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE9"), (33993));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE10"), (33994));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE11"), (33995));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE12"), (33996));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE13"), (33997));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE14"), (33998));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE15"), (33999));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE16"), (34000));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE17"), (34001));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE18"), (34002));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE19"), (34003));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE20"), (34004));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE21"), (34005));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE22"), (34006));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE23"), (34007));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE24"), (34008));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE25"), (34009));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE26"), (34010));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE27"), (34011));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE28"), (34012));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE29"), (34013));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE30"), (34014));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("TEXTURE31"), (34015));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("ACTIVE_TEXTURE"), (34016));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("REPEAT"), (10497));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CLAMP_TO_EDGE"), (33071));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MIRRORED_REPEAT"), (33648));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FLOAT_VEC2"), (35664));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FLOAT_VEC3"), (35665));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FLOAT_VEC4"), (35666));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INT_VEC2"), (35667));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INT_VEC3"), (35668));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INT_VEC4"), (35669));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BOOL"), (35670));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BOOL_VEC2"), (35671));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BOOL_VEC3"), (35672));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BOOL_VEC4"), (35673));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FLOAT_MAT2"), (35674));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FLOAT_MAT3"), (35675));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FLOAT_MAT4"), (35676));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLER_2D"), (35678));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("SAMPLER_CUBE"), (35680));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_ENABLED"), (34338));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_SIZE"), (34339));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_STRIDE"), (34340));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_TYPE"), (34341));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_NORMALIZED"), (34922));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_POINTER"), (34373));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_BUFFER_BINDING"), (34975));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("IMPLEMENTATION_COLOR_READ_TYPE"), (35738));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("IMPLEMENTATION_COLOR_READ_FORMAT"), (35739));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("COMPILE_STATUS"), (35713));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LOW_FLOAT"), (36336));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MEDIUM_FLOAT"), (36337));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("HIGH_FLOAT"), (36338));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("LOW_INT"), (36339));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MEDIUM_INT"), (36340));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("HIGH_INT"), (36341));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER"), (36160));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER"), (36161));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RGBA4"), (32854));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RGB5_A1"), (32855));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RGB565"), (36194));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_COMPONENT16"), (33189));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_INDEX8"), (36168));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_STENCIL"), (34041));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_WIDTH"), (36162));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_HEIGHT"), (36163));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_INTERNAL_FORMAT"), (36164));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_RED_SIZE"), (36176));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_GREEN_SIZE"), (36177));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_BLUE_SIZE"), (36178));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_ALPHA_SIZE"), (36179));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_DEPTH_SIZE"), (36180));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_STENCIL_SIZE"), (36181));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE"), (36048));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_OBJECT_NAME"), (36049));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL"), (36050));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE"), (36051));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("COLOR_ATTACHMENT0"), (36064));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_ATTACHMENT"), (36096));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("STENCIL_ATTACHMENT"), (36128));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("DEPTH_STENCIL_ATTACHMENT"), (33306));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("NONE"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_COMPLETE"), (36053));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_INCOMPLETE_ATTACHMENT"), (36054));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"), (36055));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"), (36057));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_UNSUPPORTED"), (36061));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("FRAMEBUFFER_BINDING"), (36006));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RENDERBUFFER_BINDING"), (36007));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("MAX_RENDERBUFFER_SIZE"), (34024));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("INVALID_FRAMEBUFFER_OPERATION"), (1286));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNPACK_FLIP_Y_WEBGL"), (37440));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNPACK_PREMULTIPLY_ALPHA_WEBGL"), (37441));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("CONTEXT_LOST_WEBGL"), (37442));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("UNPACK_COLORSPACE_CONVERSION_WEBGL"), (37443));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("BROWSER_DEFAULT_WEBGL"), (37444));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("activeTexture"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("attachShader"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("bindAttribLocation"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("bindRenderbuffer"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("blendColor"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("blendEquation"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("blendEquationSeparate"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("blendFunc"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("blendFuncSeparate"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("bufferData"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("bufferSubData"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("checkFramebufferStatus"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("compileShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("compressedTexImage2D"), (7));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("compressedTexSubImage2D"), (8));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("copyTexImage2D"), (8));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("copyTexSubImage2D"), (8));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("createBuffer"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("createFramebuffer"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("createProgram"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("createRenderbuffer"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("createShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("createTexture"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("cullFace"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("deleteBuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("deleteFramebuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("deleteProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("deleteRenderbuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("deleteShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("deleteTexture"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("depthFunc"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("depthMask"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("depthRange"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("detachShader"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("disable"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("enable"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("finish"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("flush"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("framebufferRenderbuffer"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("framebufferTexture2D"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("frontFace"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("generateMipmap"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getActiveAttrib"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getActiveUniform"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getAttachedShaders"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getAttribLocation"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getBufferParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getContextAttributes"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getError"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getExtension"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getFramebufferAttachmentParameter"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getParameter"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getProgramInfoLog"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getProgramParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getRenderbufferParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getShaderInfoLog"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getShaderParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getShaderPrecisionFormat"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getShaderSource"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getSupportedExtensions"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getTexParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getUniform"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getUniformLocation"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getVertexAttrib"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("getVertexAttribOffset"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("hint"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isBuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isContextLost"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isEnabled"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isFramebuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isRenderbuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("isTexture"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("lineWidth"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("linkProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("pixelStorei"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("polygonOffset"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("readPixels"), (7));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("renderbufferStorage"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("sampleCoverage"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("shaderSource"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("stencilFunc"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("stencilFuncSeparate"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("stencilMask"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("stencilMaskSeparate"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("stencilOp"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("stencilOpSeparate"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("texImage2D"), (6));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("texParameterf"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("texParameteri"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("texSubImage2D"), (7));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("useProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("validateProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("bindBuffer"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("bindFramebuffer"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("bindTexture"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("clear"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("clearColor"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("clearDepth"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("clearStencil"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("colorMask"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("disableVertexAttribArray"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("drawArrays"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("drawElements"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("enableVertexAttribArray"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("scissor"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform1f"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform1fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform1i"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform1iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform2f"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform2fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform2i"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform2iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform3f"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform3fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform3i"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform3iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform4f"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform4fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform4i"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniform4iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniformMatrix2fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniformMatrix3fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("uniformMatrix4fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib1f"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib1fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib2f"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib2fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib3f"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib3fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib4f"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttrib4fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("vertexAttribPointer"), (6));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("viewport"), (4));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGLRenderingContext), ("drawingBufferFormat"));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RGB8"), (32849));
    }
  } while (false);
do {
    {
      defineConstant((WebGLRenderingContext).prototype, ("RGBA8"), (32856));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("drawingBufferStorage"), (3));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((WebGLRenderingContext).prototype, (WebGLRenderingContext));
    }
  } while (false);
do {
    {
      installContextMethod((WebGLRenderingContext), ("makeXRCompatible"), (0));
    }
  } while (false);
do {
    {
      defineToStringTag((WebGLRenderingContext).prototype, (WebGLRenderingContext).name);
    }
  } while (false);
  do {
    defineConstant((WebGLRenderingContext), ("DEPTH_BUFFER_BIT"), (256));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BUFFER_BIT"), (1024));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("COLOR_BUFFER_BIT"), (16384));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("POINTS"), (0));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINES"), (1));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINE_LOOP"), (2));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINE_STRIP"), (3));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TRIANGLES"), (4));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TRIANGLE_STRIP"), (5));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TRIANGLE_FAN"), (6));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ZERO"), (0));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ONE"), (1));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SRC_COLOR"), (768));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ONE_MINUS_SRC_COLOR"), (769));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SRC_ALPHA"), (770));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ONE_MINUS_SRC_ALPHA"), (771));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DST_ALPHA"), (772));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ONE_MINUS_DST_ALPHA"), (773));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DST_COLOR"), (774));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ONE_MINUS_DST_COLOR"), (775));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SRC_ALPHA_SATURATE"), (776));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FUNC_ADD"), (32774));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_EQUATION"), (32777));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_EQUATION_RGB"), (32777));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_EQUATION_ALPHA"), (34877));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FUNC_SUBTRACT"), (32778));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FUNC_REVERSE_SUBTRACT"), (32779));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_DST_RGB"), (32968));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_SRC_RGB"), (32969));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_DST_ALPHA"), (32970));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_SRC_ALPHA"), (32971));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CONSTANT_COLOR"), (32769));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ONE_MINUS_CONSTANT_COLOR"), (32770));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CONSTANT_ALPHA"), (32771));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ONE_MINUS_CONSTANT_ALPHA"), (32772));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND_COLOR"), (32773));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ARRAY_BUFFER"), (34962));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ELEMENT_ARRAY_BUFFER"), (34963));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ARRAY_BUFFER_BINDING"), (34964));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ELEMENT_ARRAY_BUFFER_BINDING"), (34965));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STREAM_DRAW"), (35040));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STATIC_DRAW"), (35044));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DYNAMIC_DRAW"), (35048));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BUFFER_SIZE"), (34660));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BUFFER_USAGE"), (34661));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CURRENT_VERTEX_ATTRIB"), (34342));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRONT"), (1028));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BACK"), (1029));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRONT_AND_BACK"), (1032));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_2D"), (3553));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CULL_FACE"), (2884));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLEND"), (3042));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DITHER"), (3024));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_TEST"), (2960));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_TEST"), (2929));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SCISSOR_TEST"), (3089));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("POLYGON_OFFSET_FILL"), (32823));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLE_ALPHA_TO_COVERAGE"), (32926));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLE_COVERAGE"), (32928));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NO_ERROR"), (0));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INVALID_ENUM"), (1280));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INVALID_VALUE"), (1281));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INVALID_OPERATION"), (1282));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("OUT_OF_MEMORY"), (1285));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CW"), (2304));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CCW"), (2305));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINE_WIDTH"), (2849));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ALIASED_POINT_SIZE_RANGE"), (33901));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ALIASED_LINE_WIDTH_RANGE"), (33902));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CULL_FACE_MODE"), (2885));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRONT_FACE"), (2886));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_RANGE"), (2928));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_WRITEMASK"), (2930));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_CLEAR_VALUE"), (2931));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_FUNC"), (2932));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_CLEAR_VALUE"), (2961));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_FUNC"), (2962));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_FAIL"), (2964));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_PASS_DEPTH_FAIL"), (2965));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_PASS_DEPTH_PASS"), (2966));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_REF"), (2967));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_VALUE_MASK"), (2963));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_WRITEMASK"), (2968));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BACK_FUNC"), (34816));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BACK_FAIL"), (34817));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BACK_PASS_DEPTH_FAIL"), (34818));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BACK_PASS_DEPTH_PASS"), (34819));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BACK_REF"), (36003));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BACK_VALUE_MASK"), (36004));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BACK_WRITEMASK"), (36005));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VIEWPORT"), (2978));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SCISSOR_BOX"), (3088));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("COLOR_CLEAR_VALUE"), (3106));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("COLOR_WRITEMASK"), (3107));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNPACK_ALIGNMENT"), (3317));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("PACK_ALIGNMENT"), (3333));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_TEXTURE_SIZE"), (3379));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_VIEWPORT_DIMS"), (3386));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SUBPIXEL_BITS"), (3408));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RED_BITS"), (3410));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("GREEN_BITS"), (3411));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BLUE_BITS"), (3412));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ALPHA_BITS"), (3413));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_BITS"), (3414));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_BITS"), (3415));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("POLYGON_OFFSET_UNITS"), (10752));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("POLYGON_OFFSET_FACTOR"), (32824));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_BINDING_2D"), (32873));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLE_BUFFERS"), (32936));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLES"), (32937));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLE_COVERAGE_VALUE"), (32938));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLE_COVERAGE_INVERT"), (32939));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("COMPRESSED_TEXTURE_FORMATS"), (34467));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DONT_CARE"), (4352));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FASTEST"), (4353));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NICEST"), (4354));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("GENERATE_MIPMAP_HINT"), (33170));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BYTE"), (5120));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNSIGNED_BYTE"), (5121));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SHORT"), (5122));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNSIGNED_SHORT"), (5123));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INT"), (5124));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNSIGNED_INT"), (5125));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FLOAT"), (5126));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_COMPONENT"), (6402));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ALPHA"), (6406));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RGB"), (6407));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RGBA"), (6408));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LUMINANCE"), (6409));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LUMINANCE_ALPHA"), (6410));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNSIGNED_SHORT_4_4_4_4"), (32819));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNSIGNED_SHORT_5_5_5_1"), (32820));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNSIGNED_SHORT_5_6_5"), (33635));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAGMENT_SHADER"), (35632));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_SHADER"), (35633));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_VERTEX_ATTRIBS"), (34921));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_VERTEX_UNIFORM_VECTORS"), (36347));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_VARYING_VECTORS"), (36348));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_COMBINED_TEXTURE_IMAGE_UNITS"), (35661));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_VERTEX_TEXTURE_IMAGE_UNITS"), (35660));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_TEXTURE_IMAGE_UNITS"), (34930));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_FRAGMENT_UNIFORM_VECTORS"), (36349));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SHADER_TYPE"), (35663));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DELETE_STATUS"), (35712));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINK_STATUS"), (35714));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VALIDATE_STATUS"), (35715));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ATTACHED_SHADERS"), (35717));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ACTIVE_UNIFORMS"), (35718));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ACTIVE_ATTRIBUTES"), (35721));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SHADING_LANGUAGE_VERSION"), (35724));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CURRENT_PROGRAM"), (35725));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NEVER"), (512));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LESS"), (513));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("EQUAL"), (514));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LEQUAL"), (515));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("GREATER"), (516));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NOTEQUAL"), (517));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("GEQUAL"), (518));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ALWAYS"), (519));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("KEEP"), (7680));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("REPLACE"), (7681));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INCR"), (7682));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DECR"), (7683));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INVERT"), (5386));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INCR_WRAP"), (34055));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DECR_WRAP"), (34056));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VENDOR"), (7936));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERER"), (7937));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERSION"), (7938));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NEAREST"), (9728));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINEAR"), (9729));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NEAREST_MIPMAP_NEAREST"), (9984));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINEAR_MIPMAP_NEAREST"), (9985));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NEAREST_MIPMAP_LINEAR"), (9986));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LINEAR_MIPMAP_LINEAR"), (9987));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_MAG_FILTER"), (10240));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_MIN_FILTER"), (10241));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_WRAP_S"), (10242));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_WRAP_T"), (10243));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE"), (5890));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_CUBE_MAP"), (34067));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_BINDING_CUBE_MAP"), (34068));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_CUBE_MAP_POSITIVE_X"), (34069));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_CUBE_MAP_NEGATIVE_X"), (34070));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_CUBE_MAP_POSITIVE_Y"), (34071));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_CUBE_MAP_NEGATIVE_Y"), (34072));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_CUBE_MAP_POSITIVE_Z"), (34073));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE_CUBE_MAP_NEGATIVE_Z"), (34074));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_CUBE_MAP_TEXTURE_SIZE"), (34076));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE0"), (33984));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE1"), (33985));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE2"), (33986));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE3"), (33987));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE4"), (33988));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE5"), (33989));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE6"), (33990));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE7"), (33991));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE8"), (33992));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE9"), (33993));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE10"), (33994));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE11"), (33995));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE12"), (33996));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE13"), (33997));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE14"), (33998));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE15"), (33999));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE16"), (34000));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE17"), (34001));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE18"), (34002));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE19"), (34003));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE20"), (34004));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE21"), (34005));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE22"), (34006));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE23"), (34007));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE24"), (34008));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE25"), (34009));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE26"), (34010));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE27"), (34011));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE28"), (34012));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE29"), (34013));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE30"), (34014));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("TEXTURE31"), (34015));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("ACTIVE_TEXTURE"), (34016));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("REPEAT"), (10497));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CLAMP_TO_EDGE"), (33071));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MIRRORED_REPEAT"), (33648));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FLOAT_VEC2"), (35664));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FLOAT_VEC3"), (35665));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FLOAT_VEC4"), (35666));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INT_VEC2"), (35667));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INT_VEC3"), (35668));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INT_VEC4"), (35669));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BOOL"), (35670));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BOOL_VEC2"), (35671));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BOOL_VEC3"), (35672));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BOOL_VEC4"), (35673));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FLOAT_MAT2"), (35674));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FLOAT_MAT3"), (35675));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FLOAT_MAT4"), (35676));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLER_2D"), (35678));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("SAMPLER_CUBE"), (35680));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_ATTRIB_ARRAY_ENABLED"), (34338));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_ATTRIB_ARRAY_SIZE"), (34339));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_ATTRIB_ARRAY_STRIDE"), (34340));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_ATTRIB_ARRAY_TYPE"), (34341));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_ATTRIB_ARRAY_NORMALIZED"), (34922));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_ATTRIB_ARRAY_POINTER"), (34373));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("VERTEX_ATTRIB_ARRAY_BUFFER_BINDING"), (34975));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("IMPLEMENTATION_COLOR_READ_TYPE"), (35738));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("IMPLEMENTATION_COLOR_READ_FORMAT"), (35739));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("COMPILE_STATUS"), (35713));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LOW_FLOAT"), (36336));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MEDIUM_FLOAT"), (36337));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("HIGH_FLOAT"), (36338));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("LOW_INT"), (36339));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MEDIUM_INT"), (36340));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("HIGH_INT"), (36341));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER"), (36160));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER"), (36161));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RGBA4"), (32854));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RGB5_A1"), (32855));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RGB565"), (36194));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_COMPONENT16"), (33189));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_INDEX8"), (36168));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_STENCIL"), (34041));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_WIDTH"), (36162));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_HEIGHT"), (36163));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_INTERNAL_FORMAT"), (36164));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_RED_SIZE"), (36176));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_GREEN_SIZE"), (36177));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_BLUE_SIZE"), (36178));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_ALPHA_SIZE"), (36179));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_DEPTH_SIZE"), (36180));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_STENCIL_SIZE"), (36181));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE"), (36048));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_ATTACHMENT_OBJECT_NAME"), (36049));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL"), (36050));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE"), (36051));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("COLOR_ATTACHMENT0"), (36064));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_ATTACHMENT"), (36096));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("STENCIL_ATTACHMENT"), (36128));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("DEPTH_STENCIL_ATTACHMENT"), (33306));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("NONE"), (0));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_COMPLETE"), (36053));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_INCOMPLETE_ATTACHMENT"), (36054));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"), (36055));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"), (36057));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_UNSUPPORTED"), (36061));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("FRAMEBUFFER_BINDING"), (36006));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RENDERBUFFER_BINDING"), (36007));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("MAX_RENDERBUFFER_SIZE"), (34024));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("INVALID_FRAMEBUFFER_OPERATION"), (1286));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNPACK_FLIP_Y_WEBGL"), (37440));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNPACK_PREMULTIPLY_ALPHA_WEBGL"), (37441));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("CONTEXT_LOST_WEBGL"), (37442));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("UNPACK_COLORSPACE_CONVERSION_WEBGL"), (37443));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("BROWSER_DEFAULT_WEBGL"), (37444));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RGB8"), (32849));
  } while (false);
do {
    defineConstant((WebGLRenderingContext), ("RGBA8"), (32856));
  } while (false);
}
  {
  do {
    {
      installContextAccessor((WebGL2RenderingContext), ("canvas"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGL2RenderingContext), ("drawingBufferWidth"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGL2RenderingContext), ("drawingBufferHeight"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGL2RenderingContext), ("drawingBufferColorSpace"));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGL2RenderingContext), ("unpackColorSpace"));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_BUFFER_BIT"), (256));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BUFFER_BIT"), (1024));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_BUFFER_BIT"), (16384));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("POINTS"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINES"), (1));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINE_LOOP"), (2));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINE_STRIP"), (3));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRIANGLES"), (4));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRIANGLE_STRIP"), (5));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRIANGLE_FAN"), (6));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ZERO"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ONE"), (1));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SRC_COLOR"), (768));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ONE_MINUS_SRC_COLOR"), (769));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SRC_ALPHA"), (770));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ONE_MINUS_SRC_ALPHA"), (771));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DST_ALPHA"), (772));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ONE_MINUS_DST_ALPHA"), (773));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DST_COLOR"), (774));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ONE_MINUS_DST_COLOR"), (775));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SRC_ALPHA_SATURATE"), (776));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FUNC_ADD"), (32774));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_EQUATION"), (32777));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_EQUATION_RGB"), (32777));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_EQUATION_ALPHA"), (34877));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FUNC_SUBTRACT"), (32778));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FUNC_REVERSE_SUBTRACT"), (32779));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_DST_RGB"), (32968));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_SRC_RGB"), (32969));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_DST_ALPHA"), (32970));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_SRC_ALPHA"), (32971));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CONSTANT_COLOR"), (32769));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ONE_MINUS_CONSTANT_COLOR"), (32770));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CONSTANT_ALPHA"), (32771));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ONE_MINUS_CONSTANT_ALPHA"), (32772));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND_COLOR"), (32773));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ARRAY_BUFFER"), (34962));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ELEMENT_ARRAY_BUFFER"), (34963));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ARRAY_BUFFER_BINDING"), (34964));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ELEMENT_ARRAY_BUFFER_BINDING"), (34965));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STREAM_DRAW"), (35040));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STATIC_DRAW"), (35044));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DYNAMIC_DRAW"), (35048));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BUFFER_SIZE"), (34660));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BUFFER_USAGE"), (34661));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CURRENT_VERTEX_ATTRIB"), (34342));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRONT"), (1028));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BACK"), (1029));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRONT_AND_BACK"), (1032));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_2D"), (3553));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CULL_FACE"), (2884));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLEND"), (3042));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DITHER"), (3024));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_TEST"), (2960));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_TEST"), (2929));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SCISSOR_TEST"), (3089));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("POLYGON_OFFSET_FILL"), (32823));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLE_ALPHA_TO_COVERAGE"), (32926));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLE_COVERAGE"), (32928));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NO_ERROR"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INVALID_ENUM"), (1280));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INVALID_VALUE"), (1281));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INVALID_OPERATION"), (1282));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("OUT_OF_MEMORY"), (1285));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CW"), (2304));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CCW"), (2305));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINE_WIDTH"), (2849));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ALIASED_POINT_SIZE_RANGE"), (33901));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ALIASED_LINE_WIDTH_RANGE"), (33902));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CULL_FACE_MODE"), (2885));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRONT_FACE"), (2886));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_RANGE"), (2928));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_WRITEMASK"), (2930));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_CLEAR_VALUE"), (2931));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_FUNC"), (2932));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_CLEAR_VALUE"), (2961));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_FUNC"), (2962));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_FAIL"), (2964));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_PASS_DEPTH_FAIL"), (2965));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_PASS_DEPTH_PASS"), (2966));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_REF"), (2967));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_VALUE_MASK"), (2963));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_WRITEMASK"), (2968));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BACK_FUNC"), (34816));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BACK_FAIL"), (34817));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BACK_PASS_DEPTH_FAIL"), (34818));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BACK_PASS_DEPTH_PASS"), (34819));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BACK_REF"), (36003));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BACK_VALUE_MASK"), (36004));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BACK_WRITEMASK"), (36005));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VIEWPORT"), (2978));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SCISSOR_BOX"), (3088));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_CLEAR_VALUE"), (3106));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_WRITEMASK"), (3107));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_ALIGNMENT"), (3317));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PACK_ALIGNMENT"), (3333));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_TEXTURE_SIZE"), (3379));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VIEWPORT_DIMS"), (3386));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SUBPIXEL_BITS"), (3408));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RED_BITS"), (3410));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("GREEN_BITS"), (3411));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BLUE_BITS"), (3412));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ALPHA_BITS"), (3413));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_BITS"), (3414));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_BITS"), (3415));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("POLYGON_OFFSET_UNITS"), (10752));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("POLYGON_OFFSET_FACTOR"), (32824));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_BINDING_2D"), (32873));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLE_BUFFERS"), (32936));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLES"), (32937));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLE_COVERAGE_VALUE"), (32938));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLE_COVERAGE_INVERT"), (32939));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COMPRESSED_TEXTURE_FORMATS"), (34467));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DONT_CARE"), (4352));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FASTEST"), (4353));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NICEST"), (4354));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("GENERATE_MIPMAP_HINT"), (33170));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BYTE"), (5120));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_BYTE"), (5121));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SHORT"), (5122));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_SHORT"), (5123));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT"), (5124));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT"), (5125));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT"), (5126));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_COMPONENT"), (6402));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ALPHA"), (6406));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB"), (6407));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA"), (6408));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LUMINANCE"), (6409));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LUMINANCE_ALPHA"), (6410));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_SHORT_4_4_4_4"), (32819));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_SHORT_5_5_5_1"), (32820));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_SHORT_5_6_5"), (33635));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAGMENT_SHADER"), (35632));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_SHADER"), (35633));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VERTEX_ATTRIBS"), (34921));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VERTEX_UNIFORM_VECTORS"), (36347));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VARYING_VECTORS"), (36348));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_COMBINED_TEXTURE_IMAGE_UNITS"), (35661));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VERTEX_TEXTURE_IMAGE_UNITS"), (35660));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_TEXTURE_IMAGE_UNITS"), (34930));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_FRAGMENT_UNIFORM_VECTORS"), (36349));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SHADER_TYPE"), (35663));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DELETE_STATUS"), (35712));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINK_STATUS"), (35714));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VALIDATE_STATUS"), (35715));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ATTACHED_SHADERS"), (35717));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ACTIVE_UNIFORMS"), (35718));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ACTIVE_ATTRIBUTES"), (35721));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SHADING_LANGUAGE_VERSION"), (35724));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CURRENT_PROGRAM"), (35725));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NEVER"), (512));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LESS"), (513));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("EQUAL"), (514));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LEQUAL"), (515));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("GREATER"), (516));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NOTEQUAL"), (517));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("GEQUAL"), (518));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ALWAYS"), (519));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("KEEP"), (7680));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("REPLACE"), (7681));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INCR"), (7682));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DECR"), (7683));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INVERT"), (5386));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INCR_WRAP"), (34055));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DECR_WRAP"), (34056));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VENDOR"), (7936));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERER"), (7937));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERSION"), (7938));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NEAREST"), (9728));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINEAR"), (9729));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NEAREST_MIPMAP_NEAREST"), (9984));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINEAR_MIPMAP_NEAREST"), (9985));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NEAREST_MIPMAP_LINEAR"), (9986));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LINEAR_MIPMAP_LINEAR"), (9987));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_MAG_FILTER"), (10240));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_MIN_FILTER"), (10241));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_WRAP_S"), (10242));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_WRAP_T"), (10243));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE"), (5890));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_CUBE_MAP"), (34067));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_BINDING_CUBE_MAP"), (34068));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_CUBE_MAP_POSITIVE_X"), (34069));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_CUBE_MAP_NEGATIVE_X"), (34070));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_CUBE_MAP_POSITIVE_Y"), (34071));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_CUBE_MAP_NEGATIVE_Y"), (34072));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_CUBE_MAP_POSITIVE_Z"), (34073));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_CUBE_MAP_NEGATIVE_Z"), (34074));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_CUBE_MAP_TEXTURE_SIZE"), (34076));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE0"), (33984));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE1"), (33985));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE2"), (33986));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE3"), (33987));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE4"), (33988));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE5"), (33989));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE6"), (33990));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE7"), (33991));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE8"), (33992));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE9"), (33993));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE10"), (33994));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE11"), (33995));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE12"), (33996));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE13"), (33997));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE14"), (33998));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE15"), (33999));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE16"), (34000));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE17"), (34001));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE18"), (34002));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE19"), (34003));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE20"), (34004));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE21"), (34005));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE22"), (34006));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE23"), (34007));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE24"), (34008));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE25"), (34009));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE26"), (34010));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE27"), (34011));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE28"), (34012));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE29"), (34013));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE30"), (34014));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE31"), (34015));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ACTIVE_TEXTURE"), (34016));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("REPEAT"), (10497));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CLAMP_TO_EDGE"), (33071));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MIRRORED_REPEAT"), (33648));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_VEC2"), (35664));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_VEC3"), (35665));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_VEC4"), (35666));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_VEC2"), (35667));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_VEC3"), (35668));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_VEC4"), (35669));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BOOL"), (35670));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BOOL_VEC2"), (35671));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BOOL_VEC3"), (35672));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BOOL_VEC4"), (35673));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT2"), (35674));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT3"), (35675));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT4"), (35676));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_2D"), (35678));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_CUBE"), (35680));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_ENABLED"), (34338));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_SIZE"), (34339));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_STRIDE"), (34340));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_TYPE"), (34341));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_NORMALIZED"), (34922));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_POINTER"), (34373));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_BUFFER_BINDING"), (34975));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("IMPLEMENTATION_COLOR_READ_TYPE"), (35738));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("IMPLEMENTATION_COLOR_READ_FORMAT"), (35739));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COMPILE_STATUS"), (35713));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LOW_FLOAT"), (36336));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MEDIUM_FLOAT"), (36337));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("HIGH_FLOAT"), (36338));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("LOW_INT"), (36339));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MEDIUM_INT"), (36340));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("HIGH_INT"), (36341));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER"), (36160));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER"), (36161));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA4"), (32854));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB5_A1"), (32855));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB565"), (36194));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_COMPONENT16"), (33189));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_INDEX8"), (36168));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_STENCIL"), (34041));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_WIDTH"), (36162));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_HEIGHT"), (36163));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_INTERNAL_FORMAT"), (36164));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_RED_SIZE"), (36176));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_GREEN_SIZE"), (36177));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_BLUE_SIZE"), (36178));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_ALPHA_SIZE"), (36179));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_DEPTH_SIZE"), (36180));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_STENCIL_SIZE"), (36181));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE"), (36048));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_OBJECT_NAME"), (36049));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL"), (36050));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE"), (36051));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT0"), (36064));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_ATTACHMENT"), (36096));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL_ATTACHMENT"), (36128));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_STENCIL_ATTACHMENT"), (33306));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("NONE"), (0));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_COMPLETE"), (36053));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_INCOMPLETE_ATTACHMENT"), (36054));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"), (36055));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"), (36057));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_UNSUPPORTED"), (36061));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_BINDING"), (36006));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_BINDING"), (36007));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_RENDERBUFFER_SIZE"), (34024));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INVALID_FRAMEBUFFER_OPERATION"), (1286));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_FLIP_Y_WEBGL"), (37440));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_PREMULTIPLY_ALPHA_WEBGL"), (37441));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CONTEXT_LOST_WEBGL"), (37442));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_COLORSPACE_CONVERSION_WEBGL"), (37443));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("BROWSER_DEFAULT_WEBGL"), (37444));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("READ_BUFFER"), (3074));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_ROW_LENGTH"), (3314));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_SKIP_ROWS"), (3315));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_SKIP_PIXELS"), (3316));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PACK_ROW_LENGTH"), (3330));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PACK_SKIP_ROWS"), (3331));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PACK_SKIP_PIXELS"), (3332));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR"), (6144));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH"), (6145));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STENCIL"), (6146));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RED"), (6403));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB8"), (32849));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA8"), (32856));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB10_A2"), (32857));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_BINDING_3D"), (32874));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_SKIP_IMAGES"), (32877));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNPACK_IMAGE_HEIGHT"), (32878));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_3D"), (32879));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_WRAP_R"), (32882));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_3D_TEXTURE_SIZE"), (32883));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_2_10_10_10_REV"), (33640));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_ELEMENTS_VERTICES"), (33000));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_ELEMENTS_INDICES"), (33001));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_MIN_LOD"), (33082));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_MAX_LOD"), (33083));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_BASE_LEVEL"), (33084));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_MAX_LEVEL"), (33085));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MIN"), (32775));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX"), (32776));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_COMPONENT24"), (33190));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_TEXTURE_LOD_BIAS"), (34045));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_COMPARE_MODE"), (34892));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_COMPARE_FUNC"), (34893));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CURRENT_QUERY"), (34917));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("QUERY_RESULT"), (34918));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("QUERY_RESULT_AVAILABLE"), (34919));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STREAM_READ"), (35041));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STREAM_COPY"), (35042));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STATIC_READ"), (35045));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("STATIC_COPY"), (35046));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DYNAMIC_READ"), (35049));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DYNAMIC_COPY"), (35050));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_DRAW_BUFFERS"), (34852));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER0"), (34853));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER1"), (34854));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER2"), (34855));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER3"), (34856));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER4"), (34857));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER5"), (34858));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER6"), (34859));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER7"), (34860));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER8"), (34861));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER9"), (34862));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER10"), (34863));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER11"), (34864));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER12"), (34865));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER13"), (34866));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER14"), (34867));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_BUFFER15"), (34868));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_FRAGMENT_UNIFORM_COMPONENTS"), (35657));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VERTEX_UNIFORM_COMPONENTS"), (35658));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_3D"), (35679));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_2D_SHADOW"), (35682));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAGMENT_SHADER_DERIVATIVE_HINT"), (35723));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PIXEL_PACK_BUFFER"), (35051));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PIXEL_UNPACK_BUFFER"), (35052));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PIXEL_PACK_BUFFER_BINDING"), (35053));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("PIXEL_UNPACK_BUFFER_BINDING"), (35055));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT2x3"), (35685));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT2x4"), (35686));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT3x2"), (35687));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT3x4"), (35688));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT4x2"), (35689));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_MAT4x3"), (35690));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SRGB"), (35904));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SRGB8"), (35905));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SRGB8_ALPHA8"), (35907));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COMPARE_REF_TO_TEXTURE"), (34894));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA32F"), (34836));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB32F"), (34837));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA16F"), (34842));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB16F"), (34843));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_INTEGER"), (35069));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_ARRAY_TEXTURE_LAYERS"), (35071));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MIN_PROGRAM_TEXEL_OFFSET"), (35076));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_PROGRAM_TEXEL_OFFSET"), (35077));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VARYING_COMPONENTS"), (35659));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_2D_ARRAY"), (35866));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_BINDING_2D_ARRAY"), (35869));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R11F_G11F_B10F"), (35898));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_10F_11F_11F_REV"), (35899));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB9_E5"), (35901));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_5_9_9_9_REV"), (35902));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_BUFFER_MODE"), (35967));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS"), (35968));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_VARYINGS"), (35971));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_BUFFER_START"), (35972));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_BUFFER_SIZE"), (35973));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN"), (35976));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RASTERIZER_DISCARD"), (35977));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS"), (35978));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS"), (35979));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INTERLEAVED_ATTRIBS"), (35980));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SEPARATE_ATTRIBS"), (35981));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_BUFFER"), (35982));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_BUFFER_BINDING"), (35983));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA32UI"), (36208));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB32UI"), (36209));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA16UI"), (36214));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB16UI"), (36215));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA8UI"), (36220));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB8UI"), (36221));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA32I"), (36226));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB32I"), (36227));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA16I"), (36232));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB16I"), (36233));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA8I"), (36238));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB8I"), (36239));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RED_INTEGER"), (36244));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB_INTEGER"), (36248));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA_INTEGER"), (36249));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_2D_ARRAY"), (36289));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_2D_ARRAY_SHADOW"), (36292));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_CUBE_SHADOW"), (36293));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_VEC2"), (36294));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_VEC3"), (36295));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_VEC4"), (36296));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_SAMPLER_2D"), (36298));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_SAMPLER_3D"), (36299));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_SAMPLER_CUBE"), (36300));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_SAMPLER_2D_ARRAY"), (36303));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_SAMPLER_2D"), (36306));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_SAMPLER_3D"), (36307));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_SAMPLER_CUBE"), (36308));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_SAMPLER_2D_ARRAY"), (36311));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH_COMPONENT32F"), (36012));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH32F_STENCIL8"), (36013));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FLOAT_32_UNSIGNED_INT_24_8_REV"), (36269));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING"), (33296));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE"), (33297));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_RED_SIZE"), (33298));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_GREEN_SIZE"), (33299));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_BLUE_SIZE"), (33300));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE"), (33301));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE"), (33302));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE"), (33303));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_DEFAULT"), (33304));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_INT_24_8"), (34042));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DEPTH24_STENCIL8"), (35056));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNED_NORMALIZED"), (35863));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_FRAMEBUFFER_BINDING"), (36006));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("READ_FRAMEBUFFER"), (36008));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("DRAW_FRAMEBUFFER"), (36009));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("READ_FRAMEBUFFER_BINDING"), (36010));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RENDERBUFFER_SAMPLES"), (36011));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER"), (36052));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_COLOR_ATTACHMENTS"), (36063));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT1"), (36065));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT2"), (36066));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT3"), (36067));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT4"), (36068));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT5"), (36069));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT6"), (36070));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT7"), (36071));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT8"), (36072));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT9"), (36073));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT10"), (36074));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT11"), (36075));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT12"), (36076));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT13"), (36077));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT14"), (36078));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COLOR_ATTACHMENT15"), (36079));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"), (36182));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_SAMPLES"), (36183));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("HALF_FLOAT"), (5131));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG"), (33319));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG_INTEGER"), (33320));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R8"), (33321));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG8"), (33323));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R16F"), (33325));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R32F"), (33326));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG16F"), (33327));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG32F"), (33328));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R8I"), (33329));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R8UI"), (33330));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R16I"), (33331));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R16UI"), (33332));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R32I"), (33333));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R32UI"), (33334));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG8I"), (33335));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG8UI"), (33336));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG16I"), (33337));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG16UI"), (33338));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG32I"), (33339));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG32UI"), (33340));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ARRAY_BINDING"), (34229));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("R8_SNORM"), (36756));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RG8_SNORM"), (36757));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB8_SNORM"), (36758));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGBA8_SNORM"), (36759));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SIGNED_NORMALIZED"), (36764));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COPY_READ_BUFFER"), (36662));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COPY_WRITE_BUFFER"), (36663));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COPY_READ_BUFFER_BINDING"), (36662));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("COPY_WRITE_BUFFER_BINDING"), (36663));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BUFFER"), (35345));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BUFFER_BINDING"), (35368));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BUFFER_START"), (35369));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BUFFER_SIZE"), (35370));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VERTEX_UNIFORM_BLOCKS"), (35371));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_FRAGMENT_UNIFORM_BLOCKS"), (35373));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_COMBINED_UNIFORM_BLOCKS"), (35374));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_UNIFORM_BUFFER_BINDINGS"), (35375));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_UNIFORM_BLOCK_SIZE"), (35376));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS"), (35377));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS"), (35379));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BUFFER_OFFSET_ALIGNMENT"), (35380));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ACTIVE_UNIFORM_BLOCKS"), (35382));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_TYPE"), (35383));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_SIZE"), (35384));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BLOCK_INDEX"), (35386));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_OFFSET"), (35387));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_ARRAY_STRIDE"), (35388));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_MATRIX_STRIDE"), (35389));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_IS_ROW_MAJOR"), (35390));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BLOCK_BINDING"), (35391));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BLOCK_DATA_SIZE"), (35392));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BLOCK_ACTIVE_UNIFORMS"), (35394));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES"), (35395));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER"), (35396));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER"), (35398));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INVALID_INDEX"), (4294967295));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_VERTEX_OUTPUT_COMPONENTS"), (37154));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_FRAGMENT_INPUT_COMPONENTS"), (37157));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_SERVER_WAIT_TIMEOUT"), (37137));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("OBJECT_TYPE"), (37138));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SYNC_CONDITION"), (37139));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SYNC_STATUS"), (37140));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SYNC_FLAGS"), (37141));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SYNC_FENCE"), (37142));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SYNC_GPU_COMMANDS_COMPLETE"), (37143));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("UNSIGNALED"), (37144));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SIGNALED"), (37145));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ALREADY_SIGNALED"), (37146));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TIMEOUT_EXPIRED"), (37147));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("CONDITION_SATISFIED"), (37148));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("WAIT_FAILED"), (37149));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SYNC_FLUSH_COMMANDS_BIT"), (1));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("VERTEX_ATTRIB_ARRAY_DIVISOR"), (35070));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ANY_SAMPLES_PASSED"), (35887));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("ANY_SAMPLES_PASSED_CONSERVATIVE"), (36202));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("SAMPLER_BINDING"), (35097));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("RGB10_A2UI"), (36975));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("INT_2_10_10_10_REV"), (36255));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK"), (36386));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_PAUSED"), (36387));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_ACTIVE"), (36388));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TRANSFORM_FEEDBACK_BINDING"), (36389));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_IMMUTABLE_FORMAT"), (37167));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_ELEMENT_INDEX"), (36203));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TEXTURE_IMMUTABLE_LEVELS"), (33503));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("TIMEOUT_IGNORED"), (-1));
    }
  } while (false);
do {
    {
      defineConstant((WebGL2RenderingContext).prototype, ("MAX_CLIENT_WAIT_TIMEOUT_WEBGL"), (37447));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("activeTexture"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("attachShader"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("beginQuery"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("beginTransformFeedback"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindAttribLocation"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindBufferBase"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindBufferRange"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindRenderbuffer"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindSampler"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindTransformFeedback"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindVertexArray"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("blendColor"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("blendEquation"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("blendEquationSeparate"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("blendFunc"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("blendFuncSeparate"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("blitFramebuffer"), (10));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bufferData"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bufferSubData"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("checkFramebufferStatus"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clientWaitSync"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("compileShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("compressedTexImage2D"), (7));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("compressedTexImage3D"), (8));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("compressedTexSubImage2D"), (8));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("compressedTexSubImage3D"), (10));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("copyBufferSubData"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("copyTexImage2D"), (8));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("copyTexSubImage2D"), (8));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("copyTexSubImage3D"), (9));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createBuffer"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createFramebuffer"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createProgram"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createQuery"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createRenderbuffer"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createSampler"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createTexture"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createTransformFeedback"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("createVertexArray"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("cullFace"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteBuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteFramebuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteQuery"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteRenderbuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteSampler"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteSync"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteTexture"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteTransformFeedback"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("deleteVertexArray"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("depthFunc"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("depthMask"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("depthRange"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("detachShader"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("disable"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("drawArraysInstanced"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("drawElementsInstanced"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("drawRangeElements"), (6));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("enable"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("endQuery"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("endTransformFeedback"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("fenceSync"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("finish"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("flush"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("framebufferRenderbuffer"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("framebufferTexture2D"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("framebufferTextureLayer"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("frontFace"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("generateMipmap"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getActiveAttrib"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getActiveUniform"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getActiveUniformBlockName"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getActiveUniformBlockParameter"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getActiveUniforms"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getAttachedShaders"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getAttribLocation"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getBufferParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getBufferSubData"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getContextAttributes"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getError"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getExtension"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getFragDataLocation"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getFramebufferAttachmentParameter"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getIndexedParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getInternalformatParameter"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getParameter"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getProgramInfoLog"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getProgramParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getQuery"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getQueryParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getRenderbufferParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getSamplerParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getShaderInfoLog"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getShaderParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getShaderPrecisionFormat"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getShaderSource"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getSupportedExtensions"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getSyncParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getTexParameter"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getTransformFeedbackVarying"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getUniform"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getUniformBlockIndex"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getUniformIndices"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getUniformLocation"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getVertexAttrib"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("getVertexAttribOffset"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("hint"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("invalidateFramebuffer"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("invalidateSubFramebuffer"), (6));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isBuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isContextLost"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isEnabled"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isFramebuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isQuery"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isRenderbuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isSampler"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isShader"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isSync"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isTexture"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isTransformFeedback"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("isVertexArray"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("lineWidth"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("linkProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("pauseTransformFeedback"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("pixelStorei"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("polygonOffset"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("readBuffer"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("readPixels"), (7));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("renderbufferStorage"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("renderbufferStorageMultisample"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("resumeTransformFeedback"), (0));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("sampleCoverage"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("samplerParameterf"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("samplerParameteri"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("shaderSource"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("stencilFunc"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("stencilFuncSeparate"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("stencilMask"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("stencilMaskSeparate"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("stencilOp"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("stencilOpSeparate"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texImage2D"), (6));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texImage3D"), (10));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texParameterf"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texParameteri"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texStorage2D"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texStorage3D"), (6));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texSubImage2D"), (7));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("texSubImage3D"), (11));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("transformFeedbackVaryings"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform1ui"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform2ui"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform3ui"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform4ui"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformBlockBinding"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("useProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("validateProgram"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttribDivisor"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttribI4i"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttribI4ui"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttribIPointer"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("waitSync"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindBuffer"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindFramebuffer"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("bindTexture"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clear"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clearBufferfi"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clearBufferfv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clearBufferiv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clearBufferuiv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clearColor"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clearDepth"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("clearStencil"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("colorMask"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("disableVertexAttribArray"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("drawArrays"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("drawBuffers"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("drawElements"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("enableVertexAttribArray"), (1));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("scissor"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform1f"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform1fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform1i"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform1iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform1uiv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform2f"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform2fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform2i"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform2iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform2uiv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform3f"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform3fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform3i"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform3iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform3uiv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform4f"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform4fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform4i"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform4iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniform4uiv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix2fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix2x3fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix2x4fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix3fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix3x2fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix3x4fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix4fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix4x2fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("uniformMatrix4x3fv"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib1f"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib1fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib2f"), (3));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib2fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib3f"), (4));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib3fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib4f"), (5));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttrib4fv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttribI4iv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttribI4uiv"), (2));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("vertexAttribPointer"), (6));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("viewport"), (4));
    }
  } while (false);
do {
    {
      installContextAccessor((WebGL2RenderingContext), ("drawingBufferFormat"));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("drawingBufferStorage"), (3));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((WebGL2RenderingContext).prototype, (WebGL2RenderingContext));
    }
  } while (false);
do {
    {
      installContextMethod((WebGL2RenderingContext), ("makeXRCompatible"), (0));
    }
  } while (false);
do {
    {
      defineToStringTag((WebGL2RenderingContext).prototype, (WebGL2RenderingContext).name);
    }
  } while (false);
  do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_BUFFER_BIT"), (256));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BUFFER_BIT"), (1024));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_BUFFER_BIT"), (16384));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("POINTS"), (0));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINES"), (1));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINE_LOOP"), (2));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINE_STRIP"), (3));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRIANGLES"), (4));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRIANGLE_STRIP"), (5));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRIANGLE_FAN"), (6));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ZERO"), (0));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ONE"), (1));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SRC_COLOR"), (768));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ONE_MINUS_SRC_COLOR"), (769));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SRC_ALPHA"), (770));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ONE_MINUS_SRC_ALPHA"), (771));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DST_ALPHA"), (772));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ONE_MINUS_DST_ALPHA"), (773));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DST_COLOR"), (774));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ONE_MINUS_DST_COLOR"), (775));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SRC_ALPHA_SATURATE"), (776));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FUNC_ADD"), (32774));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_EQUATION"), (32777));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_EQUATION_RGB"), (32777));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_EQUATION_ALPHA"), (34877));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FUNC_SUBTRACT"), (32778));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FUNC_REVERSE_SUBTRACT"), (32779));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_DST_RGB"), (32968));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_SRC_RGB"), (32969));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_DST_ALPHA"), (32970));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_SRC_ALPHA"), (32971));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CONSTANT_COLOR"), (32769));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ONE_MINUS_CONSTANT_COLOR"), (32770));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CONSTANT_ALPHA"), (32771));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ONE_MINUS_CONSTANT_ALPHA"), (32772));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND_COLOR"), (32773));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ARRAY_BUFFER"), (34962));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ELEMENT_ARRAY_BUFFER"), (34963));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ARRAY_BUFFER_BINDING"), (34964));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ELEMENT_ARRAY_BUFFER_BINDING"), (34965));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STREAM_DRAW"), (35040));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STATIC_DRAW"), (35044));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DYNAMIC_DRAW"), (35048));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BUFFER_SIZE"), (34660));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BUFFER_USAGE"), (34661));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CURRENT_VERTEX_ATTRIB"), (34342));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRONT"), (1028));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BACK"), (1029));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRONT_AND_BACK"), (1032));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_2D"), (3553));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CULL_FACE"), (2884));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLEND"), (3042));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DITHER"), (3024));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_TEST"), (2960));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_TEST"), (2929));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SCISSOR_TEST"), (3089));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("POLYGON_OFFSET_FILL"), (32823));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLE_ALPHA_TO_COVERAGE"), (32926));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLE_COVERAGE"), (32928));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NO_ERROR"), (0));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INVALID_ENUM"), (1280));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INVALID_VALUE"), (1281));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INVALID_OPERATION"), (1282));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("OUT_OF_MEMORY"), (1285));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CW"), (2304));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CCW"), (2305));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINE_WIDTH"), (2849));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ALIASED_POINT_SIZE_RANGE"), (33901));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ALIASED_LINE_WIDTH_RANGE"), (33902));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CULL_FACE_MODE"), (2885));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRONT_FACE"), (2886));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_RANGE"), (2928));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_WRITEMASK"), (2930));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_CLEAR_VALUE"), (2931));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_FUNC"), (2932));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_CLEAR_VALUE"), (2961));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_FUNC"), (2962));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_FAIL"), (2964));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_PASS_DEPTH_FAIL"), (2965));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_PASS_DEPTH_PASS"), (2966));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_REF"), (2967));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_VALUE_MASK"), (2963));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_WRITEMASK"), (2968));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BACK_FUNC"), (34816));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BACK_FAIL"), (34817));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BACK_PASS_DEPTH_FAIL"), (34818));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BACK_PASS_DEPTH_PASS"), (34819));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BACK_REF"), (36003));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BACK_VALUE_MASK"), (36004));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BACK_WRITEMASK"), (36005));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VIEWPORT"), (2978));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SCISSOR_BOX"), (3088));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_CLEAR_VALUE"), (3106));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_WRITEMASK"), (3107));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_ALIGNMENT"), (3317));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PACK_ALIGNMENT"), (3333));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_TEXTURE_SIZE"), (3379));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VIEWPORT_DIMS"), (3386));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SUBPIXEL_BITS"), (3408));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RED_BITS"), (3410));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("GREEN_BITS"), (3411));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BLUE_BITS"), (3412));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ALPHA_BITS"), (3413));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_BITS"), (3414));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_BITS"), (3415));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("POLYGON_OFFSET_UNITS"), (10752));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("POLYGON_OFFSET_FACTOR"), (32824));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_BINDING_2D"), (32873));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLE_BUFFERS"), (32936));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLES"), (32937));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLE_COVERAGE_VALUE"), (32938));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLE_COVERAGE_INVERT"), (32939));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COMPRESSED_TEXTURE_FORMATS"), (34467));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DONT_CARE"), (4352));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FASTEST"), (4353));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NICEST"), (4354));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("GENERATE_MIPMAP_HINT"), (33170));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BYTE"), (5120));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_BYTE"), (5121));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SHORT"), (5122));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_SHORT"), (5123));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT"), (5124));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT"), (5125));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT"), (5126));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_COMPONENT"), (6402));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ALPHA"), (6406));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB"), (6407));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA"), (6408));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LUMINANCE"), (6409));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LUMINANCE_ALPHA"), (6410));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_SHORT_4_4_4_4"), (32819));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_SHORT_5_5_5_1"), (32820));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_SHORT_5_6_5"), (33635));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAGMENT_SHADER"), (35632));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_SHADER"), (35633));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VERTEX_ATTRIBS"), (34921));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VERTEX_UNIFORM_VECTORS"), (36347));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VARYING_VECTORS"), (36348));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_COMBINED_TEXTURE_IMAGE_UNITS"), (35661));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VERTEX_TEXTURE_IMAGE_UNITS"), (35660));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_TEXTURE_IMAGE_UNITS"), (34930));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_FRAGMENT_UNIFORM_VECTORS"), (36349));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SHADER_TYPE"), (35663));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DELETE_STATUS"), (35712));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINK_STATUS"), (35714));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VALIDATE_STATUS"), (35715));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ATTACHED_SHADERS"), (35717));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ACTIVE_UNIFORMS"), (35718));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ACTIVE_ATTRIBUTES"), (35721));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SHADING_LANGUAGE_VERSION"), (35724));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CURRENT_PROGRAM"), (35725));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NEVER"), (512));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LESS"), (513));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("EQUAL"), (514));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LEQUAL"), (515));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("GREATER"), (516));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NOTEQUAL"), (517));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("GEQUAL"), (518));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ALWAYS"), (519));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("KEEP"), (7680));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("REPLACE"), (7681));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INCR"), (7682));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DECR"), (7683));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INVERT"), (5386));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INCR_WRAP"), (34055));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DECR_WRAP"), (34056));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VENDOR"), (7936));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERER"), (7937));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERSION"), (7938));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NEAREST"), (9728));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINEAR"), (9729));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NEAREST_MIPMAP_NEAREST"), (9984));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINEAR_MIPMAP_NEAREST"), (9985));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NEAREST_MIPMAP_LINEAR"), (9986));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LINEAR_MIPMAP_LINEAR"), (9987));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_MAG_FILTER"), (10240));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_MIN_FILTER"), (10241));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_WRAP_S"), (10242));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_WRAP_T"), (10243));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE"), (5890));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_CUBE_MAP"), (34067));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_BINDING_CUBE_MAP"), (34068));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_CUBE_MAP_POSITIVE_X"), (34069));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_CUBE_MAP_NEGATIVE_X"), (34070));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_CUBE_MAP_POSITIVE_Y"), (34071));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_CUBE_MAP_NEGATIVE_Y"), (34072));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_CUBE_MAP_POSITIVE_Z"), (34073));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_CUBE_MAP_NEGATIVE_Z"), (34074));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_CUBE_MAP_TEXTURE_SIZE"), (34076));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE0"), (33984));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE1"), (33985));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE2"), (33986));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE3"), (33987));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE4"), (33988));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE5"), (33989));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE6"), (33990));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE7"), (33991));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE8"), (33992));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE9"), (33993));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE10"), (33994));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE11"), (33995));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE12"), (33996));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE13"), (33997));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE14"), (33998));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE15"), (33999));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE16"), (34000));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE17"), (34001));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE18"), (34002));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE19"), (34003));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE20"), (34004));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE21"), (34005));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE22"), (34006));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE23"), (34007));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE24"), (34008));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE25"), (34009));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE26"), (34010));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE27"), (34011));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE28"), (34012));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE29"), (34013));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE30"), (34014));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE31"), (34015));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ACTIVE_TEXTURE"), (34016));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("REPEAT"), (10497));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CLAMP_TO_EDGE"), (33071));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MIRRORED_REPEAT"), (33648));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_VEC2"), (35664));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_VEC3"), (35665));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_VEC4"), (35666));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_VEC2"), (35667));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_VEC3"), (35668));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_VEC4"), (35669));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BOOL"), (35670));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BOOL_VEC2"), (35671));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BOOL_VEC3"), (35672));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BOOL_VEC4"), (35673));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT2"), (35674));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT3"), (35675));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT4"), (35676));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_2D"), (35678));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_CUBE"), (35680));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_ENABLED"), (34338));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_SIZE"), (34339));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_STRIDE"), (34340));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_TYPE"), (34341));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_NORMALIZED"), (34922));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_POINTER"), (34373));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_BUFFER_BINDING"), (34975));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("IMPLEMENTATION_COLOR_READ_TYPE"), (35738));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("IMPLEMENTATION_COLOR_READ_FORMAT"), (35739));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COMPILE_STATUS"), (35713));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LOW_FLOAT"), (36336));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MEDIUM_FLOAT"), (36337));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("HIGH_FLOAT"), (36338));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("LOW_INT"), (36339));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MEDIUM_INT"), (36340));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("HIGH_INT"), (36341));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER"), (36160));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER"), (36161));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA4"), (32854));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB5_A1"), (32855));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB565"), (36194));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_COMPONENT16"), (33189));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_INDEX8"), (36168));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_STENCIL"), (34041));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_WIDTH"), (36162));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_HEIGHT"), (36163));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_INTERNAL_FORMAT"), (36164));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_RED_SIZE"), (36176));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_GREEN_SIZE"), (36177));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_BLUE_SIZE"), (36178));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_ALPHA_SIZE"), (36179));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_DEPTH_SIZE"), (36180));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_STENCIL_SIZE"), (36181));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE"), (36048));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_OBJECT_NAME"), (36049));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL"), (36050));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE"), (36051));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT0"), (36064));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_ATTACHMENT"), (36096));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL_ATTACHMENT"), (36128));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_STENCIL_ATTACHMENT"), (33306));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("NONE"), (0));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_COMPLETE"), (36053));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_INCOMPLETE_ATTACHMENT"), (36054));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"), (36055));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"), (36057));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_UNSUPPORTED"), (36061));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_BINDING"), (36006));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_BINDING"), (36007));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_RENDERBUFFER_SIZE"), (34024));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INVALID_FRAMEBUFFER_OPERATION"), (1286));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_FLIP_Y_WEBGL"), (37440));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_PREMULTIPLY_ALPHA_WEBGL"), (37441));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CONTEXT_LOST_WEBGL"), (37442));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_COLORSPACE_CONVERSION_WEBGL"), (37443));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("BROWSER_DEFAULT_WEBGL"), (37444));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("READ_BUFFER"), (3074));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_ROW_LENGTH"), (3314));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_SKIP_ROWS"), (3315));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_SKIP_PIXELS"), (3316));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PACK_ROW_LENGTH"), (3330));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PACK_SKIP_ROWS"), (3331));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PACK_SKIP_PIXELS"), (3332));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR"), (6144));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH"), (6145));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STENCIL"), (6146));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RED"), (6403));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB8"), (32849));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA8"), (32856));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB10_A2"), (32857));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_BINDING_3D"), (32874));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_SKIP_IMAGES"), (32877));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNPACK_IMAGE_HEIGHT"), (32878));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_3D"), (32879));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_WRAP_R"), (32882));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_3D_TEXTURE_SIZE"), (32883));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_2_10_10_10_REV"), (33640));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_ELEMENTS_VERTICES"), (33000));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_ELEMENTS_INDICES"), (33001));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_MIN_LOD"), (33082));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_MAX_LOD"), (33083));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_BASE_LEVEL"), (33084));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_MAX_LEVEL"), (33085));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MIN"), (32775));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX"), (32776));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_COMPONENT24"), (33190));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_TEXTURE_LOD_BIAS"), (34045));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_COMPARE_MODE"), (34892));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_COMPARE_FUNC"), (34893));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CURRENT_QUERY"), (34917));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("QUERY_RESULT"), (34918));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("QUERY_RESULT_AVAILABLE"), (34919));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STREAM_READ"), (35041));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STREAM_COPY"), (35042));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STATIC_READ"), (35045));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("STATIC_COPY"), (35046));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DYNAMIC_READ"), (35049));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DYNAMIC_COPY"), (35050));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_DRAW_BUFFERS"), (34852));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER0"), (34853));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER1"), (34854));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER2"), (34855));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER3"), (34856));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER4"), (34857));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER5"), (34858));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER6"), (34859));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER7"), (34860));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER8"), (34861));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER9"), (34862));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER10"), (34863));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER11"), (34864));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER12"), (34865));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER13"), (34866));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER14"), (34867));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_BUFFER15"), (34868));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_FRAGMENT_UNIFORM_COMPONENTS"), (35657));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VERTEX_UNIFORM_COMPONENTS"), (35658));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_3D"), (35679));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_2D_SHADOW"), (35682));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAGMENT_SHADER_DERIVATIVE_HINT"), (35723));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PIXEL_PACK_BUFFER"), (35051));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PIXEL_UNPACK_BUFFER"), (35052));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PIXEL_PACK_BUFFER_BINDING"), (35053));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("PIXEL_UNPACK_BUFFER_BINDING"), (35055));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT2x3"), (35685));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT2x4"), (35686));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT3x2"), (35687));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT3x4"), (35688));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT4x2"), (35689));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_MAT4x3"), (35690));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SRGB"), (35904));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SRGB8"), (35905));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SRGB8_ALPHA8"), (35907));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COMPARE_REF_TO_TEXTURE"), (34894));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA32F"), (34836));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB32F"), (34837));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA16F"), (34842));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB16F"), (34843));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_INTEGER"), (35069));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_ARRAY_TEXTURE_LAYERS"), (35071));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MIN_PROGRAM_TEXEL_OFFSET"), (35076));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_PROGRAM_TEXEL_OFFSET"), (35077));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VARYING_COMPONENTS"), (35659));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_2D_ARRAY"), (35866));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_BINDING_2D_ARRAY"), (35869));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R11F_G11F_B10F"), (35898));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_10F_11F_11F_REV"), (35899));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB9_E5"), (35901));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_5_9_9_9_REV"), (35902));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_BUFFER_MODE"), (35967));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS"), (35968));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_VARYINGS"), (35971));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_BUFFER_START"), (35972));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_BUFFER_SIZE"), (35973));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN"), (35976));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RASTERIZER_DISCARD"), (35977));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS"), (35978));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS"), (35979));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INTERLEAVED_ATTRIBS"), (35980));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SEPARATE_ATTRIBS"), (35981));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_BUFFER"), (35982));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_BUFFER_BINDING"), (35983));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA32UI"), (36208));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB32UI"), (36209));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA16UI"), (36214));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB16UI"), (36215));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA8UI"), (36220));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB8UI"), (36221));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA32I"), (36226));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB32I"), (36227));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA16I"), (36232));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB16I"), (36233));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA8I"), (36238));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB8I"), (36239));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RED_INTEGER"), (36244));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB_INTEGER"), (36248));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA_INTEGER"), (36249));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_2D_ARRAY"), (36289));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_2D_ARRAY_SHADOW"), (36292));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_CUBE_SHADOW"), (36293));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_VEC2"), (36294));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_VEC3"), (36295));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_VEC4"), (36296));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_SAMPLER_2D"), (36298));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_SAMPLER_3D"), (36299));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_SAMPLER_CUBE"), (36300));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_SAMPLER_2D_ARRAY"), (36303));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_SAMPLER_2D"), (36306));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_SAMPLER_3D"), (36307));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_SAMPLER_CUBE"), (36308));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_SAMPLER_2D_ARRAY"), (36311));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH_COMPONENT32F"), (36012));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH32F_STENCIL8"), (36013));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FLOAT_32_UNSIGNED_INT_24_8_REV"), (36269));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING"), (33296));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE"), (33297));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_RED_SIZE"), (33298));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_GREEN_SIZE"), (33299));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_BLUE_SIZE"), (33300));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE"), (33301));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE"), (33302));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE"), (33303));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_DEFAULT"), (33304));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_INT_24_8"), (34042));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DEPTH24_STENCIL8"), (35056));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNED_NORMALIZED"), (35863));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_FRAMEBUFFER_BINDING"), (36006));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("READ_FRAMEBUFFER"), (36008));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("DRAW_FRAMEBUFFER"), (36009));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("READ_FRAMEBUFFER_BINDING"), (36010));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RENDERBUFFER_SAMPLES"), (36011));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER"), (36052));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_COLOR_ATTACHMENTS"), (36063));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT1"), (36065));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT2"), (36066));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT3"), (36067));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT4"), (36068));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT5"), (36069));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT6"), (36070));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT7"), (36071));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT8"), (36072));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT9"), (36073));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT10"), (36074));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT11"), (36075));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT12"), (36076));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT13"), (36077));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT14"), (36078));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COLOR_ATTACHMENT15"), (36079));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"), (36182));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_SAMPLES"), (36183));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("HALF_FLOAT"), (5131));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG"), (33319));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG_INTEGER"), (33320));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R8"), (33321));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG8"), (33323));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R16F"), (33325));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R32F"), (33326));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG16F"), (33327));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG32F"), (33328));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R8I"), (33329));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R8UI"), (33330));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R16I"), (33331));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R16UI"), (33332));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R32I"), (33333));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R32UI"), (33334));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG8I"), (33335));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG8UI"), (33336));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG16I"), (33337));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG16UI"), (33338));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG32I"), (33339));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG32UI"), (33340));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ARRAY_BINDING"), (34229));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("R8_SNORM"), (36756));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RG8_SNORM"), (36757));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB8_SNORM"), (36758));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGBA8_SNORM"), (36759));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SIGNED_NORMALIZED"), (36764));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COPY_READ_BUFFER"), (36662));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COPY_WRITE_BUFFER"), (36663));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COPY_READ_BUFFER_BINDING"), (36662));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("COPY_WRITE_BUFFER_BINDING"), (36663));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BUFFER"), (35345));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BUFFER_BINDING"), (35368));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BUFFER_START"), (35369));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BUFFER_SIZE"), (35370));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VERTEX_UNIFORM_BLOCKS"), (35371));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_FRAGMENT_UNIFORM_BLOCKS"), (35373));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_COMBINED_UNIFORM_BLOCKS"), (35374));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_UNIFORM_BUFFER_BINDINGS"), (35375));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_UNIFORM_BLOCK_SIZE"), (35376));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS"), (35377));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS"), (35379));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BUFFER_OFFSET_ALIGNMENT"), (35380));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ACTIVE_UNIFORM_BLOCKS"), (35382));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_TYPE"), (35383));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_SIZE"), (35384));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BLOCK_INDEX"), (35386));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_OFFSET"), (35387));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_ARRAY_STRIDE"), (35388));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_MATRIX_STRIDE"), (35389));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_IS_ROW_MAJOR"), (35390));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BLOCK_BINDING"), (35391));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BLOCK_DATA_SIZE"), (35392));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BLOCK_ACTIVE_UNIFORMS"), (35394));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES"), (35395));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER"), (35396));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER"), (35398));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INVALID_INDEX"), (4294967295));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_VERTEX_OUTPUT_COMPONENTS"), (37154));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_FRAGMENT_INPUT_COMPONENTS"), (37157));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_SERVER_WAIT_TIMEOUT"), (37137));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("OBJECT_TYPE"), (37138));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SYNC_CONDITION"), (37139));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SYNC_STATUS"), (37140));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SYNC_FLAGS"), (37141));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SYNC_FENCE"), (37142));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SYNC_GPU_COMMANDS_COMPLETE"), (37143));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("UNSIGNALED"), (37144));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SIGNALED"), (37145));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ALREADY_SIGNALED"), (37146));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TIMEOUT_EXPIRED"), (37147));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("CONDITION_SATISFIED"), (37148));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("WAIT_FAILED"), (37149));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SYNC_FLUSH_COMMANDS_BIT"), (1));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("VERTEX_ATTRIB_ARRAY_DIVISOR"), (35070));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ANY_SAMPLES_PASSED"), (35887));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("ANY_SAMPLES_PASSED_CONSERVATIVE"), (36202));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("SAMPLER_BINDING"), (35097));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("RGB10_A2UI"), (36975));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("INT_2_10_10_10_REV"), (36255));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK"), (36386));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_PAUSED"), (36387));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_ACTIVE"), (36388));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TRANSFORM_FEEDBACK_BINDING"), (36389));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_IMMUTABLE_FORMAT"), (37167));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_ELEMENT_INDEX"), (36203));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TEXTURE_IMMUTABLE_LEVELS"), (33503));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("TIMEOUT_IGNORED"), (-1));
  } while (false);
do {
    defineConstant((WebGL2RenderingContext), ("MAX_CLIENT_WAIT_TIMEOUT_WEBGL"), (37447));
  } while (false);
}
  finish(WebGLObject);
  do {
    
  } while (false);
do {
    finish((((resourceConstructors)[1])));
  } while (false);
do {
    finish((((resourceConstructors)[2])));
  } while (false);
do {
    finish((((resourceConstructors)[3])));
  } while (false);
do {
    finish((((resourceConstructors)[4])));
  } while (false);
do {
    finish((((resourceConstructors)[5])));
  } while (false);
do {
    finish((((resourceConstructors)[6])));
  } while (false);
do {
    finish((((resourceConstructors)[7])));
  } while (false);
do {
    finish((((resourceConstructors)[8])));
  } while (false);
do {
    finish((((resourceConstructors)[9])));
  } while (false);
do {
    finish((((resourceConstructors)[10])));
  } while (false);
do {
    finish((((resourceConstructors)[11])));
  } while (false);
do {
    finish((((resourceConstructors)[12])));
  } while (false);
  {
  do {
    const getter = {
      [`get ${("size")}`]() {
        return webglValueProperty(this, ("size"), ("activeInfo"));
      },
    }[`get ${("size")}`];
    registerNativeGetter(getter, ("size"));
    definePrototypeGetter((WebGLActiveInfo).prototype, ("size"), getter);
  } while (false);
do {
    const getter = {
      [`get ${("type")}`]() {
        return webglValueProperty(this, ("type"), ("activeInfo"));
      },
    }[`get ${("type")}`];
    registerNativeGetter(getter, ("type"));
    definePrototypeGetter((WebGLActiveInfo).prototype, ("type"), getter);
  } while (false);
do {
    const getter = {
      [`get ${("name")}`]() {
        return webglValueProperty(this, ("name"), ("activeInfo"));
      },
    }[`get ${("name")}`];
    registerNativeGetter(getter, ("name"));
    definePrototypeGetter((WebGLActiveInfo).prototype, ("name"), getter);
  } while (false);
  finish((WebGLActiveInfo));
}
  {
  do {
    const getter = {
      [`get ${("rangeMin")}`]() {
        return webglValueProperty(this, ("rangeMin"), ("precisionFormat"));
      },
    }[`get ${("rangeMin")}`];
    registerNativeGetter(getter, ("rangeMin"));
    definePrototypeGetter((WebGLShaderPrecisionFormat).prototype, ("rangeMin"), getter);
  } while (false);
do {
    const getter = {
      [`get ${("rangeMax")}`]() {
        return webglValueProperty(this, ("rangeMax"), ("precisionFormat"));
      },
    }[`get ${("rangeMax")}`];
    registerNativeGetter(getter, ("rangeMax"));
    definePrototypeGetter((WebGLShaderPrecisionFormat).prototype, ("rangeMax"), getter);
  } while (false);
do {
    const getter = {
      [`get ${("precision")}`]() {
        return webglValueProperty(this, ("precision"), ("precisionFormat"));
      },
    }[`get ${("precision")}`];
    registerNativeGetter(getter, ("precision"));
    definePrototypeGetter((WebGLShaderPrecisionFormat).prototype, ("precision"), getter);
  } while (false);
  finish((WebGLShaderPrecisionFormat));
}
  {
  do {
    const getter = {
      [`get ${("statusMessage")}`]() {
        return webglValueProperty(this, ("statusMessage"), ("contextEvent"));
      },
    }[`get ${("statusMessage")}`];
    registerNativeGetter(getter, ("statusMessage"));
    definePrototypeGetter((WebGLContextEvent).prototype, ("statusMessage"), getter);
  } while (false);
  finish((WebGLContextEvent));
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
