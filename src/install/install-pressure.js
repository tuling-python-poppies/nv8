import * as runtime from "../api/pressure/pressure-runtime.js";
import { PRESSURE_SURFACES } from "../api/pressure/pressure-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze({
  PressureObserver: runtime.PressureObserver,
  PressureRecord: runtime.PressureRecord,
});

export function installPressure() {
  do {
    delete (((runtime.pressureConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.pressureConstructors)[0])).name, (((runtime.pressureConstructors)[0])));
  } while (false);
do {
    delete (((runtime.pressureConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.pressureConstructors)[1])).name, (((runtime.pressureConstructors)[1])));
  } while (false);
  do {
    {
  do {
    {
      const callback = {
        [("disconnect")](...args) { return runtime.pressureOperation(this, ("disconnect"), args); },
      }[("disconnect")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("disconnect"));
      definePrototypeMethod((constructors[("PressureObserver")]).prototype, ("disconnect"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("observe")](...args) { return runtime.pressureOperation(this, ("observe"), args); },
      }[("observe")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("observe"));
      definePrototypeMethod((constructors[("PressureObserver")]).prototype, ("observe"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("takeRecords")](...args) { return runtime.pressureOperation(this, ("takeRecords"), args); },
      }[("takeRecords")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("takeRecords"));
      definePrototypeMethod((constructors[("PressureObserver")]).prototype, ("takeRecords"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("unobserve")](...args) { return runtime.pressureOperation(this, ("unobserve"), args); },
      }[("unobserve")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("unobserve"));
      definePrototypeMethod((constructors[("PressureObserver")]).prototype, ("unobserve"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("PressureObserver")]).prototype, (constructors[("PressureObserver")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("PressureObserver")]).prototype, (constructors[("PressureObserver")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("source")]() { return runtime.pressureProperty(this, ("source")); },
      }, ("source")).get;
      registerNativeGetter(getter, ("source"));
      definePrototypeGetter((constructors[("PressureRecord")]).prototype, ("source"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("state")]() { return runtime.pressureProperty(this, ("state")); },
      }, ("state")).get;
      registerNativeGetter(getter, ("state"));
      definePrototypeGetter((constructors[("PressureRecord")]).prototype, ("state"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("time")]() { return runtime.pressureProperty(this, ("time")); },
      }, ("time")).get;
      registerNativeGetter(getter, ("time"));
      definePrototypeGetter((constructors[("PressureRecord")]).prototype, ("time"), getter);
    }
  } while (false);
do {
    {
      const callback = {
        [("toJSON")](...args) { return runtime.pressureOperation(this, ("toJSON"), args); },
      }[("toJSON")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("toJSON"));
      definePrototypeMethod((constructors[("PressureRecord")]).prototype, ("toJSON"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("PressureRecord")]).prototype, (constructors[("PressureRecord")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("PressureRecord")]).prototype, (constructors[("PressureRecord")]).name);
    }
  } while (false);
}
  } while (false);
  Object.defineProperty(runtime.PressureObserver, "knownSources", {
    value: Object.freeze(["cpu"]),
    writable: false,
    enumerable: true,
    configurable: true,
  });
}


