import { requireAnimation } from "../animation/animation-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function AnimationTrigger() {
  throw new TypeError("Illegal constructor");
}

export function TimelineTrigger() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'TimelineTrigger': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  const input = arguments[0];
  if (input !== undefined && !Array.isArray(input)) {
    throw new TypeError(
      "Failed to construct 'TimelineTrigger': "
        + "The object must have a callable @@iterator property.",
    );
  }
  const ranges = (input ?? []).map(init => {
    if (init === null || typeof init !== "object") {
      throw new TypeError(
        "Failed to construct 'TimelineTrigger': range entry must be an object.",
      );
    }
    return createRange(init);
  });
  const list = createRangeList(ranges);
  state.set(this, {
    kind: "trigger",
    animations: [],
    ranges: list,
  });
}

export function TimelineTriggerRange() {
  throw new TypeError("Illegal constructor");
}

export function TimelineTriggerRangeList() {
  throw new TypeError("Illegal constructor");
}

export const timelineTriggerConstructors = Object.freeze([
  AnimationTrigger,
  TimelineTrigger,
  TimelineTriggerRange,
  TimelineTriggerRangeList,
]);
for (const Constructor of timelineTriggerConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function timelineTriggerProperty(value, name) {
  return requireRecord(value)[name];
}

export function timelineTriggerOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "trigger") {
    if (name === "addAnimation") {
      requireArguments(args, 1, name, "AnimationTrigger");
      requireAnimationValue(args[0], name);
      if (!record.animations.includes(args[0])) {
        record.animations.push(args[0]);
      }
      return undefined;
    }
    if (name === "getAnimations") return record.animations.slice();
    if (name === "removeAnimation") {
      requireArguments(args, 1, name, "AnimationTrigger");
      requireAnimationValue(args[0], name);
      const index = record.animations.indexOf(args[0]);
      if (index !== -1) record.animations.splice(index, 1);
      return undefined;
    }
  }
  if (record.kind === "rangeList") {
    if (name === "entries") return record.ranges.entries();
    if (name === "keys") return record.ranges.keys();
    if (name === "values") return record.ranges.values();
    if (name === "forEach") {
      if (typeof args[0] !== "function") {
        throw new TypeError("callback must be a function");
      }
      for (let index = 0; index < record.ranges.length; index += 1) {
        Reflect.apply(args[0], args[1], [
          record.ranges[index],
          index,
          value,
        ]);
      }
      return undefined;
    }
    if (name === "item") {
      const number = Number(args[0]);
      const index = Number.isFinite(number) ? Math.trunc(number) : -1;
      return index < 0 ? null : record.ranges[index] ?? null;
    }
  }
  throw new TypeError(`Unsupported Timeline Trigger operation: ${name}`);
}

export function timelineTriggerIterator(value) {
  const record = requireRecord(value);
  if (record.kind !== "rangeList") throw new TypeError("Illegal invocation");
  return record.ranges.values();
}

function createRange(init) {
  return create(TimelineTriggerRange, {
    kind: "range",
    timeline: init.timeline === undefined
      ? globalThis.document?.timeline ?? null
      : init.timeline,
    activationRangeStart: init.activationRangeStart ?? "normal",
    activationRangeEnd: init.activationRangeEnd ?? "normal",
    activeRangeStart: init.activeRangeStart ?? "auto",
    activeRangeEnd: init.activeRangeEnd ?? "auto",
  });
}

function createRangeList(ranges) {
  const list = create(TimelineTriggerRangeList, {
    kind: "rangeList",
    ranges,
    length: ranges.length,
  });
  for (let index = 0; index < ranges.length; index += 1) {
    Object.defineProperty(list, `${index}`, {
      value: ranges[index],
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }
  return list;
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireArguments(args, count, method, interfaceName) {
  if (args.length >= count) return;
  throw new TypeError(
    `Failed to execute '${method}' on '${interfaceName}': `
      + `${count} argument required, but only ${args.length} present.`,
  );
}

function requireAnimationValue(value, method) {
  try {
    requireAnimation(value);
  } catch {
    throw new TypeError(
      `Failed to execute '${method}' on 'AnimationTrigger': `
        + "parameter 1 is not of type 'Animation'.",
    );
  }
}
