import { styleSheetReadonlyDescriptor } from "./style-sheet-property.js";
export const type = styleSheetReadonlyDescriptor("type", record => record.type).get;
