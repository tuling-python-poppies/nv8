import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/midi/midi-runtime.js";
import { MIDI_SURFACES } from "../api/midi/midi-surface.js";
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

const constructors = Object.freeze(Object.fromEntries(
  runtime.midiConstructors.map(Constructor => [Constructor.name, Constructor]),
));
const eventHandlers = new Set(["onstatechange", "onmidimessage"]);

export function installMIDI() {

    delete runtime.midiConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.midiConstructors[0].name, runtime.midiConstructors[0]);

    delete runtime.midiConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.midiConstructors[1].name, runtime.midiConstructors[1]);

    delete runtime.midiConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.midiConstructors[2].name, runtime.midiConstructors[2]);

    delete runtime.midiConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.midiConstructors[3].name, runtime.midiConstructors[3]);

    delete runtime.midiConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.midiConstructors[4].name, runtime.midiConstructors[4]);

    delete runtime.midiConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.midiConstructors[5].name, runtime.midiConstructors[5]);

  inherit(runtime.MIDIAccess, EventTarget);
  inherit(runtime.MIDIPort, EventTarget);
  inherit(runtime.MIDIInput, runtime.MIDIPort);
  inherit(runtime.MIDIOutput, runtime.MIDIPort);

    {

    installAccessor(constructors["MIDIAccess"], "inputs");

    installAccessor(constructors["MIDIAccess"], "outputs");

    installAccessor(constructors["MIDIAccess"], "sysexEnabled");

    installAccessor(constructors["MIDIAccess"], "onstatechange");

    {
      defineConstructorBacklink(constructors["MIDIAccess"].prototype, constructors["MIDIAccess"]);
    }

    {
      defineToStringTag(constructors["MIDIAccess"].prototype, constructors["MIDIAccess"].name);
    }

}

    {

    installAccessor(constructors["MIDIPort"], "connection");

    installAccessor(constructors["MIDIPort"], "id");

    installAccessor(constructors["MIDIPort"], "manufacturer");

    installAccessor(constructors["MIDIPort"], "name");

    installAccessor(constructors["MIDIPort"], "state");

    installAccessor(constructors["MIDIPort"], "type");

    installAccessor(constructors["MIDIPort"], "version");

    installAccessor(constructors["MIDIPort"], "onstatechange");

    installMethod(constructors["MIDIPort"], "close", 0);

    installMethod(constructors["MIDIPort"], "open", 0);

    {
      defineConstructorBacklink(constructors["MIDIPort"].prototype, constructors["MIDIPort"]);
    }

    {
      defineToStringTag(constructors["MIDIPort"].prototype, constructors["MIDIPort"].name);
    }

}

    {

    installAccessor(constructors["MIDIInput"], "onmidimessage");

    {
      defineConstructorBacklink(constructors["MIDIInput"].prototype, constructors["MIDIInput"]);
    }

    {
      defineToStringTag(constructors["MIDIInput"].prototype, constructors["MIDIInput"].name);
    }

}

    {

    installMethod(constructors["MIDIOutput"], "send", 1);

    {
      defineConstructorBacklink(constructors["MIDIOutput"].prototype, constructors["MIDIOutput"]);
    }

    {
      defineToStringTag(constructors["MIDIOutput"].prototype, constructors["MIDIOutput"].name);
    }

}

{

    installAccessor(constructors["MIDIInputMap"], "size");

    installMethod(constructors["MIDIInputMap"], "entries", 0);

    installMethod(constructors["MIDIInputMap"], "forEach", 1);

    installMethod(constructors["MIDIInputMap"], "get", 1);

    installMethod(constructors["MIDIInputMap"], "has", 1);

    installMethod(constructors["MIDIInputMap"], "keys", 0);

    installMethod(constructors["MIDIInputMap"], "values", 0);

    {
      defineConstructorBacklink(constructors["MIDIInputMap"].prototype, constructors["MIDIInputMap"]);
    }

    {
      defineToStringTag(constructors["MIDIInputMap"].prototype, constructors["MIDIInputMap"].name);
    }

{
      const callback = {
        ["entries"]() { return runtime.midiIterator(this); },
      }["entries"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "entries");
      Object.defineProperty(constructors["MIDIInputMap"].prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
}
{

    installAccessor(constructors["MIDIOutputMap"], "size");

    installMethod(constructors["MIDIOutputMap"], "entries", 0);

    installMethod(constructors["MIDIOutputMap"], "forEach", 1);

    installMethod(constructors["MIDIOutputMap"], "get", 1);

    installMethod(constructors["MIDIOutputMap"], "has", 1);

    installMethod(constructors["MIDIOutputMap"], "keys", 0);

    installMethod(constructors["MIDIOutputMap"], "values", 0);

    {
      defineConstructorBacklink(constructors["MIDIOutputMap"].prototype, constructors["MIDIOutputMap"]);
    }

    {
      defineToStringTag(constructors["MIDIOutputMap"].prototype, constructors["MIDIOutputMap"].name);
    }

{
      const callback = {
        ["entries"]() { return runtime.midiIterator(this); },
      }["entries"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "entries");
      Object.defineProperty(constructors["MIDIOutputMap"].prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
}
}

function inherit(Constructor, Parent) {
  Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
  Object.setPrototypeOf(Constructor, Parent);
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.midiProperty(this, name); },
    set [name](value) { runtime.setMIDIProperty(this, name, value); },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (eventHandlers.has(name)) {
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
    [name](...args) { return runtime.midiOperation(this, name, args); },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
