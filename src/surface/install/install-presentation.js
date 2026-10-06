import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/presentation/presentation-runtime.js";
import {
  PRESENTATION_SURFACES,
} from "../api/presentation/presentation-surface.js";
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
  runtime.presentationConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));
const eventHandlers = new Set([
  "onchange",
  "onconnectionavailable",
  "onconnect",
  "onclose",
  "onterminate",
  "onmessage",
]);

export function installPresentation() {

    delete runtime.presentationConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.presentationConstructors[0].name, runtime.presentationConstructors[0]);

    delete runtime.presentationConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.presentationConstructors[1].name, runtime.presentationConstructors[1]);

    delete runtime.presentationConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.presentationConstructors[2].name, runtime.presentationConstructors[2]);

    delete runtime.presentationConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.presentationConstructors[3].name, runtime.presentationConstructors[3]);

    delete runtime.presentationConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.presentationConstructors[4].name, runtime.presentationConstructors[4]);

    delete runtime.presentationConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.presentationConstructors[5].name, runtime.presentationConstructors[5]);

    Object.setPrototypeOf(runtime.PresentationRequest.prototype, EventTarget.prototype);
    Object.setPrototypeOf(runtime.PresentationRequest, EventTarget);

    Object.setPrototypeOf(runtime.PresentationAvailability.prototype, EventTarget.prototype);
    Object.setPrototypeOf(runtime.PresentationAvailability, EventTarget);

    Object.setPrototypeOf(runtime.PresentationConnection.prototype, EventTarget.prototype);
    Object.setPrototypeOf(runtime.PresentationConnection, EventTarget);

    Object.setPrototypeOf(runtime.PresentationConnectionList.prototype, EventTarget.prototype);
    Object.setPrototypeOf(runtime.PresentationConnectionList, EventTarget);

    {

    installAccessor(constructors["Presentation"], "defaultRequest");

    installAccessor(constructors["Presentation"], "receiver");

    {
      defineConstructorBacklink(constructors["Presentation"].prototype, constructors["Presentation"]);
    }

    {
      defineToStringTag(constructors["Presentation"].prototype, constructors["Presentation"].name);
    }

}

    {

    installAccessor(constructors["PresentationRequest"], "onconnectionavailable");

    installMethod(constructors["PresentationRequest"], "getAvailability", 0);

    installMethod(constructors["PresentationRequest"], "reconnect", 1);

    installMethod(constructors["PresentationRequest"], "start", 0);

    {
      defineConstructorBacklink(constructors["PresentationRequest"].prototype, constructors["PresentationRequest"]);
    }

    {
      defineToStringTag(constructors["PresentationRequest"].prototype, constructors["PresentationRequest"].name);
    }

}

    {

    installAccessor(constructors["PresentationAvailability"], "value");

    installAccessor(constructors["PresentationAvailability"], "onchange");

    {
      defineConstructorBacklink(constructors["PresentationAvailability"].prototype, constructors["PresentationAvailability"]);
    }

    {
      defineToStringTag(constructors["PresentationAvailability"].prototype, constructors["PresentationAvailability"].name);
    }

}

    {

    installAccessor(constructors["PresentationConnection"], "id");

    installAccessor(constructors["PresentationConnection"], "url");

    installAccessor(constructors["PresentationConnection"], "state");

    installAccessor(constructors["PresentationConnection"], "onconnect");

    installAccessor(constructors["PresentationConnection"], "onclose");

    installAccessor(constructors["PresentationConnection"], "onterminate");

    installAccessor(constructors["PresentationConnection"], "binaryType");

    installAccessor(constructors["PresentationConnection"], "onmessage");

    installMethod(constructors["PresentationConnection"], "close", 0);

    installMethod(constructors["PresentationConnection"], "send", 1);

    installMethod(constructors["PresentationConnection"], "terminate", 0);

    {
      defineConstructorBacklink(constructors["PresentationConnection"].prototype, constructors["PresentationConnection"]);
    }

    {
      defineToStringTag(constructors["PresentationConnection"].prototype, constructors["PresentationConnection"].name);
    }

}

    {

    installAccessor(constructors["PresentationConnectionList"], "connections");

    installAccessor(constructors["PresentationConnectionList"], "onconnectionavailable");

    {
      defineConstructorBacklink(constructors["PresentationConnectionList"].prototype, constructors["PresentationConnectionList"]);
    }

    {
      defineToStringTag(constructors["PresentationConnectionList"].prototype, constructors["PresentationConnectionList"].name);
    }

}

    {

    installAccessor(constructors["PresentationReceiver"], "connectionList");

    {
      defineConstructorBacklink(constructors["PresentationReceiver"].prototype, constructors["PresentationReceiver"]);
    }

    {
      defineToStringTag(constructors["PresentationReceiver"].prototype, constructors["PresentationReceiver"].name);
    }

}

}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.presentationProperty(this, name); },
    set [name](value) { runtime.setPresentationProperty(this, name, value); },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (eventHandlers.has(name)
      || name === "binaryType"
      || name === "defaultRequest") {
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
      return runtime.presentationOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
