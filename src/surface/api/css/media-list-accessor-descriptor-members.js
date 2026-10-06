// css 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { mediaListAccessorDescriptor } from "./media-list-property.js";
import { setMediaText } from "./media-list-state.js";

export const mediaText = mediaListAccessorDescriptor(
  "mediaText",
  record => record.values.join(", "),
  setMediaText,
);
