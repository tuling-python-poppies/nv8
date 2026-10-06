import * as runtime from "../api/identity-services/identity-services-runtime.js";
import {
  IDENTITY_SERVICE_SURFACES,
} from "../api/identity-services/identity-services-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.identityServiceConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installIdentityServices() {

    delete runtime.identityServiceConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.identityServiceConstructors[0].name, runtime.identityServiceConstructors[0]);

    delete runtime.identityServiceConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.identityServiceConstructors[1].name, runtime.identityServiceConstructors[1]);

    delete runtime.identityServiceConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.identityServiceConstructors[2].name, runtime.identityServiceConstructors[2]);

  {
  {
      const callback = {
        ["queryFeatureSupport"](...args) {
          return runtime.identityServiceOperation(this, "queryFeatureSupport", args);
        },
      }["queryFeatureSupport"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "queryFeatureSupport");
      definePrototypeMethod(constructors["ProtectedAudience"].prototype, "queryFeatureSupport", callback);
    }

    {
      defineConstructorBacklink(constructors["ProtectedAudience"].prototype, constructors["ProtectedAudience"]);
    }

    {
      defineToStringTag(constructors["ProtectedAudience"].prototype, constructors["ProtectedAudience"].name);
    }

}

    {

    {
      defineConstructorBacklink(constructors["IdentityProvider"].prototype, constructors["IdentityProvider"]);
    }

    {
      defineToStringTag(constructors["IdentityProvider"].prototype, constructors["IdentityProvider"].name);
    }

}

{
  {
      const callback = {
        ["setStatus"](...args) {
          return runtime.identityServiceOperation(this, "setStatus", args);
        },
      }["setStatus"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "setStatus");
      definePrototypeMethod(constructors["NavigatorLogin"].prototype, "setStatus", callback);
    }

    {
      defineConstructorBacklink(constructors["NavigatorLogin"].prototype, constructors["NavigatorLogin"]);
    }

    {
      defineToStringTag(constructors["NavigatorLogin"].prototype, constructors["NavigatorLogin"].name);
    }

}
  installStatic(runtime.IdentityProvider, "close", 0,
    runtime.identityProviderClose);
  installStatic(runtime.IdentityProvider, "getUserInfo", 1,
    runtime.identityProviderGetUserInfo);
  installStatic(runtime.IdentityProvider, "resolve", 1,
    runtime.identityProviderResolve);
}

function installStatic(Constructor, name, length, operation) {
  const callback = {
    [name](...args) {
      return operation(...args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
