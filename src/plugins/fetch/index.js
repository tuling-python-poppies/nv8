import { installFetch } from "../../install/install-fetch.js";

const FETCH_INSTALLER_URL = new URL(
  "../../install/install-fetch.js",
  import.meta.url,
);

/**
 * @nv8/plugin-fetch
 * 
 * Fetch API
 * 
 * 提供能力：
 * - fetch.base: fetch, Request, Response, Headers
 */
export const fetchPlugin = {
  id: "@nv8/plugin-fetch",
  version: "1.0.0",
  capabilities: ["fetch.base"],
  dependencies: ["@nv8/plugin-webidl", "@nv8/plugin-streams", "@nv8/plugin-abort"],
  supports: { realms: ['root', 'iframe', 'worker'] },
  
  install(sandbox, registry, config) {
    // 安装 Fetch API
    installFetch();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "fetch");
    registry.reserveGlobalSurface(this.id, "Headers");
    registry.reserveGlobalSurface(this.id, "Request");
    registry.reserveGlobalSurface(this.id, "Response");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(FETCH_INSTALLER_URL);
    if (!module?.namespace?.installFetch) {
      throw new Error('Realm module loader cannot install Fetch');
    }
    module.namespace.installFetch();
    context.exports.fetch = true;
  },
  
  async reset(context) {
    // Replay state is owned by the Realm module graph.
  },
  
  async dispose(context) {
    // Replay state is released with the Realm.
  },
};
