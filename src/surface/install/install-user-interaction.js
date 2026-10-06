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

    delete runtime.userInteractionConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.userInteractionConstructors[0].name, runtime.userInteractionConstructors[0]);

    delete runtime.userInteractionConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.userInteractionConstructors[1].name, runtime.userInteractionConstructors[1]);

    delete runtime.userInteractionConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.userInteractionConstructors[2].name, runtime.userInteractionConstructors[2]);

    delete runtime.userInteractionConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.userInteractionConstructors[3].name, runtime.userInteractionConstructors[3]);

  Object.setPrototypeOf(runtime.CloseWatcher.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.CloseWatcher, EventTarget);
  {

    {
      installAccessor(constructors["CloseWatcher"], "oncancel");
    }

    {
      installAccessor(constructors["CloseWatcher"], "onclose");
    }

{
      const callback = {
        ["close"](...args) {
          return runtime.userInteractionOperation(this, "close", args);
        },
      }["close"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "close");
      definePrototypeMethod(constructors["CloseWatcher"].prototype, "close", callback);
    }
{
      const callback = {
        ["destroy"](...args) {
          return runtime.userInteractionOperation(this, "destroy", args);
        },
      }["destroy"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "destroy");
      definePrototypeMethod(constructors["CloseWatcher"].prototype, "destroy", callback);
    }
{
      const callback = {
        ["requestClose"](...args) {
          return runtime.userInteractionOperation(this, "requestClose", args);
        },
      }["requestClose"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "requestClose");
      definePrototypeMethod(constructors["CloseWatcher"].prototype, "requestClose", callback);
    }

    {
      defineConstructorBacklink(constructors["CloseWatcher"].prototype, constructors["CloseWatcher"]);
    }

    {
      defineToStringTag(constructors["CloseWatcher"].prototype, constructors["CloseWatcher"].name);
    }

}
{
  {
      const callback = {
        ["open"](...args) {
          return runtime.userInteractionOperation(this, "open", args);
        },
      }["open"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "open");
      definePrototypeMethod(constructors["EyeDropper"].prototype, "open", callback);
    }

    {
      defineConstructorBacklink(constructors["EyeDropper"].prototype, constructors["EyeDropper"]);
    }

    {
      defineToStringTag(constructors["EyeDropper"].prototype, constructors["EyeDropper"].name);
    }

}
{
  {
      const callback = {
        ["requestPresenter"](...args) {
          return runtime.userInteractionOperation(this, "requestPresenter", args);
        },
      }["requestPresenter"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "requestPresenter");
      definePrototypeMethod(constructors["Ink"].prototype, "requestPresenter", callback);
    }

    {
      defineConstructorBacklink(constructors["Ink"].prototype, constructors["Ink"]);
    }

    {
      defineToStringTag(constructors["Ink"].prototype, constructors["Ink"].name);
    }

}
{

    {
      installAccessor(constructors["DelegatedInkTrailPresenter"], "presentationArea");
    }

{
      const callback = {
        ["updateInkTrailStartPoint"](...args) {
          return runtime.userInteractionOperation(this, "updateInkTrailStartPoint", args);
        },
      }["updateInkTrailStartPoint"];
      Object.defineProperty(callback, "length", {
        value: 2,
        configurable: true,
      });
      registerNativeFunction(callback, "updateInkTrailStartPoint");
      definePrototypeMethod(constructors["DelegatedInkTrailPresenter"].prototype, "updateInkTrailStartPoint", callback);
    }

    {
      defineConstructorBacklink(constructors["DelegatedInkTrailPresenter"].prototype, constructors["DelegatedInkTrailPresenter"]);
    }

    {
      defineToStringTag(constructors["DelegatedInkTrailPresenter"].prototype, constructors["DelegatedInkTrailPresenter"].name);
    }

}
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
