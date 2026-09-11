export function destroyRealm(record) {
  if (record.destroyed === true) return;
  record.destroyed = true;
  record.disposePageScripts?.();
  record.__nv8ModuleImporter?.dispose?.();
  record.__nv8ModuleImporter = null;
  record.__nv8ModuleCache?.clear?.();
  record.__nv8ModuleCache = null;
  record.moduleLoader?.dispose?.();
  record.context = null;
  record.moduleLoader = null;
  record.bootstrap = null;
}
