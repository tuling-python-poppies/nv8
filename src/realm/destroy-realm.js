export function destroyRealm(record) {
  record.destroyed = true;
  record.context = null;
  record.moduleLoader = null;
  record.bootstrap = null;
}
