import { elementNullableStringProperty } from "./element-extended-property.js";
const d = elementNullableStringProperty("role", "role");
export const role = d.get; export const setRole = d.set;
