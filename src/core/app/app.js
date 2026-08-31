/**
 * Nv8 App - 应用主入口
 * 
 * 职责：
 * 1. 插件加载和生命周期管理
 * 2. Sandbox 创建和管理
 * 3. 配置管理
 * 4. 全局状态协调
 */

import { resolvePluginDependencies, detectCircularDependencies } from '../plugin-sdk/capability-matcher.js';
import { createStateRegistry, createStateAccessor } from '../plugin-sdk/state-registry.js';
import { createSandbox } from './sandbox.js';

export class Nv8App {
  constructor(config = {}) {
    this.config = {
      plugins: [],
      defaultRealm: 'node',
      enableLogging: true,
      ...config,
    };
    
    // 插件管理
    this.availablePlugins = new Map(); // id -> Plugin
    this.loadedPlugins = new Map();    // id -> { plugin, instance }
    this.pluginLoadOrder = [];         // 加载顺序
    
    // 状态管理
    this.stateRegistry = createStateRegistry();
    
    // Sandbox 管理
    this.sandboxes = new Map(); // id -> Sandbox
    
    // 生命周期状态
    this.state = 'created'; // created -> loading -> ready -> running -> stopped
    
    this.log('Nv8App created');
  }
  
  /**
   * 注册插件（不立即加载）
   */
  registerPlugin(plugin) {
    if (this.availablePlugins.has(plugin.id)) {
      const existing = this.availablePlugins.get(plugin.id);
      this.log(`Plugin "${plugin.id}" already registered (v${existing.version}), skipping v${plugin.version}`);
      return;
    }
    
    this.availablePlugins.set(plugin.id, plugin);
    this.log(`Registered plugin: ${plugin.id}@${plugin.version}`);
  }
  
  /**
   * 批量注册插件
   */
  registerPlugins(plugins) {
    for (const plugin of plugins) {
      this.registerPlugin(plugin);
    }
  }
  
  /**
   * 初始化应用（解析依赖并加载插件）
   */
  async initialize() {
    if (this.state !== 'created') {
      throw new Error(`Cannot initialize app in state: ${this.state}`);
    }
    
    this.state = 'loading';
    this.log('Initializing app...');
    
    try {
      // 1. 解析依赖
      const requestedIds = this.config.plugins.map(p => 
        typeof p === 'string' ? p : `${p.id}@${p.version || '*'}`
      );
      
      const availablePlugins = Array.from(this.availablePlugins.values());
      
      const resolution = resolvePluginDependencies(requestedIds, availablePlugins);
      
      this.pluginLoadOrder = resolution.plugins;
      this.log(`Resolved ${resolution.plugins.length} plugins in dependency order`);
      
      // 2. 检查循环依赖
      const circularCheck = detectCircularDependencies(resolution.plugins);
      if (circularCheck.hasCycle) {
        throw new Error(
          `Circular dependency detected:\n${circularCheck.cycles.map(c => c.join(' -> ')).join('\n')}`
        );
      }
      
      // 3. 按顺序加载插件
      for (const plugin of this.pluginLoadOrder) {
        await this.loadPlugin(plugin);
      }
      
      this.state = 'ready';
      this.log('App initialized successfully');
      
    } catch (error) {
      this.state = 'created';
      throw error;
    }
  }
  
  /**
   * 加载单个插件
   */
  async loadPlugin(plugin) {
    if (this.loadedPlugins.has(plugin.id)) {
      return; // 已加载
    }
    
    this.log(`Loading plugin: ${plugin.id}@${plugin.version}`);
    
    try {
      // 创建插件上下文
      const context = this.createPluginContext(plugin);
      
      // 调用 install
      const installResult = await plugin.install(context);
      
      // 保存实例
      this.loadedPlugins.set(plugin.id, {
        plugin,
        instance: installResult || null,
        context,
      });
      
      this.log(`✓ Loaded: ${plugin.id}@${plugin.version}`);
      
    } catch (error) {
      throw new Error(
        `Failed to load plugin "${plugin.id}@${plugin.version}": ${error.message}`
      );
    }
  }
  
  /**
   * 创建插件安装上下文
   */
  createPluginContext(plugin) {
    const app = this;
    
    return {
      // 应用信息
      app: {
        version: '1.0.0',
        config: this.config,
      },
      
      // 状态管理
      state: createStateAccessor(
        this.stateRegistry,
        plugin.id,           // pluginInstanceId
        this.config.defaultRealm,  // realmId
        'default'            // sandboxId
      ),
      
      // 获取其他插件
      getPlugin(id) {
        const loaded = app.loadedPlugins.get(id);
        if (!loaded) {
          throw new Error(`Plugin "${id}" not found or not loaded`);
        }
        return loaded.instance;
      },
      
      // 检查插件是否可用
      hasPlugin(id) {
        return app.loadedPlugins.has(id);
      },
      
      // 日志
      log(...args) {
        app.log(`[${plugin.id}]`, ...args);
      },
      
      // 创建 Sandbox
      createSandbox(options = {}) {
        return app.createSandbox({
          ...options,
          createdBy: plugin.id,
        });
      },
    };
  }
  
  /**
   * 创建 Sandbox
   */
  createSandbox(options = {}) {
    const sandbox = createSandbox({
      app: this,
      realm: options.realm || this.config.defaultRealm,
      plugins: options.plugins || this.pluginLoadOrder.map(p => p.id),
      ...options,
    });
    
    this.sandboxes.set(sandbox.id, sandbox);
    this.log(`Created sandbox: ${sandbox.id} (realm: ${sandbox.realm})`);
    
    return sandbox;
  }
  
  /**
   * 获取 Sandbox
   */
  getSandbox(id) {
    return this.sandboxes.get(id);
  }
  
  /**
   * 销毁 Sandbox
   */
  destroySandbox(id) {
    const sandbox = this.sandboxes.get(id);
    if (sandbox) {
      sandbox.destroy();
      this.sandboxes.delete(id);
      this.log(`Destroyed sandbox: ${id}`);
    }
  }
  
  /**
   * 启动应用
   */
  async start() {
    if (this.state !== 'ready') {
      throw new Error(`Cannot start app in state: ${this.state}`);
    }
    
    this.state = 'running';
    this.log('App started');
  }
  
  /**
   * 停止应用
   */
  async stop() {
    if (this.state !== 'running') {
      return;
    }
    
    this.log('Stopping app...');
    
    // 销毁所有 Sandbox
    for (const [id] of this.sandboxes) {
      this.destroySandbox(id);
    }
    
    // 卸载插件（逆序）
    for (const plugin of [...this.pluginLoadOrder].reverse()) {
      const loaded = this.loadedPlugins.get(plugin.id);
      if (loaded && loaded.instance && loaded.instance.cleanup) {
        try {
          await loaded.instance.cleanup();
        } catch (error) {
          this.log(`Error cleaning up plugin "${plugin.id}":`, error);
        }
      }
    }
    
    this.loadedPlugins.clear();
    this.state = 'stopped';
    this.log('App stopped');
  }
  
  /**
   * 获取插件实例
   */
  getPlugin(id) {
    const loaded = this.loadedPlugins.get(id);
    return loaded ? loaded.instance : null;
  }
  
  /**
   * 日志输出
   */
  log(...args) {
    if (this.config.enableLogging) {
      console.log('[Nv8App]', ...args);
    }
  }
}

/**
 * 便捷工厂函数
 */
export function createApp(config) {
  return new Nv8App(config);
}
