import { videoHandlerProperty } from "./html-video-element-property.js";
const descriptor = videoHandlerProperty("onleavepictureinpicture");
export const onleavepictureinpicture = descriptor.get;
export const setOnleavepictureinpicture = descriptor.set;
