import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/user-interaction/user-interaction-runtime.js";
import {
  USER_INTERACTION_SURFACES,
} from "../api/user-interaction/user-interaction-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.userInteractionConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installUserInteraction() {
  do {
    delete (((runtime.userInteractionConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.userInteractionConstructors)[0])).name, (((runtime.userInteractionConstructors)[0])));
  } while (false);
do {
    delete (((runtime.userInteractionConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.userInteractionConstructors)[1])).name, (((runtime.userInteractionConstructors)[1])));
  } while (false);
do {
    delete (((runtime.userInteractionConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.userInteractionConstructors)[2])).name, (((runtime.userInteractionConstructors)[2])));
  } while (false);
do {
    delete (((runtime.userInteractionConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.userInteractionConstructors)[3])).name, (((runtime.userInteractionConstructors)[3])));
  } while (false);
  Object.setPrototypeOf(runtime.CloseWatcher.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.CloseWatcher, EventTarget);
  do {
    {
  do {
    {
      installAccessor((constructors[("CloseWatcher")]), ("oncancel"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("CloseWatcher")]), ("onclose"));
    }
  } while (false);
do {
    {
      const callback = {
        [("close")](...args) {
          return runtime.userInteractionOperation(this, ("close"), args);
        },
      }[("close")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("close"));
      definePrototypeMethod((constructors[("CloseWatcher")]).prototype, ("close"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("destroy")](...args) {
          return runtime.userInteractionOperation(this, ("destroy"), args);
        },
      }[("destroy")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("destroy"));
      definePrototypeMethod((constructors[("CloseWatcher")]).prototype, ("destroy"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("requestClose")](...args) {
          return runtime.userInteractionOperation(this, ("requestClose"), args);
        },
      }[("requestClose")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("requestClose"));
      definePrototypeMethod((constructors[("CloseWatcher")]).prototype, ("requestClose"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("CloseWatcher")]).prototype, (constructors[("CloseWatcher")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("CloseWatcher")]).prototype, (constructors[("CloseWatcher")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const callback = {
        [("open")](...args) {
          return runtime.userInteractionOperation(this, ("open"), args);
        },
      }[("open")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("open"));
      definePrototypeMethod((constructors[("EyeDropper")]).prototype, ("open"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("EyeDropper")]).prototype, (constructors[("EyeDropper")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("EyeDropper")]).prototype, (constructors[("EyeDropper")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const callback = {
        [("requestPresenter")](...args) {
          return runtime.userInteractionOperation(this, ("requestPresenter"), args);
        },
      }[("requestPresenter")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("requestPresenter"));
      definePrototypeMethod((constructors[("Ink")]).prototype, ("requestPresenter"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Ink")]).prototype, (constructors[("Ink")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Ink")]).prototype, (constructors[("Ink")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      installAccessor((constructors[("DelegatedInkTrailPresenter")]), ("presentationArea"));
    }
  } while (false);
do {
    {
      const callback = {
        [("updateInkTrailStartPoint")](...args) {
          return runtime.userInteractionOperation(this, ("updateInkTrailStartPoint"), args);
        },
      }[("updateInkTrailStartPoint")];
      Object.defineProperty(callback, "length", {
        value: (2),
        configurable: true,
      });
      registerNativeFunction(callback, ("updateInkTrailStartPoint"));
      definePrototypeMethod((constructors[("DelegatedInkTrailPresenter")]).prototype, ("updateInkTrailStartPoint"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("DelegatedInkTrailPresenter")]).prototype, (constructors[("DelegatedInkTrailPresenter")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("DelegatedInkTrailPresenter")]).prototype, (constructors[("DelegatedInkTrailPresenter")]).name);
    }
  } while (false);
}
  } while (false);
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.userInteractionProperty(this, name);
    },
    set [name](value) {
      runtime.setUserInteractionProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (Constructor === runtime.CloseWatcher) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(
      Constructor.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
  } else {
    definePrototypeGetter(Constructor.prototype, name, descriptor.get);
  }
}
