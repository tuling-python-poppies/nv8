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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze({
  FragmentDirective: runtime.FragmentDirective,
  NotRestoredReasonDetails: runtime.NotRestoredReasonDetails,
  NotRestoredReasons: runtime.NotRestoredReasons,
});

export function installNavigationDiagnostics() {
  do {
    delete (((runtime.navigationDiagnosticConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.navigationDiagnosticConstructors)[0])).name, (((runtime.navigationDiagnosticConstructors)[0])));
  } while (false);
do {
    delete (((runtime.navigationDiagnosticConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.navigationDiagnosticConstructors)[1])).name, (((runtime.navigationDiagnosticConstructors)[1])));
  } while (false);
do {
    delete (((runtime.navigationDiagnosticConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.navigationDiagnosticConstructors)[2])).name, (((runtime.navigationDiagnosticConstructors)[2])));
  } while (false);
  do {
    {
  do {
    {
      defineConstructorBacklink((constructors[("FragmentDirective")]).prototype, (constructors[("FragmentDirective")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("FragmentDirective")]).prototype, (constructors[("FragmentDirective")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("NotRestoredReasonDetails")]), ("reason"));
  } while (false);
do {
    installMethod((constructors[("NotRestoredReasonDetails")]), ("toJSON"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("NotRestoredReasonDetails")]).prototype, (constructors[("NotRestoredReasonDetails")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("NotRestoredReasonDetails")]).prototype, (constructors[("NotRestoredReasonDetails")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("NotRestoredReasons")]), ("src"));
  } while (false);
do {
    installAccessor((constructors[("NotRestoredReasons")]), ("id"));
  } while (false);
do {
    installAccessor((constructors[("NotRestoredReasons")]), ("name"));
  } while (false);
do {
    installAccessor((constructors[("NotRestoredReasons")]), ("url"));
  } while (false);
do {
    installAccessor((constructors[("NotRestoredReasons")]), ("reasons"));
  } while (false);
do {
    installAccessor((constructors[("NotRestoredReasons")]), ("children"));
  } while (false);
do {
    installMethod((constructors[("NotRestoredReasons")]), ("toJSON"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("NotRestoredReasons")]).prototype, (constructors[("NotRestoredReasons")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("NotRestoredReasons")]).prototype, (constructors[("NotRestoredReasons")]).name);
    }
  } while (false);
}
  } while (false);
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
