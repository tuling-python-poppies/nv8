import {
  elementInternalsARIAPropertyPart1Table,
  elementInternalsARIAPropertyPart2Table,
} from "../api/dom/element-internals-ariaproperty-members.js";

export function installElementInternalsARIABeforeMethods(accessor) {
  for (const [name, entry] of elementInternalsARIAPropertyPart1Table) accessor(name, entry);
}

export function installElementInternalsARIAAfterMethods(accessor) {
  for (const [name, entry] of elementInternalsARIAPropertyPart2Table) accessor(name, entry);
}
