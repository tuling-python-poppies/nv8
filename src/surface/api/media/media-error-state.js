import { MediaError } from "./media-error-constructor.js";
const mediaErrorState = new WeakMap();
export function createMediaError(code, message = "") {
  const error = Object.create(MediaError.prototype);
  mediaErrorState.set(error, { code: Number(code) >>> 0, message: `${message}` });
  return error;
}
export function requireMediaError(error) {
  const state = mediaErrorState.get(error);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
