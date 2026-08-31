import { elementInternalsReadonlyDescriptor } from "./element-internals-property.js";
export const validity = elementInternalsReadonlyDescriptor("validity", record => record.validity).get;
