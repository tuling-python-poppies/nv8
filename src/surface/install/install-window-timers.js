import {
  installCancelAnimationFrame,
} from "../api/window/cancel-animation-frame.js";
import { installClearInterval } from "../api/window/clear-interval.js";
import { installClearTimeout } from "../api/window/clear-timeout.js";
import { installQueueMicrotask } from "../api/window/queue-microtask.js";
import {
  installRequestAnimationFrame,
} from "../api/window/request-animation-frame.js";
import { installSetInterval } from "../api/window/set-interval.js";
import { installSetTimeout } from "../api/window/set-timeout.js";

export function installWindowTimers() {
  installCancelAnimationFrame();
  installClearInterval();
  installClearTimeout();
  installQueueMicrotask();
  installRequestAnimationFrame();
  installSetInterval();
  installSetTimeout();
}
