import { DOMException } from "../event/dom-exception-constructor.js";
import { pathCommand } from "./path-2d-command.js";
export const ellipse = pathCommand("ellipse", 7, values => {
  const radiusX = Number(values[2]);
  const radiusY = Number(values[3]);
  if (radiusX < 0 || radiusY < 0) {
    throw new DOMException("The radius provided is negative", "IndexSizeError");
  }
  return [
    Number(values[0]), Number(values[1]), radiusX, radiusY,
    Number(values[4]), Number(values[5]), Number(values[6]), Boolean(values[7]),
  ];
});
