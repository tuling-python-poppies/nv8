import { pathCommand } from "./path-2d-command.js";
export const rect = pathCommand(
  "rect",
  4,
  values => values.slice(0, 4).map(Number),
);
