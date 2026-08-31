import { pathCommand } from "./path-2d-command.js";
export const moveTo = pathCommand(
  "moveTo",
  2,
  values => [Number(values[0]), Number(values[1])],
);
