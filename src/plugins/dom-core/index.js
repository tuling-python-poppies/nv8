import { installNode } from "../../install/install-node.js";
import { installElement } from "../../install/install-element.js";
import { installDocument } from "../../install/install-document.js";
import { installDocumentFragment } from "../../install/install-document-fragment.js";
import { installAttr } from "../../install/install-attr.js";
import { installCharacterData } from "../../install/install-character-data.js";
import { installText } from "../../install/install-text.js";
import { installComment } from "../../install/install-comment.js";
import { installShadowRoot } from "../../install/install-shadow-root.js";

const DOM_CORE_INSTALLER_URL = new URL(
  "../../install/install-dom-core.js",
  import.meta.url,
);

/**
 * @nv8/plugin-dom-core
 * 
 * DOM 核心节点类型
 * 
 * 提供能力：
 * - dom.node: Node 基类
 * - dom.element: Element 和子类
 * - dom.document: Document
 * - dom.fragment: DocumentFragment
 * - dom.shadow: ShadowRoot
 */
export const domCorePlugin = {
  id: "@nv8/plugin-dom-core",
  version: "1.0.0",
  capabilities: ["dom.node", "dom.element", "dom.document", "dom.fragment", "dom.shadow"],
  dependencies: ["@nv8/plugin-events", "@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装核心节点类型
    installNode();
    installCharacterData();
    installText();
    installComment();
    installAttr();
    installElement();
    installDocumentFragment();
    installShadowRoot();
    installDocument();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Node");
    registry.reserveGlobalSurface(this.id, "Element");
    registry.reserveGlobalSurface(this.id, "Document");
    registry.reserveGlobalSurface(this.id, "DocumentFragment");
    registry.reserveGlobalSurface(this.id, "ShadowRoot");
    registry.reserveGlobalSurface(this.id, "Attr");
    registry.reserveGlobalSurface(this.id, "CharacterData");
    registry.reserveGlobalSurface(this.id, "Text");
    registry.reserveGlobalSurface(this.id, "Comment");
    registry.reserveGlobalSurface(this.id, "document");
  },
  
  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(DOM_CORE_INSTALLER_URL);
    if (!module?.namespace?.installDOMCore) {
      throw new Error('Realm module loader cannot install DOM Core');
    }
    module.namespace.installDOMCore();
    context.exports.domCore = true;
  },
  
  reset(sandbox, registry) {
    // DOM 核心节点不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
