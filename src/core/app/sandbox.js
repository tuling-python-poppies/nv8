/**
 * Sandbox - 隔离的执行环境
 * 
 * 职责：
 * 1. 创建隔离的 JavaScript 运行时（Realm）
 * 2. 注入插件提供的全局对象和 API
 * 3. 执行用户代码
 * 4. 管理沙箱生命周期
 */

import { createRealmFactory } from './realm-factory.js';

let sandboxIdCounter = 0;

export class Sandbox {
  constructor(options) {
    this.id = options.id || `sandbox-${++sandboxIdCounter}`;
    this.app = options.app;
    this.realm = options.realm || 'node';
    this.pluginIds = options.plugins || [];
    this.createdBy = options.createdBy || null;
    
    // 状态
    this.state = 'created'; // created -> initializing -> ready -> destroyed
    this.context = null;    // 执行上下文（Realm）
    this.globals = {};      // 注入的全局对象
    
    // 插件贡献的 API
    this.contributedAPIs = new Map(); // pluginId -> { globals, helpers }
  }
  
  /**
   * 初始化沙箱
   */
  async initialize() {
    if (this.state !== 'created') {
      throw new Error(`Cannot initialize sandbox in state: ${this.state}`);
    }
    
    this.state = 'initializing';
    
    try {
      // 1. 创建 Realm
      const realmFactory = createRealmFactory(this.realm);
      this.context = await realmFactory.create(this);
      
      // 2. 收集插件贡献的 API
      await this.collectPluginAPIs();
      
      // 3. 注入全局对象
      this.injectGlobals();
      
      this.state = 'ready';
      
    } catch (error) {
      this.state = 'created';
      throw error;
    }
  }
  
  /**
   * 收集插件提供的 API
   */
  async collectPluginAPIs() {
    for (const pluginId of this.pluginIds) {
      const loaded = this.app.loadedPlugins.get(pluginId);
      
      if (!loaded) {
        continue;
      }
      
      const { plugin, instance } = loaded;
      
      // 检查插件是否支持当前 Realm
      if (plugin.supports?.realms && 
          !plugin.supports.realms.includes(this.realm)) {
        continue;
      }
      
      // 调用插件的 contributeToSandbox
      if (instance && typeof instance.contributeToSandbox === 'function') {
        const contribution = await instance.contributeToSandbox(this);
        
        if (contribution) {
          this.contributedAPIs.set(pluginId, contribution);
        }
      }
    }
  }
  
  /**
   * 注入全局对象
   */
  injectGlobals() {
    // 合并所有插件贡献的全局对象
    for (const [pluginId, contribution] of this.contributedAPIs) {
      if (contribution.globals) {
        Object.assign(this.globals, contribution.globals);
      }
    }
    
    // 将全局对象注入到 Realm
    if (this.context && typeof this.context.injectGlobals === 'function') {
      this.context.injectGlobals(this.globals);
    }
  }
  
  /**
   * 执行代码
   */
  async execute(code, options = {}) {
    if (this.state !== 'ready') {
      throw new Error(`Cannot execute code in sandbox state: ${this.state}`);
    }
    
    if (!this.context || typeof this.context.execute !== 'function') {
      throw new Error('Realm context does not support execution');
    }
    
    return await this.context.execute(code, options);
  }
  
  /**
   * 执行函数
   */
  async executeFunction(fn, ...args) {
    if (this.state !== 'ready') {
      throw new Error(`Cannot execute function in sandbox state: ${this.state}`);
    }
    
    if (!this.context || typeof this.context.executeFunction !== 'function') {
      throw new Error('Realm context does not support function execution');
    }
    
    return await this.context.executeFunction(fn, ...args);
  }
  
  /**
   * 获取全局对象
   */
  getGlobal(name) {
    return this.globals[name];
  }
  
  /**
   * 设置全局对象
   */
  setGlobal(name, value) {
    this.globals[name] = value;
    
    if (this.context && typeof this.context.setGlobal === 'function') {
      this.context.setGlobal(name, value);
    }
  }
  
  /**
   * 获取插件贡献的帮助函数
   */
  getHelper(pluginId, helperName) {
    const contribution = this.contributedAPIs.get(pluginId);
    
    if (!contribution || !contribution.helpers) {
      return null;
    }
    
    return contribution.helpers[helperName];
  }
  
  /**
   * 销毁沙箱
   */
  destroy() {
    if (this.state === 'destroyed') {
      return;
    }
    
    // 清理 Realm
    if (this.context && typeof this.context.destroy === 'function') {
      this.context.destroy();
    }
    
    this.context = null;
    this.globals = {};
    this.contributedAPIs.clear();
    this.state = 'destroyed';
  }
  
  /**
   * 获取沙箱信息
   */
  getInfo() {
    return {
      id: this.id,
      realm: this.realm,
      state: this.state,
      plugins: this.pluginIds,
      createdBy: this.createdBy,
      globalCount: Object.keys(this.globals).length,
      contributionCount: this.contributedAPIs.size,
    };
  }
}

/**
 * 工厂函数
 */
export function createSandbox(options) {
  return new Sandbox(options);
}
