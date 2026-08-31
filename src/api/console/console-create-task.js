import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { run } from "./console-task-run.js";

export const createTask = {
  createTask() {
    const value = {};
    Object.defineProperty(value, "run", {
      value: run,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    traceCall(
      "window.console.createTask",
      "console",
      Array.from(arguments),
      value,
    );
    return value;
  },
}.createTask;
registerNativeFunction(createTask, "createTask");
