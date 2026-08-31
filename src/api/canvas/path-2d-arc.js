import { DOMException } from "../event/dom-exception-constructor.js";
import { pathCommand } from "./path-2d-command.js";
export const arc = pathCommand("arc", 5, values => {
  const radius = Number(values[2]);
  if (radius < 0) throw new DOMException("The radius provided is negative", "IndexSizeError");
  return [
    Number(values[0]), Number(values[1]), radius,
    Number(values[3]), Number(values[4]), Boolean(values[5]),
  ];
});
