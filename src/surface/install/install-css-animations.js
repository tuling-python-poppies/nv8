import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSAnimation,
  CSSTransition,
  animationName,
  installCSSAnimationConstructors,
  transitionProperty,
} from "../api/css/css-animation-constructors.js";

export function installCSSAnimations() {
  installCSSAnimationConstructors();
  definePrototypeGetter(CSSTransition.prototype, "transitionProperty", transitionProperty);
  defineConstructorBacklink(CSSTransition.prototype, CSSTransition);
  defineToStringTag(CSSTransition.prototype, "CSSTransition");
  definePrototypeGetter(CSSAnimation.prototype, "animationName", animationName);
  defineConstructorBacklink(CSSAnimation.prototype, CSSAnimation);
  defineToStringTag(CSSAnimation.prototype, "CSSAnimation");
}
