import { documentMethod } from "./document-method.js";
import { queryCommandSupportedOperation } from "./document-extended-method-operations.js";
export const queryCommandSupported = documentMethod("queryCommandSupported", 1, queryCommandSupportedOperation);
