import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/edit-context/edit-context-runtime.js";
import {
  EDIT_CONTEXT_SURFACES,
} from "../api/edit-context/edit-context-surface.js";
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

const constructors = Object.freeze({
  TextFormat: runtime.TextFormat,
  EditContext: runtime.EditContext,
});
const settable = new Set([
  "ontextupdate",
  "ontextformatupdate",
  "oncharacterboundsupdate",
  "oncompositionstart",
  "oncompositionend",
]);

export function installEditContext() {
  do {
    delete (((runtime.editContextConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.editContextConstructors)[0])).name, (((runtime.editContextConstructors)[0])));
  } while (false);
do {
    delete (((runtime.editContextConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.editContextConstructors)[1])).name, (((runtime.editContextConstructors)[1])));
  } while (false);
  Object.setPrototypeOf(runtime.EditContext.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.EditContext, EventTarget);
  do {
    {
  do {
    installAccessor((constructors[("TextFormat")]), ("rangeStart"));
  } while (false);
do {
    installAccessor((constructors[("TextFormat")]), ("rangeEnd"));
  } while (false);
do {
    installAccessor((constructors[("TextFormat")]), ("underlineStyle"));
  } while (false);
do {
    installAccessor((constructors[("TextFormat")]), ("underlineThickness"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("TextFormat")]).prototype, (constructors[("TextFormat")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("TextFormat")]).prototype, (constructors[("TextFormat")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("EditContext")]), ("text"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("selectionStart"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("selectionEnd"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("characterBoundsRangeStart"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("ontextupdate"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("ontextformatupdate"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("oncharacterboundsupdate"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("oncompositionstart"));
  } while (false);
do {
    installAccessor((constructors[("EditContext")]), ("oncompositionend"));
  } while (false);
do {
    installMethod((constructors[("EditContext")]), ("attachedElements"), (0));
  } while (false);
do {
    installMethod((constructors[("EditContext")]), ("characterBounds"), (0));
  } while (false);
do {
    installMethod((constructors[("EditContext")]), ("updateCharacterBounds"), (2));
  } while (false);
do {
    installMethod((constructors[("EditContext")]), ("updateControlBounds"), (1));
  } while (false);
do {
    installMethod((constructors[("EditContext")]), ("updateSelection"), (2));
  } while (false);
do {
    installMethod((constructors[("EditContext")]), ("updateSelectionBounds"), (1));
  } while (false);
do {
    installMethod((constructors[("EditContext")]), ("updateText"), (3));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("EditContext")]).prototype, (constructors[("EditContext")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("EditContext")]).prototype, (constructors[("EditContext")]).name);
    }
  } while (false);
}
  } while (false);
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.editContextProperty(this, name);
    },
    set [name](value) {
      runtime.setEditContextProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (settable.has(name)) {
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
      return runtime.editContextOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
