import { elementStringProperty } from "./element-extended-property.js";
const descriptor = elementStringProperty("slot");
export const slot = descriptor.get;
export const setSlot = descriptor.set;
