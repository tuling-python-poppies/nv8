import { documentMethod } from "./document-method.js";
import { hasFocusOperation } from "./document-extended-method-operations.js";
export const hasFocus = documentMethod("hasFocus", 0, hasFocusOperation);
