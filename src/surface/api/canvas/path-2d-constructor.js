import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializePath2D, isPath2D, requirePath2D } from "./path-2d-state.js";

export function Path2D() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'Path2D': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  const source = arguments[0];
  const commands = source === undefined
    ? []
    : isPath2D(source)
      ? requirePath2D(source)
      : [["source", `${source}`]];
  initializePath2D(this, commands);
  traceConstruct(
    "window.Path2D",
    source === undefined ? [] : [source],
    "Path2D",
  );
}
registerNativeFunction(Path2D, "Path2D");

export function installPath2DConstructor() {
  delete Path2D.prototype.constructor;
  defineGlobalConstructor("Path2D", Path2D);
}
