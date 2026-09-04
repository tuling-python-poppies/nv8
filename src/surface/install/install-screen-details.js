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
  do {
    delete (((runtime.screenDetailsConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.screenDetailsConstructors)[0])).name, (((runtime.screenDetailsConstructors)[0])));
  } while (false);
do {
    delete (((runtime.screenDetailsConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.screenDetailsConstructors)[1])).name, (((runtime.screenDetailsConstructors)[1])));
  } while (false);
  Object.setPrototypeOf(runtime.ScreenDetailed.prototype, Screen.prototype);
  Object.setPrototypeOf(runtime.ScreenDetailed, Screen);
  Object.setPrototypeOf(runtime.ScreenDetails.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.ScreenDetails, EventTarget);
  do {
    {
  do {
    {
      installAccessor((constructors[("ScreenDetailed")]), ("left"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetailed")]), ("top"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetailed")]), ("isPrimary"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetailed")]), ("isInternal"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetailed")]), ("devicePixelRatio"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetailed")]), ("label"));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ScreenDetailed")]).prototype, (constructors[("ScreenDetailed")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ScreenDetailed")]).prototype, (constructors[("ScreenDetailed")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      installAccessor((constructors[("ScreenDetails")]), ("screens"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetails")]), ("currentScreen"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetails")]), ("onscreenschange"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("ScreenDetails")]), ("oncurrentscreenchange"));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ScreenDetails")]).prototype, (constructors[("ScreenDetails")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ScreenDetails")]).prototype, (constructors[("ScreenDetails")]).name);
    }
  } while (false);
}
  } while (false);
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
