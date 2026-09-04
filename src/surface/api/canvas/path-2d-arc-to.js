import { DOMException } from "../event/dom-exception-constructor.js";
import { pathCommand } from "./path-2d-command.js";
export const arcTo = pathCommand("arcTo", 5, values => {
  const radius = Number(values[4]);
  if (radius < 0) throw new DOMException("The radius provided is negative", "IndexSizeError");
  return [
    Number(values[0]), Number(values[1]), Number(values[2]),
    Number(values[3]), radius,
  ];
});
