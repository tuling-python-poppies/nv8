import { mediaProperty } from "./html-media-element-property.js";
const descriptor = mediaProperty("src", value => `${value}`, (state, value) => {
  state.src = value;
  state.currentSrc = "";
  state.networkState = 0;
  state.readyState = 0;
  state.ended = false;
});
export const src = descriptor.get;
export const setSrc = descriptor.set;
