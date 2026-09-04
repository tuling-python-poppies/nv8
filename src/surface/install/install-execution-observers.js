import * as runtime from "../api/execution-observers/execution-observers-runtime.js";
import {
  EXECUTION_OBSERVER_SURFACES,
} from "../api/execution-observers/execution-observers-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../engine/webidl/native-function.js";

const constructors = Object.freeze({
  CreateMonitor: runtime.CreateMonitor,
  Profiler: runtime.Profiler,
});

export function installExecutionObservers() {
  do {
    {
  delete ((runtime.executionObserverConstructors)[0]).prototype.constructor;
  defineGlobalConstructor(((runtime.executionObserverConstructors)[0]).name, ((runtime.executionObserverConstructors)[0]));
  {
  do {
    {
      {
        definePrototypeAccessor(
          (((runtime.executionObserverConstructors)[0])).prototype,
          ("ondownloadprogress"),
          runtime.ondownloadprogress.get,
          runtime.ondownloadprogress.set,
        );
      }
    }
  } while (false);
do {
    {
      defineConstructorBacklink((((runtime.executionObserverConstructors)[0])).prototype, (((runtime.executionObserverConstructors)[0])));
    }
  } while (false);
do {
    {
      defineToStringTag((((runtime.executionObserverConstructors)[0])).prototype, (((runtime.executionObserverConstructors)[0])).name);
    }
  } while (false);
}
}
  } while (false);
do {
    {
  delete ((runtime.executionObserverConstructors)[1]).prototype.constructor;
  defineGlobalConstructor(((runtime.executionObserverConstructors)[1]).name, ((runtime.executionObserverConstructors)[1]));
  {
  do {
    {
      {
        const getter = Object.getOwnPropertyDescriptor({
          get [("sampleInterval")]() { return runtime.profilerProperty(this, ("sampleInterval")); },
        }, ("sampleInterval")).get;
        registerNativeGetter(getter, ("sampleInterval"));
        definePrototypeGetter((((runtime.executionObserverConstructors)[1])).prototype, ("sampleInterval"), getter);
      }
    }
  } while (false);
do {
    {
      {
        const getter = Object.getOwnPropertyDescriptor({
          get [("stopped")]() { return runtime.profilerProperty(this, ("stopped")); },
        }, ("stopped")).get;
        registerNativeGetter(getter, ("stopped"));
        definePrototypeGetter((((runtime.executionObserverConstructors)[1])).prototype, ("stopped"), getter);
      }
    }
  } while (false);
do {
    {
      definePrototypeMethod((((runtime.executionObserverConstructors)[1])).prototype, ("stop"), runtime[("stop")]);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((((runtime.executionObserverConstructors)[1])).prototype, (((runtime.executionObserverConstructors)[1])));
    }
  } while (false);
do {
    {
      defineToStringTag((((runtime.executionObserverConstructors)[1])).prototype, (((runtime.executionObserverConstructors)[1])).name);
    }
  } while (false);
}
}
  } while (false);
}

export function installCreateMonitor() {
  {
  delete (runtime.CreateMonitor).prototype.constructor;
  defineGlobalConstructor((runtime.CreateMonitor).name, (runtime.CreateMonitor));
  {
  do {
    {
      {
        definePrototypeAccessor(
          ((runtime.CreateMonitor)).prototype,
          ("ondownloadprogress"),
          runtime.ondownloadprogress.get,
          runtime.ondownloadprogress.set,
        );
      }
    }
  } while (false);
do {
    {
      defineConstructorBacklink(((runtime.CreateMonitor)).prototype, ((runtime.CreateMonitor)));
    }
  } while (false);
do {
    {
      defineToStringTag(((runtime.CreateMonitor)).prototype, ((runtime.CreateMonitor)).name);
    }
  } while (false);
}
}
}




