import { customStateSetMethod } from "./custom-state-set-method.js";
export const keys = customStateSetMethod("keys", 0, set => set.keys());
