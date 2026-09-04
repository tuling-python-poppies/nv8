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
  do {
    delete (((runtime.presentationConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.presentationConstructors)[0])).name, (((runtime.presentationConstructors)[0])));
  } while (false);
do {
    delete (((runtime.presentationConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.presentationConstructors)[1])).name, (((runtime.presentationConstructors)[1])));
  } while (false);
do {
    delete (((runtime.presentationConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.presentationConstructors)[2])).name, (((runtime.presentationConstructors)[2])));
  } while (false);
do {
    delete (((runtime.presentationConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.presentationConstructors)[3])).name, (((runtime.presentationConstructors)[3])));
  } while (false);
do {
    delete (((runtime.presentationConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.presentationConstructors)[4])).name, (((runtime.presentationConstructors)[4])));
  } while (false);
do {
    delete (((runtime.presentationConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.presentationConstructors)[5])).name, (((runtime.presentationConstructors)[5])));
  } while (false);
  do {
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[0])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[0])), EventTarget);
  } while (false);
do {
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[1])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[1])), EventTarget);
  } while (false);
do {
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[2])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[2])), EventTarget);
  } while (false);
do {
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[3])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([
    runtime.PresentationRequest,
    runtime.PresentationAvailability,
    runtime.PresentationConnection,
    runtime.PresentationConnectionList,
  ])[3])), EventTarget);
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("Presentation")]), ("defaultRequest"));
  } while (false);
do {
    installAccessor((constructors[("Presentation")]), ("receiver"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Presentation")]).prototype, (constructors[("Presentation")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Presentation")]).prototype, (constructors[("Presentation")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("PresentationRequest")]), ("onconnectionavailable"));
  } while (false);
do {
    installMethod((constructors[("PresentationRequest")]), ("getAvailability"), (0));
  } while (false);
do {
    installMethod((constructors[("PresentationRequest")]), ("reconnect"), (1));
  } while (false);
do {
    installMethod((constructors[("PresentationRequest")]), ("start"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("PresentationRequest")]).prototype, (constructors[("PresentationRequest")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("PresentationRequest")]).prototype, (constructors[("PresentationRequest")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("PresentationAvailability")]), ("value"));
  } while (false);
do {
    installAccessor((constructors[("PresentationAvailability")]), ("onchange"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("PresentationAvailability")]).prototype, (constructors[("PresentationAvailability")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("PresentationAvailability")]).prototype, (constructors[("PresentationAvailability")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("PresentationConnection")]), ("id"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnection")]), ("url"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnection")]), ("state"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnection")]), ("onconnect"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnection")]), ("onclose"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnection")]), ("onterminate"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnection")]), ("binaryType"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnection")]), ("onmessage"));
  } while (false);
do {
    installMethod((constructors[("PresentationConnection")]), ("close"), (0));
  } while (false);
do {
    installMethod((constructors[("PresentationConnection")]), ("send"), (1));
  } while (false);
do {
    installMethod((constructors[("PresentationConnection")]), ("terminate"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("PresentationConnection")]).prototype, (constructors[("PresentationConnection")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("PresentationConnection")]).prototype, (constructors[("PresentationConnection")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("PresentationConnectionList")]), ("connections"));
  } while (false);
do {
    installAccessor((constructors[("PresentationConnectionList")]), ("onconnectionavailable"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("PresentationConnectionList")]).prototype, (constructors[("PresentationConnectionList")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("PresentationConnectionList")]).prototype, (constructors[("PresentationConnectionList")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("PresentationReceiver")]), ("connectionList"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("PresentationReceiver")]).prototype, (constructors[("PresentationReceiver")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("PresentationReceiver")]).prototype, (constructors[("PresentationReceiver")]).name);
    }
  } while (false);
}
  } while (false);
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
