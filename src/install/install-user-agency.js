import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/user-agency/user-agency-runtime.js";
import { USER_AGENCY_SURFACES } from "../api/user-agency/user-agency-surface.js";
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

const constructors = Object.freeze(Object.fromEntries(
  runtime.userAgencyConstructors.map(Constructor => [Constructor.name, Constructor]),
));
const settable = new Set([
  "onchange",
  "onclipboardchange",
  "onclick",
  "onshow",
  "onerror",
  "onclose",
]);

export function installUserAgency() {
  do {
    delete (((runtime.userAgencyConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.userAgencyConstructors)[0])).name, (((runtime.userAgencyConstructors)[0])));
  } while (false);
do {
    delete (((runtime.userAgencyConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.userAgencyConstructors)[1])).name, (((runtime.userAgencyConstructors)[1])));
  } while (false);
do {
    delete (((runtime.userAgencyConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.userAgencyConstructors)[2])).name, (((runtime.userAgencyConstructors)[2])));
  } while (false);
do {
    delete (((runtime.userAgencyConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.userAgencyConstructors)[3])).name, (((runtime.userAgencyConstructors)[3])));
  } while (false);
do {
    delete (((runtime.userAgencyConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.userAgencyConstructors)[4])).name, (((runtime.userAgencyConstructors)[4])));
  } while (false);
  do {
    const Constructor = constructors[("Permissions")];
    
  } while (false);
do {
    const Constructor = constructors[("PermissionStatus")];
    {
      Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
      Object.setPrototypeOf(Constructor, EventTarget);
    }
  } while (false);
do {
    const Constructor = constructors[("Clipboard")];
    {
      Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
      Object.setPrototypeOf(Constructor, EventTarget);
    }
  } while (false);
do {
    const Constructor = constructors[("ClipboardItem")];
    
  } while (false);
do {
    const Constructor = constructors[("Notification")];
    {
      Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
      Object.setPrototypeOf(Constructor, EventTarget);
    }
  } while (false);
  do {
    {
  do {
    method((constructors[("Permissions")]), ("query"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("Permissions")]).prototype, (constructors[("Permissions")]));
  } while (false);
do {
    defineToStringTag((constructors[("Permissions")]).prototype, (constructors[("Permissions")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("PermissionStatus")]), ("name"));
  } while (false);
do {
    accessor((constructors[("PermissionStatus")]), ("state"));
  } while (false);
do {
    accessor((constructors[("PermissionStatus")]), ("onchange"));
  } while (false);
do {
    defineConstructorBacklink((constructors[("PermissionStatus")]).prototype, (constructors[("PermissionStatus")]));
  } while (false);
do {
    defineToStringTag((constructors[("PermissionStatus")]).prototype, (constructors[("PermissionStatus")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("Clipboard")]), ("onclipboardchange"));
  } while (false);
do {
    method((constructors[("Clipboard")]), ("read"), (0));
  } while (false);
do {
    method((constructors[("Clipboard")]), ("readText"), (0));
  } while (false);
do {
    method((constructors[("Clipboard")]), ("write"), (1));
  } while (false);
do {
    method((constructors[("Clipboard")]), ("writeText"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("Clipboard")]).prototype, (constructors[("Clipboard")]));
  } while (false);
do {
    defineToStringTag((constructors[("Clipboard")]).prototype, (constructors[("Clipboard")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("ClipboardItem")]), ("types"));
  } while (false);
do {
    method((constructors[("ClipboardItem")]), ("getType"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("ClipboardItem")]).prototype, (constructors[("ClipboardItem")]));
  } while (false);
do {
    defineToStringTag((constructors[("ClipboardItem")]).prototype, (constructors[("ClipboardItem")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("Notification")]), ("onclick"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("onshow"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("onerror"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("onclose"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("title"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("dir"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("lang"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("body"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("tag"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("icon"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("badge"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("vibrate"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("timestamp"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("renotify"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("silent"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("requireInteraction"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("data"));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("actions"));
  } while (false);
do {
    method((constructors[("Notification")]), ("close"), (0));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("image"));
  } while (false);
do {
    defineConstructorBacklink((constructors[("Notification")]).prototype, (constructors[("Notification")]));
  } while (false);
do {
    accessor((constructors[("Notification")]), ("scenario"));
  } while (false);
do {
    defineToStringTag((constructors[("Notification")]).prototype, (constructors[("Notification")]).name);
  } while (false);
}
  } while (false);
  staticMethod(
    runtime.ClipboardItem,
    "supports",
    runtime.clipboardItemSupports,
    1,
  );
  staticMethod(
    runtime.Notification,
    "requestPermission",
    runtime.requestNotificationPermission,
    0,
  );
  const permission = Object.getOwnPropertyDescriptor({
    get permission() {
      return runtime.notificationPermission();
    },
  }, "permission").get;
  registerNativeGetter(permission, "permission");
  Object.defineProperty(runtime.Notification, "permission", {
    get: permission,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(runtime.Notification, "maxActions", {
    value: 2,
    enumerable: true,
    configurable: true,
  });
}



function accessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.userAgencyProperty(this, name);
    },
    set [name](value) {
      runtime.setUserAgencyProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (settable.has(name)) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(Constructor.prototype, name, descriptor.get, descriptor.set);
  } else {
    definePrototypeGetter(Constructor.prototype, name, descriptor.get);
  }
}

function method(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.userAgencyOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function staticMethod(Constructor, name, operation, length) {
  const callback = {
    [name](...args) {
      return operation(...args);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
