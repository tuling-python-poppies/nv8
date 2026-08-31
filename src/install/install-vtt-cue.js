import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { align, setAlign } from "../api/media/vtt-cue-align-property.js";
import {
  VTTCue,
  installVTTCueConstructor,
} from "../api/media/vtt-cue-constructor.js";
import { getCueAsHTML } from "../api/media/vtt-cue-get-cue-as-html.js";
import { line, setLine } from "../api/media/vtt-cue-line-property.js";
import { position, setPosition } from "../api/media/vtt-cue-position-property.js";
import { size, setSize } from "../api/media/vtt-cue-size-property.js";
import { snapToLines, setSnapToLines } from "../api/media/vtt-cue-snap-to-lines-property.js";
import { text, setText } from "../api/media/vtt-cue-text-property.js";
import { vertical, setVertical } from "../api/media/vtt-cue-vertical-property.js";

export function installVTTCue() {
  installVTTCueConstructor();
  accessor("vertical", vertical, setVertical);
  accessor("snapToLines", snapToLines, setSnapToLines);
  accessor("line", line, setLine);
  accessor("position", position, setPosition);
  accessor("size", size, setSize);
  accessor("align", align, setAlign);
  accessor("text", text, setText);
  definePrototypeMethod(VTTCue.prototype, "getCueAsHTML", getCueAsHTML);
  defineConstructorBacklink(VTTCue.prototype, VTTCue);
  defineToStringTag(VTTCue.prototype, "VTTCue");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(VTTCue.prototype, name, getter, setter);
}
