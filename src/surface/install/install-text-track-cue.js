import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  TextTrackCue,
  installTextTrackCueConstructor,
} from "../api/media/text-track-cue-constructor.js";
import { endTime, setEndTime } from "../api/media/text-track-cue-end-time-property.js";
import { id, setId } from "../api/media/text-track-cue-id-property.js";
import { onenter, setOnenter } from "../api/media/text-track-cue-onenter-property.js";
import { onexit, setOnexit } from "../api/media/text-track-cue-onexit-property.js";
import { pauseOnExit, setPauseOnExit } from "../api/media/text-track-cue-pause-on-exit-property.js";
import { startTime, setStartTime } from "../api/media/text-track-cue-start-time-property.js";
import { track } from "../api/media/text-track-cue-track-getter.js";

export function installTextTrackCue() {
  installTextTrackCueConstructor();
  definePrototypeGetter(TextTrackCue.prototype, "track", track);
  accessor("id", id, setId);
  accessor("startTime", startTime, setStartTime);
  accessor("endTime", endTime, setEndTime);
  accessor("pauseOnExit", pauseOnExit, setPauseOnExit);
  accessor("onenter", onenter, setOnenter);
  accessor("onexit", onexit, setOnexit);
  defineConstructorBacklink(TextTrackCue.prototype, TextTrackCue);
  defineToStringTag(TextTrackCue.prototype, "TextTrackCue");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(TextTrackCue.prototype, name, getter, setter);
}
