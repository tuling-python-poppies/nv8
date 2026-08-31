import { elementInternalsReadonlyDescriptor } from "./element-internals-property.js";
import { internalsForm } from "./element-internals-state.js";
export const form = elementInternalsReadonlyDescriptor("form", internalsForm).get;
