// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaProperty } from "./html-media-element-property.js";

const MEDIA_PROPERTY_TABLE_ROWS = [
  ["autoplay", "autoplay", Boolean],
  ["controls", "controls", Boolean],
  ["currentTime", "currentTime", value => Math.max(0, Number(value))],
  ["defaultMuted", "defaultMuted", Boolean],
  ["defaultPlaybackRate", "defaultPlaybackRate", Number],
  ["disableRemotePlayback", "disableRemotePlayback", Boolean],
  ["loading", "loading", value => `${value}` === "lazy" ? "lazy" : "eager"],
  ["loop", "loop", Boolean],
  ["muted", "muted", Boolean],
  ["playbackRate", "playbackRate", Number],
  ["preservesPitch", "preservesPitch", Boolean],
];

export const mediaPropertyTable = MEDIA_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaProperty(...args)],
);

