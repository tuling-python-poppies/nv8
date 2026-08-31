import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/global-services/global-services-runtime.js";
import {
  GLOBAL_SERVICES_SURFACES,
} from "../api/global-services/global-services-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze({
  CrashReportContext: runtime.CrashReportContext,
  DocumentPictureInPicture: runtime.DocumentPictureInPicture,
  Fence: runtime.Fence,
  Viewport: runtime.Viewport,
});

export function installGlobalServices() {
  runtime.resetGlobalServices();
  do {
    delete (((runtime.globalServiceConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.globalServiceConstructors)[0])).name, (((runtime.globalServiceConstructors)[0])));
  } while (false);
do {
    delete (((runtime.globalServiceConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.globalServiceConstructors)[1])).name, (((runtime.globalServiceConstructors)[1])));
  } while (false);
do {
    delete (((runtime.globalServiceConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.globalServiceConstructors)[2])).name, (((runtime.globalServiceConstructors)[2])));
  } while (false);
do {
    delete (((runtime.globalServiceConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.globalServiceConstructors)[3])).name, (((runtime.globalServiceConstructors)[3])));
  } while (false);
  Object.setPrototypeOf(
    runtime.DocumentPictureInPicture.prototype,
    EventTarget.prototype,
  );
  Object.setPrototypeOf(runtime.DocumentPictureInPicture, EventTarget);
  do {
    {
  do {
    installMethod((constructors[("CrashReportContext")]), ("delete"), (1));
  } while (false);
do {
    installMethod((constructors[("CrashReportContext")]), ("initialize"), (1));
  } while (false);
do {
    installMethod((constructors[("CrashReportContext")]), ("set"), (2));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("CrashReportContext")]).prototype, (constructors[("CrashReportContext")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("CrashReportContext")]).prototype, (constructors[("CrashReportContext")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("DocumentPictureInPicture")]), ("window"));
  } while (false);
do {
    installAccessor((constructors[("DocumentPictureInPicture")]), ("onenter"));
  } while (false);
do {
    installMethod((constructors[("DocumentPictureInPicture")]), ("requestWindow"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("DocumentPictureInPicture")]).prototype, (constructors[("DocumentPictureInPicture")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("DocumentPictureInPicture")]).prototype, (constructors[("DocumentPictureInPicture")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("Fence")]), ("getNestedConfigs"), (0));
  } while (false);
do {
    installMethod((constructors[("Fence")]), ("reportEvent"), (1));
  } while (false);
do {
    installMethod((constructors[("Fence")]), ("setReportEventDataForAutomaticBeacons"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Fence")]).prototype, (constructors[("Fence")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Fence")]).prototype, (constructors[("Fence")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("Viewport")]), ("segments"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Viewport")]).prototype, (constructors[("Viewport")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Viewport")]).prototype, (constructors[("Viewport")]).name);
    }
  } while (false);
}
  } while (false);
  installReadonlyGlobal("crashReport", runtime.crashReportGlobal);
  installReadonlyGlobal(
    "documentPictureInPicture",
    runtime.documentPictureInPictureGlobal,
  );
  installReadonlyGlobal("fence", () => null);
  installViewportGlobal();
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.globalServiceProperty(this, name);
    },
    set [name](value) {
      runtime.setGlobalServiceProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (Constructor === runtime.DocumentPictureInPicture && name === "onenter") {
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

function installMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.globalServiceOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function installReadonlyGlobal(name, callback) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return callback();
    },
  }, name).get;
  registerNativeGetter(getter, name);
  Object.defineProperty(globalThis, name, {
    get: getter,
    enumerable: true,
    configurable: true,
  });
}

function installViewportGlobal() {
  const descriptor = Object.getOwnPropertyDescriptor({
    get viewport() {
      return runtime.viewportGlobal();
    },
    set viewport(value) {
      runtime.setViewportGlobal(value);
    },
  }, "viewport");
  registerNativeGetter(descriptor.get, "viewport");
  registerNativeFunction(descriptor.set, "set viewport");
  Object.defineProperty(globalThis, "viewport", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}
