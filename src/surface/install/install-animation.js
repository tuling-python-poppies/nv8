import { Animation, installAnimationConstructor } from "../api/animation/animation-constructor.js";
import { playState } from "../api/animation/animation-play-state-getter.js";
import { replaceState } from "../api/animation/animation-replace-state-getter.js";
import { pending } from "../api/animation/animation-pending-getter.js";
import { finished } from "../api/animation/animation-finished-getter.js";
import { ready } from "../api/animation/animation-ready-getter.js";
import { overallProgress } from "../api/animation/animation-overall-progress-getter.js";
import { defineConstructorBacklink, definePrototypeAccessor, definePrototypeGetter, definePrototypeMethod, defineToStringTag } from "../../engine/webidl/descriptor.js";
import { animationPropertyTable } from "../api/animation/animation-property-members.js";
import { animationMethodTable } from "../api/animation/animation-method-members.js";

export function installAnimation() {
  installAnimationConstructor();
  for (const [name, entry] of animationPropertyTable) accessor(name, entry.get, entry.set);
  getter("playState", playState);
  getter("replaceState", replaceState);
  getter("pending", pending);
  getter("finished", finished);
  getter("ready", ready);
  for (const [name, entry] of animationMethodTable) method(name, entry);
  getter("overallProgress", overallProgress);
  defineConstructorBacklink(Animation.prototype, Animation);
  defineToStringTag(Animation.prototype, "Animation");
}

function accessor(name, get, set) { definePrototypeAccessor(Animation.prototype, name, get, set); }
function getter(name, get) { definePrototypeGetter(Animation.prototype, name, get); }
function method(name, callback) { definePrototypeMethod(Animation.prototype, name, callback); }
