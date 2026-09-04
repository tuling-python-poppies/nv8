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
  do {
    delete (((runtime.midiConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.midiConstructors)[0])).name, (((runtime.midiConstructors)[0])));
  } while (false);
do {
    delete (((runtime.midiConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.midiConstructors)[1])).name, (((runtime.midiConstructors)[1])));
  } while (false);
do {
    delete (((runtime.midiConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.midiConstructors)[2])).name, (((runtime.midiConstructors)[2])));
  } while (false);
do {
    delete (((runtime.midiConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.midiConstructors)[3])).name, (((runtime.midiConstructors)[3])));
  } while (false);
do {
    delete (((runtime.midiConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.midiConstructors)[4])).name, (((runtime.midiConstructors)[4])));
  } while (false);
do {
    delete (((runtime.midiConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.midiConstructors)[5])).name, (((runtime.midiConstructors)[5])));
  } while (false);
  inherit(runtime.MIDIAccess, EventTarget);
  inherit(runtime.MIDIPort, EventTarget);
  inherit(runtime.MIDIInput, runtime.MIDIPort);
  inherit(runtime.MIDIOutput, runtime.MIDIPort);
  do {
    {
  do {
    installAccessor((constructors[("MIDIAccess")]), ("inputs"));
  } while (false);
do {
    installAccessor((constructors[("MIDIAccess")]), ("outputs"));
  } while (false);
do {
    installAccessor((constructors[("MIDIAccess")]), ("sysexEnabled"));
  } while (false);
do {
    installAccessor((constructors[("MIDIAccess")]), ("onstatechange"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("MIDIAccess")]).prototype, (constructors[("MIDIAccess")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("MIDIAccess")]).prototype, (constructors[("MIDIAccess")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("MIDIPort")]), ("connection"));
  } while (false);
do {
    installAccessor((constructors[("MIDIPort")]), ("id"));
  } while (false);
do {
    installAccessor((constructors[("MIDIPort")]), ("manufacturer"));
  } while (false);
do {
    installAccessor((constructors[("MIDIPort")]), ("name"));
  } while (false);
do {
    installAccessor((constructors[("MIDIPort")]), ("state"));
  } while (false);
do {
    installAccessor((constructors[("MIDIPort")]), ("type"));
  } while (false);
do {
    installAccessor((constructors[("MIDIPort")]), ("version"));
  } while (false);
do {
    installAccessor((constructors[("MIDIPort")]), ("onstatechange"));
  } while (false);
do {
    installMethod((constructors[("MIDIPort")]), ("close"), (0));
  } while (false);
do {
    installMethod((constructors[("MIDIPort")]), ("open"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("MIDIPort")]).prototype, (constructors[("MIDIPort")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("MIDIPort")]).prototype, (constructors[("MIDIPort")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("MIDIInput")]), ("onmidimessage"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("MIDIInput")]).prototype, (constructors[("MIDIInput")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("MIDIInput")]).prototype, (constructors[("MIDIInput")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("MIDIOutput")]), ("send"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("MIDIOutput")]).prototype, (constructors[("MIDIOutput")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("MIDIOutput")]).prototype, (constructors[("MIDIOutput")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("MIDIInputMap")]), ("size"));
  } while (false);
do {
    installMethod((constructors[("MIDIInputMap")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("MIDIInputMap")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("MIDIInputMap")]), ("get"), (1));
  } while (false);
do {
    installMethod((constructors[("MIDIInputMap")]), ("has"), (1));
  } while (false);
do {
    installMethod((constructors[("MIDIInputMap")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("MIDIInputMap")]), ("values"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("MIDIInputMap")]).prototype, (constructors[("MIDIInputMap")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("MIDIInputMap")]).prototype, (constructors[("MIDIInputMap")]).name);
    }
  } while (false);
do {
    {
      const callback = {
        [("entries")]() { return runtime.midiIterator(this); },
      }[("entries")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("entries"));
      Object.defineProperty((constructors[("MIDIInputMap")]).prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("MIDIOutputMap")]), ("size"));
  } while (false);
do {
    installMethod((constructors[("MIDIOutputMap")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("MIDIOutputMap")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("MIDIOutputMap")]), ("get"), (1));
  } while (false);
do {
    installMethod((constructors[("MIDIOutputMap")]), ("has"), (1));
  } while (false);
do {
    installMethod((constructors[("MIDIOutputMap")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("MIDIOutputMap")]), ("values"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("MIDIOutputMap")]).prototype, (constructors[("MIDIOutputMap")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("MIDIOutputMap")]).prototype, (constructors[("MIDIOutputMap")]).name);
    }
  } while (false);
do {
    {
      const callback = {
        [("entries")]() { return runtime.midiIterator(this); },
      }[("entries")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("entries"));
      Object.defineProperty((constructors[("MIDIOutputMap")]).prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  } while (false);
}
  } while (false);
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
