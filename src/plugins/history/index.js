import { installHistory } from "../../install/install-history.js";

const HISTORY_INSTALLER_URL = new URL(
  "../../install/install-history.js",
  import.meta.url,
);

/**
 * @nv8/plugin-history
 * 
 * History 对象
 * 
 * 提供能力：
 * - history.base: History 对象和导航历史管理
 */
export const historyPlugin = {
  id: "@nv8/plugin-history",
  version: "1.0.0",
  capabilities: ["history.base"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装 History
    installHistory();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "History");
    registry.reserveGlobalSurface(this.id, "history");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(HISTORY_INSTALLER_URL);
    if (!module?.namespace?.installHistory) {
      throw new Error('Realm module loader cannot install History');
    }
    module.namespace.installHistory();
    context.exports.history = true;
  },
  
  async reset(context) {
    // Navigation state is recreated with the Realm; no host-global reset is needed.
  },
  
  async dispose(context) {
    // Navigation state is owned by the Realm module graph.
  },
};
