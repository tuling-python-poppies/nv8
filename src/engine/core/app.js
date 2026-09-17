/**
 * Core App - 应用容器
 * 
 * App 是 Nv8 的顶层容器，负责：
 * 1. 插件注册和管理
 * 2. Profile 配置管理
 * 3. Sandbox 生命周期管理
 * 4. 全局状态管理
 */

import { resolvePluginDependencies, validateDependencies } from '../plugin-sdk/index.js';
import { createStateRegistry } from '../plugin-sdk/index.js';
import { createSandbox } from './sandbox.js';
import { DiagnosticsCollector } from './diagnostics/collector.js';
import { createLifecycleRecorder } from './lifecycle-events.js';

let appIdCounter = 0;

/**
 * 创建 App 实例
 * 
 * @param {AppOptions} options - 配置选项
 * @returns {App}
 */
export function createApp(options = {}) {
  const appId = `app-${++appIdCounter}`;
  const trace = options.trace !== false;
  const lifecycle = createLifecycleRecorder({
    maxEntries: options.maxLifecycleEntries,
  });
  const diagnostics = new DiagnosticsCollector({
    maxEntries: options.maxDiagnosticEntries,
  });
  let destroyed = false;
  let closing = false;
  let disposal = null;
  const pendingCreations = new Set();
  function assertActive() {
    if (!closing && !destroyed) return;
    const error = new Error('App has been closed');
    error.code = 'ERR_NV8_APP_CLOSED';
    throw error;
  }
  lifecycle.emit('app.created', { appId });
  
  // 注册表
  const plugins = new Map();        // plugin-id -> Plugin[]
  const profiles = new Map();       // profile-id -> Profile
  const sandboxes = new Map();      // sandbox-id -> Sandbox
  
  // 全局状态
  const stateRegistry = createStateRegistry();
  
  // 日志工具
  const logger = createLogger(trace);
  
  logger.info(`App created: ${appId}`);
  
  return {
    id: appId,
    
    /**
     * 注册插件
     * 
     * @param {Plugin} plugin - 插件定义
     */
    registerPlugin(plugin) {
      assertActive();
      logger.info(`Registering plugin: ${plugin.id}@${plugin.version}`);
      
      if (!plugins.has(plugin.id)) {
        plugins.set(plugin.id, []);
      }
      
      const versions = plugins.get(plugin.id);
      
      // 检查是否已经注册了相同版本
      const existing = versions.find(p => p.version === plugin.version);
      if (existing) {
        throw new Error(
          `Plugin "${plugin.id}@${plugin.version}" is already registered`
        );
      }
      
      versions.push(plugin);
      lifecycle.emit('plugin.registered', {
        appId,
        pluginId: plugin.id,
        version: plugin.version,
      });
      logger.info(`Plugin registered: ${plugin.id}@${plugin.version}`);
    },
    
    /**
     * 批量注册插件
     */
    registerPlugins(pluginList) {
      for (const plugin of pluginList) {
        this.registerPlugin(plugin);
      }
    },
    
    /**
     * 注册 Profile
     * 
     * Profile 定义了一组插件的组合配置
     * 
     * @param {Profile} profile - Profile 定义
     */
    registerProfile(profile) {
      assertActive();
      logger.info(`Registering profile: ${profile.id}`);
      
      if (profiles.has(profile.id)) {
        throw new Error(`Profile "${profile.id}" is already registered`);
      }
      
      profiles.set(profile.id, profile);
      lifecycle.emit('profile.registered', { appId, profileId: profile.id });
      logger.info(`Profile registered: ${profile.id}`);
    },
    
    /**
     * 创建 Sandbox
     * 
     * @param {SandboxOptions} options - Sandbox 配置
     * @returns {Promise<Sandbox>}
     */
    async createSandbox(options) {
      assertActive();
      let finish;
      const pending = new Promise(resolve => { finish = resolve; });
      pendingCreations.add(pending);
      try {
      logger.info(`Creating sandbox with profile: ${options.profile || 'default'}`);
      
      // 1. 获取 profile
      const profile = profiles.get(options.profile);
      if (!profile) {
        throw new Error(`Profile "${options.profile}" not found`);
      }
      
      // 2. 解析插件依赖
      const allPlugins = Array.from(plugins.values()).flat();
      const resolved = resolvePluginDependencies(profile.plugins, allPlugins);
      
      logger.info(`Resolved ${resolved.count} plugins for sandbox`);
      
      // 3. 验证依赖
      const validation = validateDependencies(resolved.plugins);
      if (!validation.valid) {
        throw new Error(
          `Dependency validation failed:\n${validation.errors.join('\n')}`
        );
      }
      
      // 4. 创建 Sandbox
      let sandbox;
      try {
        sandbox = await createSandbox({
          appId,
          profile,
        plugins: resolved.plugins,
        stateRegistry,
        trace: options.trace !== false,
          logger,
          limits: options.limits,
        });
      } catch (error) {
        diagnostics.record(error, { phase: 'sandbox.create', profileId: profile.id });
        lifecycle.emit('sandbox.create.failed', {
          appId,
          profileId: profile.id,
          code: error.code || 'ERR_NV8_SANDBOX_CREATE',
        });
        throw error;
      }
      
      if (closing || destroyed) {
        await sandbox.destroy();
        assertActive();
      }
      sandboxes.set(sandbox.id, sandbox);
      lifecycle.emit('sandbox.created', {
        appId,
        sandboxId: sandbox.id,
        profileId: profile.id,
      });
      logger.info(`Sandbox created: ${sandbox.id}`);
      
      return sandbox;
      } finally {
        pendingCreations.delete(pending);
        finish();
      }
    },
    
    /**
     * 销毁 Sandbox
     */
    async destroySandbox(sandboxId) {
      logger.info(`Destroying sandbox: ${sandboxId}`);
      
      const sandbox = sandboxes.get(sandboxId);
      if (!sandbox) {
        throw new Error(`Sandbox "${sandboxId}" not found`);
      }
      
      try {
        await sandbox.destroy();
      } catch (error) {
        diagnostics.record(error, { phase: 'sandbox.destroy', sandboxId });
        lifecycle.emit('sandbox.destroy.failed', {
          appId,
          sandboxId,
          code: error.code || 'ERR_NV8_SANDBOX_DESTROY',
        });
        throw error;
      }
      sandboxes.delete(sandboxId);
      lifecycle.emit('sandbox.destroyed', { appId, sandboxId });
      
      // 清理 sandbox 状态
      stateRegistry.destroyContext('sandbox', sandboxId);
      
      logger.info(`Sandbox destroyed: ${sandboxId}`);
    },
    
    /**
     * 获取 Sandbox
     */
    getSandbox(sandboxId) {
      return sandboxes.get(sandboxId);
    },
    
    /**
     * 获取所有 Sandbox
     */
    getAllSandboxes() {
      return Array.from(sandboxes.values());
    },
    
    /**
     * 获取插件信息
     */
    getPlugin(pluginId, version = '*') {
      const versions = plugins.get(pluginId);
      if (!versions) return null;
      
      if (version === '*') {
        // 返回最高版本
        versions.sort((a, b) => {
          const partsA = a.version.split('.').map(Number);
          const partsB = b.version.split('.').map(Number);
          
          for (let i = 0; i < 3; i++) {
            if (partsA[i] > partsB[i]) return -1;
            if (partsA[i] < partsB[i]) return 1;
          }
          return 0;
        });
        return versions[0];
      }
      
      return versions.find(p => p.version === version);
    },
    
    /**
     * 获取所有插件
     */
    getAllPlugins() {
      return Array.from(plugins.values()).flat();
    },
    
    /**
     * 获取 Profile
     */
    getProfile(profileId) {
      return profiles.get(profileId);
    },
    
    /**
     * 获取所有 Profile
     */
    getAllProfiles() {
      return Array.from(profiles.values());
    },
    
    /**
     * 获取全局状态
     */
    getState(key) {
      return stateRegistry.get(key, 'app', null);
    },
    
    /**
     * 设置全局状态
     */
    setState(key, value) {
      assertActive();
      stateRegistry.set(key, value, 'app', null);
    },
    
    diagnose() {
      return {
        appId,
        destroyed,
        plugins: Array.from(plugins.entries()).map(([id, versions]) => ({
          id,
          versions: versions.map(plugin => plugin.version),
        })),
        profiles: Array.from(profiles.keys()),
        sandboxes: Array.from(sandboxes.keys()),
        diagnostics: diagnostics.getAll(),
        lifecycle: lifecycle.snapshot(),
      };
    },

    getDiagnostics() {
      return diagnostics.getAll();
    },

    /**
     * 销毁 App
     */
    destroy() {
      if (disposal !== null) return disposal;
      closing = true;
      disposal = (async () => {
      await Promise.all(pendingCreations);
      logger.info(`Destroying app: ${appId}`);
      
      // 销毁所有 Sandbox
      for (const [sandboxId] of sandboxes) {
        await this.destroySandbox(sandboxId);
      }
      
      // 清理全局状态
      stateRegistry.destroyContext('app', null);
      destroyed = true;
      lifecycle.emit('app.destroyed', { appId });
      logger.info(`App destroyed: ${appId}`);
      })();
      return disposal;
    },
    
    /**
     * 调试信息
     */
    inspect() {
      return {
        appId,
        plugins: Array.from(plugins.entries()).map(([id, versions]) => ({
          id,
          versions: versions.map(p => p.version),
        })),
        profiles: Array.from(profiles.keys()),
        sandboxes: Array.from(sandboxes.keys()),
      };
    },
  };
}

/**
 * 创建日志工具
 */
function createLogger(enabled) {
  const prefix = '[Nv8 App]';
  
  return {
    info(...args) {
      if (enabled) console.log(prefix, ...args);
    },
    warn(...args) {
      if (enabled) console.warn(prefix, ...args);
    },
    error(...args) {
      console.error(prefix, ...args);
    },
    trace(...args) {
      if (enabled) console.log(prefix, '[TRACE]', ...args);
    },
  };
}

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} AppOptions
 * @property {boolean} [trace] - 是否启用追踪日志
 * 
 * @typedef {Object} Profile
 * @property {string} id - Profile ID
 * @property {string} description - 描述
 * @property {string[]} plugins - 插件列表 (id@version 格式)
 * 
 * @typedef {Object} SandboxOptions
 * @property {string} profile - Profile ID
 * @property {boolean} [trace] - 是否启用追踪日志
 * 
 * @typedef {Object} App
 * @property {string} id - App ID
 * @property {function(Plugin): void} registerPlugin
 * @property {function(Plugin[]): void} registerPlugins
 * @property {function(Profile): void} registerProfile
 * @property {function(SandboxOptions): Promise<Sandbox>} createSandbox
 * @property {function(string): Promise<void>} destroySandbox
 * @property {function(string): Sandbox} getSandbox
 * @property {function(): Sandbox[]} getAllSandboxes
 * @property {function(string, string=): Plugin} getPlugin
 * @property {function(): Plugin[]} getAllPlugins
 * @property {function(string): Profile} getProfile
 * @property {function(): Profile[]} getAllProfiles
 * @property {function(string): any} getState
 * @property {function(string, any): void} setState
 * @property {function(): Promise<void>} destroy
 * @property {function(): Object} inspect
 */
