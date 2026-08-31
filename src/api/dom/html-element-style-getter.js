import { htmlReadonlyDescriptor } from "./html-element-property.js";
import { htmlStyleRecord } from "./html-element-state.js";
export const style = htmlReadonlyDescriptor("style", htmlStyleRecord).get;
