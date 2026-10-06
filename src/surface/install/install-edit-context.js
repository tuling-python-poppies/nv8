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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

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

    delete runtime.editContextConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.editContextConstructors[0].name, runtime.editContextConstructors[0]);

    delete runtime.editContextConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.editContextConstructors[1].name, runtime.editContextConstructors[1]);

  Object.setPrototypeOf(runtime.EditContext.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.EditContext, EventTarget);

    {

    installAccessor(constructors["TextFormat"], "rangeStart");

    installAccessor(constructors["TextFormat"], "rangeEnd");

    installAccessor(constructors["TextFormat"], "underlineStyle");

    installAccessor(constructors["TextFormat"], "underlineThickness");

    {
      defineConstructorBacklink(constructors["TextFormat"].prototype, constructors["TextFormat"]);
    }

    {
      defineToStringTag(constructors["TextFormat"].prototype, constructors["TextFormat"].name);
    }

}

    {

    installAccessor(constructors["EditContext"], "text");

    installAccessor(constructors["EditContext"], "selectionStart");

    installAccessor(constructors["EditContext"], "selectionEnd");

    installAccessor(constructors["EditContext"], "characterBoundsRangeStart");

    installAccessor(constructors["EditContext"], "ontextupdate");

    installAccessor(constructors["EditContext"], "ontextformatupdate");

    installAccessor(constructors["EditContext"], "oncharacterboundsupdate");

    installAccessor(constructors["EditContext"], "oncompositionstart");

    installAccessor(constructors["EditContext"], "oncompositionend");

    installMethod(constructors["EditContext"], "attachedElements", 0);

    installMethod(constructors["EditContext"], "characterBounds", 0);

    installMethod(constructors["EditContext"], "updateCharacterBounds", 2);

    installMethod(constructors["EditContext"], "updateControlBounds", 1);

    installMethod(constructors["EditContext"], "updateSelection", 2);

    installMethod(constructors["EditContext"], "updateSelectionBounds", 1);

    installMethod(constructors["EditContext"], "updateText", 3);

    {
      defineConstructorBacklink(constructors["EditContext"].prototype, constructors["EditContext"]);
    }

    {
      defineToStringTag(constructors["EditContext"].prototype, constructors["EditContext"].name);
    }

}

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
