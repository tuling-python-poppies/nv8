import { DOMException } from "../api/event/dom-exception-constructor.js";
import * as runtime from "../api/web-transport/web-transport-runtime.js";
import {
  WEB_TRANSPORT_SURFACES,
} from "../api/web-transport/web-transport-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.webTransportConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));
const settable = new Set([
  "incomingMaxAge",
  "outgoingMaxAge",
  "incomingHighWaterMark",
  "outgoingHighWaterMark",
  // Edge 151 新增
  "incomingMaxBufferedDatagrams",
  "outgoingMaxBufferedDatagrams",
]);

export function installWebTransport() {
  do {
    delete (((runtime.webTransportConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.webTransportConstructors)[0])).name, (((runtime.webTransportConstructors)[0])));
  } while (false);
do {
    delete (((runtime.webTransportConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.webTransportConstructors)[1])).name, (((runtime.webTransportConstructors)[1])));
  } while (false);
do {
    delete (((runtime.webTransportConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.webTransportConstructors)[2])).name, (((runtime.webTransportConstructors)[2])));
  } while (false);
do {
    delete (((runtime.webTransportConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.webTransportConstructors)[3])).name, (((runtime.webTransportConstructors)[3])));
  } while (false);
  Object.setPrototypeOf(runtime.WebTransportError.prototype, DOMException.prototype);
  Object.setPrototypeOf(runtime.WebTransportError, DOMException);
  do {
    {
  do {
    {
      installAccessor((constructors[("WebTransport")]), ("incomingUnidirectionalStreams"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransport")]), ("incomingBidirectionalStreams"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransport")]), ("datagrams"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransport")]), ("ready"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransport")]), ("closed"));
    }
  } while (false);
do {
    {
      const callback = {
        [("close")](...args) {
          return runtime.webTransportOperation(this, ("close"), args);
        },
      }[("close")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("close"));
      definePrototypeMethod((constructors[("WebTransport")]).prototype, ("close"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("createBidirectionalStream")](...args) {
          return runtime.webTransportOperation(this, ("createBidirectionalStream"), args);
        },
      }[("createBidirectionalStream")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("createBidirectionalStream"));
      definePrototypeMethod((constructors[("WebTransport")]).prototype, ("createBidirectionalStream"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("createUnidirectionalStream")](...args) {
          return runtime.webTransportOperation(this, ("createUnidirectionalStream"), args);
        },
      }[("createUnidirectionalStream")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("createUnidirectionalStream"));
      definePrototypeMethod((constructors[("WebTransport")]).prototype, ("createUnidirectionalStream"), callback);
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransport")]), ("protocol"));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("WebTransport")]).prototype, (constructors[("WebTransport")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("WebTransport")]).prototype, (constructors[("WebTransport")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      installAccessor((constructors[("WebTransportBidirectionalStream")]), ("readable"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportBidirectionalStream")]), ("writable"));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("WebTransportBidirectionalStream")]).prototype, (constructors[("WebTransportBidirectionalStream")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("WebTransportBidirectionalStream")]).prototype, (constructors[("WebTransportBidirectionalStream")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("readable"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("writable"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("maxDatagramSize"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("incomingMaxAge"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("outgoingMaxAge"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("incomingHighWaterMark"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("outgoingHighWaterMark"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("incomingMaxBufferedDatagrams"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportDatagramDuplexStream")]), ("outgoingMaxBufferedDatagrams"));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("WebTransportDatagramDuplexStream")]).prototype, (constructors[("WebTransportDatagramDuplexStream")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("WebTransportDatagramDuplexStream")]).prototype, (constructors[("WebTransportDatagramDuplexStream")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      installAccessor((constructors[("WebTransportError")]), ("streamErrorCode"));
    }
  } while (false);
do {
    {
      installAccessor((constructors[("WebTransportError")]), ("source"));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("WebTransportError")]).prototype, (constructors[("WebTransportError")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("WebTransportError")]).prototype, (constructors[("WebTransportError")]).name);
    }
  } while (false);
}
  } while (false);
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.webTransportProperty(this, name);
    },
    set [name](value) {
      runtime.setWebTransportProperty(this, name, value);
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
