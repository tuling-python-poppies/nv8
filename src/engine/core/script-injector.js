/**
 * Script Injector
 * 
 * 负责以正确的时序注入脚本，解决 Bug 2（脚本时序问题）
 * 
 * 核心原则：
 * 1. 脚本不能同步 eval，必须通过任务队列异步注入
 * 2. 保持真实浏览器的异步加载时序
 * 3. 确保回调发生在下一轮任务中，而不是同步调用
 */

/**
 * 脚本加载策略
 */
export const SCRIPT_LOAD_STRATEGY = {
  SYNC: 'sync',           // 同步加载（不推荐，仅用于测试）
  ASYNC: 'async',         // 异步加载（默认，通过 setTimeout）
  DEFERRED: 'deferred',   // 延迟加载（在 DOMContentLoaded 前）
  MODULE: 'module',       // ES Module 加载
};

/**
 * 脚本注入器
 */
export class ScriptInjector {
  constructor(realm, options = {}) {
    this.realm = realm;
    this.strategy = options.strategy || SCRIPT_LOAD_STRATEGY.ASYNC;
    this.lifecycle = options.lifecycle || null;
    // 脚本加载/执行失败原来直接 `console.error`，那会绕过宿主的 logger 打到
    // stdout：调用方关不掉、诊断层收不到，而 `logger` 才是 Core 约定的出口。
    // 缺省 no-op 是因为这些错误已经通过 `triggerErrorCallbacks` 与
    // `script.error` 往上抛了一份，日志只是补充。
    this.logger = options.logger ?? null;
    this.pendingScripts = [];
    this.loadedScripts = new Set();
    this.scriptCallbacks = new Map(); // URL -> [callbacks]
    this.disposed = false;
  }

  /** @param {string} message @param {unknown} error */
  reportError(message, error) {
    this.logger?.error?.(message, error);
  }
  
  /**
   * 从 DOM script 元素注册脚本。
   * 支持 appendChild 和 insertBefore 产生的节点，调用方负责提供 fixture resolver。
   */
  async registerScriptElement(element, sourceResolver, options = {}) {
    const sourceUrl = element?.getAttribute?.('src') || element?.src || null;
    const url = sourceUrl || options.url || `inline-script-${this.pendingScripts.length}`;
    const source = sourceUrl
      ? await sourceResolver(sourceUrl, element)
      : `${element?.textContent ?? element?.text ?? ''}`;
    const elementAsync = element?.async;
    return this.registerScript(url, source, {
      strategy: options.strategy || (element?.defer ? SCRIPT_LOAD_STRATEGY.DEFERRED : this.strategy),
      async: options.async
        ?? (elementAsync === undefined ? !element?.defer : elementAsync),
      element,
    });
  }
  
  /**
   * 扫描当前文档中的 script 节点。
   */
  async scanScriptElements(document, sourceResolver, options = {}) {
    const scripts = listValues(document?.getElementsByTagName?.('script')); 
    const registered = [];
    for (const script of scripts) {
      registered.push(await this.registerScriptElement(script, sourceResolver, options));
    }
    return registered;
  }
  
  /**
   * 观察后续插入的 script 节点，覆盖 appendChild/insertBefore 两条路径。
   */
  observeScriptElements(document, sourceResolver, options = {}) {
    const observerConstructor = options.MutationObserver
      || document?.defaultView?.MutationObserver
      || globalThis.MutationObserver;
    if (typeof observerConstructor !== 'function') {
      return { disconnect() {} };
    }
    const observer = new observerConstructor(records => {
      for (const record of records) {
        for (const node of listValues(record.addedNodes)) {
          const scripts = [];
          if (node?.localName === 'script') scripts.push(node);
          for (const child of listValues(node?.getElementsByTagName?.('script'))) {
            scripts.push(child);
          }
          for (const script of scripts) {
            void this.registerScriptElement(script, sourceResolver, options)
              .catch(error => {
                const url = script?.getAttribute?.('src') || script?.src || '<inline-script>';
                this.reportError(`Error loading script ${url}:`, error);
                this.triggerErrorCallbacks(url, error);
              });
          }
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true });
    return observer;
  }
  
  /**
   * 注册脚本（异步加载模式）
   * 
   * 这个方法模拟真实浏览器的 script 标签行为：
   * 1. 脚本源码可能已经在内存中（类似 Service Worker 拦截）
   * 2. 但执行和回调必须是异步的
   * 3. 回调在下一轮任务中调用
   */
  registerScript(url, source, options = {}) {
    const {
      strategy = this.strategy,
      defer = false,
      async = true,
      element = null,
    } = options;
    
    const script = {
      url,
      source,
      strategy,
      defer,
      async,
      loaded: false,
      executed: false,
      error: null,
      element,
    };

    // dispose 之后不再排队也不再执行：注入器与 Realm 生命周期绑定，
    // 销毁后已排程的任务不能把脚本重新注入一个已拆除的 Realm。
    if (this.disposed) {
      script.executed = true;
      return script;
    }

    this.pendingScripts.push(script);
    
    // 异步加载（模拟真实浏览器的异步行为）
    if (strategy === SCRIPT_LOAD_STRATEGY.SYNC) {
      // 同步加载（不推荐，打破时序）
      this.executeScript(script);
    } else if (strategy === SCRIPT_LOAD_STRATEGY.DEFERRED) {
      // 延迟加载，等待 DOMContentLoaded
      this.deferScript(script);
    } else if (strategy === SCRIPT_LOAD_STRATEGY.ASYNC || async || strategy === SCRIPT_LOAD_STRATEGY.MODULE) {
      // 使用 setTimeout 确保回调在下一轮任务中执行
      setTimeout(() => {
        this.executeScript(script);
      }, 0);
    }
    
    return script;
  }
  
  /**
   * 注册脚本加载回调
   * 
   * 类似于 AWSC.use("nc", callback) 的行为：
   * - 如果脚本已加载，回调应该在下一轮任务中调用
   * - 如果脚本未加载，回调等待脚本加载后调用
   */
  onScriptLoad(url, callback) {
    if (!this.scriptCallbacks.has(url)) {
      this.scriptCallbacks.set(url, []);
    }
    
    this.scriptCallbacks.get(url).push(callback);
    
    // 如果脚本已经加载，异步调用回调
    if (this.loadedScripts.has(url)) {
      setTimeout(() => {
        if (this.disposed) return;
        try {
          callback();
        } catch (error) {
          this.reportError(`Error in script callback for ${url}:`, error);
        }
      }, 0);
    }
  }
  
  /**
   * 注册脚本加载失败回调。
   */
  onScriptError(url, callback) {
    if (!this.scriptErrorCallbacks) {
      this.scriptErrorCallbacks = new Map();
    }
    if (!this.scriptErrorCallbacks.has(url)) {
      this.scriptErrorCallbacks.set(url, []);
    }
    this.scriptErrorCallbacks.get(url).push(callback);
  }
  
  /**
   * 执行脚本
   */
  executeScript(script) {
    if (this.disposed || script.executed) {
      return;
    }
    
    try {
      if (this.lifecycle !== null && script.element !== null) {
        this.realm.global.__nv8CurrentScript = script.element;
        this.lifecycle.setCurrentScriptFromGlobal?.();
      }
      // 在 Realm 中执行脚本
      this.realm.evaluate(script.source, {
        filename: script.url,
      });
      
      script.loaded = true;
      this.loadedScripts.add(script.url);
      this.triggerCallbacks(script.url);
    } catch (error) {
      script.error = error;
      this.triggerErrorCallbacks(script.url, error);
      this.reportError(`Error executing script ${script.url}:`, error);
    } finally {
      if (this.lifecycle !== null && script.element !== null) {
        this.lifecycle.clearCurrentScript?.();
      }
      // Failed loads must also leave the pending queue.
      script.executed = true;
    }
  }
  
  /**
   * 延迟加载脚本
   */
  deferScript(script) {
    // 简化实现：延迟到下一轮任务
    setTimeout(() => {
      this.executeScript(script);
    }, 10);
  }
  
  /**
   * 触发回调（异步）
   */
  triggerCallbacks(url) {
    const callbacks = this.scriptCallbacks.get(url);
    if (!callbacks || callbacks.length === 0) {
      return;
    }
    
    // 所有回调都在下一轮任务中执行
    for (const callback of callbacks) {
      setTimeout(() => {
        if (this.disposed) return;
        try {
          callback();
        } catch (error) {
          this.reportError(`Error in script callback for ${url}:`, error);
        }
      }, 0);
    }
    
    // 清空回调
    this.scriptCallbacks.delete(url);
  }
  
  triggerErrorCallbacks(url, error) {
    const callbacks = this.scriptErrorCallbacks?.get(url) || [];
    for (const callback of callbacks) {
      setTimeout(() => {
        if (this.disposed) return;
        callback(error);
      }, 0);
    }
    this.scriptErrorCallbacks?.delete(url);
  }
  
  /**
   * 检查脚本是否已加载
   */
  isScriptLoaded(url) {
    return this.loadedScripts.has(url);
  }
  
  /**
   * 获取待加载脚本数量
   */
  getPendingCount() {
    return this.pendingScripts.filter(s => !s.executed).length;
  }
  
  /**
   * 获取已经执行失败的脚本。
   */
  getErrors() {
    return this.pendingScripts
      .filter(script => script.error !== null)
      .map(script => ({
        url: script.url,
        error: script.error,
      }));
  }
  
  /**
   * 等待所有脚本加载完成
   */
  async waitForAllScripts() {
    return new Promise((resolve) => {
      const check = () => {
        if (this.disposed || this.getPendingCount() === 0) {
          resolve();
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
  }
  
  /**
   * 清理
   */
  dispose() {
    this.disposed = true;
    this.pendingScripts = [];
    this.loadedScripts.clear();
    this.scriptCallbacks.clear();
    this.scriptErrorCallbacks?.clear();
  }
}

/**
 * 创建脚本注入器
 */
function listValues(value) {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.slice();
  const output = [];
  for (let index = 0; index in Object(value); index += 1) {
    output.push(value[index]);
  }
  return output;
}

export function createScriptInjector(realm, options) {
  return new ScriptInjector(realm, options);
}
