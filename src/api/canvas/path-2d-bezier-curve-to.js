import { pathCommand } from "./path-2d-command.js";
export const bezierCurveTo = pathCommand(
  "bezierCurveTo",
  6,
  values => values.slice(0, 6).map(Number),
);
