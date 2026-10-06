import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  AudioData,
  AudioDecoder,
  AudioEncoder,
  EncodedAudioChunk,
  EncodedVideoChunk,
  ImageDecoder,
  ImageTrack,
  ImageTrackList,
  VideoColorSpace,
  VideoDecoder,
  VideoEncoder,
  VideoFrame,
  codecIsConfigSupported,
  codecsConstructors,
  codecsOperation,
  codecsProperty,
  imageDecoderIsTypeSupported,
  imageTrackListValues,
  setCodecsProperty,
} from "../api/codecs/codecs-runtime.js";
import { CODECS_SURFACES } from "../api/codecs/codecs-surface.js";
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

const constructors = Object.freeze({
  AudioData,
  AudioDecoder,
  AudioEncoder,
  EncodedAudioChunk,
  EncodedVideoChunk,
  ImageDecoder,
  ImageTrack,
  ImageTrackList,
  VideoColorSpace,
  VideoDecoder,
  VideoEncoder,
  VideoFrame,
});

const writable = new Set(["ondequeue", "selected"]);

export function installCodecs() {

    delete codecsConstructors[0].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[0].name, codecsConstructors[0]);

    delete codecsConstructors[1].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[1].name, codecsConstructors[1]);

    delete codecsConstructors[2].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[2].name, codecsConstructors[2]);

    delete codecsConstructors[3].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[3].name, codecsConstructors[3]);

    delete codecsConstructors[4].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[4].name, codecsConstructors[4]);

    delete codecsConstructors[5].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[5].name, codecsConstructors[5]);

    delete codecsConstructors[6].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[6].name, codecsConstructors[6]);

    delete codecsConstructors[7].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[7].name, codecsConstructors[7]);

    delete codecsConstructors[8].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[8].name, codecsConstructors[8]);

    delete codecsConstructors[9].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[9].name, codecsConstructors[9]);

    delete codecsConstructors[10].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[10].name, codecsConstructors[10]);

    delete codecsConstructors[11].prototype.constructor;
    defineGlobalConstructor(codecsConstructors[11].name, codecsConstructors[11]);

  {
    const Constructor = constructors["AudioDecoder"];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  }
{
    const Constructor = constructors["AudioEncoder"];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  }
{
    const Constructor = constructors["VideoDecoder"];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  }
{
    const Constructor = constructors["VideoEncoder"];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  }

    {

    accessor(constructors["AudioData"], "format");

    accessor(constructors["AudioData"], "sampleRate");

    accessor(constructors["AudioData"], "numberOfFrames");

    accessor(constructors["AudioData"], "numberOfChannels");

    accessor(constructors["AudioData"], "duration");

    accessor(constructors["AudioData"], "timestamp");

    method(constructors["AudioData"], "allocationSize", 1);

    method(constructors["AudioData"], "clone", 0);

    method(constructors["AudioData"], "close", 0);

    method(constructors["AudioData"], "copyTo", 2);

    {
      defineConstructorBacklink(constructors["AudioData"].prototype, constructors["AudioData"]);
    }

    {
      defineToStringTag(constructors["AudioData"].prototype, constructors["AudioData"].name);
    }

}

    {

    accessor(constructors["VideoFrame"], "format");

    accessor(constructors["VideoFrame"], "timestamp");

    accessor(constructors["VideoFrame"], "duration");

    accessor(constructors["VideoFrame"], "codedWidth");

    accessor(constructors["VideoFrame"], "codedHeight");

    accessor(constructors["VideoFrame"], "codedRect");

    accessor(constructors["VideoFrame"], "visibleRect");

    accessor(constructors["VideoFrame"], "rotation");

    accessor(constructors["VideoFrame"], "flip");

    accessor(constructors["VideoFrame"], "displayWidth");

    accessor(constructors["VideoFrame"], "displayHeight");

    accessor(constructors["VideoFrame"], "colorSpace");

    method(constructors["VideoFrame"], "allocationSize", 0);

    method(constructors["VideoFrame"], "clone", 0);

    method(constructors["VideoFrame"], "close", 0);

    method(constructors["VideoFrame"], "copyTo", 1);

    method(constructors["VideoFrame"], "metadata", 0);

    {
      defineConstructorBacklink(constructors["VideoFrame"].prototype, constructors["VideoFrame"]);
    }

    {
      defineToStringTag(constructors["VideoFrame"].prototype, constructors["VideoFrame"].name);
    }

}

    {

    accessor(constructors["EncodedAudioChunk"], "type");

    accessor(constructors["EncodedAudioChunk"], "timestamp");

    accessor(constructors["EncodedAudioChunk"], "byteLength");

    accessor(constructors["EncodedAudioChunk"], "duration");

    method(constructors["EncodedAudioChunk"], "copyTo", 1);

    {
      defineConstructorBacklink(constructors["EncodedAudioChunk"].prototype, constructors["EncodedAudioChunk"]);
    }

    {
      defineToStringTag(constructors["EncodedAudioChunk"].prototype, constructors["EncodedAudioChunk"].name);
    }

}

    {

    accessor(constructors["EncodedVideoChunk"], "type");

    accessor(constructors["EncodedVideoChunk"], "timestamp");

    accessor(constructors["EncodedVideoChunk"], "duration");

    accessor(constructors["EncodedVideoChunk"], "byteLength");

    method(constructors["EncodedVideoChunk"], "copyTo", 1);

    {
      defineConstructorBacklink(constructors["EncodedVideoChunk"].prototype, constructors["EncodedVideoChunk"]);
    }

    {
      defineToStringTag(constructors["EncodedVideoChunk"].prototype, constructors["EncodedVideoChunk"].name);
    }

}

    {

    accessor(constructors["AudioDecoder"], "decodeQueueSize");

    accessor(constructors["AudioDecoder"], "ondequeue");

    accessor(constructors["AudioDecoder"], "state");

    method(constructors["AudioDecoder"], "close", 0);

    method(constructors["AudioDecoder"], "configure", 1);

    method(constructors["AudioDecoder"], "decode", 1);

    method(constructors["AudioDecoder"], "flush", 0);

    method(constructors["AudioDecoder"], "reset", 0);

    {
      defineConstructorBacklink(constructors["AudioDecoder"].prototype, constructors["AudioDecoder"]);
    }

    {
      defineToStringTag(constructors["AudioDecoder"].prototype, constructors["AudioDecoder"].name);
    }

}

    {

    accessor(constructors["AudioEncoder"], "encodeQueueSize");

    accessor(constructors["AudioEncoder"], "ondequeue");

    accessor(constructors["AudioEncoder"], "state");

    method(constructors["AudioEncoder"], "close", 0);

    method(constructors["AudioEncoder"], "configure", 1);

    method(constructors["AudioEncoder"], "encode", 1);

    method(constructors["AudioEncoder"], "flush", 0);

    method(constructors["AudioEncoder"], "reset", 0);

    {
      defineConstructorBacklink(constructors["AudioEncoder"].prototype, constructors["AudioEncoder"]);
    }

    {
      defineToStringTag(constructors["AudioEncoder"].prototype, constructors["AudioEncoder"].name);
    }

}

    {

    accessor(constructors["VideoDecoder"], "decodeQueueSize");

    accessor(constructors["VideoDecoder"], "ondequeue");

    accessor(constructors["VideoDecoder"], "state");

    method(constructors["VideoDecoder"], "close", 0);

    method(constructors["VideoDecoder"], "configure", 1);

    method(constructors["VideoDecoder"], "decode", 1);

    method(constructors["VideoDecoder"], "flush", 0);

    method(constructors["VideoDecoder"], "reset", 0);

    {
      defineConstructorBacklink(constructors["VideoDecoder"].prototype, constructors["VideoDecoder"]);
    }

    {
      defineToStringTag(constructors["VideoDecoder"].prototype, constructors["VideoDecoder"].name);
    }

}

    {

    accessor(constructors["VideoEncoder"], "encodeQueueSize");

    accessor(constructors["VideoEncoder"], "ondequeue");

    accessor(constructors["VideoEncoder"], "state");

    method(constructors["VideoEncoder"], "close", 0);

    method(constructors["VideoEncoder"], "configure", 1);

    method(constructors["VideoEncoder"], "encode", 1);

    method(constructors["VideoEncoder"], "flush", 0);

    method(constructors["VideoEncoder"], "reset", 0);

    {
      defineConstructorBacklink(constructors["VideoEncoder"].prototype, constructors["VideoEncoder"]);
    }

    {
      defineToStringTag(constructors["VideoEncoder"].prototype, constructors["VideoEncoder"].name);
    }

}

    {

    accessor(constructors["VideoColorSpace"], "primaries");

    accessor(constructors["VideoColorSpace"], "transfer");

    accessor(constructors["VideoColorSpace"], "matrix");

    accessor(constructors["VideoColorSpace"], "fullRange");

    method(constructors["VideoColorSpace"], "toJSON", 0);

    {
      defineConstructorBacklink(constructors["VideoColorSpace"].prototype, constructors["VideoColorSpace"]);
    }

    {
      defineToStringTag(constructors["VideoColorSpace"].prototype, constructors["VideoColorSpace"].name);
    }

}

    {

    accessor(constructors["ImageDecoder"], "type");

    accessor(constructors["ImageDecoder"], "complete");

    accessor(constructors["ImageDecoder"], "completed");

    accessor(constructors["ImageDecoder"], "tracks");

    method(constructors["ImageDecoder"], "close", 0);

    method(constructors["ImageDecoder"], "decode", 0);

    method(constructors["ImageDecoder"], "reset", 0);

    {
      defineConstructorBacklink(constructors["ImageDecoder"].prototype, constructors["ImageDecoder"]);
    }

    {
      defineToStringTag(constructors["ImageDecoder"].prototype, constructors["ImageDecoder"].name);
    }

}

    {

    accessor(constructors["ImageTrack"], "frameCount");

    accessor(constructors["ImageTrack"], "animated");

    accessor(constructors["ImageTrack"], "repetitionCount");

    accessor(constructors["ImageTrack"], "selected");

    {
      defineConstructorBacklink(constructors["ImageTrack"].prototype, constructors["ImageTrack"]);
    }

    {
      defineToStringTag(constructors["ImageTrack"].prototype, constructors["ImageTrack"].name);
    }

}

{

    accessor(constructors["ImageTrackList"], "length");

    accessor(constructors["ImageTrackList"], "selectedIndex");

    accessor(constructors["ImageTrackList"], "selectedTrack");

    accessor(constructors["ImageTrackList"], "ready");

    {
      defineConstructorBacklink(constructors["ImageTrackList"].prototype, constructors["ImageTrackList"]);
    }

    {
      defineToStringTag(constructors["ImageTrackList"].prototype, constructors["ImageTrackList"].name);
    }

{
      function values() {
        return imageTrackListValues(this);
      }
      registerNativeFunction(values, "values");
      definePrototypeMethod(
        (constructors["ImageTrackList"]).prototype,
        Symbol.iterator,
        values,
        "values",
        false,
      );
    }
}
  codecStatic(AudioDecoder, "audioDecoder");
  codecStatic(AudioEncoder, "audioEncoder");
  codecStatic(VideoDecoder, "videoDecoder");
  codecStatic(VideoEncoder, "videoEncoder");
  staticMethod(
    ImageDecoder,
    "isTypeSupported",
    imageDecoderIsTypeSupported,
  );
}

function accessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return codecsProperty(this, name);
    },
    set [name](value) {
      setCodecsProperty(this, name, value);
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
      return codecsOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function codecStatic(Constructor, kind) {
  staticMethod(
    Constructor,
    "isConfigSupported",
    config => codecIsConfigSupported(kind, config),
  );
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
