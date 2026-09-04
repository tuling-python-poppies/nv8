import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Animation } from "../animation/animation-constructor.js";
import { initializeAnimation, requireAnimation } from "../animation/animation-state.js";

const state = new WeakMap();

export function CSSAnimation() { throw new TypeError("Illegal constructor"); }
export function CSSTransition() { throw new TypeError("Illegal constructor"); }
registerNativeFunction(CSSAnimation, "CSSAnimation");
registerNativeFunction(CSSTransition, "CSSTransition");

export function createCSSAnimation(name, effect = null, timeline = undefined) {
  const animation = Object.create(CSSAnimation.prototype);
  initializeAnimation(animation, effect, timeline);
  state.set(animation, { animationName: `${name}`, transitionProperty: "" });
  return animation;
}

export function createCSSTransition(property, effect = null, timeline = undefined) {
  const animation = Object.create(CSSTransition.prototype);
  initializeAnimation(animation, effect, timeline);
  state.set(animation, { animationName: "", transitionProperty: `${property}` });
  return animation;
}

export function animationName() {
  requireAnimation(this);
  const record = state.get(this);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record.animationName;
}
registerNativeGetter(animationName, "animationName");

export function transitionProperty() {
  requireAnimation(this);
  const record = state.get(this);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record.transitionProperty;
}
registerNativeGetter(transitionProperty, "transitionProperty");

export function installCSSAnimationConstructors() {
  inherit(CSSAnimation, Animation);
  inherit(CSSTransition, Animation);
  for (const constructor of [CSSAnimation, CSSTransition]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}

function inherit(constructor, parent) {
  Object.setPrototypeOf(constructor.prototype, parent.prototype);
  Object.setPrototypeOf(constructor, parent);
}
