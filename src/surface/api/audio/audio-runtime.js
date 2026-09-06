import { initializeEventTarget } from "../event/event-target-state.js";
import { initializeEvent } from "../event/event-state.js";
import { Event } from "../event/event-constructor.js";
import { MessageChannel } from "../messaging/messaging-runtime.js";
import { createMediaStream } from "../media/media-stream-state.js";
import { createMediaStreamTrack } from "../media/media-stream-track-state.js";
import { createWorklet } from "../worklet/worklet-runtime.js";
import { monotonicNow, timingProfile } from "../../../infra/scheduler/monotonic-clock.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function BaseAudioContext() { illegalConstructor("BaseAudioContext", new.target); }
export function AudioContext() {
  requireNew(new.target, "AudioContext");
  initializeAudioContext(this, arguments[0] ?? {}, false);
}
export function OfflineAudioContext(contextOptions) {
  requireNew(new.target, "OfflineAudioContext");
  initializeOfflineContext(this, contextOptions, arguments);
}
export function AudioBuffer(options) {
  requireNew(new.target, "AudioBuffer");
  initializeAudioBuffer(this, options);
}
export function AudioNode() { illegalConstructor("AudioNode", new.target); }
export function AudioDestinationNode() { illegalConstructor("AudioDestinationNode", new.target); }
export function AudioListener() { illegalConstructor("AudioListener", new.target); }
export function AudioParam() { illegalConstructor("AudioParam", new.target); }
export function AudioScheduledSourceNode() { illegalConstructor("AudioScheduledSourceNode", new.target); }
export function AudioParamMap() { illegalConstructor("AudioParamMap", new.target); }
export function AudioSinkInfo() { illegalConstructor("AudioSinkInfo", new.target); }
export function AudioPlaybackStats() { illegalConstructor("AudioPlaybackStats", new.target); }
export function ScriptProcessorNode() { illegalConstructor("ScriptProcessorNode", new.target); }

export function AudioBufferSourceNode(context) {
  requireNew(new.target, "AudioBufferSourceNode");
  initializeNode(this, "audioBufferSource", context, arguments[1] ?? {});
}
export function AudioWorkletNode(context, name) {
  requireNew(new.target, "AudioWorkletNode");
  initializeNode(this, "audioWorklet", context, {
    ...(arguments[2] ?? {}),
    name: `${name}`,
  });
}
export function MediaElementAudioSourceNode(context, options) {
  requireNew(new.target, "MediaElementAudioSourceNode");
  initializeNode(this, "mediaElementSource", context, options ?? {});
}
export function MediaStreamAudioSourceNode(context, options) {
  requireNew(new.target, "MediaStreamAudioSourceNode");
  initializeNode(this, "mediaStreamSource", context, options ?? {});
}
export function MediaStreamAudioDestinationNode(context) {
  requireNew(new.target, "MediaStreamAudioDestinationNode");
  initializeNode(this, "mediaStreamDestination", context, arguments[1] ?? {});
}
export function AnalyserNode(context) {
  requireNew(new.target, "AnalyserNode");
  initializeNode(this, "analyser", context, arguments[1] ?? {});
}
export function BiquadFilterNode(context) {
  requireNew(new.target, "BiquadFilterNode");
  initializeNode(this, "biquad", context, arguments[1] ?? {});
}
export function ChannelMergerNode(context) {
  requireNew(new.target, "ChannelMergerNode");
  initializeNode(this, "channelMerger", context, arguments[1] ?? {});
}
export function ChannelSplitterNode(context) {
  requireNew(new.target, "ChannelSplitterNode");
  initializeNode(this, "channelSplitter", context, arguments[1] ?? {});
}
export function ConstantSourceNode(context) {
  requireNew(new.target, "ConstantSourceNode");
  initializeNode(this, "constantSource", context, arguments[1] ?? {});
}
export function ConvolverNode(context) {
  requireNew(new.target, "ConvolverNode");
  initializeNode(this, "convolver", context, arguments[1] ?? {});
}
export function DelayNode(context) {
  requireNew(new.target, "DelayNode");
  initializeNode(this, "delay", context, arguments[1] ?? {});
}
export function DynamicsCompressorNode(context) {
  requireNew(new.target, "DynamicsCompressorNode");
  initializeNode(this, "compressor", context, arguments[1] ?? {});
}
export function GainNode(context) {
  requireNew(new.target, "GainNode");
  initializeNode(this, "gain", context, arguments[1] ?? {});
}
export function IIRFilterNode(context, options) {
  requireNew(new.target, "IIRFilterNode");
  initializeNode(this, "iir", context, options ?? {});
}
export function OscillatorNode(context) {
  requireNew(new.target, "OscillatorNode");
  initializeNode(this, "oscillator", context, arguments[1] ?? {});
}
export function PannerNode(context) {
  requireNew(new.target, "PannerNode");
  initializeNode(this, "panner", context, arguments[1] ?? {});
}
export function PeriodicWave(context) {
  requireNew(new.target, "PeriodicWave");
  requireContext(context);
  state.set(this, {
    kind: "periodicWave",
    context,
    options: Object.freeze({ ...(arguments[1] ?? {}) }),
  });
}
export function StereoPannerNode(context) {
  requireNew(new.target, "StereoPannerNode");
  initializeNode(this, "stereoPanner", context, arguments[1] ?? {});
}
export function WaveShaperNode(context) {
  requireNew(new.target, "WaveShaperNode");
  initializeNode(this, "waveShaper", context, arguments[1] ?? {});
}

export function OfflineAudioCompletionEvent(type, init) {
  requireNew(new.target, "OfflineAudioCompletionEvent");
  if (arguments.length < 2 || init === null || typeof init !== "object") {
    throw new TypeError("OfflineAudioCompletionEvent requires an init object");
  }
  initializeEvent(this, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(this, {
    kind: "offlineCompletionEvent",
    renderedBuffer: init.renderedBuffer ?? null,
  });
}

export const audioConstructors = Object.freeze([
  BaseAudioContext,
  AudioContext,
  OfflineAudioContext,
  AudioBuffer,
  AudioNode,
  AudioDestinationNode,
  AudioListener,
  AudioParam,
  AudioScheduledSourceNode,
  AudioBufferSourceNode,
  AudioWorkletNode,
  MediaElementAudioSourceNode,
  MediaStreamAudioSourceNode,
  MediaStreamAudioDestinationNode,
  AudioParamMap,
  AudioSinkInfo,
  AudioPlaybackStats,
  OfflineAudioCompletionEvent,
  AnalyserNode,
  BiquadFilterNode,
  ChannelMergerNode,
  ChannelSplitterNode,
  ConstantSourceNode,
  ConvolverNode,
  DelayNode,
  DynamicsCompressorNode,
  GainNode,
  IIRFilterNode,
  OscillatorNode,
  PannerNode,
  PeriodicWave,
  ScriptProcessorNode,
  StereoPannerNode,
  WaveShaperNode,
]);

for (const constructor of audioConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

const constructorByNodeKind = Object.freeze({
  analyser: AnalyserNode,
  audioBufferSource: AudioBufferSourceNode,
  biquad: BiquadFilterNode,
  channelMerger: ChannelMergerNode,
  channelSplitter: ChannelSplitterNode,
  constantSource: ConstantSourceNode,
  convolver: ConvolverNode,
  delay: DelayNode,
  destination: AudioDestinationNode,
  compressor: DynamicsCompressorNode,
  gain: GainNode,
  iir: IIRFilterNode,
  mediaElementSource: MediaElementAudioSourceNode,
  mediaStreamDestination: MediaStreamAudioDestinationNode,
  mediaStreamSource: MediaStreamAudioSourceNode,
  oscillator: OscillatorNode,
  panner: PannerNode,
  scriptProcessor: ScriptProcessorNode,
  stereoPanner: StereoPannerNode,
  waveShaper: WaveShaperNode,
});

export function audioProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "context" || record.kind === "offlineContext") {
    if (name === "currentTime") return contextCurrentTime(record);
    // OfflineAudioContext.length 内部叫 offlineLength（`length` 在别处另有含义），
    // 不映射的话这个属性读出来是 undefined。音频指纹脚本会读它。
    if (name === "length" && record.kind === "offlineContext") {
      return record.offlineLength;
    }
    return record[name];
  }
  if (record.kind === "audioBuffer") {
    if (name === "duration") return record.length / record.sampleRate;
    return record[name];
  }
  if (record.kind === "audioParam") {
    if (name === "value") return audioParamValue(record);
    return record[name];
  }
  if (record.kind === "paramMap") {
    if (name === "size") return record.values.size;
  }
  if (record.kind === "playbackStats") {
    if (name === "totalDuration") {
      return contextCurrentTime(requireContextRecord(record.context));
    }
    return record[name];
  }
  if (name in record) return record[name];
  if (record.props?.has(name)) return record.props.get(name);
  return undefined;
}

export function setAudioProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "audioParam") {
    if (name === "value") {
      record.value = clampNumber(input, record.minValue, record.maxValue);
      return;
    }
    if (name === "automationRate") {
      const rate = `${input}`;
      if (!["a-rate", "k-rate"].includes(rate)) {
        throw new TypeError("Invalid AudioParam automationRate");
      }
      record.automationRate = rate;
      return;
    }
  }
  if (record.props?.has(name)) {
    setNodeProperty(record, name, input);
    return;
  }
  if (["channelCount", "channelCountMode", "channelInterpretation"].includes(name)) {
    setNodeProperty(record, name, input);
  }
}

export function audioOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "context" || record.kind === "offlineContext") {
    return contextOperation(value, record, name, args);
  }
  if (record.kind === "audioBuffer") return audioBufferOperation(record, name, args);
  if (record.kind === "audioParam") return audioParamOperation(value, record, name, args);
  if (record.kind === "paramMap") return paramMapOperation(value, record, name, args);
  if (record.kind === "listener") {
    if (name === "setPosition") {
      setVectorParams(record, "position", args);
      return;
    }
    if (name === "setOrientation") {
      setVectorParams(record, "forward", args.slice(0, 3));
      setVectorParams(record, "up", args.slice(3, 6));
      return;
    }
  }
  if (record.kind === "playbackStats") {
    if (name === "resetLatency") {
      record.averageLatency = 0;
      record.minimumLatency = 0;
      record.maximumLatency = 0;
      return;
    }
    if (name === "toJSON") {
      return {
        underrunDuration: record.underrunDuration,
        underrunEvents: record.underrunEvents,
        totalDuration: audioProperty(value, "totalDuration"),
        averageLatency: record.averageLatency,
        minimumLatency: record.minimumLatency,
        maximumLatency: record.maximumLatency,
      };
    }
  }
  if (record.kind === "node") return nodeOperation(value, record, name, args);
  throw new TypeError(`Unsupported audio operation: ${name}`);
}

function initializeAudioContext(context, options, offline) {
  initializeEventTarget(context);
  const sampleRate = finitePositive(options.sampleRate ?? 48000, "sampleRate");
  const record = {
    kind: offline ? "offlineContext" : "context",
    object: context,
    sampleRate,
    state: offline ? "suspended" : "suspended",
    accumulatedTime: 0,
    runningSince: null,
    destination: null,
    listener: null,
    audioWorklet: createWorklet("audio"),
    handlers: new Map([
      ["onstatechange", null],
      ["onerror", null],
      ["onsinkchange", null],
      ["oncomplete", null],
    ]),
    baseLatency: 128 / sampleRate,
    outputLatency: 256 / sampleRate,
    sinkId: "default",
    playbackStats: null,
    closed: false,
    nodes: new Set(),
    offlineLength: 0,
    suspensions: new Map(),
  };
  state.set(context, record);
  record.destination = createNode("destination", context, {});
  record.listener = createListener(context);
  record.playbackStats = createPlaybackStats(context);
}

function initializeOfflineContext(context, options, args) {
  let normalized;
  if (options !== null && typeof options === "object") {
    normalized = {
      numberOfChannels: options.numberOfChannels,
      length: options.length,
      sampleRate: options.sampleRate,
    };
  } else {
    // 三参数重载。少于三个实参时 Chromium 走字典重载，于是一个数字会被当成
    // OfflineAudioContextOptions 而报 TypeError——实测
    // `new OfflineAudioContext(1)` 给
    // "The provided value is not of type 'OfflineAudioContextOptions'."
    if (args.length < 3) {
      throw new TypeError(
        "Failed to construct 'OfflineAudioContext': "
        + "The provided value is not of type 'OfflineAudioContextOptions'.",
      );
    }
    normalized = {
      numberOfChannels: options,
      length: args[1],
      sampleRate: args[2],
    };
  }
  initializeAudioContext(context, normalized, true);
  const record = requireRecord(context);
  record.numberOfChannels = offlineChannelCount(normalized.numberOfChannels);
  record.offlineLength = offlineFrameCount(normalized.length);
  requireSupportedSampleRate(record.sampleRate);
  // destination 的通道数跟随 numberOfChannels，且 mode 是 `explicit`。
  // 实测 `new OfflineAudioContext(1, 44100, 44100)` 的 destination 是
  // `1|1|explicit|speakers`，而原实现一律给 `2|2|max|speakers`。
  // destination 在 initializeAudioContext() 里就建好了，那时还不知道通道数，
  // 所以这里补配。
  const destinationRecord = requireRecord(record.destination);
  destinationRecord.channelCount = record.numberOfChannels;
  destinationRecord.maxChannelCount = record.numberOfChannels;
  destinationRecord.channelCountMode = "explicit";
}

/**
 * `numberOfChannels` 校验。
 *
 * 报错类型必须是 `NotSupportedError` 而不是 `RangeError`——脚本经常按
 * `error.name` 分支。
 */
function offlineChannelCount(value) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0 || number > 32) {
    throw new DOMException(
      "Failed to construct 'OfflineAudioContext': The number of channels provided "
      + `(${number}) is outside the range [1, 32].`,
      "NotSupportedError",
    );
  }
  return number;
}

function offlineFrameCount(value) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new DOMException(
      "Failed to construct 'OfflineAudioContext': The number of frames provided "
      + `(${number}) is less than the minimum bound (1).`,
      "NotSupportedError",
    );
  }
  return number;
}

/**
 * 采样率范围 [3000, 768000]（实测真实 Edge 的报错文案直接带这个区间）。
 *
 * 原实现只要求「有限正数」，于是 `sampleRate: 1` 被静默接受——一个把采样率设成
 * 非法值再看是否抛错的探测，能直接区分出来。
 */
function requireSupportedSampleRate(sampleRate) {
  if (sampleRate >= 3000 && sampleRate <= 768000) return;
  throw new DOMException(
    "Failed to construct 'OfflineAudioContext': The sampleRate provided "
    + `(${sampleRate}) is outside the range [3000, 768000].`,
    "NotSupportedError",
  );
}

function initializeAudioBuffer(buffer, options) {
  if (options === null || typeof options !== "object") {
    throw new TypeError("AudioBuffer requires an options object");
  }
  const numberOfChannels = positiveInteger(
    options.numberOfChannels ?? 1,
    "numberOfChannels",
  );
  if (numberOfChannels > 32) throw new RangeError("Too many audio channels");
  const length = positiveInteger(options.length, "length");
  const sampleRate = finitePositive(options.sampleRate, "sampleRate");
  state.set(buffer, {
    kind: "audioBuffer",
    length,
    sampleRate,
    numberOfChannels,
    channels: Array.from(
      { length: numberOfChannels },
      () => new Float32Array(length),
    ),
  });
}

function initializeNode(node, nodeKind, context, options) {
  const contextRecord = requireContext(context);
  initializeEventTarget(node);
  const defaults = nodeDefaults(nodeKind, contextRecord, options);
  const record = {
    kind: "node",
    nodeKind,
    context,
    numberOfInputs: sourceNode(nodeKind) ? 0 : 1,
    numberOfOutputs: nodeKind === "destination" ? 0 : 1,
    channelCount: Number(options.channelCount ?? 2),
    channelCountMode: `${options.channelCountMode ?? "max"}`,
    channelInterpretation: `${options.channelInterpretation ?? "speakers"}`,
    connections: new Set(),
    handlers: new Map([
      ["onended", null],
      ["onaudioprocess", null],
      ["onprocessorerror", null],
    ]),
    props: new Map(Object.entries(defaults)),
    started: false,
    stopped: false,
    startTime: null,
    stopTime: null,
  };
  state.set(node, record);
  contextRecord.nodes.add(node);
}

function createNode(nodeKind, context, options) {
  const Constructor = constructorByNodeKind[nodeKind];
  const node = Object.create(Constructor.prototype);
  initializeNode(node, nodeKind, context, options);
  return node;
}

function createListener(context) {
  const listener = Object.create(AudioListener.prototype);
  state.set(listener, {
    kind: "listener",
    context,
    props: new Map([
      ["positionX", createParam(context, 0)],
      ["positionY", createParam(context, 0)],
      ["positionZ", createParam(context, 0)],
      ["forwardX", createParam(context, 0)],
      ["forwardY", createParam(context, 0)],
      ["forwardZ", createParam(context, -1)],
      ["upX", createParam(context, 0)],
      ["upY", createParam(context, 1)],
      ["upZ", createParam(context, 0)],
    ]),
  });
  return listener;
}

/**
 * float32 的最大值**加宽成 double 之后**的精确值。
 *
 * 原来写的是 `3.4028235e38`——那是 float32 最大值的十进制**缩写**，直接当 double
 * 用会打印成 `3.4028235e+38`，而真实 Chromium 打印
 * `3.4028234663852886e+38`。AudioParam 在 Chromium 里是 float 存储，读出来是
 * float32 加宽成 double，所以小数展开是完整的。
 *
 * 一个 `node.gain.minValue` 就能看出差别，成本极低。
 */
const FLOAT32_MAX = 3.4028234663852886e38;

/**
 * `detune` 的取值范围（实测真实 Edge：±153600 音分）。
 *
 * 原来所有 AudioParam 的 min/max 都是 float32 极值，于是 `frequency` 与 `detune`
 * 的范围全都不对。这两个是音频指纹脚本最常读的字段。
 */
const DETUNE_LIMIT = 153600;

function createParam(
  context,
  defaultValue,
  minValue = -FLOAT32_MAX,
  maxValue = FLOAT32_MAX,
) {
  const param = Object.create(AudioParam.prototype);
  // Chromium 里 AudioParam 是 float 存储，所有读出来的值都是 float32 加宽成
  // double。不 fround 的话 `attack.defaultValue` 会是 0.003 而真实是
  // 0.003000000026077032——写死小数字面量必然对不上。
  const rounded = Math.fround(Number(defaultValue));
  state.set(param, {
    kind: "audioParam",
    context,
    value: rounded,
    defaultValue: rounded,
    minValue: Math.fround(Number(minValue)),
    maxValue: Math.fround(Number(maxValue)),
    automationRate: "a-rate",
    events: [],
  });
  return param;
}

function createParamMap(values = new Map()) {
  const map = Object.create(AudioParamMap.prototype);
  state.set(map, { kind: "paramMap", values });
  return map;
}

function createPlaybackStats(context) {
  const stats = Object.create(AudioPlaybackStats.prototype);
  state.set(stats, {
    kind: "playbackStats",
    context,
    underrunDuration: 0,
    underrunEvents: 0,
    averageLatency: 0,
    minimumLatency: 0,
    maximumLatency: 0,
  });
  return stats;
}

function createSinkInfo(type = "none") {
  const info = Object.create(AudioSinkInfo.prototype);
  state.set(info, { kind: "sinkInfo", type });
  return info;
}

function contextOperation(context, record, name, args) {
  switch (name) {
    case "createBuffer":
      return createAudioBuffer(args[0], args[1], args[2]);
    case "createAnalyser": return createNode("analyser", context, {});
    case "createBiquadFilter": return createNode("biquad", context, {});
    case "createBufferSource": return createNode("audioBufferSource", context, {});
    case "createChannelMerger":
      return createNode("channelMerger", context, {
        numberOfInputs: args[0] ?? 6,
      });
    case "createChannelSplitter":
      return createNode("channelSplitter", context, {
        numberOfOutputs: args[0] ?? 6,
      });
    case "createConstantSource": return createNode("constantSource", context, {});
    case "createConvolver": return createNode("convolver", context, {});
    case "createDelay": return createNode("delay", context, { maxDelayTime: args[0] });
    case "createDynamicsCompressor": return createNode("compressor", context, {});
    case "createGain": return createNode("gain", context, {});
    case "createIIRFilter":
      return createNode("iir", context, {
        feedforward: [...args[0]],
        feedback: [...args[1]],
      });
    case "createOscillator": return createNode("oscillator", context, {});
    case "createPanner": return createNode("panner", context, {});
    case "createPeriodicWave": {
      const wave = Object.create(PeriodicWave.prototype);
      state.set(wave, {
        kind: "periodicWave",
        context,
        options: Object.freeze({
          real: new Float32Array(args[0]),
          imag: new Float32Array(args[1]),
          ...(args[2] ?? {}),
        }),
      });
      return wave;
    }
    case "createScriptProcessor":
      return createNode("scriptProcessor", context, {
        bufferSize: args[0] ?? 0,
        numberOfInputChannels: args[1] ?? 2,
        numberOfOutputChannels: args[2] ?? 2,
      });
    case "createStereoPanner": return createNode("stereoPanner", context, {});
    case "createWaveShaper": return createNode("waveShaper", context, {});
    case "createMediaElementSource":
      return createNode("mediaElementSource", context, { mediaElement: args[0] });
    case "createMediaStreamSource":
      return createNode("mediaStreamSource", context, { mediaStream: args[0] });
    case "createMediaStreamDestination":
      return createNode("mediaStreamDestination", context, {});
    case "decodeAudioData": {
      const input = args[0];
      if (!(input instanceof ArrayBuffer)) {
        return Promise.reject(new TypeError("decodeAudioData requires an ArrayBuffer"));
      }
      const decoded = createAudioBuffer(
        1,
        Math.max(1, Math.floor(input.byteLength / 4)),
        record.sampleRate,
      );
      return Promise.resolve(decoded).then(value => {
        if (typeof args[1] === "function") Reflect.apply(args[1], undefined, [value]);
        return value;
      }, error => {
        if (typeof args[2] === "function") Reflect.apply(args[2], undefined, [error]);
        throw error;
      });
    }
    case "resume":
      return transitionContext(record, "running");
    case "suspend":
      if (record.kind === "offlineContext" && args.length > 0) {
        const time = finiteNonNegative(args[0], "suspendTime");
        if (record.suspensions.has(time)) {
          return Promise.reject(new DOMException(
            "A suspension already exists at this time.",
            "InvalidStateError",
          ));
        }
        let resolve;
        const promise = new Promise(value => { resolve = value; });
        record.suspensions.set(time, resolve);
        return promise;
      }
      return transitionContext(record, "suspended");
    case "close":
      if (record.kind === "offlineContext") {
        return Promise.reject(new DOMException(
          "OfflineAudioContext cannot be closed.",
          "InvalidStateError",
        ));
      }
      return transitionContext(record, "closed");
    case "getOutputTimestamp":
      return {
        contextTime: contextCurrentTime(record),
        performanceTime: monotonicNow(),
      };
    case "setSinkId": {
      const requested = args[0];
      record.sinkId = typeof requested === "object"
        ? createSinkInfo(`${requested?.type ?? "none"}`)
        : `${requested}`;
      emit(record, "sinkchange", "onsinkchange");
      return Promise.resolve();
    }
    case "startRendering":
      return startOfflineRendering(record);
    default:
      throw new TypeError(`Unsupported audio context operation: ${name}`);
  }
}

function transitionContext(record, next) {
  if (record.state === "closed" && next !== "closed") {
    return Promise.reject(new DOMException(
      "The AudioContext is closed.",
      "InvalidStateError",
    ));
  }
  if (record.state === next) return Promise.resolve();
  const now = monotonicNow();
  if (record.state === "running" && record.runningSince !== null) {
    record.accumulatedTime += (now - record.runningSince) / 1000;
  }
  record.runningSince = next === "running" ? now : null;
  record.state = next;
  record.closed = next === "closed";
  emit(record, "statechange", "onstatechange");
  return Promise.resolve();
}

function startOfflineRendering(record) {
  if (record.renderPromise !== undefined) return record.renderPromise;
  record.state = "running";
  emit(record, "statechange", "onstatechange");
  record.renderPromise = Promise.resolve().then(() => {
    const buffer = createAudioBuffer(
      record.numberOfChannels,
      record.offlineLength,
      record.sampleRate,
    );
    record.accumulatedTime = record.offlineLength / record.sampleRate;
    for (const [time, resolve] of [...record.suspensions].sort((a, b) => a[0] - b[0])) {
      if (time <= record.accumulatedTime) resolve();
    }
    record.suspensions.clear();
    record.state = "closed";
    emit(record, "statechange", "onstatechange");
    const event = new OfflineAudioCompletionEvent("complete", {
      renderedBuffer: buffer,
    });
    record.object.dispatchEvent(event);
    const handler = record.handlers.get("oncomplete");
    if (handler !== null) Reflect.apply(handler, record.object, [event]);
    return buffer;
  });
  return record.renderPromise;
}

function nodeOperation(node, record, name, args) {
  switch (name) {
    case "connect": {
      const destination = args[0];
      const destinationRecord = requireRecord(destination);
      if (
        !["node", "audioParam"].includes(destinationRecord.kind)
        || destinationRecord.context !== record.context
      ) {
        throw new DOMException(
          "Failed to execute 'connect' on 'AudioNode': cannot connect to an "
          + "AudioNode belonging to a different audio context.",
          "InvalidAccessError",
        );
      }
      record.connections.add(destination);
      return destination;
    }
    case "disconnect":
      if (args.length === 0) record.connections.clear();
      else record.connections.delete(args[0]);
      return;
    case "start":
      if (record.started) {
        throw new DOMException("The source has already started.", "InvalidStateError");
      }
      record.started = true;
      record.startTime = finiteNonNegative(args[0] ?? 0, "when");
      return;
    case "stop":
      if (!record.started) {
        throw new DOMException("The source has not started.", "InvalidStateError");
      }
      record.stopped = true;
      record.stopTime = finiteNonNegative(args[0] ?? 0, "when");
      Promise.resolve().then(() => emit(record, "ended", "onended", node));
      return;
    case "getByteFrequencyData":
      fillArrayWithNoise(args[0], 0);
      return;
    case "getByteTimeDomainData":
      fillArrayWithNoise(args[0], 128);
      return;
    case "getFloatFrequencyData":
      fillArrayWithNoise(args[0], -Infinity);
      return;
    case "getFloatTimeDomainData":
      fillArrayWithNoise(args[0], 0);
      return;
    case "getFrequencyResponse":
      fillArray(args[1], 1);
      fillArray(args[2], 0);
      return;
    case "setPeriodicWave":
      if (requireRecord(args[0]).kind !== "periodicWave") {
        throw new TypeError("Expected a PeriodicWave");
      }
      record.props.set("type", "custom");
      record.periodicWave = args[0];
      return;
    case "setPosition":
      setVectorParams(record, "position", args);
      return;
    case "setOrientation":
      if (record.nodeKind === "panner") setVectorParams(record, "orientation", args);
      else {
        setVectorParams(record, "forward", args.slice(0, 3));
        setVectorParams(record, "up", args.slice(3, 6));
      }
      return;
    default:
      throw new TypeError(`Unsupported AudioNode operation: ${name}`);
  }
}

function audioBufferOperation(record, name, args) {
  const channel = channelData(
    record,
    args[name === "getChannelData" ? 0 : 1],
  );
  if (name === "getChannelData") return channel;
  const offset = Math.max(0, Number(args[2] ?? 0) >>> 0);
  if (name === "copyFromChannel") {
    const destination = args[0];
    if (!ArrayBuffer.isView(destination)) throw new TypeError("Expected a typed array");
    destination.set(channel.subarray(offset, offset + destination.length));
    return;
  }
  if (name === "copyToChannel") {
    const source = args[0];
    if (!ArrayBuffer.isView(source)) throw new TypeError("Expected a typed array");
    channel.set(source.subarray(0, channel.length - offset), offset);
    return;
  }
  throw new TypeError(`Unsupported AudioBuffer operation: ${name}`);
}

function audioParamOperation(param, record, name, args) {
  if (name === "cancelScheduledValues") {
    const start = finiteNonNegative(args[0], "startTime");
    record.events = record.events.filter(event => event.time < start);
    return param;
  }
  if (name === "cancelAndHoldAtTime") {
    const time = finiteNonNegative(args[0], "cancelTime");
    record.value = valueAtTime(record, time);
    record.events = record.events.filter(event => event.time < time);
    return param;
  }
  const event = { type: name };
  if (name === "setValueCurveAtTime") {
    event.curve = new Float32Array(args[0]);
    event.time = finiteNonNegative(args[1], "startTime");
    event.duration = finitePositive(args[2], "duration");
    event.value = event.curve[event.curve.length - 1] ?? record.value;
  } else if (name === "setTargetAtTime") {
    event.value = clampNumber(args[0], record.minValue, record.maxValue);
    event.time = finiteNonNegative(args[1], "startTime");
    event.timeConstant = finitePositive(args[2], "timeConstant");
  } else {
    event.value = clampNumber(args[0], record.minValue, record.maxValue);
    event.time = finiteNonNegative(args[1], "time");
    if (name === "exponentialRampToValueAtTime" && event.value <= 0) {
      throw new RangeError("Exponential ramps require a positive value");
    }
  }
  record.events.push(event);
  record.events.sort((left, right) => left.time - right.time);
  return param;
}

function paramMapOperation(map, record, name, args) {
  if (name === "size") return record.values.size;
  if (name === "get") return record.values.get(`${args[0]}`);
  if (name === "has") return record.values.has(`${args[0]}`);
  if (name === "keys") return record.values.keys();
  if (name === "values") return record.values.values();
  if (name === "entries") return record.values.entries();
  if (name === "forEach") {
    if (typeof args[0] !== "function") throw new TypeError("callback is not a function");
    for (const [key, value] of record.values) {
      Reflect.apply(args[0], args[1], [value, key, map]);
    }
    return;
  }
  throw new TypeError(`Unsupported AudioParamMap operation: ${name}`);
}

function nodeDefaults(kind, contextRecord, options) {
  const param = (value, min, max) => createParam(
    contextRecord.object,
    Number(options.value ?? value),
    min,
    max,
  );
  const common = {
    channelCount: Number(options.channelCount ?? 2),
    channelCountMode: `${options.channelCountMode ?? "max"}`,
    channelInterpretation: `${options.channelInterpretation ?? "speakers"}`,
  };
  switch (kind) {
    case "destination": return { ...common, maxChannelCount: 2 };
    case "audioBufferSource":
      return {
        ...common,
        buffer: options.buffer ?? null,
        playbackRate: param(1),
        detune: param(0),
        loop: Boolean(options.loop),
        loopStart: Number(options.loopStart ?? 0),
        loopEnd: Number(options.loopEnd ?? 0),
      };
    case "audioWorklet": {
      const channel = new MessageChannel();
      return {
        ...common,
        parameters: createParamMap(new Map()),
        port: channel.port1,
        processorPort: channel.port2,
      };
    }
    case "analyser":
      return {
        ...common,
        fftSize: Number(options.fftSize ?? 2048),
        frequencyBinCount: Number(options.fftSize ?? 2048) / 2,
        minDecibels: Number(options.minDecibels ?? -100),
        maxDecibels: Number(options.maxDecibels ?? -30),
        smoothingTimeConstant: Number(options.smoothingTimeConstant ?? 0.8),
      };
    case "biquad":
      return {
        ...common,
        type: `${options.type ?? "lowpass"}`,
        frequency: param(options.frequency ?? 350),
        detune: param(options.detune ?? 0),
        Q: param(options.Q ?? 1),
        gain: param(options.gain ?? 0),
      };
    case "constantSource": return { ...common, offset: param(options.offset ?? 1) };
    case "convolver":
      return {
        ...common,
        buffer: options.buffer ?? null,
        normalize: options.disableNormalization === undefined
          ? true
          : !Boolean(options.disableNormalization),
      };
    case "delay": return { ...common, delayTime: param(options.delayTime ?? 0, 0) };
    case "compressor":
      return {
        ...common,
        threshold: param(-24, -100, 0),
        knee: param(30, 0, 40),
        ratio: param(12, 1, 20),
        reduction: 0,
        attack: param(0.003, 0, 1),
        release: param(0.25, 0, 1),
      };
    case "gain": return { ...common, gain: param(options.gain ?? 1) };
    case "oscillator":
      return {
        ...common,
        type: `${options.type ?? "sine"}`,
        // 实测真实 Edge：frequency 的范围是 ±nyquist（sampleRate/2），
        // detune 是 ±153600。原来两者都用 float32 极值，是错的。
        frequency: param(
          options.frequency ?? 440,
          -contextRecord.sampleRate / 2,
          contextRecord.sampleRate / 2,
        ),
        detune: param(options.detune ?? 0, -DETUNE_LIMIT, DETUNE_LIMIT),
      };
    case "panner":
      return {
        ...common,
        panningModel: `${options.panningModel ?? "equalpower"}`,
        positionX: param(options.positionX ?? 0),
        positionY: param(options.positionY ?? 0),
        positionZ: param(options.positionZ ?? 0),
        orientationX: param(options.orientationX ?? 1),
        orientationY: param(options.orientationY ?? 0),
        orientationZ: param(options.orientationZ ?? 0),
        distanceModel: `${options.distanceModel ?? "inverse"}`,
        refDistance: Number(options.refDistance ?? 1),
        maxDistance: Number(options.maxDistance ?? 10000),
        rolloffFactor: Number(options.rolloffFactor ?? 1),
        coneInnerAngle: Number(options.coneInnerAngle ?? 360),
        coneOuterAngle: Number(options.coneOuterAngle ?? 360),
        coneOuterGain: Number(options.coneOuterGain ?? 0),
      };
    case "stereoPanner": return { ...common, pan: param(options.pan ?? 0, -1, 1) };
    case "waveShaper":
      return {
        ...common,
        curve: options.curve === undefined ? null : new Float32Array(options.curve),
        oversample: `${options.oversample ?? "none"}`,
      };
    case "scriptProcessor":
      return { ...common, bufferSize: Number(options.bufferSize ?? 0) };
    case "mediaElementSource":
      return { ...common, mediaElement: options.mediaElement };
    case "mediaStreamSource":
      return { ...common, mediaStream: options.mediaStream };
    case "mediaStreamDestination":
      return {
        ...common,
        stream: createMediaStream([
          createMediaStreamTrack("audio", "Web Audio Destination"),
        ]),
      };
    default: return common;
  }
}

function setNodeProperty(record, name, input) {
  if (name === "fftSize") {
    const size = Number(input);
    if (!Number.isInteger(size) || size < 32 || size > 32768 || (size & (size - 1)) !== 0) {
      // 报错类型必须是 IndexSizeError 而不是 RangeError——脚本按 error.name 分支。
      // 文案里的「不是 2 的幂」是 Chromium 的模板，范围超界另有一套文案，
      // 这里只对齐被探针覆盖的那条。
      throw new DOMException(
        "Failed to set the 'fftSize' property on 'AnalyserNode': "
        + `The value provided (${size}) is not a power of two.`,
        "IndexSizeError",
      );
    }
    record.props.set("fftSize", size);
    record.props.set("frequencyBinCount", size / 2);
    return;
  }
  if (name === "channelCount") {
    const count = positiveInteger(input, "channelCount");
    record.channelCount = count;
    record.props?.set(name, count);
    return;
  }
  if (name === "channelCountMode") {
    const mode = `${input}`;
    if (!["max", "clamped-max", "explicit"].includes(mode)) {
      throw new TypeError("Invalid channelCountMode");
    }
    record.channelCountMode = mode;
    record.props?.set(name, mode);
    return;
  }
  if (name === "channelInterpretation") {
    const interpretation = `${input}`;
    if (!["speakers", "discrete"].includes(interpretation)) {
      throw new TypeError("Invalid channelInterpretation");
    }
    record.channelInterpretation = interpretation;
    record.props?.set(name, interpretation);
    return;
  }
  const current = record.props.get(name);
  if (current !== null && typeof current === "object" && requireRecordOptional(current)?.kind === "audioParam") {
    return;
  }
  if (["loop", "normalize"].includes(name)) record.props.set(name, Boolean(input));
  else if ([
    "loopStart", "loopEnd", "minDecibels", "maxDecibels",
    "smoothingTimeConstant", "refDistance", "maxDistance", "rolloffFactor",
    "coneInnerAngle", "coneOuterAngle", "coneOuterGain",
  ].includes(name)) record.props.set(name, Number(input));
  else if (name === "curve") {
    record.props.set(name, input === null ? null : new Float32Array(input));
  } else if (["buffer", "mediaElement", "mediaStream"].includes(name)) {
    record.props.set(name, input);
  } else {
    record.props.set(name, `${input}`);
  }
}

function contextCurrentTime(record) {
  if (record.state !== "running" || record.runningSince === null) {
    return record.accumulatedTime;
  }
  return record.accumulatedTime + (monotonicNow() - record.runningSince) / 1000;
}

function audioParamValue(record) {
  return valueAtTime(record, contextCurrentTime(requireContextRecord(record.context)));
}

function valueAtTime(record, time) {
  let value = record.value;
  for (const event of record.events) {
    if (event.time > time) break;
    value = event.value;
  }
  return value;
}

function emit(record, type, handlerName, target = record.object) {
  if (target === undefined || typeof target.dispatchEvent !== "function") return;
  Promise.resolve().then(() => {
    const event = new Event(type);
    target.dispatchEvent(event);
    const handler = record.handlers?.get(handlerName) ?? null;
    if (handler !== null) Reflect.apply(handler, target, [event]);
  });
}

function createAudioBuffer(numberOfChannels, length, sampleRate) {
  const buffer = Object.create(AudioBuffer.prototype);
  initializeAudioBuffer(buffer, { numberOfChannels, length, sampleRate });
  return buffer;
}

function channelData(record, channelNumber) {
  const index = Number(channelNumber);
  if (!Number.isInteger(index) || index < 0 || index >= record.numberOfChannels) {
    // IndexSizeError，不是 RangeError。注意真实文案**结尾没有句点**。
    throw new DOMException(
      "Failed to execute 'getChannelData' on 'AudioBuffer': "
      + `channel index (${index}) exceeds number of channels `
      + `(${record.numberOfChannels})`,
      "IndexSizeError",
    );
  }
  return record.channels[index];
}

function setVectorParams(record, prefix, values) {
  for (const [suffix, value] of [["X", values[0]], ["Y", values[1]], ["Z", values[2]]]) {
    const param = record.props.get(`${prefix}${suffix}`);
    if (param !== undefined) requireRecord(param).value = Number(value);
  }
}

function fillArray(value, fill) {
  if (!ArrayBuffer.isView(value)) throw new TypeError("Expected a typed array");
  value.fill(fill);
}

// Adds deterministic per-session sub-LSB noise to audio analyser output so
// canvas/audio fingerprinting gets a session-unique value without audible change.
function fillArrayWithNoise(value, fill) {
  if (!ArrayBuffer.isView(value)) throw new TypeError("Expected a typed array");
  const seed = timingProfile().jitterSeed;
  const isFloat = value instanceof Float32Array;
  const isInfinity = !isFinite(fill);
  let s = seed >>> 0;
  for (let i = 0; i < value.length; i++) {
    // xorshift32 — fast, deterministic
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    const n = (s & 0xffff) / 0x10000; // [0, 1)
    if (isInfinity) {
      // getFloatFrequencyData: fill is -Infinity, add tiny positive offset to a few bins
      value[i] = i % 11 === 0 ? -100 + (n * 2 - 1) * 0.8 : fill;
    } else if (isFloat) {
      // getFloatTimeDomainData: values near 0
      value[i] = fill + (n * 2 - 1) * 1e-7;
    } else {
      // Byte arrays (0..255): add ±1 to occasional elements
      value[i] = (fill + (i % 7 === 0 ? ((s & 1) ? 1 : -1) : 0)) & 0xff;
    }
  }
}

function sourceNode(kind) {
  return [
    "audioBufferSource",
    "constantSource",
    "mediaElementSource",
    "mediaStreamSource",
    "oscillator",
  ].includes(kind);
}

function requireContext(context) {
  const record = requireContextRecord(context);
  if (record.state === "closed") {
    throw new DOMException("The AudioContext is closed.", "InvalidStateError");
  }
  return record;
}

function requireContextRecord(context) {
  const record = state.get(context);
  if (!["context", "offlineContext"].includes(record?.kind)) {
    throw new TypeError("Expected a BaseAudioContext");
  }
  return record;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireRecordOptional(value) {
  return state.get(value);
}

function finitePositive(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new RangeError(`${name} must be a positive finite number`);
  }
  return number;
}

function finiteNonNegative(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new RangeError(`${name} must be a non-negative finite number`);
  }
  return number;
}

function positiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
  return number;
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.min(max, Math.max(min, number));
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(
      `Failed to construct '${name}': Please use the 'new' operator, this DOM object constructor cannot be called as a function.`,
    );
  }
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
