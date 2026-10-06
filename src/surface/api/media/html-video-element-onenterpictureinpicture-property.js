import { videoHandlerProperty } from "./html-video-element-property.js";
const descriptor = videoHandlerProperty("onenterpictureinpicture");
export const onenterpictureinpicture = descriptor.get;
export const setOnenterpictureinpicture = descriptor.set;
