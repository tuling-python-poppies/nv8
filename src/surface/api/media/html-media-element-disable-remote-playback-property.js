import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("disableRemotePlayback", Boolean);
export const disableRemotePlayback = descriptor.get;
export const setDisableRemotePlayback = descriptor.set;
