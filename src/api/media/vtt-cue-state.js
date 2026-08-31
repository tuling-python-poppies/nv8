const vttCueState = new WeakMap();

export function initializeVTTCue(cue, text) {
  vttCueState.set(cue, {
    vertical: "",
    snapToLines: true,
    line: "auto",
    position: 50,
    size: 100,
    align: "center",
    text,
  });
}

export function requireVTTCue(cue) {
  const state = vttCueState.get(cue);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
