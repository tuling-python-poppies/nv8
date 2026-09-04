import { elementInternalsMethod } from "./element-internals-method.js";
export const setFormValue = elementInternalsMethod("setFormValue", 1, (record, args) => {
  record.formValue = args[0] ?? null;
  record.formState = args.length > 1 ? args[1] : record.formValue;
});
