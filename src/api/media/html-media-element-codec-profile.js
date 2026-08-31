import { createRealmSlot } from "../../core/state-scope.js";

// 编解码器白名单原先是模块级状态，会跨 Realm 共享媒体能力指纹。
const codecSlot = createRealmSlot(() => ({
  audio: new Set(DEFAULT_AUDIO_CODECS),
  video: new Set(DEFAULT_VIDEO_CODECS),
}), "html-media-element-codec-profile");

function codecState() {
  return codecSlot.get(globalThis);
}

const DEFAULT_AUDIO_CODECS = Object.freeze([
  "opus",
  "vorbis",
  "mp4a",
  "flac",
  "pcm",
  "mp3",
]);
const DEFAULT_VIDEO_CODECS = Object.freeze([
  "vp8",
  "vp09",
  "av01",
  "avc1",
  "hvc1",
  "hev1",
]);

export function configureMediaElementCodecProfile(profile) {
  const state = codecState();
  state.audio = new Set(profile?.audioCodecs ?? []);
  state.video = new Set(profile?.videoCodecs ?? []);
}

export function mediaElementCanPlayTypeResult(input) {
  const value = `${input}`.trim().toLowerCase();
  const semicolon = value.indexOf(";");
  const mimeType = (semicolon < 0 ? value : value.slice(0, semicolon)).trim();
  const parameters = semicolon < 0 ? "" : value.slice(semicolon + 1);
  const codecs = readCodecs(parameters);

  if (mimeType === "audio/mpeg") {
    return codecState().audio.has("mp3") ? "probably" : "";
  }
  if (mimeType === "audio/ogg") {
    return supportsAnyAudio("opus", "vorbis") ? codecConfidence(codecs) : "";
  }
  if (mimeType === "audio/wav") {
    return codecState().audio.has("pcm") ? "maybe" : "";
  }
  if (mimeType === "audio/webm") {
    return supportsAnyAudio("opus", "vorbis") ? codecConfidence(codecs) : "";
  }
  if (mimeType === "video/mp4") {
    if (!supportsAnyVideo("av01", "avc1", "hvc1", "hev1")) return "";
    return codecConfidence(codecs, "maybe");
  }
  if (mimeType === "video/webm") {
    if (!supportsAnyVideo("vp8", "vp09", "av01")) return "";
    return codecConfidence(codecs);
  }
  return "";
}

function readCodecs(parameters) {
  const match = /(?:^|;)\s*codecs\s*=\s*(?:"([^"]*)"|'([^']*)'|([^;]*))/u
    .exec(`;${parameters}`);
  if (match === null) return [];
  const source = match[1] ?? match[2] ?? match[3] ?? "";
  return source
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);
}

function codecConfidence(codecs, incompleteConfidence = "probably") {
  if (codecs.length === 0) return "maybe";
  for (const codec of codecs) {
    const family = codec.split(".", 1)[0];
    if (
      !codecState().audio.has(family)
      && !codecState().video.has(family)
    ) {
      return "";
    }
  }
  if (codecs.some(codec => !codec.includes("."))) {
    return incompleteConfidence;
  }
  return "probably";
}

function supportsAnyAudio(...names) {
  return names.some(name => codecState().audio.has(name));
}

function supportsAnyVideo(...names) {
  return names.some(name => codecState().video.has(name));
}
