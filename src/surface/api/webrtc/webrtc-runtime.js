import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { initializeDOMException } from "../event/dom-exception-state.js";
import {
  createMediaStream,
  isMediaStream,
  requireMediaStream,
} from "../media/media-stream-state.js";
import {
  createMediaStreamTrack,
  isMediaStreamTrack,
  requireMediaStreamTrack,
} from "../media/media-stream-track-state.js";
import { monotonicNow } from "../../../infra/scheduler/monotonic-clock.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
let nextPeerId = 0;

export function RTCTrackEvent(type, init) {
  eventRecord(this, type, init, "trackEvent", {
    receiver: init?.receiver ?? null,
    track: init?.track ?? null,
    streams: Object.freeze([...(init?.streams ?? [])]),
    transceiver: init?.transceiver ?? null,
  });
}
export function RTCStatsReport() { illegalConstructor("RTCStatsReport", new.target); }
export function RTCSessionDescription(init = {}) {
  requireNew(new.target, "RTCSessionDescription");
  state.set(this, {
    kind: "sessionDescription",
    type: `${init.type ?? ""}`,
    sdp: `${init.sdp ?? ""}`,
  });
}
export function RTCSctpTransport() { illegalConstructor("RTCSctpTransport", new.target); }
export function RTCRtpTransceiver() { illegalConstructor("RTCRtpTransceiver", new.target); }
export function RTCRtpSender() { illegalConstructor("RTCRtpSender", new.target); }
export function RTCRtpReceiver() { illegalConstructor("RTCRtpReceiver", new.target); }
export function RTCPeerConnectionIceEvent(type, init = {}) {
  eventRecord(this, type, init, "iceEvent", {
    candidate: init.candidate === null || init.candidate === undefined
      ? null
      : normalizeCandidate(init.candidate),
  });
}
export function RTCPeerConnectionIceErrorEvent(type, init) {
  eventRecord(this, type, init, "iceErrorEvent", {
    address: init?.address ?? null,
    port: init?.port ?? null,
    hostCandidate: `${init?.hostCandidate ?? ""}`,
    url: `${init?.url ?? ""}`,
    errorCode: Number(init?.errorCode ?? 0),
    errorText: `${init?.errorText ?? ""}`,
  });
}
export function RTCPeerConnection(configuration = {}) {
  requireNew(new.target, "RTCPeerConnection");
  initializePeer(this, configuration);
}
export function RTCIceTransport() { illegalConstructor("RTCIceTransport", new.target); }
export function RTCIceCandidate(init = {}) {
  requireNew(new.target, "RTCIceCandidate");
  initializeIceCandidate(this, init);
}
export function RTCErrorEvent(type, init) {
  eventRecord(this, type, init, "errorEvent", {
    error: init?.error ?? null,
  });
}
export function RTCError(init, message = "") {
  requireNew(new.target, "RTCError");
  if (init === null || typeof init !== "object") {
    throw new TypeError("RTCError requires an init object");
  }
  initializeDOMException(this, `${message}`, "OperationError");
  state.set(this, {
    kind: "rtcError",
    errorDetail: `${init.errorDetail ?? ""}`,
    sdpLineNumber: init.sdpLineNumber ?? null,
    httpRequestStatusCode: init.httpRequestStatusCode ?? null,
    sctpCauseCode: init.sctpCauseCode ?? null,
    receivedAlert: init.receivedAlert ?? null,
    sentAlert: init.sentAlert ?? null,
  });
}
export function RTCEncodedVideoFrame(original) {
  requireNew(new.target, "RTCEncodedVideoFrame");
  initializeEncodedFrame(this, "encodedVideoFrame", original, true);
}
export function RTCEncodedAudioFrame(original) {
  requireNew(new.target, "RTCEncodedAudioFrame");
  initializeEncodedFrame(this, "encodedAudioFrame", original, false);
}
export function RTCDtlsTransport() { illegalConstructor("RTCDtlsTransport", new.target); }
export function RTCDataChannelEvent(type, init) {
  eventRecord(this, type, init, "dataChannelEvent", {
    channel: init?.channel ?? null,
  });
}
export function RTCDTMFToneChangeEvent(type, init) {
  eventRecord(this, type, init, "dtmfToneEvent", {
    tone: `${init?.tone ?? ""}`,
  });
}
export function RTCDTMFSender() { illegalConstructor("RTCDTMFSender", new.target); }
export function RTCCertificate() { illegalConstructor("RTCCertificate", new.target); }
export function RTCDataChannel() { illegalConstructor("RTCDataChannel", new.target); }
export function RTCRtpScriptTransform(worker) {
  requireNew(new.target, "RTCRtpScriptTransform");
  if (worker === null || (typeof worker !== "object" && typeof worker !== "function")) {
    throw new TypeError("RTCRtpScriptTransform requires a Worker");
  }
  state.set(this, {
    kind: "scriptTransform",
    worker,
    options: arguments[1] ?? {},
  });
}

export const webrtcConstructors = Object.freeze([
  RTCTrackEvent,
  RTCStatsReport,
  RTCSessionDescription,
  RTCSctpTransport,
  RTCRtpTransceiver,
  RTCRtpSender,
  RTCRtpReceiver,
  RTCPeerConnectionIceEvent,
  RTCPeerConnectionIceErrorEvent,
  RTCPeerConnection,
  RTCIceTransport,
  RTCIceCandidate,
  RTCErrorEvent,
  RTCError,
  RTCEncodedVideoFrame,
  RTCEncodedAudioFrame,
  RTCDtlsTransport,
  RTCDataChannelEvent,
  RTCDTMFToneChangeEvent,
  RTCDTMFSender,
  RTCCertificate,
  RTCDataChannel,
  RTCRtpScriptTransform,
]);

for (const constructor of webrtcConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function webrtcProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "statsReport" && name === "size") {
    return record.values.size;
  }
  return record[name];
}

export function setWebrtcProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "transceiver" && name === "direction") {
    const direction = `${input}`;
    if (!["sendrecv", "sendonly", "recvonly", "inactive"].includes(direction)) {
      throw new TypeError("Invalid transceiver direction");
    }
    record.direction = direction;
    return;
  }
  if (record.kind === "receiver") {
    if (name === "playoutDelayHint" || name === "jitterBufferTarget") {
      record[name] = input === null ? null : nonNegativeNumber(input, name);
      return;
    }
    if (name === "transform") record.transform = input;
  } else if (record.kind === "sender" && name === "transform") {
    record.transform = input;
  } else if (record.kind === "dataChannel") {
    if (name === "bufferedAmountLowThreshold") {
      record.bufferedAmountLowThreshold = nonNegativeNumber(input, name);
    } else if (name === "binaryType") {
      const binaryType = `${input}`;
      if (!["blob", "arraybuffer"].includes(binaryType)) {
        throw new TypeError("Invalid binaryType");
      }
      record.binaryType = binaryType;
    }
  } else if (record.kind.endsWith("Frame") && name === "data") {
    record.data = copyBuffer(input);
  }
}

export function webrtcOperation(value, name, args) {
  const record = requireRecord(value);
  switch (record.kind) {
    case "sessionDescription":
      if (name === "toJSON") return { type: record.type, sdp: record.sdp };
      break;
    case "iceCandidate":
      if (name === "toJSON") return candidateJSON(record);
      break;
    case "statsReport":
      return statsOperation(record, name, args);
    case "peer":
      return peerOperation(record, name, args);
    case "sender":
      return senderOperation(record, name, args);
    case "receiver":
      return receiverOperation(record, name);
    case "transceiver":
      return transceiverOperation(record, name, args);
    case "iceTransport":
      return iceTransportOperation(record, name);
    case "dtlsTransport":
      if (name === "getRemoteCertificates") return [];
      break;
    case "dtmfSender":
      if (name === "insertDTMF") return insertDTMF(record, args);
      break;
    case "certificate":
      if (name === "getFingerprints") return record.fingerprints.map(item => ({ ...item }));
      break;
    case "dataChannel":
      return dataChannelOperation(record, name, args);
    case "encodedAudioFrame":
    case "encodedVideoFrame":
      if (name === "getMetadata") return { ...record.metadata };
      if (name === "toString") return `[object ${record.kind === "encodedVideoFrame" ? "RTCEncodedVideoFrame" : "RTCEncodedAudioFrame"}]`;
      break;
  }
  throw new TypeError(`Unsupported WebRTC operation: ${name}`);
}

export function webrtcIterator(value) {
  return requireKind(value, "statsReport").values.entries();
}

export function generateCertificate(algorithm) {
  if (algorithm === null || typeof algorithm !== "object") {
    return Promise.reject(new TypeError("Certificate algorithm is required"));
  }
  const certificate = Object.create(RTCCertificate.prototype);
  state.set(certificate, {
    kind: "certificate",
    expires: Date.now() + 86_400_000,
    fingerprints: Object.freeze([Object.freeze({
      algorithm: "sha-256",
      value: "00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00",
    })]),
  });
  return Promise.resolve(certificate);
}

export function rtpCapabilities(kind) {
  const normalized = `${kind}`;
  if (!["audio", "video"].includes(normalized)) return null;
  return {
    codecs: normalized === "audio"
      ? [{ mimeType: "audio/opus", clockRate: 48000, channels: 2 }]
      : [{ mimeType: "video/VP8", clockRate: 90000 }],
    headerExtensions: [],
  };
}

function initializePeer(peer, configuration) {
  if (configuration === null || typeof configuration !== "object") {
    throw new TypeError("RTCConfiguration must be an object");
  }
  initializeEventTarget(peer);
  nextPeerId += 1;
  const ice = createIceTransport();
  const dtls = createDtlsTransport(ice);
  const sctp = createSctpTransport(dtls);
  state.set(peer, {
    kind: "peer",
    object: peer,
    id: nextPeerId,
    configuration: normalizeConfiguration(configuration),
    localDescription: null,
    currentLocalDescription: null,
    pendingLocalDescription: null,
    remoteDescription: null,
    currentRemoteDescription: null,
    pendingRemoteDescription: null,
    signalingState: "stable",
    iceGatheringState: "new",
    iceConnectionState: "new",
    connectionState: "new",
    canTrickleIceCandidates: null,
    sctp,
    ice,
    dtls,
    transceivers: [],
    senders: [],
    receivers: [],
    localStreams: [],
    remoteStreams: [],
    dataChannels: [],
    remoteCandidates: [],
    handlers: createHandlerMap([
      "onnegotiationneeded",
      "onicecandidate",
      "onsignalingstatechange",
      "oniceconnectionstatechange",
      "onconnectionstatechange",
      "onicegatheringstatechange",
      "onicecandidateerror",
      "ontrack",
      "ondatachannel",
      "onaddstream",
      "onremovestream",
    ]),
    closed: false,
  });
}

function peerOperation(record, name, args) {
  if (name === "close") {
    if (record.closed) return;
    record.closed = true;
    record.signalingState = "closed";
    record.iceConnectionState = "closed";
    record.connectionState = "closed";
    requireRecord(record.ice).state = "closed";
    requireRecord(record.dtls).state = "closed";
    requireRecord(record.sctp).state = "closed";
    for (const channel of record.dataChannels) closeDataChannel(requireRecord(channel));
    emit(record, "signalingstatechange", "onsignalingstatechange");
    emit(record, "iceconnectionstatechange", "oniceconnectionstatechange");
    emit(record, "connectionstatechange", "onconnectionstatechange");
    return;
  }
  requireOpenPeer(record);
  if (name === "getConfiguration") return cloneConfiguration(record.configuration);
  if (name === "setConfiguration") {
    record.configuration = normalizeConfiguration(args[0] ?? {});
    return;
  }
  if (name === "createOffer") {
    return Promise.resolve(createDescription("offer", createSdp(record, "offer")));
  }
  if (name === "createAnswer") {
    if (record.remoteDescription?.type !== "offer") {
      return Promise.reject(invalidState("No remote offer is set"));
    }
    return Promise.resolve(createDescription("answer", createSdp(record, "answer")));
  }
  if (name === "setLocalDescription") return setLocalDescription(record, args[0]);
  if (name === "setRemoteDescription") return setRemoteDescription(record, args[0]);
  if (name === "addIceCandidate") {
    if (args[0] !== null && args[0] !== undefined) {
      record.remoteCandidates.push(normalizeCandidate(args[0]));
    }
    return Promise.resolve();
  }
  if (name === "restartIce") {
    record.iceGatheringState = "new";
    record.iceConnectionState = "new";
    emit(record, "negotiationneeded", "onnegotiationneeded");
    return;
  }
  if (name === "addTrack") return addTrack(record, args);
  if (name === "removeTrack") return removeTrack(record, args[0]);
  if (name === "addTransceiver") return addTransceiver(record, args[0], args[1] ?? {});
  if (name === "getSenders") return [...record.senders];
  if (name === "getReceivers") return [...record.receivers];
  if (name === "getTransceivers") return [...record.transceivers];
  if (name === "getLocalStreams") return [...record.localStreams];
  if (name === "getRemoteStreams") return [...record.remoteStreams];
  if (name === "addStream") {
    const stream = args[0];
    if (!isMediaStream(stream)) throw new TypeError("Expected MediaStream");
    if (!record.localStreams.includes(stream)) record.localStreams.push(stream);
    for (const track of requireMediaStream(stream).tracks) addTrack(record, [track, stream]);
    return;
  }
  if (name === "removeStream") {
    const stream = args[0];
    record.localStreams = record.localStreams.filter(item => item !== stream);
    for (const sender of record.senders) {
      const senderRecord = requireRecord(sender);
      senderRecord.streams = senderRecord.streams.filter(item => item !== stream);
    }
    emit(record, "negotiationneeded", "onnegotiationneeded");
    return;
  }
  if (name === "createDataChannel") return createDataChannel(record, args[0], args[1] ?? {});
  if (name === "createDTMFSender") {
    const track = args[0];
    if (!isMediaStreamTrack(track) || requireMediaStreamTrack(track).kind !== "audio") {
      throw new TypeError("Expected an audio MediaStreamTrack");
    }
    return createDtmfSender(track);
  }
  if (name === "getStats") return Promise.resolve(createStatsReport(record, args[0]));
  throw new TypeError(`Unsupported RTCPeerConnection operation: ${name}`);
}

function setLocalDescription(record, input) {
  const description = input === undefined
    ? createDescription(
      record.remoteDescription?.type === "offer" ? "answer" : "offer",
      createSdp(record, record.remoteDescription?.type === "offer" ? "answer" : "offer"),
    )
    : normalizeDescription(input);
  record.localDescription = description;
  record.currentLocalDescription = description;
  record.pendingLocalDescription = null;
  record.signalingState = description.type === "offer"
    ? "have-local-offer"
    : "stable";
  emit(record, "signalingstatechange", "onsignalingstatechange");
  record.iceGatheringState = "gathering";
  requireRecord(record.ice).gatheringState = "gathering";
  emit(record, "icegatheringstatechange", "onicegatheringstatechange");
  return Promise.resolve().then(() => {
    record.iceGatheringState = "complete";
    requireRecord(record.ice).gatheringState = "complete";
    emit(record, "icecandidate", "onicecandidate", new RTCPeerConnectionIceEvent(
      "icecandidate",
      { candidate: null },
    ));
    emit(record, "icegatheringstatechange", "onicegatheringstatechange");
    maybeConnect(record);
  });
}

function setRemoteDescription(record, input) {
  const description = normalizeDescription(input);
  record.remoteDescription = description;
  record.currentRemoteDescription = description;
  record.pendingRemoteDescription = null;
  record.canTrickleIceCandidates = description.sdp.includes("a=ice-options:trickle");
  record.signalingState = description.type === "offer"
    ? "have-remote-offer"
    : "stable";
  emit(record, "signalingstatechange", "onsignalingstatechange");
  maybeConnect(record);
  return Promise.resolve();
}

function maybeConnect(record) {
  if (
    record.localDescription === null
    || record.remoteDescription === null
    || record.signalingState !== "stable"
    || record.closed
  ) {
    return;
  }
  record.iceConnectionState = "connected";
  record.connectionState = "connected";
  requireRecord(record.ice).state = "connected";
  requireRecord(record.dtls).state = "connected";
  requireRecord(record.sctp).state = "connected";
  for (const transceiver of record.transceivers) {
    const item = requireRecord(transceiver);
    item.currentDirection = item.direction;
  }
  for (const channel of record.dataChannels) openDataChannel(requireRecord(channel));
  emit(record, "iceconnectionstatechange", "oniceconnectionstatechange");
  emit(record, "connectionstatechange", "onconnectionstatechange");
}

function addTrack(record, args) {
  const track = args[0];
  if (!isMediaStreamTrack(track)) throw new TypeError("Expected MediaStreamTrack");
  if (record.senders.some(sender => requireRecord(sender).track === track)) {
    throw invalidState("Track is already added");
  }
  const streams = args.slice(1);
  if (!streams.every(isMediaStream)) throw new TypeError("Expected MediaStream");
  for (const stream of streams) {
    if (!record.localStreams.includes(stream)) record.localStreams.push(stream);
  }
  const transceiver = createTransceiver(
    record,
    requireMediaStreamTrack(track).kind,
    track,
    { direction: "sendrecv", streams },
  );
  emit(record, "negotiationneeded", "onnegotiationneeded");
  return requireRecord(transceiver).sender;
}

function removeTrack(record, sender) {
  const senderRecord = requireKind(sender, "sender");
  if (senderRecord.peer !== record.object) throw new TypeError("Foreign sender");
  senderRecord.track = null;
  emit(record, "negotiationneeded", "onnegotiationneeded");
}

function addTransceiver(record, source, init) {
  let kind;
  let track = null;
  if (isMediaStreamTrack(source)) {
    track = source;
    kind = requireMediaStreamTrack(source).kind;
  } else {
    kind = `${source}`;
    if (!["audio", "video"].includes(kind)) throw new TypeError("Invalid media kind");
  }
  const transceiver = createTransceiver(record, kind, track, init);
  emit(record, "negotiationneeded", "onnegotiationneeded");
  return transceiver;
}

function createTransceiver(peerRecord, kind, track, init) {
  const sender = Object.create(RTCRtpSender.prototype);
  const receiver = Object.create(RTCRtpReceiver.prototype);
  const transceiver = Object.create(RTCRtpTransceiver.prototype);
  const receiverTrack = createMediaStreamTrack(kind, `Remote ${kind}`);
  state.set(sender, {
    kind: "sender",
    peer: peerRecord.object,
    track,
    transport: peerRecord.dtls,
    rtcpTransport: null,
    dtmf: kind === "audio" ? createDtmfSender(track) : null,
    streams: [...(init.streams ?? [])],
    parameters: createRtpParameters(kind),
    transform: null,
  });
  state.set(receiver, {
    kind: "receiver",
    peer: peerRecord.object,
    track: receiverTrack,
    transport: peerRecord.dtls,
    rtcpTransport: null,
    playoutDelayHint: null,
    jitterBufferTarget: null,
    parameters: createRtpParameters(kind),
    transform: null,
  });
  state.set(transceiver, {
    kind: "transceiver",
    peer: peerRecord.object,
    mid: `${peerRecord.transceivers.length}`,
    sender,
    receiver,
    stopped: false,
    direction: `${init.direction ?? "sendrecv"}`,
    currentDirection: null,
    codecPreferences: [],
    headerExtensions: [],
  });
  peerRecord.senders.push(sender);
  peerRecord.receivers.push(receiver);
  peerRecord.transceivers.push(transceiver);
  return transceiver;
}

function senderOperation(record, name, args) {
  if (name === "getParameters") return structuredCopy(record.parameters);
  if (name === "setParameters") {
    record.parameters = structuredCopy(args[0] ?? {});
    return Promise.resolve();
  }
  if (name === "replaceTrack") {
    const track = args[0] ?? null;
    if (track !== null && !isMediaStreamTrack(track)) {
      return Promise.reject(new TypeError("Expected MediaStreamTrack or null"));
    }
    record.track = track;
    return Promise.resolve();
  }
  if (name === "setStreams") {
    if (!args.every(isMediaStream)) throw new TypeError("Expected MediaStream");
    record.streams = [...args];
    return;
  }
  if (name === "getStats") return Promise.resolve(createStatsReport(requireRecord(record.peer)));
  if (name === "createEncodedStreams") return createEncodedStreams();
}

function receiverOperation(record, name) {
  if (name === "getParameters") return structuredCopy(record.parameters);
  if (name === "getStats") return Promise.resolve(createStatsReport(requireRecord(record.peer)));
  if (name === "getContributingSources" || name === "getSynchronizationSources") return [];
  if (name === "createEncodedStreams") return createEncodedStreams();
}

function transceiverOperation(record, name, args) {
  if (name === "stop") {
    record.stopped = true;
    record.direction = "inactive";
    record.currentDirection = null;
    return;
  }
  if (name === "setCodecPreferences") {
    record.codecPreferences = structuredCopy(args[0] ?? []);
    return;
  }
  if (name === "setHeaderExtensionsToNegotiate") {
    record.headerExtensions = structuredCopy(args[0] ?? []);
    return;
  }
  if (name === "getHeaderExtensionsToNegotiate") {
    return structuredCopy(record.headerExtensions);
  }
  if (name === "getNegotiatedHeaderExtensions") {
    return record.currentDirection === null ? [] : structuredCopy(record.headerExtensions);
  }
}

function createDataChannel(peerRecord, label, init) {
  const channel = Object.create(RTCDataChannel.prototype);
  initializeEventTarget(channel);
  const id = init.id ?? peerRecord.dataChannels.length;
  state.set(channel, {
    kind: "dataChannel",
    object: channel,
    peer: peerRecord.object,
    label: `${label}`,
    ordered: Boolean(init.ordered ?? true),
    maxPacketLifeTime: init.maxPacketLifeTime ?? null,
    maxRetransmits: init.maxRetransmits ?? null,
    protocol: `${init.protocol ?? ""}`,
    negotiated: Boolean(init.negotiated),
    id: Number(id),
    readyState: "connecting",
    bufferedAmount: 0,
    bufferedAmountLowThreshold: 0,
    binaryType: "arraybuffer",
    reliable: init.maxPacketLifeTime === undefined && init.maxRetransmits === undefined,
    handlers: createHandlerMap([
      "onopen",
      "onbufferedamountlow",
      "onerror",
      "onclosing",
      "onclose",
      "onmessage",
    ]),
  });
  peerRecord.dataChannels.push(channel);
  if (peerRecord.connectionState === "connected") openDataChannel(state.get(channel));
  return channel;
}

function dataChannelOperation(record, name, args) {
  if (name === "close") return closeDataChannel(record);
  if (name === "send") {
    if (record.readyState !== "open") throw invalidState("Data channel is not open");
    const size = dataSize(args[0]);
    record.bufferedAmount += size;
    Promise.resolve().then(() => {
      if (record.readyState === "closed") return;
      const previous = record.bufferedAmount;
      record.bufferedAmount = Math.max(0, record.bufferedAmount - size);
      if (
        previous > record.bufferedAmountLowThreshold
        && record.bufferedAmount <= record.bufferedAmountLowThreshold
      ) {
        emit(record, "bufferedamountlow", "onbufferedamountlow");
      }
    });
    return;
  }
}

function openDataChannel(record) {
  if (record.readyState !== "connecting") return;
  record.readyState = "open";
  emit(record, "open", "onopen");
}

function closeDataChannel(record) {
  if (record.readyState === "closed") return;
  record.readyState = "closing";
  emit(record, "closing", "onclosing");
  Promise.resolve().then(() => {
    record.readyState = "closed";
    emit(record, "close", "onclose");
  });
}

function createDtmfSender(track) {
  const value = Object.create(RTCDTMFSender.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "dtmfSender",
    object: value,
    track,
    canInsertDTMF: track !== null,
    toneBuffer: "",
    handlers: createHandlerMap(["ontonechange"]),
    generation: 0,
  });
  return value;
}

function insertDTMF(record, args) {
  if (!record.canInsertDTMF) throw invalidState("DTMF is unavailable");
  record.toneBuffer = `${args[0]}`.toUpperCase();
  record.generation += 1;
  const generation = record.generation;
  for (const tone of record.toneBuffer) {
    Promise.resolve().then(() => {
      if (generation !== record.generation) return;
      record.toneBuffer = record.toneBuffer.slice(1);
      emit(record, "tonechange", "ontonechange", new RTCDTMFToneChangeEvent(
        "tonechange",
        { tone },
      ));
    });
  }
}

function createIceTransport() {
  const value = Object.create(RTCIceTransport.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "iceTransport",
    role: "unknown",
    state: "new",
    gatheringState: "new",
    handlers: createHandlerMap([
      "onstatechange",
      "ongatheringstatechange",
      "onselectedcandidatepairchange",
    ]),
    localCandidates: [],
    remoteCandidates: [],
  });
  return value;
}

function iceTransportOperation(record, name) {
  if (name === "getLocalCandidates") return structuredCopy(record.localCandidates);
  if (name === "getRemoteCandidates") return structuredCopy(record.remoteCandidates);
  if (name === "getLocalParameters") {
    return { usernameFragment: "edge", password: "offline" };
  }
  if (name === "getRemoteParameters") return null;
  if (name === "getSelectedCandidatePair") return null;
}

function createDtlsTransport(iceTransport) {
  const value = Object.create(RTCDtlsTransport.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "dtlsTransport",
    iceTransport,
    state: "new",
    handlers: createHandlerMap(["onstatechange", "onerror"]),
  });
  return value;
}

function createSctpTransport(transport) {
  const value = Object.create(RTCSctpTransport.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "sctpTransport",
    transport,
    state: "connecting",
    maxMessageSize: 262144,
    maxChannels: 65534,
    handlers: createHandlerMap(["onstatechange"]),
  });
  return value;
}

function createStatsReport(peerRecord) {
  const report = Object.create(RTCStatsReport.prototype);
  const timestamp = monotonicNow();
  const values = new Map();
  values.set(`peer-connection-${peerRecord.id}`, Object.freeze({
    id: `peer-connection-${peerRecord.id}`,
    type: "peer-connection",
    timestamp,
    dataChannelsOpened: peerRecord.dataChannels.filter(
      channel => requireRecord(channel).readyState === "open",
    ).length,
    dataChannelsClosed: peerRecord.dataChannels.filter(
      channel => requireRecord(channel).readyState === "closed",
    ).length,
  }));
  peerRecord.senders.forEach((sender, index) => {
    const track = requireRecord(sender).track;
    values.set(`outbound-rtp-${index}`, Object.freeze({
      id: `outbound-rtp-${index}`,
      type: "outbound-rtp",
      timestamp,
      kind: track === null ? null : requireMediaStreamTrack(track).kind,
      packetsSent: 0,
      bytesSent: 0,
    }));
  });
  state.set(report, { kind: "statsReport", object: report, values });
  return report;
}

function statsOperation(record, name, args) {
  if (name === "entries") return record.values.entries();
  if (name === "keys") return record.values.keys();
  if (name === "values") return record.values.values();
  if (name === "get") return record.values.get(args[0]);
  if (name === "has") return record.values.has(args[0]);
  if (name === "forEach") {
    const callback = args[0];
    const thisArg = args[1];
    record.values.forEach((item, key) => {
      Reflect.apply(callback, thisArg, [item, key, record.object]);
    });
  }
}

function initializeIceCandidate(value, init) {
  const candidate = `${init.candidate ?? ""}`;
  const parsed = parseCandidate(candidate);
  state.set(value, {
    kind: "iceCandidate",
    candidate,
    sdpMid: init.sdpMid ?? null,
    sdpMLineIndex: init.sdpMLineIndex ?? null,
    foundation: init.foundation ?? parsed.foundation,
    component: init.component ?? parsed.component,
    priority: init.priority ?? parsed.priority,
    address: init.address ?? parsed.address,
    protocol: init.protocol ?? parsed.protocol,
    port: init.port ?? parsed.port,
    type: init.type ?? parsed.type,
    tcpType: init.tcpType ?? null,
    relatedAddress: init.relatedAddress ?? null,
    relatedPort: init.relatedPort ?? null,
    usernameFragment: init.usernameFragment ?? null,
    relayProtocol: init.relayProtocol ?? null,
    url: init.url ?? null,
  });
}

function parseCandidate(candidate) {
  const fields = candidate.replace(/^candidate:/u, "").trim().split(/\s+/u);
  return {
    foundation: fields[0] || null,
    component: fields[1] === "1" ? "rtp" : fields[1] === "2" ? "rtcp" : null,
    protocol: fields[2]?.toLowerCase() ?? null,
    priority: fields[3] === undefined ? null : Number(fields[3]),
    address: fields[4] ?? null,
    port: fields[5] === undefined ? null : Number(fields[5]),
    type: fields[7] ?? null,
  };
}

function candidateJSON(record) {
  return {
    candidate: record.candidate,
    sdpMid: record.sdpMid,
    sdpMLineIndex: record.sdpMLineIndex,
    usernameFragment: record.usernameFragment,
  };
}

function initializeEncodedFrame(value, kind, original, video) {
  const source = state.get(original);
  const input = source?.kind === kind ? source : original;
  if (input === null || typeof input !== "object") {
    throw new TypeError("Encoded frame source is required");
  }
  state.set(value, {
    kind,
    type: video ? `${input.type ?? "key"}` : undefined,
    timestamp: Number(input.timestamp ?? 0),
    data: copyBuffer(input.data ?? new ArrayBuffer(0)),
    metadata: structuredCopy(input.metadata ?? {}),
  });
}

function eventRecord(value, type, init, kind, fields) {
  requireNew(new.target ?? value?.constructor, value?.constructor?.name ?? "Event");
  if (init === null || typeof init !== "object") {
    throw new TypeError("Event init must be an object");
  }
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, { kind, ...fields });
}

function createDescription(type, sdp) {
  return new RTCSessionDescription({ type, sdp });
}

function normalizeDescription(input) {
  if (state.get(input)?.kind === "sessionDescription") return input;
  if (input === null || typeof input !== "object") {
    throw new TypeError("RTCSessionDescriptionInit is required");
  }
  return createDescription(`${input.type}`, `${input.sdp ?? ""}`);
}

function normalizeCandidate(input) {
  return state.get(input)?.kind === "iceCandidate"
    ? input
    : new RTCIceCandidate(input);
}

function normalizeConfiguration(input) {
  return Object.freeze({
    iceServers: Object.freeze([...(input.iceServers ?? [])].map(server => Object.freeze({
      ...server,
    }))),
    iceTransportPolicy: `${input.iceTransportPolicy ?? "all"}`,
    bundlePolicy: `${input.bundlePolicy ?? "balanced"}`,
    rtcpMuxPolicy: `${input.rtcpMuxPolicy ?? "require"}`,
    iceCandidatePoolSize: Number(input.iceCandidatePoolSize ?? 0),
  });
}

function cloneConfiguration(value) {
  return {
    ...value,
    iceServers: value.iceServers.map(server => ({ ...server })),
  };
}

function createSdp(record, type) {
  const lines = [
    "v=0",
    `o=- ${record.id} ${type === "offer" ? 1 : 2} IN IP4 127.0.0.1`,
    "s=-",
    "t=0 0",
    "a=ice-options:trickle",
  ];
  for (const transceiver of record.transceivers) {
    const item = requireRecord(transceiver);
    const payload = requireMediaStreamTrack(
      requireRecord(item.receiver).track,
    ).kind === "audio" ? "111" : "96";
    lines.push(
      `m=${payload === "111" ? "audio" : "video"} 9 UDP/TLS/RTP/SAVPF ${payload}`,
      "c=IN IP4 0.0.0.0",
      `a=mid:${item.mid}`,
      `a=${item.direction}`,
    );
  }
  return `${lines.join("\r\n")}\r\n`;
}

function createRtpParameters(kind) {
  return {
    transactionId: `edge-${kind}`,
    codecs: rtpCapabilities(kind).codecs,
    headerExtensions: [],
    encodings: [{}],
    rtcp: { reducedSize: true },
  };
}

function createEncodedStreams() {
  const transform = new TransformStream();
  return { readable: transform.readable, writable: transform.writable };
}

function emit(record, type, handlerName, event = new Event(type)) {
  const target = record.object;
  if (target === undefined) return;
  Promise.resolve().then(() => {
    target.dispatchEvent(event);
    const handler = record.handlers?.get(handlerName) ?? null;
    if (handler !== null) Reflect.apply(handler, target, [event]);
  });
}

function createHandlerMap(names) {
  return new Map(names.map(name => [name, null]));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireKind(value, kind) {
  const record = requireRecord(value);
  if (record.kind !== kind) throw new TypeError("Illegal invocation");
  return record;
}

function requireOpenPeer(record) {
  if (record.closed) throw invalidState("RTCPeerConnection is closed");
}

function invalidState(message) {
  return new DOMException(message, "InvalidStateError");
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use the new operator`);
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

function structuredCopy(input) {
  if (input === undefined) return undefined;
  return JSON.parse(JSON.stringify(input));
}

function copyBuffer(input) {
  if (input instanceof ArrayBuffer) return input.slice(0);
  if (ArrayBuffer.isView(input)) {
    return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  }
  throw new TypeError("Expected BufferSource");
}

function nonNegativeNumber(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new RangeError(`${name} must be a non-negative finite number`);
  }
  return number;
}

function dataSize(value) {
  if (typeof value === "string") return new TextEncoder().encode(value).byteLength;
  if (value instanceof ArrayBuffer) return value.byteLength;
  if (ArrayBuffer.isView(value)) return value.byteLength;
  if (typeof Blob === "function" && value instanceof Blob) return value.size;
  throw new TypeError("Unsupported RTCDataChannel data");
}
