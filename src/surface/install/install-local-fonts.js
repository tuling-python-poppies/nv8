import * as runtime from "../api/local-fonts/local-fonts-runtime.js";
import {
  installFontFaceSetConstructor,
} from "../api/local-fonts/font-face-set-runtime.js";
import {
  LOCAL_FONTS_SURFACES,
} from "../api/local-fonts/local-fonts-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineGlobalFunction,
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
  FontFace: runtime.FontFace,
  FontData: runtime.FontData,
});

export function installLocalFonts({ exposeGlobal = false } = {}) {
  if (exposeGlobal) {
    installFontFaceSetConstructor({ edge151Surface: true });
  }

    delete runtime.localFontsConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.localFontsConstructors[0].name, runtime.localFontsConstructors[0]);

    delete runtime.localFontsConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.localFontsConstructors[1].name, runtime.localFontsConstructors[1]);

  {

    {
      installAccessor(constructors["FontFace"], "family");
    }

    {
      installAccessor(constructors["FontFace"], "style");
    }

    {
      installAccessor(constructors["FontFace"], "weight");
    }

    {
      installAccessor(constructors["FontFace"], "stretch");
    }

    {
      installAccessor(constructors["FontFace"], "unicodeRange");
    }

    {
      installAccessor(constructors["FontFace"], "variant");
    }

    {
      installAccessor(constructors["FontFace"], "featureSettings");
    }

    {
      installAccessor(constructors["FontFace"], "display");
    }

    {
      installAccessor(constructors["FontFace"], "ascentOverride");
    }

    {
      installAccessor(constructors["FontFace"], "descentOverride");
    }

    {
      installAccessor(constructors["FontFace"], "lineGapOverride");
    }

    {
      installAccessor(constructors["FontFace"], "sizeAdjust");
    }

    {
      installAccessor(constructors["FontFace"], "status");
    }

    {
      installAccessor(constructors["FontFace"], "loaded");
    }

{
      const callback = {
        ["load"](...args) {
          return runtime.localFontsOperation(this, "load", args);
        },
      }["load"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "load");
      definePrototypeMethod(constructors["FontFace"].prototype, "load", callback);
    }

    {
      installAccessor(constructors["FontFace"], "variationSettings");
    }

    {
      defineConstructorBacklink(constructors["FontFace"].prototype, constructors["FontFace"]);
    }

    {
      defineToStringTag(constructors["FontFace"].prototype, constructors["FontFace"].name);
    }

}
{

    {
      installAccessor(constructors["FontData"], "postscriptName");
    }

    {
      installAccessor(constructors["FontData"], "fullName");
    }

    {
      installAccessor(constructors["FontData"], "family");
    }

    {
      installAccessor(constructors["FontData"], "style");
    }

{
      const callback = {
        ["blob"](...args) {
          return runtime.localFontsOperation(this, "blob", args);
        },
      }["blob"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "blob");
      definePrototypeMethod(constructors["FontData"].prototype, "blob", callback);
    }

    {
      defineConstructorBacklink(constructors["FontData"].prototype, constructors["FontData"]);
    }

    {
      defineToStringTag(constructors["FontData"].prototype, constructors["FontData"].name);
    }

}
  defineGlobalFunction("queryLocalFonts", runtime.queryLocalFonts);
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.localFontsProperty(this, name);
    },
    set [name](value) {
      runtime.setLocalFontsProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (Constructor === runtime.FontFace && runtime.fontFaceSettable.has(name)) {
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
