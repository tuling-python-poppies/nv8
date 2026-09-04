import { textTrackListHandlerProperty } from "./text-track-list-handler-property.js";
const descriptor = textTrackListHandlerProperty("onchange");
export const onchange = descriptor.get;
export const setOnchange = descriptor.set;
