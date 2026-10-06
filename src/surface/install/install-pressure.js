import * as runtime from "../api/pressure/pressure-runtime.js";
import { PRESSURE_SURFACES } from "../api/pressure/pressure-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze({
  PressureObserver: runtime.PressureObserver,
  PressureRecord: runtime.PressureRecord,
});

export function installPressure() {

    delete runtime.pressureConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.pressureConstructors[0].name, runtime.pressureConstructors[0]);

    delete runtime.pressureConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.pressureConstructors[1].name, runtime.pressureConstructors[1]);

  {
  {
      const callback = {
        ["disconnect"](...args) { return runtime.pressureOperation(this, "disconnect", args); },
      }["disconnect"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "disconnect");
      definePrototypeMethod(constructors["PressureObserver"].prototype, "disconnect", callback);
    }
{
      const callback = {
        ["observe"](...args) { return runtime.pressureOperation(this, "observe", args); },
      }["observe"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "observe");
      definePrototypeMethod(constructors["PressureObserver"].prototype, "observe", callback);
    }
{
      const callback = {
        ["takeRecords"](...args) { return runtime.pressureOperation(this, "takeRecords", args); },
      }["takeRecords"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "takeRecords");
      definePrototypeMethod(constructors["PressureObserver"].prototype, "takeRecords", callback);
    }
{
      const callback = {
        ["unobserve"](...args) { return runtime.pressureOperation(this, "unobserve", args); },
      }["unobserve"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "unobserve");
      definePrototypeMethod(constructors["PressureObserver"].prototype, "unobserve", callback);
    }

    {
      defineConstructorBacklink(constructors["PressureObserver"].prototype, constructors["PressureObserver"]);
    }

    {
      defineToStringTag(constructors["PressureObserver"].prototype, constructors["PressureObserver"].name);
    }

}
{
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["source"]() { return runtime.pressureProperty(this, "source"); },
      }, "source").get;
      registerNativeGetter(getter, "source");
      definePrototypeGetter(constructors["PressureRecord"].prototype, "source", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["state"]() { return runtime.pressureProperty(this, "state"); },
      }, "state").get;
      registerNativeGetter(getter, "state");
      definePrototypeGetter(constructors["PressureRecord"].prototype, "state", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["time"]() { return runtime.pressureProperty(this, "time"); },
      }, "time").get;
      registerNativeGetter(getter, "time");
      definePrototypeGetter(constructors["PressureRecord"].prototype, "time", getter);
    }
{
      const callback = {
        ["toJSON"](...args) { return runtime.pressureOperation(this, "toJSON", args); },
      }["toJSON"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "toJSON");
      definePrototypeMethod(constructors["PressureRecord"].prototype, "toJSON", callback);
    }

    {
      defineConstructorBacklink(constructors["PressureRecord"].prototype, constructors["PressureRecord"]);
    }

    {
      defineToStringTag(constructors["PressureRecord"].prototype, constructors["PressureRecord"].name);
    }

}
  Object.defineProperty(runtime.PressureObserver, "knownSources", {
    value: Object.freeze(["cpu"]),
    writable: false,
    enumerable: true,
    configurable: true,
  });
}
