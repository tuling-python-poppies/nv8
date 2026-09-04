import { documentMethod } from "./document-method.js";
import { execCommandOperation } from "./document-extended-method-operations.js";
export const execCommand = documentMethod("execCommand", 1, execCommandOperation);
