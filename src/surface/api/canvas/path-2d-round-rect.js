import { pathCommand } from "./path-2d-command.js";
export const roundRect = pathCommand(
  "roundRect",
  4,
  values => [
    Number(values[0]),
    Number(values[1]),
    Number(values[2]),
    Number(values[3]),
    values[4] === undefined ? 0 : Number(values[4]),
  ],
);
