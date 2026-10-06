import { videoProperty } from "./html-video-element-property.js";
const descriptor = videoProperty("disablePictureInPicture", Boolean);
export const disablePictureInPicture = descriptor.get;
export const setDisablePictureInPicture = descriptor.set;
