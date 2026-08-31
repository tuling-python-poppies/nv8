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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze({
  FontFace: runtime.FontFace,
  FontData: runtime.FontData,
});

export function installLocalFonts({ exposeGlobal = false } = {}) {
  if (exposeGlobal) {
    installFontFaceSetConstructor({ edge151Surface: true });
  }
  do {
    delete (((runtime.localFontsConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.localFontsConstructors)[0])).name, (((runtime.localFontsConstructors)[0])));
  } while (false);
do {
    delete (((runtime.localFontsConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.localFontsConstructors)[1])).name, (((runtime.localFontsConstructors)[1])));
  } while (false);
  do {
    {
  do {
    {
      installAccessor((constructors[("FontFace")]), ("family"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("style"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("weight"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("stretch"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("unicodeRange"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("variant"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("featureSettings"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("display"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("ascentOverride"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("descentOverride"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("lineGapOverride"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("sizeAdjust"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("status"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("loaded"));
    }
  } while (false);
do {
    {
      const callback = {
        [("load")](...args) {
          return runtime.localFontsOperation(this, ("load"), args);
        },
      }[("load")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("load"));
      definePrototypeMethod((constructors[("FontFace")]).prototype, ("load"), callback);
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontFace")]), ("variationSettings"));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("FontFace")]).prototype, (constructors[("FontFace")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("FontFace")]).prototype, (constructors[("FontFace")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      installAccessor((constructors[("FontData")]), ("postscriptName"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontData")]), ("fullName"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontData")]), ("family"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("FontData")]), ("style"));
    }
  } while (false);
do {
    {
      const callback = {
        [("blob")](...args) {
          return runtime.localFontsOperation(this, ("blob"), args);
        },
      }[("blob")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("blob"));
      definePrototypeMethod((constructors[("FontData")]).prototype, ("blob"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("FontData")]).prototype, (constructors[("FontData")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("FontData")]).prototype, (constructors[("FontData")]).name);
    }
  } while (false);
}
  } while (false);
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
