// canvas 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { imageDataGetter } from "./image-data-getter.js";

export const colorSpace = imageDataGetter("colorSpace");
export const data = imageDataGetter("data");
export const height = imageDataGetter("height");
export const pixelFormat = imageDataGetter("pixelFormat");
export const width = imageDataGetter("width");
