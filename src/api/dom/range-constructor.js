import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { traceConstruct } from "../../trace/trace-function.js";
import { AbstractRange } from "./abstract-range-constructor.js";
import { initializeRange } from "./range-state.js";

export function Range() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'Range': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  initializeRange(this);
  traceConstruct("window.Range", [], "Range");
}
registerNativeFunction(Range, "Range");

export function createRange(document) {
  const range = Object.create(Range.prototype);
  initializeRange(range, document);
  return range;
}

export function installRangeConstructor() {
  Object.setPrototypeOf(Range.prototype, AbstractRange.prototype);
  Object.setPrototypeOf(Range, AbstractRange);
  delete Range.prototype.constructor;
  defineRangeConstants(Range);
  defineGlobalConstructor("Range", Range);
}

export function installRangePrototypeConstants() {
  defineRangeConstants(Range.prototype);
}

export function finishRangeConstructor() {
  defineConstructorBacklink(Range.prototype, Range);
  defineToStringTag(Range.prototype, "Range");
}

function defineRangeConstants(object) {
  for (const [name, value] of [
    ["START_TO_START", 0],
    ["START_TO_END", 1],
    ["END_TO_END", 2],
    ["END_TO_START", 3],
  ]) {
    Object.defineProperty(object, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }
}
