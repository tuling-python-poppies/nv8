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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

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

    delete runtime.userAgencyConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.userAgencyConstructors[0].name, runtime.userAgencyConstructors[0]);

    delete runtime.userAgencyConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.userAgencyConstructors[1].name, runtime.userAgencyConstructors[1]);

    delete runtime.userAgencyConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.userAgencyConstructors[2].name, runtime.userAgencyConstructors[2]);

    delete runtime.userAgencyConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.userAgencyConstructors[3].name, runtime.userAgencyConstructors[3]);

    delete runtime.userAgencyConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.userAgencyConstructors[4].name, runtime.userAgencyConstructors[4]);

  {
    const Constructor = constructors["Permissions"];

  }
{
    const Constructor = constructors["PermissionStatus"];
    {
      Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
      Object.setPrototypeOf(Constructor, EventTarget);
    }
  }
{
    const Constructor = constructors["Clipboard"];
    {
      Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
      Object.setPrototypeOf(Constructor, EventTarget);
    }
  }
{
    const Constructor = constructors["ClipboardItem"];

  }
{
    const Constructor = constructors["Notification"];
    {
      Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
      Object.setPrototypeOf(Constructor, EventTarget);
    }
  }

    {

    method(constructors["Permissions"], "query", 1);

    defineConstructorBacklink(constructors["Permissions"].prototype, constructors["Permissions"]);

    defineToStringTag(constructors["Permissions"].prototype, constructors["Permissions"].name);

}

    {

    accessor(constructors["PermissionStatus"], "name");

    accessor(constructors["PermissionStatus"], "state");

    accessor(constructors["PermissionStatus"], "onchange");

    defineConstructorBacklink(constructors["PermissionStatus"].prototype, constructors["PermissionStatus"]);

    defineToStringTag(constructors["PermissionStatus"].prototype, constructors["PermissionStatus"].name);

}

    {

    accessor(constructors["Clipboard"], "onclipboardchange");

    method(constructors["Clipboard"], "read", 0);

    method(constructors["Clipboard"], "readText", 0);

    method(constructors["Clipboard"], "write", 1);

    method(constructors["Clipboard"], "writeText", 1);

    defineConstructorBacklink(constructors["Clipboard"].prototype, constructors["Clipboard"]);

    defineToStringTag(constructors["Clipboard"].prototype, constructors["Clipboard"].name);

}

    {

    accessor(constructors["ClipboardItem"], "types");

    method(constructors["ClipboardItem"], "getType", 1);

    defineConstructorBacklink(constructors["ClipboardItem"].prototype, constructors["ClipboardItem"]);

    defineToStringTag(constructors["ClipboardItem"].prototype, constructors["ClipboardItem"].name);

}

    {

    accessor(constructors["Notification"], "onclick");

    accessor(constructors["Notification"], "onshow");

    accessor(constructors["Notification"], "onerror");

    accessor(constructors["Notification"], "onclose");

    accessor(constructors["Notification"], "title");

    accessor(constructors["Notification"], "dir");

    accessor(constructors["Notification"], "lang");

    accessor(constructors["Notification"], "body");

    accessor(constructors["Notification"], "tag");

    accessor(constructors["Notification"], "icon");

    accessor(constructors["Notification"], "badge");

    accessor(constructors["Notification"], "vibrate");

    accessor(constructors["Notification"], "timestamp");

    accessor(constructors["Notification"], "renotify");

    accessor(constructors["Notification"], "silent");

    accessor(constructors["Notification"], "requireInteraction");

    accessor(constructors["Notification"], "data");

    accessor(constructors["Notification"], "actions");

    method(constructors["Notification"], "close", 0);

    accessor(constructors["Notification"], "image");

    defineConstructorBacklink(constructors["Notification"].prototype, constructors["Notification"]);

    accessor(constructors["Notification"], "scenario");

    defineToStringTag(constructors["Notification"].prototype, constructors["Notification"].name);

}

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
