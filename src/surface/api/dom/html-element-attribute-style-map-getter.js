import { htmlReadonlyDescriptor } from "./html-element-property.js";
import { htmlAttributeStyleMap } from "./html-element-state.js";
export const attributeStyleMap = htmlReadonlyDescriptor("attributeStyleMap", htmlAttributeStyleMap).get;
