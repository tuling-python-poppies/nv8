const dialogState = new WeakMap();

export function initializeDialog(dialog) {
  dialogState.set(dialog, {
    open: false,
    returnValue: "",
    closedBy: "none",
    modal: false,
  });
}

export function requireDialog(dialog) {
  const state = dialogState.get(dialog);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}
