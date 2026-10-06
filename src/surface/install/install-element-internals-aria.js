

export function installElementInternalsARIABeforeMethods(accessor) {
  for (const [name, entry] of elementInternalsARIAPropertyTable) accessor(name, entry);
}

export function installElementInternalsARIAAfterMethods(accessor) {
}
