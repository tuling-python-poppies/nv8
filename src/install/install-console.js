import { assert } from "../api/console/console-assert.js";
import { clear } from "../api/console/console-clear.js";
import { context } from "../api/console/console-context.js";
import { countReset } from "../api/console/console-count-reset.js";
import { count } from "../api/console/console-count.js";
import { createTask } from "../api/console/console-create-task.js";
import { debug } from "../api/console/console-debug.js";
import { dir } from "../api/console/console-dir.js";
import { dirxml } from "../api/console/console-dirxml.js";
import { error } from "../api/console/console-error.js";
import { groupCollapsed } from "../api/console/console-group-collapsed.js";
import { groupEnd } from "../api/console/console-group-end.js";
import { group } from "../api/console/console-group.js";
import { info } from "../api/console/console-info.js";
import { log } from "../api/console/console-log.js";
import { memory as memoryGetter } from "../api/console/console-memory-getter.js";
import { memory as memorySetter } from "../api/console/console-memory-setter.js";
import { createMemoryInfo } from "../api/console/console-memory.js";
import { profileEnd } from "../api/console/console-profile-end.js";
import { profile } from "../api/console/console-profile.js";
import {
  currentConsole,
  setMemoryInfo,
} from "../api/console/console-state.js";
import { table } from "../api/console/console-table.js";
import { timeEnd } from "../api/console/console-time-end.js";
import { timeLog } from "../api/console/console-time-log.js";
import { timeStamp } from "../api/console/console-time-stamp.js";
import { time } from "../api/console/console-time.js";
import { trace } from "../api/console/console-trace.js";
import { warn } from "../api/console/console-warn.js";
import { registerNativeFunction } from "../webidl/native-function.js";

export function installConsole() {
  const value = currentConsole();
  Object.defineProperty(memoryGetter, "name", {
    value: "",
    configurable: true,
  });
  Object.defineProperty(memorySetter, "name", {
    value: "",
    configurable: true,
  });
  Object.defineProperty(memorySetter, "length", {
    value: 0,
    configurable: true,
  });
  registerNativeFunction(memoryGetter, "");
  registerNativeFunction(memorySetter, "");
  defineMethod(value, "debug", debug);
  defineMethod(value, "error", error);
  defineMethod(value, "info", info);
  defineMethod(value, "log", log);
  defineMethod(value, "warn", warn);
  defineMethod(value, "dir", dir);
  defineMethod(value, "dirxml", dirxml);
  defineMethod(value, "table", table);
  defineMethod(value, "trace", trace);
  defineMethod(value, "group", group);
  defineMethod(value, "groupCollapsed", groupCollapsed);
  defineMethod(value, "groupEnd", groupEnd);
  defineMethod(value, "clear", clear);
  defineMethod(value, "count", count);
  defineMethod(value, "countReset", countReset);
  defineMethod(value, "assert", assert);
  defineMethod(value, "profile", profile);
  defineMethod(value, "profileEnd", profileEnd);
  defineMethod(value, "time", time);
  defineMethod(value, "timeLog", timeLog);
  defineMethod(value, "timeEnd", timeEnd);
  defineMethod(value, "timeStamp", timeStamp);
  defineMethod(value, "context", context);
  defineMethod(value, "createTask", createTask);
  setMemoryInfo(createMemoryInfo());
  Object.defineProperty(value, "memory", {
    get: memoryGetter,
    set: memorySetter,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "console", {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function defineMethod(object, name, callback) {
  Object.defineProperty(object, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
