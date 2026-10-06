// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { textTrackListHandlerProperty } from "./text-track-list-handler-property.js";

const TEXT_TRACK_LIST_HANDLER_PROPERTY_TABLE_ROWS = [
  ["onaddtrack", "onaddtrack"],
  ["onchange", "onchange"],
  ["onremovetrack", "onremovetrack"],
];

export const textTrackListHandlerPropertyTable = TEXT_TRACK_LIST_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, textTrackListHandlerProperty(...args)],
);

