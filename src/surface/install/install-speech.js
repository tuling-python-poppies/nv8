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

    delete speechConstructors[0].prototype.constructor;
    defineGlobalConstructor(speechConstructors[0].name, speechConstructors[0]);

    delete speechConstructors[1].prototype.constructor;
    defineGlobalConstructor(speechConstructors[1].name, speechConstructors[1]);

    delete speechConstructors[2].prototype.constructor;
    defineGlobalConstructor(speechConstructors[2].name, speechConstructors[2]);

    delete speechConstructors[3].prototype.constructor;
    defineGlobalConstructor(speechConstructors[3].name, speechConstructors[3]);

    delete speechConstructors[4].prototype.constructor;
    defineGlobalConstructor(speechConstructors[4].name, speechConstructors[4]);

  {
    const Constructor = constructors["SpeechSynthesis"];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[0]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["SpeechSynthesisErrorEvent"];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[1]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["SpeechSynthesisEvent"];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[2]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["SpeechSynthesisUtterance"];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[3]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["SpeechSynthesisVoice"];
    const parent = constructors[(((((Object.entries(SPEECH_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(SPEECH_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(SPEECH_SURFACES))[4]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }

    {

    installAccessor(constructors["SpeechSynthesis"], "pending");

    installAccessor(constructors["SpeechSynthesis"], "speaking");

    installAccessor(constructors["SpeechSynthesis"], "paused");

    installAccessor(constructors["SpeechSynthesis"], "onvoiceschanged");

    installMethod(constructors["SpeechSynthesis"], "cancel", 0);

    installMethod(constructors["SpeechSynthesis"], "getVoices", 0);

    installMethod(constructors["SpeechSynthesis"], "pause", 0);

    installMethod(constructors["SpeechSynthesis"], "resume", 0);

    installMethod(constructors["SpeechSynthesis"], "speak", 1);

    installMethod(constructors["SpeechSynthesis"], "preload", 2);

    {
      defineConstructorBacklink(constructors["SpeechSynthesis"].prototype, constructors["SpeechSynthesis"]);
    }

    {
      defineToStringTag(constructors["SpeechSynthesis"].prototype, constructors["SpeechSynthesis"].name);
    }

}

    {

    installAccessor(constructors["SpeechSynthesisErrorEvent"], "error");

    {
      defineConstructorBacklink(constructors["SpeechSynthesisErrorEvent"].prototype, constructors["SpeechSynthesisErrorEvent"]);
    }

    {
      defineToStringTag(constructors["SpeechSynthesisErrorEvent"].prototype, constructors["SpeechSynthesisErrorEvent"].name);
    }

}

    {

    installAccessor(constructors["SpeechSynthesisEvent"], "utterance");

    installAccessor(constructors["SpeechSynthesisEvent"], "charIndex");

    installAccessor(constructors["SpeechSynthesisEvent"], "charLength");

    installAccessor(constructors["SpeechSynthesisEvent"], "elapsedTime");

    installAccessor(constructors["SpeechSynthesisEvent"], "name");

    {
      defineConstructorBacklink(constructors["SpeechSynthesisEvent"].prototype, constructors["SpeechSynthesisEvent"]);
    }

    {
      defineToStringTag(constructors["SpeechSynthesisEvent"].prototype, constructors["SpeechSynthesisEvent"].name);
    }

}

    {

    installAccessor(constructors["SpeechSynthesisUtterance"], "text");

    installAccessor(constructors["SpeechSynthesisUtterance"], "lang");

    installAccessor(constructors["SpeechSynthesisUtterance"], "voice");

    installAccessor(constructors["SpeechSynthesisUtterance"], "volume");

    installAccessor(constructors["SpeechSynthesisUtterance"], "rate");

    installAccessor(constructors["SpeechSynthesisUtterance"], "pitch");

    installAccessor(constructors["SpeechSynthesisUtterance"], "onstart");

    installAccessor(constructors["SpeechSynthesisUtterance"], "onend");

    installAccessor(constructors["SpeechSynthesisUtterance"], "onerror");

    installAccessor(constructors["SpeechSynthesisUtterance"], "onpause");

    installAccessor(constructors["SpeechSynthesisUtterance"], "onresume");

    installAccessor(constructors["SpeechSynthesisUtterance"], "onmark");

    installAccessor(constructors["SpeechSynthesisUtterance"], "onboundary");

    {
      defineConstructorBacklink(constructors["SpeechSynthesisUtterance"].prototype, constructors["SpeechSynthesisUtterance"]);
    }

    {
      defineToStringTag(constructors["SpeechSynthesisUtterance"].prototype, constructors["SpeechSynthesisUtterance"].name);
    }

}

    {

    installAccessor(constructors["SpeechSynthesisVoice"], "voiceURI");

    installAccessor(constructors["SpeechSynthesisVoice"], "name");

    installAccessor(constructors["SpeechSynthesisVoice"], "lang");

    installAccessor(constructors["SpeechSynthesisVoice"], "localService");

    installAccessor(constructors["SpeechSynthesisVoice"], "default");

    {
      defineConstructorBacklink(constructors["SpeechSynthesisVoice"].prototype, constructors["SpeechSynthesisVoice"]);
    }

    {
      defineToStringTag(constructors["SpeechSynthesisVoice"].prototype, constructors["SpeechSynthesisVoice"].name);
    }

}

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
