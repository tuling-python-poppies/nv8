import { customStateSetMethod } from "./custom-state-set-method.js";
export const values = customStateSetMethod("values", 0, set => set.values());
