import { styleSheetReadonlyDescriptor } from "./style-sheet-property.js";
export const ownerNode = styleSheetReadonlyDescriptor("ownerNode", record => record.ownerNode).get;
