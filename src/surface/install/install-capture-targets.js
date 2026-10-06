import * as runtime from "../api/capture-targets/capture-targets-runtime.js";
import {
  CAPTURE_TARGET_SURFACES,
} from "../api/capture-targets/capture-targets-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";

export function installCaptureTargets() {
  {
    delete runtime.captureTargetConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.captureTargetConstructors[0].name, runtime.captureTargetConstructors[0]);
    {

    {
      defineConstructorBacklink(runtime.captureTargetConstructors[0].prototype, runtime.captureTargetConstructors[0]);
    }

    {
      defineToStringTag(runtime.captureTargetConstructors[0].prototype, runtime.captureTargetConstructors[0].name);
    }

}
    const fromElement = {
      fromElement(...args) {
        return runtime.captureTargetFromElement(runtime.captureTargetConstructors[0], args);
      },
    }.fromElement;
    Object.defineProperty(fromElement, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(fromElement, "fromElement");
    Object.defineProperty(runtime.captureTargetConstructors[0], "fromElement", {
      value: fromElement,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
{
    delete runtime.captureTargetConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.captureTargetConstructors[1].name, runtime.captureTargetConstructors[1]);
    {

    {
      defineConstructorBacklink(runtime.captureTargetConstructors[1].prototype, runtime.captureTargetConstructors[1]);
    }

    {
      defineToStringTag(runtime.captureTargetConstructors[1].prototype, runtime.captureTargetConstructors[1].name);
    }

}
    const fromElement = {
      fromElement(...args) {
        return runtime.captureTargetFromElement(runtime.captureTargetConstructors[1], args);
      },
    }.fromElement;
    Object.defineProperty(fromElement, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(fromElement, "fromElement");
    Object.defineProperty(runtime.captureTargetConstructors[1], "fromElement", {
      value: fromElement,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}
