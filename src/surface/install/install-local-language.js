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

    delete runtime.localLanguageConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.localLanguageConstructors[0].name, runtime.localLanguageConstructors[0]);

    delete runtime.localLanguageConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.localLanguageConstructors[1].name, runtime.localLanguageConstructors[1]);

    delete runtime.localLanguageConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.localLanguageConstructors[2].name, runtime.localLanguageConstructors[2]);

  {
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["expectedInputLanguages"]() {
          return runtime.localLanguageProperty(this, "expectedInputLanguages");
        },
      }, "expectedInputLanguages").get;
      registerNativeGetter(getter, "expectedInputLanguages");
      definePrototypeGetter(constructors["LanguageDetector"].prototype, "expectedInputLanguages", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["inputQuota"]() {
          return runtime.localLanguageProperty(this, "inputQuota");
        },
      }, "inputQuota").get;
      registerNativeGetter(getter, "inputQuota");
      definePrototypeGetter(constructors["LanguageDetector"].prototype, "inputQuota", getter);
    }
{
      const callback = {
        ["destroy"](...args) {
          return runtime.localLanguageOperation(this, "destroy", args);
        },
      }["destroy"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "destroy");
      definePrototypeMethod(constructors["LanguageDetector"].prototype, "destroy", callback);
    }
{
      const callback = {
        ["detect"](...args) {
          return runtime.localLanguageOperation(this, "detect", args);
        },
      }["detect"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "detect");
      definePrototypeMethod(constructors["LanguageDetector"].prototype, "detect", callback);
    }
{
      const callback = {
        ["measureInputUsage"](...args) {
          return runtime.localLanguageOperation(this, "measureInputUsage", args);
        },
      }["measureInputUsage"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "measureInputUsage");
      definePrototypeMethod(constructors["LanguageDetector"].prototype, "measureInputUsage", callback);
    }

    {
      defineConstructorBacklink(constructors["LanguageDetector"].prototype, constructors["LanguageDetector"]);
    }

    {
      defineToStringTag(constructors["LanguageDetector"].prototype, constructors["LanguageDetector"].name);
    }

}
{
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["sharedContext"]() {
          return runtime.localLanguageProperty(this, "sharedContext");
        },
      }, "sharedContext").get;
      registerNativeGetter(getter, "sharedContext");
      definePrototypeGetter(constructors["Summarizer"].prototype, "sharedContext", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["type"]() {
          return runtime.localLanguageProperty(this, "type");
        },
      }, "type").get;
      registerNativeGetter(getter, "type");
      definePrototypeGetter(constructors["Summarizer"].prototype, "type", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["format"]() {
          return runtime.localLanguageProperty(this, "format");
        },
      }, "format").get;
      registerNativeGetter(getter, "format");
      definePrototypeGetter(constructors["Summarizer"].prototype, "format", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["length"]() {
          return runtime.localLanguageProperty(this, "length");
        },
      }, "length").get;
      registerNativeGetter(getter, "length");
      definePrototypeGetter(constructors["Summarizer"].prototype, "length", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["expectedInputLanguages"]() {
          return runtime.localLanguageProperty(this, "expectedInputLanguages");
        },
      }, "expectedInputLanguages").get;
      registerNativeGetter(getter, "expectedInputLanguages");
      definePrototypeGetter(constructors["Summarizer"].prototype, "expectedInputLanguages", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["expectedContextLanguages"]() {
          return runtime.localLanguageProperty(this, "expectedContextLanguages");
        },
      }, "expectedContextLanguages").get;
      registerNativeGetter(getter, "expectedContextLanguages");
      definePrototypeGetter(constructors["Summarizer"].prototype, "expectedContextLanguages", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["outputLanguage"]() {
          return runtime.localLanguageProperty(this, "outputLanguage");
        },
      }, "outputLanguage").get;
      registerNativeGetter(getter, "outputLanguage");
      definePrototypeGetter(constructors["Summarizer"].prototype, "outputLanguage", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["inputQuota"]() {
          return runtime.localLanguageProperty(this, "inputQuota");
        },
      }, "inputQuota").get;
      registerNativeGetter(getter, "inputQuota");
      definePrototypeGetter(constructors["Summarizer"].prototype, "inputQuota", getter);
    }
{
      const callback = {
        ["destroy"](...args) {
          return runtime.localLanguageOperation(this, "destroy", args);
        },
      }["destroy"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "destroy");
      definePrototypeMethod(constructors["Summarizer"].prototype, "destroy", callback);
    }
{
      const callback = {
        ["measureInputUsage"](...args) {
          return runtime.localLanguageOperation(this, "measureInputUsage", args);
        },
      }["measureInputUsage"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "measureInputUsage");
      definePrototypeMethod(constructors["Summarizer"].prototype, "measureInputUsage", callback);
    }
{
      const callback = {
        ["summarize"](...args) {
          return runtime.localLanguageOperation(this, "summarize", args);
        },
      }["summarize"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "summarize");
      definePrototypeMethod(constructors["Summarizer"].prototype, "summarize", callback);
    }
{
      const callback = {
        ["summarizeStreaming"](...args) {
          return runtime.localLanguageOperation(this, "summarizeStreaming", args);
        },
      }["summarizeStreaming"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "summarizeStreaming");
      definePrototypeMethod(constructors["Summarizer"].prototype, "summarizeStreaming", callback);
    }

    {
      defineConstructorBacklink(constructors["Summarizer"].prototype, constructors["Summarizer"]);
    }

    {
      defineToStringTag(constructors["Summarizer"].prototype, constructors["Summarizer"].name);
    }

}
{
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["inputQuota"]() {
          return runtime.localLanguageProperty(this, "inputQuota");
        },
      }, "inputQuota").get;
      registerNativeGetter(getter, "inputQuota");
      definePrototypeGetter(constructors["Translator"].prototype, "inputQuota", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["sourceLanguage"]() {
          return runtime.localLanguageProperty(this, "sourceLanguage");
        },
      }, "sourceLanguage").get;
      registerNativeGetter(getter, "sourceLanguage");
      definePrototypeGetter(constructors["Translator"].prototype, "sourceLanguage", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["targetLanguage"]() {
          return runtime.localLanguageProperty(this, "targetLanguage");
        },
      }, "targetLanguage").get;
      registerNativeGetter(getter, "targetLanguage");
      definePrototypeGetter(constructors["Translator"].prototype, "targetLanguage", getter);
    }
{
      const callback = {
        ["destroy"](...args) {
          return runtime.localLanguageOperation(this, "destroy", args);
        },
      }["destroy"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "destroy");
      definePrototypeMethod(constructors["Translator"].prototype, "destroy", callback);
    }
{
      const callback = {
        ["measureInputUsage"](...args) {
          return runtime.localLanguageOperation(this, "measureInputUsage", args);
        },
      }["measureInputUsage"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "measureInputUsage");
      definePrototypeMethod(constructors["Translator"].prototype, "measureInputUsage", callback);
    }
{
      const callback = {
        ["translate"](...args) {
          return runtime.localLanguageOperation(this, "translate", args);
        },
      }["translate"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "translate");
      definePrototypeMethod(constructors["Translator"].prototype, "translate", callback);
    }
{
      const callback = {
        ["translateStreaming"](...args) {
          return runtime.localLanguageOperation(this, "translateStreaming", args);
        },
      }["translateStreaming"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "translateStreaming");
      definePrototypeMethod(constructors["Translator"].prototype, "translateStreaming", callback);
    }

    {
      defineConstructorBacklink(constructors["Translator"].prototype, constructors["Translator"]);
    }

    {
      defineToStringTag(constructors["Translator"].prototype, constructors["Translator"].name);
    }

}
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
