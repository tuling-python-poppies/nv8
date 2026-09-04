import * as runtime from "../api/launch-handling/launch-handling-runtime.js";
import {
  LAUNCH_HANDLING_SURFACES,
} from "../api/launch-handling/launch-handling-surface.js";
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
  LaunchParams: runtime.LaunchParams,
  LaunchQueue: runtime.LaunchQueue,
});

export function installLaunchHandling() {
  runtime.resetLaunchQueue();
  do {
    delete (((runtime.launchHandlingConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.launchHandlingConstructors)[0])).name, (((runtime.launchHandlingConstructors)[0])));
  } while (false);
do {
    delete (((runtime.launchHandlingConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.launchHandlingConstructors)[1])).name, (((runtime.launchHandlingConstructors)[1])));
  } while (false);
  do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("targetURL")]() {
          return runtime.launchHandlingProperty(this, ("targetURL"));
        },
      }, ("targetURL")).get;
      registerNativeGetter(getter, ("targetURL"));
      definePrototypeGetter((constructors[("LaunchParams")]).prototype, ("targetURL"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("files")]() {
          return runtime.launchHandlingProperty(this, ("files"));
        },
      }, ("files")).get;
      registerNativeGetter(getter, ("files"));
      definePrototypeGetter((constructors[("LaunchParams")]).prototype, ("files"), getter);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("LaunchParams")]).prototype, (constructors[("LaunchParams")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("LaunchParams")]).prototype, (constructors[("LaunchParams")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const callback = {
        [("setConsumer")](...args) {
          return runtime.launchHandlingOperation(this, ("setConsumer"), args);
        },
      }[("setConsumer")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("setConsumer"));
      definePrototypeMethod((constructors[("LaunchQueue")]).prototype, ("setConsumer"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("LaunchQueue")]).prototype, (constructors[("LaunchQueue")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("LaunchQueue")]).prototype, (constructors[("LaunchQueue")]).name);
    }
  } while (false);
}
  } while (false);
  const getter = Object.getOwnPropertyDescriptor({
    get launchQueue() {
      return runtime.launchQueueGlobal();
    },
  }, "launchQueue").get;
  registerNativeGetter(getter, "launchQueue");
  Object.defineProperty(globalThis, "launchQueue", {
    get: getter,
    enumerable: true,
    configurable: true,
  });
}


