import { installNavigator } from "../../install/install-navigator.js";

const NAVIGATOR_INSTALLER_URL = new URL(
  "../../install/install-navigator.js",
  import.meta.url,
);

/**
 * @nv8/plugin-navigator
 * 
 * Navigator 对象
 * 
 * 提供能力：
 * - navigator.base: Navigator 对象和浏览器信息
 */
export const navigatorPlugin = {
  id: "@nv8/plugin-navigator",
  version: "1.0.0",
  capabilities: ["navigator.base"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装 Navigator
    installNavigator();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Navigator");
    registry.reserveGlobalSurface(this.id, "navigator");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(NAVIGATOR_INSTALLER_URL);
    if (!module?.namespace?.installNavigator) {
      throw new Error('Realm module loader cannot install Navigator');
    }
    module.namespace.installNavigator();
    context.exports.navigator = true;
  },
  
  async reset(context) {
    // Navigator services are owned by the Realm module graph.
  },
  
  async dispose(context) {
    // Navigator services are released with the Realm.
  },
};
