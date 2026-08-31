const marqueeState = new WeakMap();
export function initializeMarquee(marquee) {
  marqueeState.set(marquee, { running: true });
}
export function requireMarquee(marquee) {
  const state = marqueeState.get(marquee);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
