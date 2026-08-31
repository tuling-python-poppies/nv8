import { documentMethod } from "./document-method.js";
import { evaluateOperation } from "./document-extended-method-operations.js";
export const evaluate = documentMethod("evaluate", 2, evaluateOperation);
