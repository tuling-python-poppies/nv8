import { requireElement } from "../dom/element-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const cropTargets = new WeakMap();
const restrictionTargets = new WeakMap();
const targetSources = new WeakMap();

export function CropTarget() {
  throw new TypeError(
    "Failed to construct 'CropTarget': Illegal constructor",
  );
}

export function RestrictionTarget() {
  throw new TypeError(
    "Failed to construct 'RestrictionTarget': Illegal constructor",
  );
}

registerNativeFunction(CropTarget, "CropTarget");
registerNativeFunction(RestrictionTarget, "RestrictionTarget");
export const captureTargetConstructors = Object.freeze([
  CropTarget,
  RestrictionTarget,
]);

export function captureTargetFromElement(Constructor, args) {
  const name = Constructor.name;
  if (args.length === 0) {
    throw new TypeError(
      `Failed to execute 'fromElement' on '${name}': `
        + "1 argument required, but only 0 present.",
    );
  }
  const source = args[0];
  if (Constructor === CropTarget) {
    if (!isElement(source)) throwElementType(name);
  } else if (!isObject(source)) {
    throwElementType(name);
  }
  const targets = Constructor === CropTarget
    ? cropTargets
    : restrictionTargets;
  let target = targets.get(source);
  if (target === undefined) {
    target = Object.create(Constructor.prototype);
    targets.set(source, target);
    targetSources.set(target, source);
  }
  return Promise.resolve(target);
}

function isElement(value) {
  try {
    requireElement(value);
    return true;
  } catch {
    return false;
  }
}

function isObject(value) {
  return (typeof value === "object" && value !== null)
    || typeof value === "function";
}

function throwElementType(name) {
  throw new TypeError(
    `Failed to execute 'fromElement' on '${name}': `
      + "parameter 1 is not of type 'Element'.",
  );
}
