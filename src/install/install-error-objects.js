import { DOMException } from "../api/event/dom-exception-constructor.js";
import * as runtime from "../api/error-objects/error-objects-runtime.js";
import {
  ERROR_OBJECT_SURFACES,
} from "../api/error-objects/error-objects-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { registerNativeGetter } from "../webidl/native-function.js";

const constructors = Object.freeze({
  DOMError: runtime.DOMError,
  QuotaExceededError: runtime.QuotaExceededError,
});

export function installErrorObjects() {
  do {
    delete (((runtime.errorObjectConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.errorObjectConstructors)[0])).name, (((runtime.errorObjectConstructors)[0])));
  } while (false);
do {
    delete (((runtime.errorObjectConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.errorObjectConstructors)[1])).name, (((runtime.errorObjectConstructors)[1])));
  } while (false);
  Object.setPrototypeOf(
    runtime.QuotaExceededError.prototype,
    DOMException.prototype,
  );
  Object.setPrototypeOf(runtime.QuotaExceededError, DOMException);
  do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("name")]() {
          return runtime.errorObjectProperty(this, ("name"));
        },
      }, ("name")).get;
      registerNativeGetter(getter, ("name"));
      definePrototypeGetter((constructors[("DOMError")]).prototype, ("name"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("message")]() {
          return runtime.errorObjectProperty(this, ("message"));
        },
      }, ("message")).get;
      registerNativeGetter(getter, ("message"));
      definePrototypeGetter((constructors[("DOMError")]).prototype, ("message"), getter);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("DOMError")]).prototype, (constructors[("DOMError")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("DOMError")]).prototype, (constructors[("DOMError")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("quota")]() {
          return runtime.errorObjectProperty(this, ("quota"));
        },
      }, ("quota")).get;
      registerNativeGetter(getter, ("quota"));
      definePrototypeGetter((constructors[("QuotaExceededError")]).prototype, ("quota"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("requested")]() {
          return runtime.errorObjectProperty(this, ("requested"));
        },
      }, ("requested")).get;
      registerNativeGetter(getter, ("requested"));
      definePrototypeGetter((constructors[("QuotaExceededError")]).prototype, ("requested"), getter);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("QuotaExceededError")]).prototype, (constructors[("QuotaExceededError")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("QuotaExceededError")]).prototype, (constructors[("QuotaExceededError")]).name);
    }
  } while (false);
}
  } while (false);
}


