import { elementExtendedMethod } from "./element-extended-method.js";
import { insertAdjacentHTMLOperation } from "./element-extended-operations.js";
export const insertAdjacentHTML = elementExtendedMethod("insertAdjacentHTML", 2, insertAdjacentHTMLOperation);
