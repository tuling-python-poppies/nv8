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
  do {
    delete (((codecsConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[0])).name, (((codecsConstructors)[0])));
  } while (false);
do {
    delete (((codecsConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[1])).name, (((codecsConstructors)[1])));
  } while (false);
do {
    delete (((codecsConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[2])).name, (((codecsConstructors)[2])));
  } while (false);
do {
    delete (((codecsConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[3])).name, (((codecsConstructors)[3])));
  } while (false);
do {
    delete (((codecsConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[4])).name, (((codecsConstructors)[4])));
  } while (false);
do {
    delete (((codecsConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[5])).name, (((codecsConstructors)[5])));
  } while (false);
do {
    delete (((codecsConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[6])).name, (((codecsConstructors)[6])));
  } while (false);
do {
    delete (((codecsConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[7])).name, (((codecsConstructors)[7])));
  } while (false);
do {
    delete (((codecsConstructors)[8])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[8])).name, (((codecsConstructors)[8])));
  } while (false);
do {
    delete (((codecsConstructors)[9])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[9])).name, (((codecsConstructors)[9])));
  } while (false);
do {
    delete (((codecsConstructors)[10])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[10])).name, (((codecsConstructors)[10])));
  } while (false);
do {
    delete (((codecsConstructors)[11])).prototype.constructor;
    defineGlobalConstructor((((codecsConstructors)[11])).name, (((codecsConstructors)[11])));
  } while (false);
  do {
    const Constructor = constructors[("AudioDecoder")];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  } while (false);
do {
    const Constructor = constructors[("AudioEncoder")];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  } while (false);
do {
    const Constructor = constructors[("VideoDecoder")];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  } while (false);
do {
    const Constructor = constructors[("VideoEncoder")];
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  } while (false);
  do {
    {
  do {
    accessor((constructors[("AudioData")]), ("format"));
  } while (false);
do {
    accessor((constructors[("AudioData")]), ("sampleRate"));
  } while (false);
do {
    accessor((constructors[("AudioData")]), ("numberOfFrames"));
  } while (false);
do {
    accessor((constructors[("AudioData")]), ("numberOfChannels"));
  } while (false);
do {
    accessor((constructors[("AudioData")]), ("duration"));
  } while (false);
do {
    accessor((constructors[("AudioData")]), ("timestamp"));
  } while (false);
do {
    method((constructors[("AudioData")]), ("allocationSize"), (1));
  } while (false);
do {
    method((constructors[("AudioData")]), ("clone"), (0));
  } while (false);
do {
    method((constructors[("AudioData")]), ("close"), (0));
  } while (false);
do {
    method((constructors[("AudioData")]), ("copyTo"), (2));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("AudioData")]).prototype, (constructors[("AudioData")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("AudioData")]).prototype, (constructors[("AudioData")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("VideoFrame")]), ("format"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("timestamp"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("duration"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("codedWidth"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("codedHeight"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("codedRect"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("visibleRect"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("rotation"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("flip"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("displayWidth"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("displayHeight"));
  } while (false);
do {
    accessor((constructors[("VideoFrame")]), ("colorSpace"));
  } while (false);
do {
    method((constructors[("VideoFrame")]), ("allocationSize"), (0));
  } while (false);
do {
    method((constructors[("VideoFrame")]), ("clone"), (0));
  } while (false);
do {
    method((constructors[("VideoFrame")]), ("close"), (0));
  } while (false);
do {
    method((constructors[("VideoFrame")]), ("copyTo"), (1));
  } while (false);
do {
    method((constructors[("VideoFrame")]), ("metadata"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("VideoFrame")]).prototype, (constructors[("VideoFrame")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("VideoFrame")]).prototype, (constructors[("VideoFrame")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("EncodedAudioChunk")]), ("type"));
  } while (false);
do {
    accessor((constructors[("EncodedAudioChunk")]), ("timestamp"));
  } while (false);
do {
    accessor((constructors[("EncodedAudioChunk")]), ("byteLength"));
  } while (false);
do {
    accessor((constructors[("EncodedAudioChunk")]), ("duration"));
  } while (false);
do {
    method((constructors[("EncodedAudioChunk")]), ("copyTo"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("EncodedAudioChunk")]).prototype, (constructors[("EncodedAudioChunk")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("EncodedAudioChunk")]).prototype, (constructors[("EncodedAudioChunk")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("EncodedVideoChunk")]), ("type"));
  } while (false);
do {
    accessor((constructors[("EncodedVideoChunk")]), ("timestamp"));
  } while (false);
do {
    accessor((constructors[("EncodedVideoChunk")]), ("duration"));
  } while (false);
do {
    accessor((constructors[("EncodedVideoChunk")]), ("byteLength"));
  } while (false);
do {
    method((constructors[("EncodedVideoChunk")]), ("copyTo"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("EncodedVideoChunk")]).prototype, (constructors[("EncodedVideoChunk")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("EncodedVideoChunk")]).prototype, (constructors[("EncodedVideoChunk")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("AudioDecoder")]), ("decodeQueueSize"));
  } while (false);
do {
    accessor((constructors[("AudioDecoder")]), ("ondequeue"));
  } while (false);
do {
    accessor((constructors[("AudioDecoder")]), ("state"));
  } while (false);
do {
    method((constructors[("AudioDecoder")]), ("close"), (0));
  } while (false);
do {
    method((constructors[("AudioDecoder")]), ("configure"), (1));
  } while (false);
do {
    method((constructors[("AudioDecoder")]), ("decode"), (1));
  } while (false);
do {
    method((constructors[("AudioDecoder")]), ("flush"), (0));
  } while (false);
do {
    method((constructors[("AudioDecoder")]), ("reset"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("AudioDecoder")]).prototype, (constructors[("AudioDecoder")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("AudioDecoder")]).prototype, (constructors[("AudioDecoder")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("AudioEncoder")]), ("encodeQueueSize"));
  } while (false);
do {
    accessor((constructors[("AudioEncoder")]), ("ondequeue"));
  } while (false);
do {
    accessor((constructors[("AudioEncoder")]), ("state"));
  } while (false);
do {
    method((constructors[("AudioEncoder")]), ("close"), (0));
  } while (false);
do {
    method((constructors[("AudioEncoder")]), ("configure"), (1));
  } while (false);
do {
    method((constructors[("AudioEncoder")]), ("encode"), (1));
  } while (false);
do {
    method((constructors[("AudioEncoder")]), ("flush"), (0));
  } while (false);
do {
    method((constructors[("AudioEncoder")]), ("reset"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("AudioEncoder")]).prototype, (constructors[("AudioEncoder")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("AudioEncoder")]).prototype, (constructors[("AudioEncoder")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("VideoDecoder")]), ("decodeQueueSize"));
  } while (false);
do {
    accessor((constructors[("VideoDecoder")]), ("ondequeue"));
  } while (false);
do {
    accessor((constructors[("VideoDecoder")]), ("state"));
  } while (false);
do {
    method((constructors[("VideoDecoder")]), ("close"), (0));
  } while (false);
do {
    method((constructors[("VideoDecoder")]), ("configure"), (1));
  } while (false);
do {
    method((constructors[("VideoDecoder")]), ("decode"), (1));
  } while (false);
do {
    method((constructors[("VideoDecoder")]), ("flush"), (0));
  } while (false);
do {
    method((constructors[("VideoDecoder")]), ("reset"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("VideoDecoder")]).prototype, (constructors[("VideoDecoder")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("VideoDecoder")]).prototype, (constructors[("VideoDecoder")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("VideoEncoder")]), ("encodeQueueSize"));
  } while (false);
do {
    accessor((constructors[("VideoEncoder")]), ("ondequeue"));
  } while (false);
do {
    accessor((constructors[("VideoEncoder")]), ("state"));
  } while (false);
do {
    method((constructors[("VideoEncoder")]), ("close"), (0));
  } while (false);
do {
    method((constructors[("VideoEncoder")]), ("configure"), (1));
  } while (false);
do {
    method((constructors[("VideoEncoder")]), ("encode"), (1));
  } while (false);
do {
    method((constructors[("VideoEncoder")]), ("flush"), (0));
  } while (false);
do {
    method((constructors[("VideoEncoder")]), ("reset"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("VideoEncoder")]).prototype, (constructors[("VideoEncoder")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("VideoEncoder")]).prototype, (constructors[("VideoEncoder")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("VideoColorSpace")]), ("primaries"));
  } while (false);
do {
    accessor((constructors[("VideoColorSpace")]), ("transfer"));
  } while (false);
do {
    accessor((constructors[("VideoColorSpace")]), ("matrix"));
  } while (false);
do {
    accessor((constructors[("VideoColorSpace")]), ("fullRange"));
  } while (false);
do {
    method((constructors[("VideoColorSpace")]), ("toJSON"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("VideoColorSpace")]).prototype, (constructors[("VideoColorSpace")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("VideoColorSpace")]).prototype, (constructors[("VideoColorSpace")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("ImageDecoder")]), ("type"));
  } while (false);
do {
    accessor((constructors[("ImageDecoder")]), ("complete"));
  } while (false);
do {
    accessor((constructors[("ImageDecoder")]), ("completed"));
  } while (false);
do {
    accessor((constructors[("ImageDecoder")]), ("tracks"));
  } while (false);
do {
    method((constructors[("ImageDecoder")]), ("close"), (0));
  } while (false);
do {
    method((constructors[("ImageDecoder")]), ("decode"), (0));
  } while (false);
do {
    method((constructors[("ImageDecoder")]), ("reset"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ImageDecoder")]).prototype, (constructors[("ImageDecoder")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ImageDecoder")]).prototype, (constructors[("ImageDecoder")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("ImageTrack")]), ("frameCount"));
  } while (false);
do {
    accessor((constructors[("ImageTrack")]), ("animated"));
  } while (false);
do {
    accessor((constructors[("ImageTrack")]), ("repetitionCount"));
  } while (false);
do {
    accessor((constructors[("ImageTrack")]), ("selected"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ImageTrack")]).prototype, (constructors[("ImageTrack")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ImageTrack")]).prototype, (constructors[("ImageTrack")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("ImageTrackList")]), ("length"));
  } while (false);
do {
    accessor((constructors[("ImageTrackList")]), ("selectedIndex"));
  } while (false);
do {
    accessor((constructors[("ImageTrackList")]), ("selectedTrack"));
  } while (false);
do {
    accessor((constructors[("ImageTrackList")]), ("ready"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ImageTrackList")]).prototype, (constructors[("ImageTrackList")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ImageTrackList")]).prototype, (constructors[("ImageTrackList")]).name);
    }
  } while (false);
do {
    {
      function values() {
        return imageTrackListValues(this);
      }
      registerNativeFunction(values, "values");
      definePrototypeMethod(
        (constructors[("ImageTrackList")]).prototype,
        Symbol.iterator,
        values,
        "values",
        false,
      );
    }
  } while (false);
}
  } while (false);
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
