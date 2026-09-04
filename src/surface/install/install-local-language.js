import * as runtime from "../api/local-language/local-language-runtime.js";
import {
  LOCAL_LANGUAGE_SURFACES,
} from "../api/local-language/local-language-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.localLanguageConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installLocalLanguage() {
  do {
    delete (((runtime.localLanguageConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.localLanguageConstructors)[0])).name, (((runtime.localLanguageConstructors)[0])));
  } while (false);
do {
    delete (((runtime.localLanguageConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.localLanguageConstructors)[1])).name, (((runtime.localLanguageConstructors)[1])));
  } while (false);
do {
    delete (((runtime.localLanguageConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.localLanguageConstructors)[2])).name, (((runtime.localLanguageConstructors)[2])));
  } while (false);
  do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("expectedInputLanguages")]() {
          return runtime.localLanguageProperty(this, ("expectedInputLanguages"));
        },
      }, ("expectedInputLanguages")).get;
      registerNativeGetter(getter, ("expectedInputLanguages"));
      definePrototypeGetter((constructors[("LanguageDetector")]).prototype, ("expectedInputLanguages"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("inputQuota")]() {
          return runtime.localLanguageProperty(this, ("inputQuota"));
        },
      }, ("inputQuota")).get;
      registerNativeGetter(getter, ("inputQuota"));
      definePrototypeGetter((constructors[("LanguageDetector")]).prototype, ("inputQuota"), getter);
    }
  } while (false);
do {
    {
      const callback = {
        [("destroy")](...args) {
          return runtime.localLanguageOperation(this, ("destroy"), args);
        },
      }[("destroy")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("destroy"));
      definePrototypeMethod((constructors[("LanguageDetector")]).prototype, ("destroy"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("detect")](...args) {
          return runtime.localLanguageOperation(this, ("detect"), args);
        },
      }[("detect")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("detect"));
      definePrototypeMethod((constructors[("LanguageDetector")]).prototype, ("detect"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("measureInputUsage")](...args) {
          return runtime.localLanguageOperation(this, ("measureInputUsage"), args);
        },
      }[("measureInputUsage")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("measureInputUsage"));
      definePrototypeMethod((constructors[("LanguageDetector")]).prototype, ("measureInputUsage"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("LanguageDetector")]).prototype, (constructors[("LanguageDetector")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("LanguageDetector")]).prototype, (constructors[("LanguageDetector")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("sharedContext")]() {
          return runtime.localLanguageProperty(this, ("sharedContext"));
        },
      }, ("sharedContext")).get;
      registerNativeGetter(getter, ("sharedContext"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("sharedContext"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("type")]() {
          return runtime.localLanguageProperty(this, ("type"));
        },
      }, ("type")).get;
      registerNativeGetter(getter, ("type"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("type"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("format")]() {
          return runtime.localLanguageProperty(this, ("format"));
        },
      }, ("format")).get;
      registerNativeGetter(getter, ("format"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("format"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("length")]() {
          return runtime.localLanguageProperty(this, ("length"));
        },
      }, ("length")).get;
      registerNativeGetter(getter, ("length"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("length"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("expectedInputLanguages")]() {
          return runtime.localLanguageProperty(this, ("expectedInputLanguages"));
        },
      }, ("expectedInputLanguages")).get;
      registerNativeGetter(getter, ("expectedInputLanguages"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("expectedInputLanguages"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("expectedContextLanguages")]() {
          return runtime.localLanguageProperty(this, ("expectedContextLanguages"));
        },
      }, ("expectedContextLanguages")).get;
      registerNativeGetter(getter, ("expectedContextLanguages"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("expectedContextLanguages"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("outputLanguage")]() {
          return runtime.localLanguageProperty(this, ("outputLanguage"));
        },
      }, ("outputLanguage")).get;
      registerNativeGetter(getter, ("outputLanguage"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("outputLanguage"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("inputQuota")]() {
          return runtime.localLanguageProperty(this, ("inputQuota"));
        },
      }, ("inputQuota")).get;
      registerNativeGetter(getter, ("inputQuota"));
      definePrototypeGetter((constructors[("Summarizer")]).prototype, ("inputQuota"), getter);
    }
  } while (false);
do {
    {
      const callback = {
        [("destroy")](...args) {
          return runtime.localLanguageOperation(this, ("destroy"), args);
        },
      }[("destroy")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("destroy"));
      definePrototypeMethod((constructors[("Summarizer")]).prototype, ("destroy"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("measureInputUsage")](...args) {
          return runtime.localLanguageOperation(this, ("measureInputUsage"), args);
        },
      }[("measureInputUsage")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("measureInputUsage"));
      definePrototypeMethod((constructors[("Summarizer")]).prototype, ("measureInputUsage"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("summarize")](...args) {
          return runtime.localLanguageOperation(this, ("summarize"), args);
        },
      }[("summarize")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("summarize"));
      definePrototypeMethod((constructors[("Summarizer")]).prototype, ("summarize"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("summarizeStreaming")](...args) {
          return runtime.localLanguageOperation(this, ("summarizeStreaming"), args);
        },
      }[("summarizeStreaming")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("summarizeStreaming"));
      definePrototypeMethod((constructors[("Summarizer")]).prototype, ("summarizeStreaming"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Summarizer")]).prototype, (constructors[("Summarizer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Summarizer")]).prototype, (constructors[("Summarizer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("inputQuota")]() {
          return runtime.localLanguageProperty(this, ("inputQuota"));
        },
      }, ("inputQuota")).get;
      registerNativeGetter(getter, ("inputQuota"));
      definePrototypeGetter((constructors[("Translator")]).prototype, ("inputQuota"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("sourceLanguage")]() {
          return runtime.localLanguageProperty(this, ("sourceLanguage"));
        },
      }, ("sourceLanguage")).get;
      registerNativeGetter(getter, ("sourceLanguage"));
      definePrototypeGetter((constructors[("Translator")]).prototype, ("sourceLanguage"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("targetLanguage")]() {
          return runtime.localLanguageProperty(this, ("targetLanguage"));
        },
      }, ("targetLanguage")).get;
      registerNativeGetter(getter, ("targetLanguage"));
      definePrototypeGetter((constructors[("Translator")]).prototype, ("targetLanguage"), getter);
    }
  } while (false);
do {
    {
      const callback = {
        [("destroy")](...args) {
          return runtime.localLanguageOperation(this, ("destroy"), args);
        },
      }[("destroy")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("destroy"));
      definePrototypeMethod((constructors[("Translator")]).prototype, ("destroy"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("measureInputUsage")](...args) {
          return runtime.localLanguageOperation(this, ("measureInputUsage"), args);
        },
      }[("measureInputUsage")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("measureInputUsage"));
      definePrototypeMethod((constructors[("Translator")]).prototype, ("measureInputUsage"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("translate")](...args) {
          return runtime.localLanguageOperation(this, ("translate"), args);
        },
      }[("translate")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("translate"));
      definePrototypeMethod((constructors[("Translator")]).prototype, ("translate"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("translateStreaming")](...args) {
          return runtime.localLanguageOperation(this, ("translateStreaming"), args);
        },
      }[("translateStreaming")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("translateStreaming"));
      definePrototypeMethod((constructors[("Translator")]).prototype, ("translateStreaming"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("Translator")]).prototype, (constructors[("Translator")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("Translator")]).prototype, (constructors[("Translator")]).name);
    }
  } while (false);
}
  } while (false);
  installStatic(runtime.LanguageDetector, "availability", 0,
    runtime.localLanguageAvailability);
  installStatic(runtime.LanguageDetector, "create", 0,
    runtime.createLanguageDetector);
  installStatic(runtime.Summarizer, "availability", 0,
    runtime.localLanguageAvailability);
  installStatic(runtime.Summarizer, "create", 0,
    runtime.createSummarizer);
  installStatic(runtime.Translator, "availability", 1,
    runtime.localLanguageAvailability);
  installStatic(runtime.Translator, "create", 1,
    runtime.createTranslator);
}



function installStatic(Constructor, name, length, operation) {
  const callback = {
    [name](...args) {
      return operation(...args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
