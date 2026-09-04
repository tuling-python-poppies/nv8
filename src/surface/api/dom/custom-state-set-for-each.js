import { customStateSetMethod } from "./custom-state-set-method.js";
export const forEach = customStateSetMethod("forEach", 1, (set, args, self) => {
  if (typeof args[0] !== "function") throw new TypeError("forEach requires a function");
  for (const value of set) args[0].call(args[1], value, value, self);
});
