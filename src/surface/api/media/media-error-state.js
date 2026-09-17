
const mediaErrorState = new WeakMap();
export function requireMediaError(error) {
  const state = mediaErrorState.get(error);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
