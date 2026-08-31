import { pathCommand } from "./path-2d-command.js";
export const lineTo = pathCommand(
  "lineTo",
  2,
  values => [Number(values[0]), Number(values[1])],
);
