import { installXMLHttpRequest } from "../../surface/install/install-xml-http-request.js";

const XHR_INSTALLER_URL = new URL(
  "../../surface/install/install-xml-http-request.js",
  import.meta.url,
);

/**
 * @nv8/plugin-xhr
 * 
 * XMLHttpRequest API
 * 
 * 提供能力：
 * - xhr.base: XMLHttpRequest 和相关事件
 */
export const xhrPlugin = {
  id: "@nv8/plugin-xhr",
  version: "1.0.0",
  capabilities: ["xhr.base"],
  dependencies: ["@nv8/plugin-events", "@nv8/plugin-webidl", "@nv8/plugin-fetch"],
  supports: { realms: ['root', 'iframe', 'worker'] },
  
  install(sandbox, registry, config) {
    // 安装 XHR API（包含 EventTarget 和 Upload）
    installXMLHttpRequest();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "XMLHttpRequest");
    registry.reserveGlobalSurface(this.id, "XMLHttpRequestEventTarget");
    registry.reserveGlobalSurface(this.id, "XMLHttpRequestUpload");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(XHR_INSTALLER_URL);
    if (!module?.namespace?.installXMLHttpRequest) {
      throw new Error('Realm module loader cannot install XMLHttpRequest');
    }
    module.namespace.installXMLHttpRequest();
    context.exports.xhr = true;
  },
  
  async reset(context) {
    // XHR state is owned by individual Realm objects.
  },
  
  async dispose(context) {
    // XHR state is released with the Realm.
  },
};
