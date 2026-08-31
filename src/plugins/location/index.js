import { installLocation } from "../../install/install-location.js";

const LOCATION_INSTALLER_URL = new URL(
  "../../install/install-location.js",
  import.meta.url,
);

/**
 * @nv8/plugin-location
 * 
 * Location 对象
 * 
 * 提供能力：
 * - location.base: Location 对象和 URL 管理
 */
export const locationPlugin = {
  id: "@nv8/plugin-location",
  version: "1.0.0",
  capabilities: ["location.base"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装 Location
    installLocation();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Location");
    registry.reserveGlobalSurface(this.id, "location");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(LOCATION_INSTALLER_URL);
    if (!module?.namespace?.installLocation) {
      throw new Error('Realm module loader cannot install Location');
    }
    module.namespace.installLocation();
    context.exports.location = true;
  },
  
  async reset(context) {
    // Navigation state is recreated with the Realm; no host-global reset is needed.
  },
  
  async dispose(context) {
    // Navigation state is owned by the Realm module graph.
  },
};
