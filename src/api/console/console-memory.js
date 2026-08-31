import { jsHeapSizeLimit } from "./console-memory-limit-getter.js";
import { initializeMemoryInfo } from "./console-memory-state.js";
import { totalJSHeapSize } from "./console-memory-total-getter.js";
import { usedJSHeapSize } from "./console-memory-used-getter.js";

export function createMemoryInfo() {
  const prototype = {};
  Object.defineProperty(prototype, "totalJSHeapSize", {
    get: totalJSHeapSize,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(prototype, "usedJSHeapSize", {
    get: usedJSHeapSize,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(prototype, "jsHeapSizeLimit", {
    get: jsHeapSizeLimit,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(prototype, Symbol.toStringTag, {
    value: "MemoryInfo",
    configurable: true,
  });
  const value = Object.create(prototype);
  initializeMemoryInfo(value);
  return value;
}
