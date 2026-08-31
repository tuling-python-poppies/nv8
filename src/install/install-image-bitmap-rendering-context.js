import {
  canvas,
  ImageBitmapRenderingContext,
  transferFromImageBitmap,
} from "../api/canvas/image-bitmap-rendering-context-runtime.js";
import {
  IMAGE_BITMAP_RENDERING_CONTEXT_SURFACE,
} from "../api/canvas/image-bitmap-rendering-context-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";

const implementations = Object.freeze({
  canvas,
  transferFromImageBitmap,
});

export function installImageBitmapRenderingContext() {
  delete ImageBitmapRenderingContext.prototype.constructor;
  defineGlobalConstructor(
    "ImageBitmapRenderingContext",
    ImageBitmapRenderingContext,
  );
  do {
    {
      definePrototypeGetter(
        ImageBitmapRenderingContext.prototype,
        ("canvas"),
        implementations[("canvas")],
      );
    }
  } while (false);
do {
    {
      definePrototypeMethod(
        ImageBitmapRenderingContext.prototype,
        ("transferFromImageBitmap"),
        implementations[("transferFromImageBitmap")],
      );
    }
  } while (false);
do {
    {
      defineConstructorBacklink(
        ImageBitmapRenderingContext.prototype,
        ImageBitmapRenderingContext,
      );
    }
  } while (false);
do {
    {
      defineToStringTag(
        ImageBitmapRenderingContext.prototype,
        "ImageBitmapRenderingContext",
      );
    }
  } while (false);
}
