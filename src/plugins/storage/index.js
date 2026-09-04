import { installStorage } from "../../surface/install/install-storage.js";

const STORAGE_INSTALLER_URL = new URL(
  "../../surface/install/install-storage.js",
  import.meta.url,
);

/**
 * @nv8/plugin-storage
 * 
 * Web Storage API
 * 
 * 提供能力：
 * - storage.local: localStorage
 * - storage.session: sessionStorage
 */
export const storagePlugin = {
  id: "@nv8/plugin-storage",
  version: "1.0.0",
  capabilities: ["storage.local", "storage.session"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装 Storage API
    installStorage();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Storage");
    registry.reserveGlobalSurface(this.id, "localStorage");
    registry.reserveGlobalSurface(this.id, "sessionStorage");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(STORAGE_INSTALLER_URL);
    if (!module?.namespace?.installStorage) {
      throw new Error('Realm module loader cannot install Storage');
    }
    module.namespace.installStorage();
    context.exports.storage = true;
  },
  
  async reset(context) {
    context.global.localStorage?.clear?.();
    context.global.sessionStorage?.clear?.();
  },
  
  async dispose(context) {
    context.global.localStorage?.clear?.();
    context.global.sessionStorage?.clear?.();
  },
};
