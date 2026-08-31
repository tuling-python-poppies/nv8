import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import { elementExtendedMethod } from "./element-extended-method.js";
import { elementLayoutRect } from "./element-layout.js";
export const getBoundingClientRect = elementExtendedMethod(
  "getBoundingClientRect", 0, element => {
    const rect = elementLayoutRect(element);
    return createDOMRect(rect.x, rect.y, rect.width, rect.height);
  },
);
