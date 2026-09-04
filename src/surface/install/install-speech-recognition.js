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
  do {
    delete (((runtime.speechRecognitionConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.speechRecognitionConstructors)[0])).name, (((runtime.speechRecognitionConstructors)[0])));
  } while (false);
do {
    delete (((runtime.speechRecognitionConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.speechRecognitionConstructors)[1])).name, (((runtime.speechRecognitionConstructors)[1])));
  } while (false);
do {
    delete (((runtime.speechRecognitionConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.speechRecognitionConstructors)[2])).name, (((runtime.speechRecognitionConstructors)[2])));
  } while (false);
do {
    delete (((runtime.speechRecognitionConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.speechRecognitionConstructors)[3])).name, (((runtime.speechRecognitionConstructors)[3])));
  } while (false);
  Object.setPrototypeOf(
    runtime.SpeechRecognition.prototype,
    EventTarget.prototype,
  );
  Object.setPrototypeOf(runtime.SpeechRecognition, EventTarget);
  do {
    {
  do {
    installAccessor((constructors[("SpeechRecognition")]), ("grammars"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("lang"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("continuous"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("interimResults"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("maxAlternatives"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onaudiostart"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onsoundstart"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onspeechstart"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onspeechend"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onsoundend"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onaudioend"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onresult"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onnomatch"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onerror"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onstart"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("onend"));
  } while (false);
do {
    installMethod((constructors[("SpeechRecognition")]), ("abort"), (0));
  } while (false);
do {
    installMethod((constructors[("SpeechRecognition")]), ("start"), (0));
  } while (false);
do {
    installMethod((constructors[("SpeechRecognition")]), ("stop"), (0));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("quality"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("processLocally"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("unspokenPunctuation"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognition")]), ("phrases"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechRecognition")]).prototype, (constructors[("SpeechRecognition")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechRecognition")]).prototype, (constructors[("SpeechRecognition")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("SpeechGrammar")]), ("src"));
  } while (false);
do {
    installAccessor((constructors[("SpeechGrammar")]), ("weight"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechGrammar")]).prototype, (constructors[("SpeechGrammar")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechGrammar")]).prototype, (constructors[("SpeechGrammar")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("SpeechGrammarList")]), ("length"));
  } while (false);
do {
    installMethod((constructors[("SpeechGrammarList")]), ("addFromString"), (1));
  } while (false);
do {
    installMethod((constructors[("SpeechGrammarList")]), ("addFromUri"), (1));
  } while (false);
do {
    installMethod((constructors[("SpeechGrammarList")]), ("item"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechGrammarList")]).prototype, (constructors[("SpeechGrammarList")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechGrammarList")]).prototype, (constructors[("SpeechGrammarList")]).name);
    }
  } while (false);
do {
    {
      const callback = {
        [("values")]() { return runtime.speechRecognitionIterator(this); },
      }[("values")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("values"));
      Object.defineProperty((constructors[("SpeechGrammarList")]).prototype, Symbol.iterator, {
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
    installAccessor((constructors[("SpeechRecognitionPhrase")]), ("phrase"));
  } while (false);
do {
    installAccessor((constructors[("SpeechRecognitionPhrase")]), ("boost"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("SpeechRecognitionPhrase")]).prototype, (constructors[("SpeechRecognitionPhrase")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("SpeechRecognitionPhrase")]).prototype, (constructors[("SpeechRecognitionPhrase")]).name);
    }
  } while (false);
}
  } while (false);
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
  do {
    const callback = {
      [("available")](options) {
        return runtime.recognitionStaticOperation(("available"), options);
      },
    }[("available")];
    registerNativeFunction(callback, ("available"));
    Object.defineProperty(runtime.SpeechRecognition, ("available"), {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
do {
    const callback = {
      [("install")](options) {
        return runtime.recognitionStaticOperation(("install"), options);
      },
    }[("install")];
    registerNativeFunction(callback, ("install"));
    Object.defineProperty(runtime.SpeechRecognition, ("install"), {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
}
