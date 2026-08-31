import { installWindow } from "../../install/install-window.js";

const WINDOW_INSTALLER_URL = new URL(
  "../../install/install-window.js",
  import.meta.url,
);

/**
 * @nv8/plugin-window
 * 
 * Window 对象
 * 
 * 提供能力：
 * - window.base: Window 对象和 self, window, globalThis 别名
 */
export const windowPlugin = {
  id: "@nv8/plugin-window",
  version: "1.0.0",
  capabilities: ["window.base"],
  dependencies: ["@nv8/plugin-events", "@nv8/plugin-webidl", "@nv8/plugin-messaging"],
  supports: { realms: ['root', 'iframe'] },
  
  install(sandbox, registry, config) {
    // 安装 Window
    installWindow();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Window");
    registry.reserveGlobalSurface(this.id, "window");
    registry.reserveGlobalSurface(this.id, "self");
    registry.reserveGlobalSurface(this.id, "globalThis");
  },
  
  async activate(context) {
    const installer = await context.moduleLoader?.importUrlAsync(WINDOW_INSTALLER_URL);
    if (!installer?.namespace?.installWindow) {
      throw new Error('Realm module loader cannot install Window');
    }
    installer.namespace.installWindow();
    context.exports.window = true;
  },

  reset(sandbox, registry) {
    // Window 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
