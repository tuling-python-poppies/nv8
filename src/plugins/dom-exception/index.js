import { installDOMException } from "../../install/install-dom-exception.js";

const DOM_EXCEPTION_INSTALLER_URL = new URL(
  "../../install/install-dom-exception.js",
  import.meta.url,
);

/**
 * @nv8/plugin-dom-exception
 * 
 * DOMException
 * 
 * 提供能力：
 * - dom.exception: DOMException 错误类型
 */
export const domExceptionPlugin = {
  id: "@nv8/plugin-dom-exception",
  version: "1.0.0",
  capabilities: ["dom.exception"],
  dependencies: ["@nv8/plugin-errors"],
  supports: { realms: ['root', 'iframe', 'worker', 'worklet'] },
  
  install(sandbox, registry, config) {
    // 安装 DOMException
    installDOMException();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "DOMException");
  },
  
  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(DOM_EXCEPTION_INSTALLER_URL);
    if (!module?.namespace?.installDOMException) {
      throw new Error('Realm module loader cannot install DOMException');
    }
    module.namespace.installDOMException();
    context.exports.DOMException = context.global.DOMException;
  },
  
  reset(sandbox, registry) {
    // DOMException 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
