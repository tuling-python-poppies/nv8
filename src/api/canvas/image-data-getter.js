import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireImageData } from "./image-data-state.js";

export function imageDataGetter(propertyName) {
  const getter = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      const result = requireImageData(this)[propertyName];
      traceGetter(
        `window.ImageData.prototype.${propertyName}`,
        "ImageData",
        result,
      );
      return result;
    },
  }, propertyName).get;
  registerNativeGetter(getter, propertyName);
  return getter;
}
