import { Animation, installAnimationConstructor } from "../api/animation/animation-constructor.js";
import { effect, setEffect } from "../api/animation/animation-effect-property.js";
import { timeline, setTimeline } from "../api/animation/animation-timeline-property-accessor.js";
import { startTime, setStartTime } from "../api/animation/animation-start-time-property.js";
import { currentTime, setCurrentTime } from "../api/animation/animation-current-time-property.js";
import { playbackRate, setPlaybackRate } from "../api/animation/animation-playback-rate-property.js";
import { rangeStart, setRangeStart } from "../api/animation/animation-range-start-property.js";
import { rangeEnd, setRangeEnd } from "../api/animation/animation-range-end-property.js";
import { playState } from "../api/animation/animation-play-state-getter.js";
import { replaceState } from "../api/animation/animation-replace-state-getter.js";
import { pending } from "../api/animation/animation-pending-getter.js";
import { id, setId } from "../api/animation/animation-id-property.js";
import { onfinish, setOnfinish } from "../api/animation/animation-onfinish-property.js";
import { oncancel, setOncancel } from "../api/animation/animation-oncancel-property.js";
import { onremove, setOnremove } from "../api/animation/animation-onremove-property.js";
import { finished } from "../api/animation/animation-finished-getter.js";
import { ready } from "../api/animation/animation-ready-getter.js";
import { cancel } from "../api/animation/animation-cancel.js";
import { commitStyles } from "../api/animation/animation-commit-styles.js";
import { finish } from "../api/animation/animation-finish.js";
import { pause } from "../api/animation/animation-pause.js";
import { persist } from "../api/animation/animation-persist.js";
import { play } from "../api/animation/animation-play.js";
import { reverse } from "../api/animation/animation-reverse.js";
import { updatePlaybackRate } from "../api/animation/animation-update-playback-rate.js";
import { overallProgress } from "../api/animation/animation-overall-progress-getter.js";
import { defineConstructorBacklink, definePrototypeAccessor, definePrototypeGetter, definePrototypeMethod, defineToStringTag } from "../../engine/webidl/descriptor.js";

export function installAnimation() {
  installAnimationConstructor();
  accessor("effect", effect, setEffect);
  accessor("timeline", timeline, setTimeline);
  accessor("startTime", startTime, setStartTime);
  accessor("currentTime", currentTime, setCurrentTime);
  accessor("playbackRate", playbackRate, setPlaybackRate);
  accessor("rangeStart", rangeStart, setRangeStart);
  accessor("rangeEnd", rangeEnd, setRangeEnd);
  getter("playState", playState);
  getter("replaceState", replaceState);
  getter("pending", pending);
  accessor("id", id, setId);
  accessor("onfinish", onfinish, setOnfinish);
  accessor("oncancel", oncancel, setOncancel);
  accessor("onremove", onremove, setOnremove);
  getter("finished", finished);
  getter("ready", ready);
  method("cancel", cancel);
  method("commitStyles", commitStyles);
  method("finish", finish);
  method("pause", pause);
  method("persist", persist);
  method("play", play);
  method("reverse", reverse);
  method("updatePlaybackRate", updatePlaybackRate);
  getter("overallProgress", overallProgress);
  defineConstructorBacklink(Animation.prototype, Animation);
  defineToStringTag(Animation.prototype, "Animation");
}

function accessor(name, get, set) { definePrototypeAccessor(Animation.prototype, name, get, set); }
function getter(name, get) { definePrototypeGetter(Animation.prototype, name, get); }
function method(name, callback) { definePrototypeMethod(Animation.prototype, name, callback); }
