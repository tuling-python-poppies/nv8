import * as runtime from "../api/observable/observable-runtime.js";
import {
  OBSERVABLE_SURFACES,
} from "../api/observable/observable-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineStaticMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze({
  Subscriber: runtime.Subscriber,
  Observable: runtime.Observable,
});

export function installObservable() {
  do {
    delete (((runtime.observableConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.observableConstructors)[0])).name, (((runtime.observableConstructors)[0])));
  } while (false);
do {
    delete (((runtime.observableConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.observableConstructors)[1])).name, (((runtime.observableConstructors)[1])));
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("Subscriber")]), ("active"));
  } while (false);
do {
    installAccessor((constructors[("Subscriber")]), ("signal"));
  } while (false);
do {
    installMethod((constructors[("Subscriber")]), ("addTeardown"), (1));
  } while (false);
do {
    installMethod((constructors[("Subscriber")]), ("complete"), (0));
  } while (false);
do {
    installMethod((constructors[("Subscriber")]), ("error"), (1));
  } while (false);
do {
    installMethod((constructors[("Subscriber")]), ("next"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Subscriber")]).prototype, (constructors[("Subscriber")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Subscriber")]).prototype, (constructors[("Subscriber")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("Observable")]), ("catch"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("drop"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("every"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("filter"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("finally"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("find"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("first"), (0));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("flatMap"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("inspect"), (0));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("last"), (0));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("map"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("reduce"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("some"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("subscribe"), (0));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("switchMap"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("take"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("takeUntil"), (1));
  } while (false);
do {
    installMethod((constructors[("Observable")]), ("toArray"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Observable")]).prototype, (constructors[("Observable")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Observable")]).prototype, (constructors[("Observable")]).name);
    }
  } while (false);
}
  } while (false);
  defineStaticMethod(runtime.Observable, "from", runtime.observableFrom, 1);
}



function installAccessor(Constructor, name) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.observableProperty(this, name);
    },
  }, name).get;
  registerNativeGetter(getter, name);
  definePrototypeGetter(Constructor.prototype, name, getter);
}

function installMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.observableOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
