import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const pictureInPictureElement = Object.getOwnPropertyDescriptor({
  get pictureInPictureElement() {
    requireShadowRoot(this);
    const result = null;
    traceGetter(
      "window.ShadowRoot.prototype.pictureInPictureElement",
      "ShadowRoot",
      result,
    );
    return result;
  },
}, "pictureInPictureElement").get;
registerNativeGetter(pictureInPictureElement, "pictureInPictureElement");
