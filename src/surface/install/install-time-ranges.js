import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  TimeRanges,
  installTimeRangesConstructor,
} from "../api/media/time-ranges-constructor.js";
import { end } from "../api/media/time-ranges-end.js";
import { length } from "../api/media/time-ranges-length-getter.js";
import { start } from "../api/media/time-ranges-start.js";
export function installTimeRanges() {
  installTimeRangesConstructor();
  definePrototypeGetter(TimeRanges.prototype, "length", length);
  definePrototypeMethod(TimeRanges.prototype, "end", end);
  definePrototypeMethod(TimeRanges.prototype, "start", start);
  defineConstructorBacklink(TimeRanges.prototype, TimeRanges);
  defineToStringTag(TimeRanges.prototype, "TimeRanges");
}
