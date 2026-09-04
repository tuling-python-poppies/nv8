import { documentMethod } from "./document-method.js";
import { queryCommandEnabledOperation } from "./document-extended-method-operations.js";
export const queryCommandEnabled = documentMethod("queryCommandEnabled", 1, queryCommandEnabledOperation);
