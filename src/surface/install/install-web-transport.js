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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

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

    delete runtime.webTransportConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.webTransportConstructors[0].name, runtime.webTransportConstructors[0]);

    delete runtime.webTransportConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.webTransportConstructors[1].name, runtime.webTransportConstructors[1]);

    delete runtime.webTransportConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.webTransportConstructors[2].name, runtime.webTransportConstructors[2]);

    delete runtime.webTransportConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.webTransportConstructors[3].name, runtime.webTransportConstructors[3]);

  Object.setPrototypeOf(runtime.WebTransportError.prototype, DOMException.prototype);
  Object.setPrototypeOf(runtime.WebTransportError, DOMException);
  {

    {
      installAccessor(constructors["WebTransport"], "incomingUnidirectionalStreams");
    }

    {
      installAccessor(constructors["WebTransport"], "incomingBidirectionalStreams");
    }

    {
      installAccessor(constructors["WebTransport"], "datagrams");
    }

    {
      installAccessor(constructors["WebTransport"], "ready");
    }

    {
      installAccessor(constructors["WebTransport"], "closed");
    }

{
      const callback = {
        ["close"](...args) {
          return runtime.webTransportOperation(this, "close", args);
        },
      }["close"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "close");
      definePrototypeMethod(constructors["WebTransport"].prototype, "close", callback);
    }
{
      const callback = {
        ["createBidirectionalStream"](...args) {
          return runtime.webTransportOperation(this, "createBidirectionalStream", args);
        },
      }["createBidirectionalStream"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "createBidirectionalStream");
      definePrototypeMethod(constructors["WebTransport"].prototype, "createBidirectionalStream", callback);
    }
{
      const callback = {
        ["createUnidirectionalStream"](...args) {
          return runtime.webTransportOperation(this, "createUnidirectionalStream", args);
        },
      }["createUnidirectionalStream"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "createUnidirectionalStream");
      definePrototypeMethod(constructors["WebTransport"].prototype, "createUnidirectionalStream", callback);
    }

    {
      installAccessor(constructors["WebTransport"], "protocol");
    }

    {
      defineConstructorBacklink(constructors["WebTransport"].prototype, constructors["WebTransport"]);
    }

    {
      defineToStringTag(constructors["WebTransport"].prototype, constructors["WebTransport"].name);
    }

}

    {

    {
      installAccessor(constructors["WebTransportBidirectionalStream"], "readable");
    }

    {
      installAccessor(constructors["WebTransportBidirectionalStream"], "writable");
    }

    {
      defineConstructorBacklink(constructors["WebTransportBidirectionalStream"].prototype, constructors["WebTransportBidirectionalStream"]);
    }

    {
      defineToStringTag(constructors["WebTransportBidirectionalStream"].prototype, constructors["WebTransportBidirectionalStream"].name);
    }

}

    {

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "readable");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "writable");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "maxDatagramSize");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "incomingMaxAge");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "outgoingMaxAge");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "incomingHighWaterMark");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "outgoingHighWaterMark");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "incomingMaxBufferedDatagrams");
    }

    {
      installAccessor(constructors["WebTransportDatagramDuplexStream"], "outgoingMaxBufferedDatagrams");
    }

    {
      defineConstructorBacklink(constructors["WebTransportDatagramDuplexStream"].prototype, constructors["WebTransportDatagramDuplexStream"]);
    }

    {
      defineToStringTag(constructors["WebTransportDatagramDuplexStream"].prototype, constructors["WebTransportDatagramDuplexStream"].name);
    }

}

    {

    {
      installAccessor(constructors["WebTransportError"], "streamErrorCode");
    }

    {
      installAccessor(constructors["WebTransportError"], "source");
    }

    {
      defineConstructorBacklink(constructors["WebTransportError"].prototype, constructors["WebTransportError"]);
    }

    {
      defineToStringTag(constructors["WebTransportError"].prototype, constructors["WebTransportError"].name);
    }

}

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
