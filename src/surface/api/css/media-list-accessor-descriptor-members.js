// css 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaListAccessorDescriptor } from "./media-list-property.js";
import { setMediaText } from "./media-list-state.js";

const MEDIA_LIST_ACCESSOR_DESCRIPTOR_TABLE_ROWS = [
  ["mediaText", "mediaText", record => record.values.join(", "), setMediaText],
];

export const mediaListAccessorDescriptorTable = MEDIA_LIST_ACCESSOR_DESCRIPTOR_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaListAccessorDescriptor(...args)],
);
