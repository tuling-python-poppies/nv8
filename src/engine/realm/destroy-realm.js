export function destroyRealm(record) {
  if (record.destroyed === true) return;
  record.destroyed = true;
  // 销毁尽力而为：任一步抛错都不能阻断其余清理，否则后续的
  // importer / moduleCache / moduleLoader 会连同 pending 定时器与监听器一起泄漏。
  try { record.disposePageScripts?.(); } catch { /* 继续清理剩余资源 */ }
  try { record.__nv8ModuleImporter?.dispose?.(); } catch { /* 同上 */ }
  record.__nv8ModuleImporter = null;
  try { record.__nv8ModuleCache?.clear?.(); } catch { /* 同上 */ }
  record.__nv8ModuleCache = null;
  try { record.moduleLoader?.dispose?.(); } catch { /* 同上 */ }
  record.context = null;
  record.moduleLoader = null;
  record.bootstrap = null;
}
