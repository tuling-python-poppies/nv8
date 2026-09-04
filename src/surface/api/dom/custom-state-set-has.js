import { customStateSetMethod } from "./custom-state-set-method.js";
export const has = customStateSetMethod("has", 1, (set, args) => set.has(`${args[0]}`));
