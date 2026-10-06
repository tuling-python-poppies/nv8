// dom 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { customStateSetMethod } from "./custom-state-set-method.js";

export const clear = customStateSetMethod("clear", 0, set => set.clear());
export const deleteState = customStateSetMethod("delete", 1, (set, args) => set.delete(`${args[0]}`));
export const entries = customStateSetMethod("entries", 0, set => set.entries());
export const has = customStateSetMethod("has", 1, (set, args) => set.has(`${args[0]}`));
export const keys = customStateSetMethod("keys", 0, set => set.keys());
export const values = customStateSetMethod("values", 0, set => set.values());
