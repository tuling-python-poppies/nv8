import { documentMethod } from "./document-method.js";
import { createExpressionOperation } from "./document-extended-method-operations.js";
export const createExpression = documentMethod("createExpression", 1, createExpressionOperation);
