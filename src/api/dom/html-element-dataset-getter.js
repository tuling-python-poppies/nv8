import { htmlReadonlyDescriptor } from "./html-element-property.js";
import { htmlDataset } from "./html-element-state.js";
export const dataset = htmlReadonlyDescriptor("dataset", htmlDataset).get;
