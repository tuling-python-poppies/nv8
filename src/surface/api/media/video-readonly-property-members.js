// media 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { videoReadonlyProperty } from "./html-video-element-property.js";

export const videoHeight = videoReadonlyProperty("videoHeight");
export const videoWidth = videoReadonlyProperty("videoWidth");
