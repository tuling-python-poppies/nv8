import { styleSheetReadonlyDescriptor } from "./style-sheet-property.js";
export const parentStyleSheet = styleSheetReadonlyDescriptor(
  "parentStyleSheet",
  record => record.parentStyleSheet,
).get;
