import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/speech-recognition/speech-recognition-runtime.js";
import {
  SPEECH_RECOGNITION_SURFACES,
} from "../api/speech-recognition/speech-recognition-surface.js";
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
  runtime.speechRecognitionConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));
const writableRecognitionProperties = new Set([
  "grammars",
  "lang",
  "continuous",
  "interimResults",
  "maxAlternatives",
  "quality",
  "processLocally",
  // Edge 151 新增
  "unspokenPunctuation",
  "phrases",
]);
const handlerProperties = new Set([
  "onaudiostart",
  "onsoundstart",
  "onspeechstart",
  "onspeechend",
  "onsoundend",
  "onaudioend",
  "onresult",
  "onnomatch",
  "onerror",
  "onstart",
  "onend",
]);

export function installSpeechRecognition() {

    delete runtime.speechRecognitionConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.speechRecognitionConstructors[0].name, runtime.speechRecognitionConstructors[0]);

    delete runtime.speechRecognitionConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.speechRecognitionConstructors[1].name, runtime.speechRecognitionConstructors[1]);

    delete runtime.speechRecognitionConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.speechRecognitionConstructors[2].name, runtime.speechRecognitionConstructors[2]);

    delete runtime.speechRecognitionConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.speechRecognitionConstructors[3].name, runtime.speechRecognitionConstructors[3]);

  Object.setPrototypeOf(
    runtime.SpeechRecognition.prototype,
    EventTarget.prototype,
  );
  Object.setPrototypeOf(runtime.SpeechRecognition, EventTarget);

    {

    installAccessor(constructors["SpeechRecognition"], "grammars");

    installAccessor(constructors["SpeechRecognition"], "lang");

    installAccessor(constructors["SpeechRecognition"], "continuous");

    installAccessor(constructors["SpeechRecognition"], "interimResults");

    installAccessor(constructors["SpeechRecognition"], "maxAlternatives");

    installAccessor(constructors["SpeechRecognition"], "onaudiostart");

    installAccessor(constructors["SpeechRecognition"], "onsoundstart");

    installAccessor(constructors["SpeechRecognition"], "onspeechstart");

    installAccessor(constructors["SpeechRecognition"], "onspeechend");

    installAccessor(constructors["SpeechRecognition"], "onsoundend");

    installAccessor(constructors["SpeechRecognition"], "onaudioend");

    installAccessor(constructors["SpeechRecognition"], "onresult");

    installAccessor(constructors["SpeechRecognition"], "onnomatch");

    installAccessor(constructors["SpeechRecognition"], "onerror");

    installAccessor(constructors["SpeechRecognition"], "onstart");

    installAccessor(constructors["SpeechRecognition"], "onend");

    installMethod(constructors["SpeechRecognition"], "abort", 0);

    installMethod(constructors["SpeechRecognition"], "start", 0);

    installMethod(constructors["SpeechRecognition"], "stop", 0);

    installAccessor(constructors["SpeechRecognition"], "quality");

    installAccessor(constructors["SpeechRecognition"], "processLocally");

    installAccessor(constructors["SpeechRecognition"], "unspokenPunctuation");

    installAccessor(constructors["SpeechRecognition"], "phrases");

    {
      defineConstructorBacklink(constructors["SpeechRecognition"].prototype, constructors["SpeechRecognition"]);
    }

    {
      defineToStringTag(constructors["SpeechRecognition"].prototype, constructors["SpeechRecognition"].name);
    }

}

    {

    installAccessor(constructors["SpeechGrammar"], "src");

    installAccessor(constructors["SpeechGrammar"], "weight");

    {
      defineConstructorBacklink(constructors["SpeechGrammar"].prototype, constructors["SpeechGrammar"]);
    }

    {
      defineToStringTag(constructors["SpeechGrammar"].prototype, constructors["SpeechGrammar"].name);
    }

}

{

    installAccessor(constructors["SpeechGrammarList"], "length");

    installMethod(constructors["SpeechGrammarList"], "addFromString", 1);

    installMethod(constructors["SpeechGrammarList"], "addFromUri", 1);

    installMethod(constructors["SpeechGrammarList"], "item", 1);

    {
      defineConstructorBacklink(constructors["SpeechGrammarList"].prototype, constructors["SpeechGrammarList"]);
    }

    {
      defineToStringTag(constructors["SpeechGrammarList"].prototype, constructors["SpeechGrammarList"].name);
    }

{
      const callback = {
        ["values"]() { return runtime.speechRecognitionIterator(this); },
      }["values"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "values");
      Object.defineProperty(constructors["SpeechGrammarList"].prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
}

    {

    installAccessor(constructors["SpeechRecognitionPhrase"], "phrase");

    installAccessor(constructors["SpeechRecognitionPhrase"], "boost");

    {
      defineConstructorBacklink(constructors["SpeechRecognitionPhrase"].prototype, constructors["SpeechRecognitionPhrase"]);
    }

    {
      defineToStringTag(constructors["SpeechRecognitionPhrase"].prototype, constructors["SpeechRecognitionPhrase"].name);
    }

}

  installStatics();
  defineGlobalConstructor(
    "webkitSpeechRecognition",
    runtime.SpeechRecognition,
  );
  defineGlobalConstructor("webkitSpeechGrammar", runtime.SpeechGrammar);
  defineGlobalConstructor(
    "webkitSpeechGrammarList",
    runtime.SpeechGrammarList,
  );
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.speechRecognitionProperty(this, name); },
    set [name](value) {
      runtime.setSpeechRecognitionProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  const writable = handlerProperties.has(name)
    || (Constructor === runtime.SpeechRecognition
      && writableRecognitionProperties.has(name))
    || (Constructor === runtime.SpeechGrammar
      && ["src", "weight"].includes(name));
  if (writable) {
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
      return runtime.speechRecognitionOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function installStatics() {
  {
    const callback = {
      ["available"](options) {
        return runtime.recognitionStaticOperation("available", options);
      },
    }["available"];
    registerNativeFunction(callback, "available");
    Object.defineProperty(runtime.SpeechRecognition, "available", {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
{
    const callback = {
      ["install"](options) {
        return runtime.recognitionStaticOperation("install", options);
      },
    }["install"];
    registerNativeFunction(callback, "install");
    Object.defineProperty(runtime.SpeechRecognition, "install", {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}
