import { elementExtendedMethod } from "./element-extended-method.js";
import { matchesAlgorithm } from "./selector-engine.js";
export const webkitMatchesSelector = elementExtendedMethod(
  "webkitMatchesSelector", 1, (element, args) => matchesAlgorithm(element, args[0]),
);
