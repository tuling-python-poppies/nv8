import { hideNodeGlobals } from "./hide-node-globals.js";
import {
  installErrorStackGuard,
} from "./install-error-stack-guard.js";
import { installConsole } from "../install/install-console.js";
import { installDOMException } from "../install/install-dom-exception.js";
import { installURLSearchParams } from "../install/install-url-search-params.js";
import { installURL } from "../install/install-url.js";
import {
  configureObjectURLRegistry,
} from "../api/url/url-state.js";
import { installTextEncoding } from "../install/install-text-encoding.js";
import {
  installNativeFunctionToString,
  registerNativeFunction,
} from "../webidl/native-function.js";
import {
  installModernBuiltins,
} from "../install/install-modern-builtins.js";
import {
  clearTrace,
  configureTrace,
  disableTrace,
  enableTrace,
  readTrace,
} from "../trace/trace-state.js";

const definitions = new Map();

export function bootstrapWorklet(
  kind,
  traceEnabled,
  maxTraceEntries,
  objectURLRegistry,
) {
  hideNodeGlobals();
  configureObjectURLRegistry(objectURLRegistry);
  installNativeFunctionToString();
  installErrorStackGuard();
  installModernBuiltins();
  configureTrace(traceEnabled, maxTraceEntries);
  installConsole();
  installDOMException();
  installURLSearchParams();
  installURL();
  installTextEncoding();
  definitions.clear();
  const prototype = Object.create(Object.prototype);
  Object.defineProperty(prototype, Symbol.toStringTag, {
    value: kind === "audio"
      ? "AudioWorkletGlobalScope"
      : "PaintWorkletGlobalScope",
    configurable: true,
  });
  Object.setPrototypeOf(globalThis, prototype);
  installRegistration("registerPaint", "paint");
  installRegistration("registerProcessor", "audio");
  if (kind === "audio") {
    for (const [name, value] of [
      ["currentFrame", 0],
      ["currentTime", 0],
      ["sampleRate", 48_000],
    ]) {
      Object.defineProperty(globalThis, name, {
        value,
        writable: false,
        enumerable: true,
        configurable: true,
      });
    }
  }
}

export function registeredDefinitionCount() {
  return definitions.size;
}

export function enableProxyTrace() {
  enableTrace();
}

export function disableProxyTrace() {
  disableTrace();
}

export function clearProxyTrace() {
  clearTrace();
}

export function proxyTrace() {
  return readTrace();
}

export function nextScheduledTaskDelay() {
  return null;
}

export function runScheduledTasks() {}

export function clearScheduledTasks() {
  definitions.clear();
}

function installRegistration(name, expectedKind) {
  const callback = {
    [name](definitionName, constructor) {
      if (arguments.length < 2) {
        throw new TypeError(`${name} requires 2 arguments.`);
      }
      const normalized = `${definitionName}`;
      if (normalized === "" || typeof constructor !== "function") {
        throw new TypeError(`Invalid ${expectedKind} worklet definition.`);
      }
      const key = `${expectedKind}\0${normalized}`;
      if (definitions.has(key)) {
        throw new DOMException(
          `The ${expectedKind} worklet name is already registered.`,
          "NotSupportedError",
        );
      }
      definitions.set(key, constructor);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: 2,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  Object.defineProperty(globalThis, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
