import { textTrackListHandlerProperty } from "./text-track-list-handler-property.js";
const descriptor = textTrackListHandlerProperty("onremovetrack");
export const onremovetrack = descriptor.get;
export const setOnremovetrack = descriptor.set;
