import { Event } from "../api/event/event-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  SpeechSynthesis,
  SpeechSynthesisErrorEvent,
  SpeechSynthesisEvent,
  SpeechSynthesisUtterance,
  SpeechSynthesisVoice,
  createSpeechSynthesis,
  setSpeechProperty,
  speechConstructors,
  speechOperation,
  speechProperty,
} from "../api/speech/speech-runtime.js";
import { SPEECH_SURFACES } from "../api/speech/speech-surface.js";
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
  SpeechSynthesis,
  SpeechSynthesisErrorEvent,
  SpeechSynthesisEvent,
  SpeechSynthesisUtterance,
  SpeechSynthesisVoice,
});

const settable = new Set([
  "onvoiceschanged",
  "text",
  "lang",
  "voice",
  "volume",
  "rate",
  "pitch",
  "onstart",
  "onend",
  "onerror",
  "onpause",
  "onresume",
  "onmark",
  "onboundary",
]);

export function installSpeech() {
  do {
    delete (((speechConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((speechConstructors)[0])).name, (((speechConstructors)[0])));
  } while (false);
do {
    delete (((speechConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((speechConstructors)[1])).name, (((speechConstructors)[1])));
  } while (false);
do {
    delete (((speechConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((speechConstructors)[2])).name, (((speechConstructors)[2])));
  } while (false);
do {
    delete (((speechConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((speechConstructors)[3])).name, (((speechConstructors)[3])));
  } while (false);
do {
    delete (((speechConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((speechConstructors)[4])).name, (((speechConstructors)[4])));
  } while (false);
  do {
    const Constructor = constructors[("SpeechSynthesis")];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[0]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("SpeechSynthesisErrorEvent")];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[1]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("SpeechSynthesisEvent")];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[2]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("SpeechSynthesisUtterance")];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[3]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("SpeechSynthesisVoice")];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[4]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("SpeechSynthesis")]), ("pending"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesis")]), ("speaking"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesis")]), ("paused"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesis")]), ("onvoiceschanged"));
  } while (false);
do {
    installMethod((constructors[("SpeechSynthesis")]), ("cancel"), (0));
  } while (false);
do {
    installMethod((constructors[("SpeechSynthesis")]), ("getVoices"), (0));
  } while (false);
do {
    installMethod((constructors[("SpeechSynthesis")]), ("pause"), (0));
  } while (false);
do {
    installMethod((constructors[("SpeechSynthesis")]), ("resume"), (0));
  } while (false);
do {
    installMethod((constructors[("SpeechSynthesis")]), ("speak"), (1));
  } while (false);
do {
    installMethod((constructors[("SpeechSynthesis")]), ("preload"), (2));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechSynthesis")]).prototype, (constructors[("SpeechSynthesis")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechSynthesis")]).prototype, (constructors[("SpeechSynthesis")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("SpeechSynthesisErrorEvent")]), ("error"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechSynthesisErrorEvent")]).prototype, (constructors[("SpeechSynthesisErrorEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechSynthesisErrorEvent")]).prototype, (constructors[("SpeechSynthesisErrorEvent")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("SpeechSynthesisEvent")]), ("utterance"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisEvent")]), ("charIndex"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisEvent")]), ("charLength"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisEvent")]), ("elapsedTime"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisEvent")]), ("name"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechSynthesisEvent")]).prototype, (constructors[("SpeechSynthesisEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechSynthesisEvent")]).prototype, (constructors[("SpeechSynthesisEvent")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("text"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("lang"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("voice"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("volume"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("rate"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("pitch"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("onstart"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("onend"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("onerror"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("onpause"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("onresume"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("onmark"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisUtterance")]), ("onboundary"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechSynthesisUtterance")]).prototype, (constructors[("SpeechSynthesisUtterance")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechSynthesisUtterance")]).prototype, (constructors[("SpeechSynthesisUtterance")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("SpeechSynthesisVoice")]), ("voiceURI"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisVoice")]), ("name"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisVoice")]), ("lang"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisVoice")]), ("localService"));
  } while (false);
do {
    installAccessor((constructors[("SpeechSynthesisVoice")]), ("default"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechSynthesisVoice")]).prototype, (constructors[("SpeechSynthesisVoice")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechSynthesisVoice")]).prototype, (constructors[("SpeechSynthesisVoice")]).name);
    }
  } while (false);
}
  } while (false);
  const synthesis = createSpeechSynthesis();
  const descriptor = Object.getOwnPropertyDescriptor({
    get speechSynthesis() {
      return synthesis;
    },
  }, "speechSynthesis");
  registerNativeGetter(descriptor.get, "speechSynthesis");
  Object.defineProperty(globalThis, "speechSynthesis", {
    get: descriptor.get,
    enumerable: true,
    configurable: true,
  });
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return speechProperty(this, name);
    },
    set [name](value) {
      setSpeechProperty(this, name, value);
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
      return speechOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
