import { styleSheetAccessorDescriptor } from "./style-sheet-property.js";
export const disabled = styleSheetAccessorDescriptor(
  "disabled",
  record => record.disabled,
  (record, value) => { record.disabled = Boolean(value); },
);
