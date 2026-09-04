import { customStateSetMethod } from "./custom-state-set-method.js";
export const clear = customStateSetMethod("clear", 0, set => set.clear());
