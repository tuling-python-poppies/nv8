import * as runtime from "../api/highlight/highlight-runtime.js";
import { HIGHLIGHT_SURFACES } from "../api/highlight/highlight-surface.js";
import {
  defineConstructorBacklink, defineGlobalConstructor, definePrototypeAccessor,
  definePrototypeGetter, definePrototypeMethod, defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction, registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.highlightConstructors.map(Constructor => [Constructor.name, Constructor]),
));

export function installHighlight() {
  do {
    delete (((runtime.highlightConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.highlightConstructors)[0])).name, (((runtime.highlightConstructors)[0])));
  } while (false);
do {
    delete (((runtime.highlightConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.highlightConstructors)[1])).name, (((runtime.highlightConstructors)[1])));
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("Highlight")]), ("priority"));
  } while (false);
do {
    installAccessor((constructors[("Highlight")]), ("type"));
  } while (false);
do {
    installAccessor((constructors[("Highlight")]), ("size"));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("add"), (1));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("clear"), (0));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("delete"), (1));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("has"), (1));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("Highlight")]), ("values"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("Highlight")]).prototype, (constructors[("Highlight")]));
  } while (false);
do {
    defineToStringTag((constructors[("Highlight")]).prototype, (constructors[("Highlight")]).name);
  } while (false);
do {
    {
      const callback = { [("values")]() { return runtime.highlightIterator(this); } }[("values")];
      registerNativeFunction(callback, ("values"));
      Object.defineProperty((constructors[("Highlight")]).prototype, Symbol.iterator, {
        value: callback, writable: true, enumerable: false, configurable: true,
      });
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("HighlightRegistry")]), ("size"));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("clear"), (0));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("delete"), (1));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("get"), (1));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("has"), (1));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("set"), (2));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("values"), (0));
  } while (false);
do {
    installMethod((constructors[("HighlightRegistry")]), ("highlightsFromPoint"), (2));
  } while (false);
do {
    defineConstructorBacklink((constructors[("HighlightRegistry")]).prototype, (constructors[("HighlightRegistry")]));
  } while (false);
do {
    defineToStringTag((constructors[("HighlightRegistry")]).prototype, (constructors[("HighlightRegistry")]).name);
  } while (false);
do {
    {
      const callback = { [("entries")]() { return runtime.highlightIterator(this); } }[("entries")];
      registerNativeFunction(callback, ("entries"));
      Object.defineProperty((constructors[("HighlightRegistry")]).prototype, Symbol.iterator, {
        value: callback, writable: true, enumerable: false, configurable: true,
      });
    }
  } while (false);
}
  } while (false);
  Object.defineProperty(globalThis.CSS, "highlights", {
    value: runtime.createHighlightRegistry(),
    writable: false,
    enumerable: true,
    configurable: true,
  });
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.highlightProperty(this, name); },
    set [name](value) { runtime.setHighlightProperty(this, name, value); },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (["priority", "type"].includes(name)) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(Constructor.prototype, name, descriptor.get, descriptor.set);
  } else definePrototypeGetter(Constructor.prototype, name, descriptor.get);
}

function installMethod(Constructor, name, length) {
  const callback = { [name](...args) {
    return runtime.highlightOperation(this, name, args);
  } }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
