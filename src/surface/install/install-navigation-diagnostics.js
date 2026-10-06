import * as runtime from "../api/navigation-diagnostics/navigation-diagnostics-runtime.js";
import {
  NAVIGATION_DIAGNOSTIC_SURFACES,
} from "../api/navigation-diagnostics/navigation-diagnostics-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze({
  FragmentDirective: runtime.FragmentDirective,
  NotRestoredReasonDetails: runtime.NotRestoredReasonDetails,
  NotRestoredReasons: runtime.NotRestoredReasons,
});

export function installNavigationDiagnostics() {

    delete runtime.navigationDiagnosticConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.navigationDiagnosticConstructors[0].name, runtime.navigationDiagnosticConstructors[0]);

    delete runtime.navigationDiagnosticConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.navigationDiagnosticConstructors[1].name, runtime.navigationDiagnosticConstructors[1]);

    delete runtime.navigationDiagnosticConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.navigationDiagnosticConstructors[2].name, runtime.navigationDiagnosticConstructors[2]);

    {

    {
      defineConstructorBacklink(constructors["FragmentDirective"].prototype, constructors["FragmentDirective"]);
    }

    {
      defineToStringTag(constructors["FragmentDirective"].prototype, constructors["FragmentDirective"].name);
    }

}

    {

    installAccessor(constructors["NotRestoredReasonDetails"], "reason");

    installMethod(constructors["NotRestoredReasonDetails"], "toJSON", 0);

    {
      defineConstructorBacklink(constructors["NotRestoredReasonDetails"].prototype, constructors["NotRestoredReasonDetails"]);
    }

    {
      defineToStringTag(constructors["NotRestoredReasonDetails"].prototype, constructors["NotRestoredReasonDetails"].name);
    }

}

    {

    installAccessor(constructors["NotRestoredReasons"], "src");

    installAccessor(constructors["NotRestoredReasons"], "id");

    installAccessor(constructors["NotRestoredReasons"], "name");

    installAccessor(constructors["NotRestoredReasons"], "url");

    installAccessor(constructors["NotRestoredReasons"], "reasons");

    installAccessor(constructors["NotRestoredReasons"], "children");

    installMethod(constructors["NotRestoredReasons"], "toJSON", 0);

    {
      defineConstructorBacklink(constructors["NotRestoredReasons"].prototype, constructors["NotRestoredReasons"]);
    }

    {
      defineToStringTag(constructors["NotRestoredReasons"].prototype, constructors["NotRestoredReasons"].name);
    }

}

}

function installAccessor(Constructor, name) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.navigationDiagnosticProperty(this, name);
    },
  }, name).get;
  registerNativeGetter(getter, name);
  definePrototypeGetter(Constructor.prototype, name, getter);
}

function installMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.navigationDiagnosticOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
