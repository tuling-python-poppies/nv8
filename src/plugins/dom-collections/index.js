import { installNodeList } from "../../surface/install/install-node-list.js";
import { installHTMLCollection } from "../../surface/install/install-html-collection.js";
import { installNamedNodeMap } from "../../surface/install/install-named-node-map.js";
import { installDOMTokenList } from "../../surface/install/install-dom-token-list.js";

const DOM_COLLECTIONS_INSTALLER_URL = new URL(
  "../../surface/install/install-dom-collections.js",
  import.meta.url,
);

/**
 * @nv8/plugin-dom-collections
 * 
 * DOM 集合类型
 * 
 * 提供能力：
 * - dom.collections: NodeList, HTMLCollection, NamedNodeMap, DOMTokenList
 */
export const domCollectionsPlugin = {
  id: "@nv8/plugin-dom-collections",
  version: "1.0.0",
  capabilities: ["dom.collections"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装集合类型
    installNodeList();
    installHTMLCollection();
    installNamedNodeMap();
    installDOMTokenList();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "NodeList");
    registry.reserveGlobalSurface(this.id, "HTMLCollection");
    registry.reserveGlobalSurface(this.id, "NamedNodeMap");
    registry.reserveGlobalSurface(this.id, "DOMTokenList");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(DOM_COLLECTIONS_INSTALLER_URL);
    if (!module?.namespace?.installDOMCollections) {
      throw new Error('Realm module loader cannot install DOM collections');
    }
    module.namespace.installDOMCollections();
    context.exports.domCollections = true;
  },
  
  reset(sandbox, registry) {
    // DOM 集合不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
