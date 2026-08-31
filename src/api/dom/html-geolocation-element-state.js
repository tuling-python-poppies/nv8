const geolocationElementState = new WeakMap();

export function initializeGeolocationElement(element) {
  geolocationElementState.set(element, {
    onlocation: null,
    accuracymode: "",
    autolocate: false,
    watch: false,
    onpromptaction: null,
    onpromptdismiss: null,
    onvalidationstatuschange: null,
  });
}

export function requireGeolocationElement(element) {
  const state = geolocationElementState.get(element);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
