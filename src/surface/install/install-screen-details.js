import { EventTarget } from "../api/event/event-target-constructor.js";
import { Screen } from "../api/screen/screen-constructor.js";
import * as runtime from "../api/screen-details/screen-details-runtime.js";
import {
  SCREEN_DETAILS_SURFACES,
} from "../api/screen-details/screen-details-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineGlobalFunction,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze({
  ScreenDetailed: runtime.ScreenDetailed,
  ScreenDetails: runtime.ScreenDetails,
});
const settable = new Set([
  "onscreenschange",
  "oncurrentscreenchange",
]);

export function installScreenDetails() {

    delete runtime.screenDetailsConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.screenDetailsConstructors[0].name, runtime.screenDetailsConstructors[0]);

    delete runtime.screenDetailsConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.screenDetailsConstructors[1].name, runtime.screenDetailsConstructors[1]);

  Object.setPrototypeOf(runtime.ScreenDetailed.prototype, Screen.prototype);
  Object.setPrototypeOf(runtime.ScreenDetailed, Screen);
  Object.setPrototypeOf(runtime.ScreenDetails.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.ScreenDetails, EventTarget);

    {

    {
      installAccessor(constructors["ScreenDetailed"], "left");
    }

    {
      installAccessor(constructors["ScreenDetailed"], "top");
    }

    {
      installAccessor(constructors["ScreenDetailed"], "isPrimary");
    }

    {
      installAccessor(constructors["ScreenDetailed"], "isInternal");
    }

    {
      installAccessor(constructors["ScreenDetailed"], "devicePixelRatio");
    }

    {
      installAccessor(constructors["ScreenDetailed"], "label");
    }

    {
      defineConstructorBacklink(constructors["ScreenDetailed"].prototype, constructors["ScreenDetailed"]);
    }

    {
      defineToStringTag(constructors["ScreenDetailed"].prototype, constructors["ScreenDetailed"].name);
    }

}

    {

    {
      installAccessor(constructors["ScreenDetails"], "screens");
    }

    {
      installAccessor(constructors["ScreenDetails"], "currentScreen");
    }

    {
      installAccessor(constructors["ScreenDetails"], "onscreenschange");
    }

    {
      installAccessor(constructors["ScreenDetails"], "oncurrentscreenchange");
    }

    {
      defineConstructorBacklink(constructors["ScreenDetails"].prototype, constructors["ScreenDetails"]);
    }

    {
      defineToStringTag(constructors["ScreenDetails"].prototype, constructors["ScreenDetails"].name);
    }

}

  registerNativeFunction(runtime.getScreenDetails, "getScreenDetails");
  defineGlobalFunction("getScreenDetails", runtime.getScreenDetails);
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.screenDetailsProperty(this, name);
    },
    set [name](value) {
      runtime.setScreenDetailsProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (settable.has(name)) {
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
