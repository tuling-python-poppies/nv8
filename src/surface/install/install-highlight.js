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

    delete runtime.highlightConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.highlightConstructors[0].name, runtime.highlightConstructors[0]);

    delete runtime.highlightConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.highlightConstructors[1].name, runtime.highlightConstructors[1]);

  {

    installAccessor(constructors["Highlight"], "priority");

    installAccessor(constructors["Highlight"], "type");

    installAccessor(constructors["Highlight"], "size");

    installMethod(constructors["Highlight"], "add", 1);

    installMethod(constructors["Highlight"], "clear", 0);

    installMethod(constructors["Highlight"], "delete", 1);

    installMethod(constructors["Highlight"], "entries", 0);

    installMethod(constructors["Highlight"], "forEach", 1);

    installMethod(constructors["Highlight"], "has", 1);

    installMethod(constructors["Highlight"], "keys", 0);

    installMethod(constructors["Highlight"], "values", 0);

    defineConstructorBacklink(constructors["Highlight"].prototype, constructors["Highlight"]);

    defineToStringTag(constructors["Highlight"].prototype, constructors["Highlight"].name);

{
      const callback = { ["values"]() { return runtime.highlightIterator(this); } }["values"];
      registerNativeFunction(callback, "values");
      Object.defineProperty(constructors["Highlight"].prototype, Symbol.iterator, {
        value: callback, writable: true, enumerable: false, configurable: true,
      });
    }
}
{

    installAccessor(constructors["HighlightRegistry"], "size");

    installMethod(constructors["HighlightRegistry"], "clear", 0);

    installMethod(constructors["HighlightRegistry"], "delete", 1);

    installMethod(constructors["HighlightRegistry"], "entries", 0);

    installMethod(constructors["HighlightRegistry"], "forEach", 1);

    installMethod(constructors["HighlightRegistry"], "get", 1);

    installMethod(constructors["HighlightRegistry"], "has", 1);

    installMethod(constructors["HighlightRegistry"], "keys", 0);

    installMethod(constructors["HighlightRegistry"], "set", 2);

    installMethod(constructors["HighlightRegistry"], "values", 0);

    installMethod(constructors["HighlightRegistry"], "highlightsFromPoint", 2);

    defineConstructorBacklink(constructors["HighlightRegistry"].prototype, constructors["HighlightRegistry"]);

    defineToStringTag(constructors["HighlightRegistry"].prototype, constructors["HighlightRegistry"].name);

{
      const callback = { ["entries"]() { return runtime.highlightIterator(this); } }["entries"];
      registerNativeFunction(callback, "entries");
      Object.defineProperty(constructors["HighlightRegistry"].prototype, Symbol.iterator, {
        value: callback, writable: true, enumerable: false, configurable: true,
      });
    }
}
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
