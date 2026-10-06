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

    delete runtime.observableConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.observableConstructors[0].name, runtime.observableConstructors[0]);

    delete runtime.observableConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.observableConstructors[1].name, runtime.observableConstructors[1]);

    {

    installAccessor(constructors["Subscriber"], "active");

    installAccessor(constructors["Subscriber"], "signal");

    installMethod(constructors["Subscriber"], "addTeardown", 1);

    installMethod(constructors["Subscriber"], "complete", 0);

    installMethod(constructors["Subscriber"], "error", 1);

    installMethod(constructors["Subscriber"], "next", 1);

    {
      defineConstructorBacklink(constructors["Subscriber"].prototype, constructors["Subscriber"]);
    }

    {
      defineToStringTag(constructors["Subscriber"].prototype, constructors["Subscriber"].name);
    }

}

    {

    installMethod(constructors["Observable"], "catch", 1);

    installMethod(constructors["Observable"], "drop", 1);

    installMethod(constructors["Observable"], "every", 1);

    installMethod(constructors["Observable"], "filter", 1);

    installMethod(constructors["Observable"], "finally", 1);

    installMethod(constructors["Observable"], "find", 1);

    installMethod(constructors["Observable"], "first", 0);

    installMethod(constructors["Observable"], "flatMap", 1);

    installMethod(constructors["Observable"], "forEach", 1);

    installMethod(constructors["Observable"], "inspect", 0);

    installMethod(constructors["Observable"], "last", 0);

    installMethod(constructors["Observable"], "map", 1);

    installMethod(constructors["Observable"], "reduce", 1);

    installMethod(constructors["Observable"], "some", 1);

    installMethod(constructors["Observable"], "subscribe", 0);

    installMethod(constructors["Observable"], "switchMap", 1);

    installMethod(constructors["Observable"], "take", 1);

    installMethod(constructors["Observable"], "takeUntil", 1);

    installMethod(constructors["Observable"], "toArray", 0);

    {
      defineConstructorBacklink(constructors["Observable"].prototype, constructors["Observable"]);
    }

    {
      defineToStringTag(constructors["Observable"].prototype, constructors["Observable"].name);
    }

}

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
