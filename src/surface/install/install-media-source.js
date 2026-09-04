import { Event } from "../api/event/event-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  BlobEvent,
  MediaRecorder,
  MediaSource,
  MediaSourceHandle,
  SourceBuffer,
  SourceBufferList,
  mediaRecorderIsTypeSupported,
  mediaSourceIsTypeSupported,
  mediaSourceOperation,
  mediaSourceProperty,
  setMediaSourceProperty,
  sourceBufferListValues,
} from "../api/media-source/media-source-runtime.js";
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

const surfaces = new Map([
  [MediaSource, [
    ["accessor", "sourceBuffers"],
    ["accessor", "activeSourceBuffers"],
    ["accessor", "duration"],
    ["accessor", "onsourceopen"],
    ["accessor", "onsourceended"],
    ["accessor", "onsourceclose"],
    ["accessor", "readyState"],
    ["method", "addSourceBuffer", 1],
    ["method", "clearLiveSeekableRange", 0],
    ["method", "endOfStream", 0],
    ["method", "removeSourceBuffer", 1],
    ["method", "setLiveSeekableRange", 2],
    ["constructor"],
    ["tag"],
  ]],
  [MediaSourceHandle, [["constructor"], ["tag"]]],
  [SourceBuffer, [
    ["accessor", "mode"],
    ["accessor", "updating"],
    ["accessor", "buffered"],
    ["accessor", "timestampOffset"],
    ["accessor", "appendWindowStart"],
    ["accessor", "appendWindowEnd"],
    ["accessor", "onupdatestart"],
    ["accessor", "onupdate"],
    ["accessor", "onupdateend"],
    ["accessor", "onerror"],
    ["accessor", "onabort"],
    ["method", "abort", 0],
    ["method", "appendBuffer", 1],
    ["method", "changeType", 1],
    ["method", "remove", 2],
    ["constructor"],
    ["tag"],
  ]],
  [SourceBufferList, [
    ["accessor", "length"],
    ["accessor", "onaddsourcebuffer"],
    ["accessor", "onremovesourcebuffer"],
    ["constructor"],
    ["tag"],
    ["iterator"],
  ]],
  [MediaRecorder, [
    ["accessor", "stream"],
    ["accessor", "mimeType"],
    ["accessor", "state"],
    ["accessor", "onstart"],
    ["accessor", "onstop"],
    ["accessor", "ondataavailable"],
    ["accessor", "onpause"],
    ["accessor", "onresume"],
    ["accessor", "onerror"],
    ["accessor", "videoBitsPerSecond"],
    ["accessor", "audioBitsPerSecond"],
    ["accessor", "audioBitrateMode"],
    ["method", "pause", 0],
    ["method", "requestData", 0],
    ["method", "resume", 0],
    ["method", "start", 0],
    ["method", "stop", 0],
    ["constructor"],
    ["tag"],
  ]],
  [BlobEvent, [
    ["accessor", "data"],
    ["accessor", "timecode"],
    ["constructor"],
    ["tag"],
  ]],
]);

const writable = new Set([
  "duration",
  "onsourceopen",
  "onsourceended",
  "onsourceclose",
  "mode",
  "timestampOffset",
  "appendWindowStart",
  "appendWindowEnd",
  "onupdatestart",
  "onupdate",
  "onupdateend",
  "onerror",
  "onabort",
  "onaddsourcebuffer",
  "onremovesourcebuffer",
  "onstart",
  "onstop",
  "ondataavailable",
  "onpause",
  "onresume",
]);

export function installMediaSource() {
  do {
    delete ((([...(surfaces.keys())])[0])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[0])).name, ((([...(surfaces.keys())])[0])));
  } while (false);
do {
    delete ((([...(surfaces.keys())])[1])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[1])).name, ((([...(surfaces.keys())])[1])));
  } while (false);
do {
    delete ((([...(surfaces.keys())])[2])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[2])).name, ((([...(surfaces.keys())])[2])));
  } while (false);
do {
    delete ((([...(surfaces.keys())])[3])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[3])).name, ((([...(surfaces.keys())])[3])));
  } while (false);
do {
    delete ((([...(surfaces.keys())])[4])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[4])).name, ((([...(surfaces.keys())])[4])));
  } while (false);
do {
    delete ((([...(surfaces.keys())])[5])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[5])).name, ((([...(surfaces.keys())])[5])));
  } while (false);
  do {
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[0])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[0])), EventTarget);
  } while (false);
do {
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[1])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[1])), EventTarget);
  } while (false);
do {
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[2])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[2])), EventTarget);
  } while (false);
do {
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[3])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([MediaSource, SourceBuffer, SourceBufferList, MediaRecorder])[3])), EventTarget);
  } while (false);
  Object.setPrototypeOf(BlobEvent.prototype, Event.prototype);
  Object.setPrototypeOf(BlobEvent, Event);
  do {
    {
  do {
    accessor((((([...(surfaces)])[0]))[0]), ("sourceBuffers"));
  } while (false);
do {
    accessor((((([...(surfaces)])[0]))[0]), ("activeSourceBuffers"));
  } while (false);
do {
    accessor((((([...(surfaces)])[0]))[0]), ("duration"));
  } while (false);
do {
    accessor((((([...(surfaces)])[0]))[0]), ("onsourceopen"));
  } while (false);
do {
    accessor((((([...(surfaces)])[0]))[0]), ("onsourceended"));
  } while (false);
do {
    accessor((((([...(surfaces)])[0]))[0]), ("onsourceclose"));
  } while (false);
do {
    accessor((((([...(surfaces)])[0]))[0]), ("readyState"));
  } while (false);
do {
    method((((([...(surfaces)])[0]))[0]), ("addSourceBuffer"), (1));
  } while (false);
do {
    method((((([...(surfaces)])[0]))[0]), ("clearLiveSeekableRange"), (0));
  } while (false);
do {
    method((((([...(surfaces)])[0]))[0]), ("endOfStream"), (0));
  } while (false);
do {
    method((((([...(surfaces)])[0]))[0]), ("removeSourceBuffer"), (1));
  } while (false);
do {
    method((((([...(surfaces)])[0]))[0]), ("setLiveSeekableRange"), (2));
  } while (false);
do {
    {
      defineConstructorBacklink((((([...(surfaces)])[0]))[0]).prototype, (((([...(surfaces)])[0]))[0]));
    }
  } while (false);
do {
    {
      defineToStringTag((((([...(surfaces)])[0]))[0]).prototype, (((([...(surfaces)])[0]))[0]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      defineConstructorBacklink((((([...(surfaces)])[1]))[0]).prototype, (((([...(surfaces)])[1]))[0]));
    }
  } while (false);
do {
    {
      defineToStringTag((((([...(surfaces)])[1]))[0]).prototype, (((([...(surfaces)])[1]))[0]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((((([...(surfaces)])[2]))[0]), ("mode"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("updating"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("buffered"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("timestampOffset"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("appendWindowStart"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("appendWindowEnd"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("onupdatestart"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("onupdate"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("onupdateend"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("onerror"));
  } while (false);
do {
    accessor((((([...(surfaces)])[2]))[0]), ("onabort"));
  } while (false);
do {
    method((((([...(surfaces)])[2]))[0]), ("abort"), (0));
  } while (false);
do {
    method((((([...(surfaces)])[2]))[0]), ("appendBuffer"), (1));
  } while (false);
do {
    method((((([...(surfaces)])[2]))[0]), ("changeType"), (1));
  } while (false);
do {
    method((((([...(surfaces)])[2]))[0]), ("remove"), (2));
  } while (false);
do {
    {
      defineConstructorBacklink((((([...(surfaces)])[2]))[0]).prototype, (((([...(surfaces)])[2]))[0]));
    }
  } while (false);
do {
    {
      defineToStringTag((((([...(surfaces)])[2]))[0]).prototype, (((([...(surfaces)])[2]))[0]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((((([...(surfaces)])[3]))[0]), ("length"));
  } while (false);
do {
    accessor((((([...(surfaces)])[3]))[0]), ("onaddsourcebuffer"));
  } while (false);
do {
    accessor((((([...(surfaces)])[3]))[0]), ("onremovesourcebuffer"));
  } while (false);
do {
    {
      defineConstructorBacklink((((([...(surfaces)])[3]))[0]).prototype, (((([...(surfaces)])[3]))[0]));
    }
  } while (false);
do {
    {
      defineToStringTag((((([...(surfaces)])[3]))[0]).prototype, (((([...(surfaces)])[3]))[0]).name);
    }
  } while (false);
do {
    {
      function values() {
        return sourceBufferListValues(this);
      }
      registerNativeFunction(values, "values");
      definePrototypeMethod(
        [...surfaces][3][0].prototype,
        Symbol.iterator,
        values,
        "values",
        false,
      );
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((((([...(surfaces)])[4]))[0]), ("stream"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("mimeType"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("state"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("onstart"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("onstop"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("ondataavailable"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("onpause"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("onresume"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("onerror"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("videoBitsPerSecond"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("audioBitsPerSecond"));
  } while (false);
do {
    accessor((((([...(surfaces)])[4]))[0]), ("audioBitrateMode"));
  } while (false);
do {
    method((((([...(surfaces)])[4]))[0]), ("pause"), (0));
  } while (false);
do {
    method((((([...(surfaces)])[4]))[0]), ("requestData"), (0));
  } while (false);
do {
    method((((([...(surfaces)])[4]))[0]), ("resume"), (0));
  } while (false);
do {
    method((((([...(surfaces)])[4]))[0]), ("start"), (0));
  } while (false);
do {
    method((((([...(surfaces)])[4]))[0]), ("stop"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((((([...(surfaces)])[4]))[0]).prototype, (((([...(surfaces)])[4]))[0]));
    }
  } while (false);
do {
    {
      defineToStringTag((((([...(surfaces)])[4]))[0]).prototype, (((([...(surfaces)])[4]))[0]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((((([...(surfaces)])[5]))[0]), ("data"));
  } while (false);
do {
    accessor((((([...(surfaces)])[5]))[0]), ("timecode"));
  } while (false);
do {
    {
      defineConstructorBacklink((((([...(surfaces)])[5]))[0]).prototype, (((([...(surfaces)])[5]))[0]));
    }
  } while (false);
do {
    {
      defineToStringTag((((([...(surfaces)])[5]))[0]).prototype, (((([...(surfaces)])[5]))[0]).name);
    }
  } while (false);
}
  } while (false);
  staticMethod(MediaSource, "isTypeSupported", mediaSourceIsTypeSupported);
  staticMethod(MediaRecorder, "isTypeSupported", mediaRecorderIsTypeSupported);
}



function accessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return mediaSourceProperty(this, name);
    },
    set [name](value) {
      setMediaSourceProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (writable.has(name)) {
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

function method(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return mediaSourceOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function staticMethod(Constructor, name, operation) {
  const callback = {
    [name](value) {
      return operation(value);
    },
  }[name];
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
