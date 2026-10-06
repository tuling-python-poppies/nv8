// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { remotePlaybackHandlerProperty } from "./remote-playback-handler-property.js";

const REMOTE_PLAYBACK_HANDLER_PROPERTY_TABLE_ROWS = [
  ["onconnect", "onconnect"],
  ["onconnecting", "onconnecting"],
  ["ondisconnect", "ondisconnect"],
];

export const remotePlaybackHandlerPropertyTable = REMOTE_PLAYBACK_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, remotePlaybackHandlerProperty(...args)],
);

