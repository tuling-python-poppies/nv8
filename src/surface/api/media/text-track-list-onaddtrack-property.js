import { textTrackListHandlerProperty } from "./text-track-list-handler-property.js";
const descriptor = textTrackListHandlerProperty("onaddtrack");
export const onaddtrack = descriptor.get;
export const setOnaddtrack = descriptor.set;
