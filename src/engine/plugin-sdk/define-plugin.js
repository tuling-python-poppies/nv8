/**
 * Plugin SDK - definePlugin
 * 
 * 插件定义工具，提供类型检查和标准化。
 * 
 * 使用示例：
 * 
 * export default definePlugin({
 *   id: 'my-plugin',
 *   version: '1.0.0',
 *   description: 'My plugin description',
 *   requires: ['webidl-foundation@1.0.0'],
 *   provides: [
 *     { name: 'my-capability', version: '1.0.0' }
 *   ],
 *   supports: {
 *     realms: ['root', 'worker']
 *   },
 *   install(context) {
 *     // 安装逻辑
 *   }
 * });
 */

import { normalizePluginApiVersion } from './api-version.js';

/**
 * 定义一个插件
 * 
 * @param {PluginDefinition} definition - 插件定义
 * @returns {Plugin} 标准化的插件对象
 */
export function definePlugin(definition) {
  validatePluginDefinition(definition);
  
  return {
    // 基本信息
    apiVersion: normalizePluginApiVersion(definition.apiVersion),
    id: definition.id,
    version: definition.version,
    description: definition.description || '',
    
    // 依赖关系
    requires: normalizeRequirements(definition.requires || []),
    provides: normalizeCapabilities(definition.provides || []),
    
    // 支持配置
    supports: {
      realms: definition.supports?.realms || ['root', 'worker', 'iframe', 'worklet'],
      profiles: definition.supports?.profiles || null, // null = all profiles
    },
    
    // 生命周期钩子
    install: definition.install,
    activate: definition.activate || null,
    reset: definition.reset || null,
    dispose: definition.dispose || null,
    uninstall: definition.uninstall || null,
    beforeRealmCreate: definition.beforeRealmCreate || null,
    afterRealmCreate: definition.afterRealmCreate || null,
    
    // 元数据
    metadata: {
      author: definition.metadata?.author || null,
      license: definition.metadata?.license || null,
      homepage: definition.metadata?.homepage || null,
      repository: definition.metadata?.repository || null,
    },
    
    // 运行时状态（由系统填充）
    _installed: false,
    _exports: null,
  };
}

/**
 * 验证插件定义
 */
function validatePluginDefinition(def) {
  // 必需字段
  if (!def.id || typeof def.id !== 'string') {
    throw new Error('Plugin definition must have a string "id"');
  }
  
  if (!def.version || typeof def.version !== 'string') {
    throw new Error(`Plugin "${def.id}" must have a string "version"`);
  }

  if (def.apiVersion !== undefined) {
    normalizePluginApiVersion(def.apiVersion);
  }
  
  if (!def.install || typeof def.install !== 'function') {
    throw new Error(`Plugin "${def.id}" must have an "install" function`);
  }
  
  // 验证版本号格式 (简单的 semver 检查)
  if (!/^\d+\.\d+\.\d+/.test(def.version)) {
    throw new Error(
      `Plugin "${def.id}" version "${def.version}" is not valid semver format`
    );
  }
  
  // 验证 ID 格式 (kebab-case)
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(def.id)) {
    throw new Error(
      `Plugin ID "${def.id}" must be kebab-case (lowercase letters, numbers, and hyphens)`
    );
  }
  
  // 验证可选钩子
  const hookNames = [
    'activate',
    'reset',
    'dispose',
    'uninstall',
    'beforeRealmCreate',
    'afterRealmCreate',
  ];
  for (const hook of hookNames) {
    if (def[hook] !== undefined && typeof def[hook] !== 'function') {
      throw new Error(`Plugin "${def.id}" ${hook} must be a function`);
    }
  }
  
  // 验证 requires
  if (def.requires !== undefined) {
    if (!Array.isArray(def.requires)) {
      throw new Error(`Plugin "${def.id}" requires must be an array`);
    }
    
    for (const req of def.requires) {
      if (typeof req === 'string') continue;
      // 与 normalizeRequirements 保持一致：对象形态 { id, version?, optional? }
      if (req !== null && typeof req === 'object' && typeof req.id === 'string') {
        continue;
      }
      throw new Error(
        `Plugin "${def.id}" requires entries must be strings or { id } objects`
      );
    }
  }
  
  // 验证 provides
  if (def.provides !== undefined) {
    if (!Array.isArray(def.provides)) {
      throw new Error(`Plugin "${def.id}" provides must be an array`);
    }
    
    for (const cap of def.provides) {
      // 支持字符串简写格式
      if (typeof cap === 'string') {
        continue;
      }
      
      // 对象格式需要验证
      if (!cap.name || typeof cap.name !== 'string') {
        throw new Error(
          `Plugin "${def.id}" capability must have a string "name"`
        );
      }
      
      if (!cap.version || typeof cap.version !== 'string') {
        throw new Error(
          `Plugin "${def.id}" capability "${cap.name}" must have a version`
        );
      }
    }
  }
  
  // 验证 supports
  if (def.supports !== undefined) {
    if (def.supports.realms !== undefined) {
      if (!Array.isArray(def.supports.realms)) {
        throw new Error(`Plugin "${def.id}" supports.realms must be an array`);
      }
      
      const validRealms = ['root', 'worker', 'iframe', 'worklet'];
      for (const realm of def.supports.realms) {
        if (!validRealms.includes(realm)) {
          throw new Error(
            `Plugin "${def.id}" invalid realm type "${realm}". ` +
            `Valid types: ${validRealms.join(', ')}`
          );
        }
      }
    }
    
    if (def.supports.profiles !== undefined && def.supports.profiles !== null) {
      if (!Array.isArray(def.supports.profiles)) {
        throw new Error(
          `Plugin "${def.id}" supports.profiles must be an array or null`
        );
      }
    }
  }
}

/**
 * 标准化依赖需求
 * 
 * 输入格式：
 * - 'plugin-id' -> { id: 'plugin-id', version: '*' }
 * - 'plugin-id@1.0.0' -> { id: 'plugin-id', version: '1.0.0' }
 * - 'plugin-id@^1.0.0' -> { id: 'plugin-id', version: '^1.0.0' }
 */
function normalizeRequirements(requires) {
  return requires.map(req => {
    if (typeof req === 'object' && req.id) {
      return {
        id: req.id,
        version: req.range || req.version || '*',
        optional: req.optional || false,
      };
    }
    
    // 解析 'id@version' 格式
    const match = req.match(/^([a-z][a-z0-9-]*)(?:@(.+))?$/);
    if (!match) {
      throw new Error(`Invalid requirement format: "${req}"`);
    }
    
    return {
      id: match[1],
      version: match[2] || '*',
      optional: false,
    };
  });
}

/**
 * 标准化能力声明
 */
function normalizeCapabilities(provides) {
  return provides.map(cap => {
    if (typeof cap === 'string') {
      // 简写格式: 'capability-name' -> { name: 'capability-name', version: '1.0.0' }
      return {
        name: cap,
        version: '1.0.0',
        description: '',
      };
    }
    
    return {
      name: cap.name,
      version: cap.version,
      description: cap.description || '',
    };
  });
}

/**
 * 解析版本范围
 * 
 * 支持的格式：
 * - '1.0.0' - 精确版本
 * - '*' - 任意版本
 * - '^1.0.0' - 兼容版本 (>=1.0.0 <2.0.0)
 * - '~1.0.0' - 补丁版本 (>=1.0.0 <1.1.0)
 * - '>=1.0.0' - 最小版本
 */
export function parseVersionRange(range) {
  if (range === '*') {
    return { type: 'any' };
  }
  
  if (range.startsWith('^')) {
    const version = range.slice(1);
    return { type: 'caret', version };
  }
  
  if (range.startsWith('~')) {
    const version = range.slice(1);
    return { type: 'tilde', version };
  }
  
  if (range.startsWith('>=')) {
    const version = range.slice(2);
    return { type: 'gte', version };
  }
  
  if (range.startsWith('>')) {
    const version = range.slice(1);
    return { type: 'gt', version };
  }
  
  if (range.startsWith('<=')) {
    const version = range.slice(2);
    return { type: 'lte', version };
  }
  
  if (range.startsWith('<')) {
    const version = range.slice(1);
    return { type: 'lt', version };
  }
  
  // 精确版本
  return { type: 'exact', version: range };
}

/**
 * 检查版本是否满足范围要求
 */
export function satisfiesVersionRange(version, range) {
  const parsed = parseVersionRange(range);
  
  if (parsed.type === 'any') {
    return true;
  }
  
  if (parsed.type === 'exact') {
    return version === parsed.version;
  }
  
  const versionParts = version.split('.').map(Number);
  const rangeParts = parsed.version.split('.').map(Number);
  
  if (parsed.type === 'caret') {
    // ^1.2.3 means >=1.2.3 <2.0.0
    if (versionParts[0] !== rangeParts[0]) {
      return false;
    }
    return compareVersions(version, parsed.version) >= 0;
  }
  
  if (parsed.type === 'tilde') {
    // ~1.2.3 means >=1.2.3 <1.3.0
    if (versionParts[0] !== rangeParts[0] || versionParts[1] !== rangeParts[1]) {
      return false;
    }
    return compareVersions(version, parsed.version) >= 0;
  }
  
  const cmp = compareVersions(version, parsed.version);
  
  if (parsed.type === 'gte') return cmp >= 0;
  if (parsed.type === 'gt') return cmp > 0;
  if (parsed.type === 'lte') return cmp <= 0;
  if (parsed.type === 'lt') return cmp < 0;
  
  return false;
}

/**
 * 比较版本号
 * 
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  
  return 0;
}

/**
 * TypeScript 类型定义（仅供参考）
 * 
 * @typedef {Object} PluginDefinition
 * @property {string} id - 插件 ID (kebab-case)
 * @property {string} version - 版本号 (semver)
 * @property {string} [description] - 描述
 * @property {string[]} [requires] - 依赖的插件
 * @property {Capability[]} [provides] - 提供的能力
 * @property {SupportConfig} [supports] - 支持配置
 * @property {InstallFunction} install - 安装函数
 * @property {UninstallFunction} [uninstall] - 卸载函数
 * @property {RealmHook} [beforeRealmCreate] - Realm 创建前钩子
 * @property {RealmHook} [afterRealmCreate] - Realm 创建后钩子
 * @property {MetadataConfig} [metadata] - 元数据
 * 
 * @typedef {Object} Capability
 * @property {string} name - 能力名称
 * @property {string} version - 能力版本
 * @property {string} [description] - 能力描述
 * 
 * @typedef {Object} SupportConfig
 * @property {('root'|'worker'|'iframe'|'worklet')[]} [realms] - 支持的 realm 类型
 * @property {string[]|null} [profiles] - 支持的 profile (null = all)
 * 
 * @typedef {Object} MetadataConfig
 * @property {string} [author] - 作者
 * @property {string} [license] - 许可证
 * @property {string} [homepage] - 主页
 * @property {string} [repository] - 仓库
 * 
 * @callback InstallFunction
 * @param {PluginContext} context - 插件上下文
 * @returns {void}
 * 
 * @callback UninstallFunction
 * @param {PluginContext} context - 插件上下文
 * @returns {void}
 * 
 * @callback RealmHook
 * @param {PluginContext} context - 插件上下文
 * @returns {void}
 */
