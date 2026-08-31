import { customStateSetMethod } from "./custom-state-set-method.js";
export const deleteState = customStateSetMethod("delete", 1, (set, args) => set.delete(`${args[0]}`));
