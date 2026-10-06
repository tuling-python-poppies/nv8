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
} from "../../engine/webidl/descriptor.js";

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

    {
      definePrototypeGetter(
        ImageBitmapRenderingContext.prototype,
        ("canvas"),
        implementations["canvas"],
      );
    }

    {
      definePrototypeMethod(
        ImageBitmapRenderingContext.prototype,
        ("transferFromImageBitmap"),
        implementations["transferFromImageBitmap"],
      );
    }

    {
      defineConstructorBacklink(
        ImageBitmapRenderingContext.prototype,
        ImageBitmapRenderingContext,
      );
    }

    {
      defineToStringTag(
        ImageBitmapRenderingContext.prototype,
        "ImageBitmapRenderingContext",
      );
    }

}
