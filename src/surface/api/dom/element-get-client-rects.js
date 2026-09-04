import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import { createDOMRectList } from "../geometry/dom-rect-list-state.js";
import { elementExtendedMethod } from "./element-extended-method.js";
import { elementLayoutRect } from "./element-layout.js";
export const getClientRects = elementExtendedMethod(
  "getClientRects", 0, element => {
    const rect = elementLayoutRect(element);
    return createDOMRectList([
      createDOMRect(rect.x, rect.y, rect.width, rect.height),
    ]);
  },
);
