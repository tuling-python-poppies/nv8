import vm from "node:vm";

const GLOBAL_AUDIT_SOURCE = `
(() => {
  "use strict";
  if (typeof process !== "undefined") return "process";
  if (typeof require !== "undefined") return "require";
  if (typeof module !== "undefined") return "module";
  if (typeof exports !== "undefined") return "exports";
  if (typeof Buffer !== "undefined") return "Buffer";
  if (typeof global !== "undefined") return "global";
  if (typeof GLOBAL !== "undefined") return "GLOBAL";
  if (typeof root !== "undefined") return "root";
  if (typeof __dirname !== "undefined") return "__dirname";
  if (typeof __filename !== "undefined") return "__filename";
  if (typeof setImmediate !== "undefined") return "setImmediate";
  if (typeof clearImmediate !== "undefined") return "clearImmediate";
  if (typeof AsyncLocalStorage !== "undefined") return "AsyncLocalStorage";
  if (typeof gc !== "undefined") return "gc";
  if ("process" in globalThis) return "globalThis.process";
  if ((0, eval)("typeof process") !== "undefined") {
    return "indirect-eval(process)";
  }
  if (Function("return typeof process")() !== "undefined") {
    return "Function(process)";
  }
  if (
    globalThis.constructor.constructor("return typeof process")()
    !== "undefined"
  ) {
    return "constructor.constructor(process)";
  }
  const GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
  if (
    GeneratorFunction("return typeof process")().next().value
    !== "undefined"
  ) {
    return "GeneratorFunction(process)";
  }
  return "";
})()
`;

export function auditRealmGlobals(context) {
  const script = new vm.Script(GLOBAL_AUDIT_SOURCE, {
    filename: "https://sandbox.test/__edge_global_audit__",
  });
  const leakedName = script.runInContext(context);
  if (leakedName !== "") {
    const error = new Error(`Node global leaked into sandbox realm: ${leakedName}`);
    error.code = "ERR_EDGE_GLOBAL_LEAK";
    throw error;
  }
}
