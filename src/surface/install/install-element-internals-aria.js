import { elementInternalsARIAPropertyTable } from "../api/dom/element-internals-ariaproperty-members.js";

export function installElementInternalsARIABeforeMethods(accessor) {
  for (const [name, entry] of elementInternalsARIAPropertyTable) accessor(name, entry);
}

export function installElementInternalsARIAAfterMethods(accessor) {
  for (const [name, entry] of elementInternalsARIAPropertyTable) accessor(name, entry);
}
