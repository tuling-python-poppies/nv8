import {
  AudioWorklet,
  Worklet,
  workletAddModule,
} from "../api/worklet/worklet-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";

export function installWorklet() {
  delete Worklet.prototype.constructor;
  defineGlobalConstructor("Worklet", Worklet);
  const addModule = {
    addModule(moduleURL) {
      if (arguments.length === 0) {
        throw new TypeError(
          "Failed to execute 'addModule': 1 argument required.",
        );
      }
      return workletAddModule(this, moduleURL, arguments[1]);
    },
  }.addModule;
  Object.defineProperty(addModule, "length", {
    value: 1,
    configurable: true,
  });
  registerNativeFunction(addModule, "addModule");
  definePrototypeMethod(Worklet.prototype, "addModule", addModule);
  defineConstructorBacklink(Worklet.prototype, Worklet);
  defineToStringTag(Worklet.prototype, "Worklet");

  Object.setPrototypeOf(AudioWorklet.prototype, Worklet.prototype);
  Object.setPrototypeOf(AudioWorklet, Worklet);
  delete AudioWorklet.prototype.constructor;
  defineGlobalConstructor("AudioWorklet", AudioWorklet);
  defineConstructorBacklink(AudioWorklet.prototype, AudioWorklet);
  defineToStringTag(AudioWorklet.prototype, "AudioWorklet");
}
