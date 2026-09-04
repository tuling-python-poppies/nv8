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
  do {
    delete (((runtime.captureTargetConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.captureTargetConstructors)[0])).name, (((runtime.captureTargetConstructors)[0])));
    {
  do {
    {
      defineConstructorBacklink(((runtime.captureTargetConstructors)[0]).prototype, ((runtime.captureTargetConstructors)[0]));
    }
  } while (false);
do {
    {
      defineToStringTag(((runtime.captureTargetConstructors)[0]).prototype, ((runtime.captureTargetConstructors)[0]).name);
    }
  } while (false);
}
    const fromElement = {
      fromElement(...args) {
        return runtime.captureTargetFromElement((((runtime.captureTargetConstructors)[0])), args);
      },
    }.fromElement;
    Object.defineProperty(fromElement, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(fromElement, "fromElement");
    Object.defineProperty((((runtime.captureTargetConstructors)[0])), "fromElement", {
      value: fromElement,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
do {
    delete (((runtime.captureTargetConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.captureTargetConstructors)[1])).name, (((runtime.captureTargetConstructors)[1])));
    {
  do {
    {
      defineConstructorBacklink(((runtime.captureTargetConstructors)[1]).prototype, ((runtime.captureTargetConstructors)[1]));
    }
  } while (false);
do {
    {
      defineToStringTag(((runtime.captureTargetConstructors)[1]).prototype, ((runtime.captureTargetConstructors)[1]).name);
    }
  } while (false);
}
    const fromElement = {
      fromElement(...args) {
        return runtime.captureTargetFromElement((((runtime.captureTargetConstructors)[1])), args);
      },
    }.fromElement;
    Object.defineProperty(fromElement, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(fromElement, "fromElement");
    Object.defineProperty((((runtime.captureTargetConstructors)[1])), "fromElement", {
      value: fromElement,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
}


