import { customStateSetMethod } from "./custom-state-set-method.js";
export const entries = customStateSetMethod("entries", 0, set => set.entries());
