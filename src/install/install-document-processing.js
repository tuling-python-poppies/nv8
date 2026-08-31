import * as runtime from "../api/document-processing/document-processing-runtime.js";
import {
  DOCUMENT_PROCESSING_SURFACES,
} from "../api/document-processing/document-processing-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { registerNativeFunction } from "../webidl/native-function.js";

export function installDocumentProcessing() {
  do {
    delete (((runtime.documentProcessingConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.documentProcessingConstructors)[0])).name, (((runtime.documentProcessingConstructors)[0])));
    const surface = DOCUMENT_PROCESSING_SURFACES[(((runtime.documentProcessingConstructors)[0])).name];
    do {
      {
        const callback = {
          [("allowAttribute")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("allowAttribute"), args)
              : runtime.xsltOperation(this, ("allowAttribute"), args);
          },
        }[("allowAttribute")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("allowAttribute"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("allowAttribute"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("allowElement")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("allowElement"), args)
              : runtime.xsltOperation(this, ("allowElement"), args);
          },
        }[("allowElement")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("allowElement"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("allowElement"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("get")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("get"), args)
              : runtime.xsltOperation(this, ("get"), args);
          },
        }[("get")];
        Object.defineProperty(callback, "length", {
          value: (0),
          configurable: true,
        });
        registerNativeFunction(callback, ("get"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("get"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("removeAttribute")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("removeAttribute"), args)
              : runtime.xsltOperation(this, ("removeAttribute"), args);
          },
        }[("removeAttribute")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("removeAttribute"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("removeAttribute"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("removeElement")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("removeElement"), args)
              : runtime.xsltOperation(this, ("removeElement"), args);
          },
        }[("removeElement")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("removeElement"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("removeElement"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("removeUnsafe")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("removeUnsafe"), args)
              : runtime.xsltOperation(this, ("removeUnsafe"), args);
          },
        }[("removeUnsafe")];
        Object.defineProperty(callback, "length", {
          value: (0),
          configurable: true,
        });
        registerNativeFunction(callback, ("removeUnsafe"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("removeUnsafe"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("replaceElementWithChildren")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("replaceElementWithChildren"), args)
              : runtime.xsltOperation(this, ("replaceElementWithChildren"), args);
          },
        }[("replaceElementWithChildren")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("replaceElementWithChildren"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("replaceElementWithChildren"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("setComments")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("setComments"), args)
              : runtime.xsltOperation(this, ("setComments"), args);
          },
        }[("setComments")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("setComments"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("setComments"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("setDataAttributes")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("setDataAttributes"), args)
              : runtime.xsltOperation(this, ("setDataAttributes"), args);
          },
        }[("setDataAttributes")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("setDataAttributes"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("setDataAttributes"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("allowProcessingInstruction")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("allowProcessingInstruction"), args)
              : runtime.xsltOperation(this, ("allowProcessingInstruction"), args);
          },
        }[("allowProcessingInstruction")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("allowProcessingInstruction"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("allowProcessingInstruction"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("removeProcessingInstruction")](...args) {
            return (((runtime.documentProcessingConstructors)[0])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("removeProcessingInstruction"), args)
              : runtime.xsltOperation(this, ("removeProcessingInstruction"), args);
          },
        }[("removeProcessingInstruction")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("removeProcessingInstruction"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[0])).prototype, ("removeProcessingInstruction"), callback);
      }
    } while (false);
do {
      {
        defineConstructorBacklink((((runtime.documentProcessingConstructors)[0])).prototype, (((runtime.documentProcessingConstructors)[0])));
      }
    } while (false);
do {
      {
        defineToStringTag((((runtime.documentProcessingConstructors)[0])).prototype, (((runtime.documentProcessingConstructors)[0])).name);
      }
    } while (false);
  } while (false);
do {
    delete (((runtime.documentProcessingConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.documentProcessingConstructors)[1])).name, (((runtime.documentProcessingConstructors)[1])));
    const surface = DOCUMENT_PROCESSING_SURFACES[(((runtime.documentProcessingConstructors)[1])).name];
    do {
      {
        const callback = {
          [("clearParameters")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("clearParameters"), args)
              : runtime.xsltOperation(this, ("clearParameters"), args);
          },
        }[("clearParameters")];
        Object.defineProperty(callback, "length", {
          value: (0),
          configurable: true,
        });
        registerNativeFunction(callback, ("clearParameters"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("clearParameters"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("getParameter")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("getParameter"), args)
              : runtime.xsltOperation(this, ("getParameter"), args);
          },
        }[("getParameter")];
        Object.defineProperty(callback, "length", {
          value: (2),
          configurable: true,
        });
        registerNativeFunction(callback, ("getParameter"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("getParameter"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("importStylesheet")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("importStylesheet"), args)
              : runtime.xsltOperation(this, ("importStylesheet"), args);
          },
        }[("importStylesheet")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("importStylesheet"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("importStylesheet"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("removeParameter")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("removeParameter"), args)
              : runtime.xsltOperation(this, ("removeParameter"), args);
          },
        }[("removeParameter")];
        Object.defineProperty(callback, "length", {
          value: (2),
          configurable: true,
        });
        registerNativeFunction(callback, ("removeParameter"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("removeParameter"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("reset")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("reset"), args)
              : runtime.xsltOperation(this, ("reset"), args);
          },
        }[("reset")];
        Object.defineProperty(callback, "length", {
          value: (0),
          configurable: true,
        });
        registerNativeFunction(callback, ("reset"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("reset"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("setParameter")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("setParameter"), args)
              : runtime.xsltOperation(this, ("setParameter"), args);
          },
        }[("setParameter")];
        Object.defineProperty(callback, "length", {
          value: (3),
          configurable: true,
        });
        registerNativeFunction(callback, ("setParameter"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("setParameter"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("transformToDocument")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("transformToDocument"), args)
              : runtime.xsltOperation(this, ("transformToDocument"), args);
          },
        }[("transformToDocument")];
        Object.defineProperty(callback, "length", {
          value: (1),
          configurable: true,
        });
        registerNativeFunction(callback, ("transformToDocument"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("transformToDocument"), callback);
      }
    } while (false);
do {
      {
        const callback = {
          [("transformToFragment")](...args) {
            return (((runtime.documentProcessingConstructors)[1])) === runtime.Sanitizer
              ? runtime.sanitizerOperation(this, ("transformToFragment"), args)
              : runtime.xsltOperation(this, ("transformToFragment"), args);
          },
        }[("transformToFragment")];
        Object.defineProperty(callback, "length", {
          value: (2),
          configurable: true,
        });
        registerNativeFunction(callback, ("transformToFragment"));
        definePrototypeMethod((((runtime.documentProcessingConstructors)[1])).prototype, ("transformToFragment"), callback);
      }
    } while (false);
do {
      {
        defineConstructorBacklink((((runtime.documentProcessingConstructors)[1])).prototype, (((runtime.documentProcessingConstructors)[1])));
      }
    } while (false);
do {
      {
        defineToStringTag((((runtime.documentProcessingConstructors)[1])).prototype, (((runtime.documentProcessingConstructors)[1])).name);
      }
    } while (false);
  } while (false);
}
