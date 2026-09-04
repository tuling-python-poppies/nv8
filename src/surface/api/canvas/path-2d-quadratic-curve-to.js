import { pathCommand } from "./path-2d-command.js";
export const quadraticCurveTo = pathCommand(
  "quadraticCurveTo",
  4,
  values => values.slice(0, 4).map(Number),
);
