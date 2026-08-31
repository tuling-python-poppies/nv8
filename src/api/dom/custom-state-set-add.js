import { customStateSetMethod } from "./custom-state-set-method.js";
import { normalizeCustomState } from "./custom-state-set-state.js";

export const add = customStateSetMethod("add", 1, (set, args, self) => {
  set.add(normalizeCustomState(args[0]));
  return self;
});
