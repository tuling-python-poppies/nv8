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

    delete ((([...(surfaces.keys())])[0])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[0])).name, ((([...(surfaces.keys())])[0])));

    delete ((([...(surfaces.keys())])[1])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[1])).name, ((([...(surfaces.keys())])[1])));

    delete ((([...(surfaces.keys())])[2])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[2])).name, ((([...(surfaces.keys())])[2])));

    delete ((([...(surfaces.keys())])[3])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[3])).name, ((([...(surfaces.keys())])[3])));

    delete ((([...(surfaces.keys())])[4])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[4])).name, ((([...(surfaces.keys())])[4])));

    delete ((([...(surfaces.keys())])[5])).prototype.constructor;
    defineGlobalConstructor(((([...(surfaces.keys())])[5])).name, ((([...(surfaces.keys())])[5])));

    Object.setPrototypeOf(MediaSource.prototype, EventTarget.prototype);
    Object.setPrototypeOf(MediaSource, EventTarget);

    Object.setPrototypeOf(SourceBuffer.prototype, EventTarget.prototype);
    Object.setPrototypeOf(SourceBuffer, EventTarget);

    Object.setPrototypeOf(SourceBufferList.prototype, EventTarget.prototype);
    Object.setPrototypeOf(SourceBufferList, EventTarget);

    Object.setPrototypeOf(MediaRecorder.prototype, EventTarget.prototype);
    Object.setPrototypeOf(MediaRecorder, EventTarget);

  Object.setPrototypeOf(BlobEvent.prototype, Event.prototype);
  Object.setPrototypeOf(BlobEvent, Event);

    {

    accessor((((([...(surfaces)])[0]))[0]), "sourceBuffers");

    accessor((((([...(surfaces)])[0]))[0]), "activeSourceBuffers");

    accessor((((([...(surfaces)])[0]))[0]), "duration");

    accessor((((([...(surfaces)])[0]))[0]), "onsourceopen");

    accessor((((([...(surfaces)])[0]))[0]), "onsourceended");

    accessor((((([...(surfaces)])[0]))[0]), "onsourceclose");

    accessor((((([...(surfaces)])[0]))[0]), "readyState");

    method((((([...(surfaces)])[0]))[0]), "addSourceBuffer", 1);

    method((((([...(surfaces)])[0]))[0]), "clearLiveSeekableRange", 0);

    method((((([...(surfaces)])[0]))[0]), "endOfStream", 0);

    method((((([...(surfaces)])[0]))[0]), "removeSourceBuffer", 1);

    method((((([...(surfaces)])[0]))[0]), "setLiveSeekableRange", 2);

    {
      defineConstructorBacklink((((([...(surfaces)])[0]))[0]).prototype, (((([...(surfaces)])[0]))[0]));
    }

    {
      defineToStringTag((((([...(surfaces)])[0]))[0]).prototype, (((([...(surfaces)])[0]))[0]).name);
    }

}

    {

    {
      defineConstructorBacklink((((([...(surfaces)])[1]))[0]).prototype, (((([...(surfaces)])[1]))[0]));
    }

    {
      defineToStringTag((((([...(surfaces)])[1]))[0]).prototype, (((([...(surfaces)])[1]))[0]).name);
    }

}

    {

    accessor((((([...(surfaces)])[2]))[0]), "mode");

    accessor((((([...(surfaces)])[2]))[0]), "updating");

    accessor((((([...(surfaces)])[2]))[0]), "buffered");

    accessor((((([...(surfaces)])[2]))[0]), "timestampOffset");

    accessor((((([...(surfaces)])[2]))[0]), "appendWindowStart");

    accessor((((([...(surfaces)])[2]))[0]), "appendWindowEnd");

    accessor((((([...(surfaces)])[2]))[0]), "onupdatestart");

    accessor((((([...(surfaces)])[2]))[0]), "onupdate");

    accessor((((([...(surfaces)])[2]))[0]), "onupdateend");

    accessor((((([...(surfaces)])[2]))[0]), "onerror");

    accessor((((([...(surfaces)])[2]))[0]), "onabort");

    method((((([...(surfaces)])[2]))[0]), "abort", 0);

    method((((([...(surfaces)])[2]))[0]), "appendBuffer", 1);

    method((((([...(surfaces)])[2]))[0]), "changeType", 1);

    method((((([...(surfaces)])[2]))[0]), "remove", 2);

    {
      defineConstructorBacklink((((([...(surfaces)])[2]))[0]).prototype, (((([...(surfaces)])[2]))[0]));
    }

    {
      defineToStringTag((((([...(surfaces)])[2]))[0]).prototype, (((([...(surfaces)])[2]))[0]).name);
    }

}

{

    accessor((((([...(surfaces)])[3]))[0]), "length");

    accessor((((([...(surfaces)])[3]))[0]), "onaddsourcebuffer");

    accessor((((([...(surfaces)])[3]))[0]), "onremovesourcebuffer");

    {
      defineConstructorBacklink((((([...(surfaces)])[3]))[0]).prototype, (((([...(surfaces)])[3]))[0]));
    }

    {
      defineToStringTag((((([...(surfaces)])[3]))[0]).prototype, (((([...(surfaces)])[3]))[0]).name);
    }

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
}

    {

    accessor((((([...(surfaces)])[4]))[0]), "stream");

    accessor((((([...(surfaces)])[4]))[0]), "mimeType");

    accessor((((([...(surfaces)])[4]))[0]), "state");

    accessor((((([...(surfaces)])[4]))[0]), "onstart");

    accessor((((([...(surfaces)])[4]))[0]), "onstop");

    accessor((((([...(surfaces)])[4]))[0]), "ondataavailable");

    accessor((((([...(surfaces)])[4]))[0]), "onpause");

    accessor((((([...(surfaces)])[4]))[0]), "onresume");

    accessor((((([...(surfaces)])[4]))[0]), "onerror");

    accessor((((([...(surfaces)])[4]))[0]), "videoBitsPerSecond");

    accessor((((([...(surfaces)])[4]))[0]), "audioBitsPerSecond");

    accessor((((([...(surfaces)])[4]))[0]), "audioBitrateMode");

    method((((([...(surfaces)])[4]))[0]), "pause", 0);

    method((((([...(surfaces)])[4]))[0]), "requestData", 0);

    method((((([...(surfaces)])[4]))[0]), "resume", 0);

    method((((([...(surfaces)])[4]))[0]), "start", 0);

    method((((([...(surfaces)])[4]))[0]), "stop", 0);

    {
      defineConstructorBacklink((((([...(surfaces)])[4]))[0]).prototype, (((([...(surfaces)])[4]))[0]));
    }

    {
      defineToStringTag((((([...(surfaces)])[4]))[0]).prototype, (((([...(surfaces)])[4]))[0]).name);
    }

}

    {

    accessor((((([...(surfaces)])[5]))[0]), "data");

    accessor((((([...(surfaces)])[5]))[0]), "timecode");

    {
      defineConstructorBacklink((((([...(surfaces)])[5]))[0]).prototype, (((([...(surfaces)])[5]))[0]));
    }

    {
      defineToStringTag((((([...(surfaces)])[5]))[0]).prototype, (((([...(surfaces)])[5]))[0]).name);
    }

}

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
