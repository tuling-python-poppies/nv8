

const videoState = new WeakMap();

export function initializeVideoElement(video) {
  videoState.set(video, {
    width: 0,
    height: 0,
    videoWidth: 0,
    videoHeight: 0,
    poster: "",
    webkitDecodedFrameCount: 0,
    webkitDroppedFrameCount: 0,
    playsInline: false,
    onenterpictureinpicture: null,
    onleavepictureinpicture: null,
    disablePictureInPicture: false,
    callbacks: new Map(),
    nextCallbackId: 1,
    msVideoProcessing: "default",
  });
}

export function requireVideoElement(video) {
  const state = videoState.get(video);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}
