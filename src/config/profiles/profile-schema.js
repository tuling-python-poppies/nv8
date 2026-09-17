/**
 * Profile Schema - Profile 定义和校验
 * 
 * Profile 定义了：
 * 1. 插件组合和版本锁定
 * 2. 浏览器环境配置
 * 3. Node 支持矩阵
 * 4. 能力降级策略
 */

/**
 * @typedef {Object} ProfileManifest
 * @property {string} id - Profile ID（语义化命名，如 "browser-profile-edge-v150"）
 * @property {string} version - Profile 版本（SemVer）
 * @property {string} name - 显示名称
 * @property {string} description - 描述
 * @property {Object} metadata - 元数据
 * @property {string} [metadata.browserFamily] - 浏览器家族（edge, chrome, firefox）
 * @property {number} [metadata.browserVersion] - 浏览器版本号
 * @property {string} [metadata.platform] - 平台（windows, macos, linux）
 * @property {PluginReference[]} plugins - 插件列表
 * @property {Object.<string, string>} [pluginPins] - 插件版本锁定（plugin-id -> exact version）
 * @property {Object.<string, any>} [config] - 配置覆盖
 * @property {NodeSupport} nodeSupport - Node.js 支持信息
 * @property {Degradation[]} [degradations] - 已知降级行为
 * @property {string[]} [requiredCapabilities] - 必需能力
 * @property {string[]} [optionalCapabilities] - 可选能力
 */

/**
 * @typedef {Object} PluginReference
 * @property {string} id - 插件 ID
 * @property {string} [range] - 版本范围（SemVer range）
 * @property {string} [exactVersion] - 精确版本（优先于 range）
 * @property {boolean} [optional] - 是否可选
 */

/**
 * @typedef {Object} NodeSupport
 * @property {string} minimum - 最低支持版本（如 "18.18.0"）
 * @property {string[]} tested - 已测试版本列表
 * @property {Object.<string, string>} [limitations] - 限制说明（Node版本 -> 说明）
 */

/**
 * @typedef {Object} Degradation
 * @property {string} capability - 受影响能力
 * @property {string} behavior - 降级行为描述
 * @property {string} reason - 降级原因
 * @property {string[]} [affectedNodeVersions] - 受影响的 Node 版本
 */

/**
 * @typedef {Object} ProfileLockPlan
 * @property {string} profileId - Profile ID
 * @property {string} profileVersion - Profile 版本
 * @property {string} createdAt - 创建时间（ISO 8601）
 * @property {PluginLock[]} plugins - 已解析的插件锁定
 * @property {Object.<string, any>} config - 配置快照
 * @property {Object} host - 宿主信息
 * @property {string} host.nodeVersion - Node 版本
 * @property {string} host.v8Version - V8 版本
 * @property {Object.<string, boolean>} host.features - 宿主能力
 * @property {string} digest - Lock plan 摘要（SHA-256）
 */

/**
 * @typedef {Object} PluginLock
 * @property {string} id - 插件 ID
 * @property {string} version - 锁定版本
 * @property {string[]} provides - 提供的能力
 * @property {number} installOrder - 安装顺序
 */

/**
 * 校验 Profile Manifest
 * 
 * @param {ProfileManifest} manifest - Profile manifest
 * @throws {Error} 校验失败
 */
export function validateProfileManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('Profile manifest must be an object');
  }
  
  // 必需字段
  if (!manifest.id || typeof manifest.id !== 'string') {
    throw new Error('Profile manifest must have a valid "id" string');
  }
  
  if (!manifest.version || typeof manifest.version !== 'string') {
    throw new Error('Profile manifest must have a valid "version" string');
  }
  
  if (!manifest.name || typeof manifest.name !== 'string') {
    throw new Error('Profile manifest must have a valid "name" string');
  }
  
  // plugins 必须是数组
  if (!Array.isArray(manifest.plugins)) {
    throw new Error('Profile manifest "plugins" must be an array');
  }
  
  // 校验每个插件引用
  for (const pluginRef of manifest.plugins) {
    validatePluginReference(pluginRef);
  }
  
  // 校验 Node 支持信息
  if (manifest.nodeSupport) {
    validateNodeSupport(manifest.nodeSupport);
  }
  
  // pluginPins 必须是对象（如果存在）
  if (manifest.pluginPins !== undefined && typeof manifest.pluginPins !== 'object') {
    throw new Error('Profile manifest "pluginPins" must be an object');
  }
  
  // config 必须是对象（如果存在）
  if (manifest.config !== undefined && typeof manifest.config !== 'object') {
    throw new Error('Profile manifest "config" must be an object');
  }

  for (const field of ['requiredCapabilities', 'optionalCapabilities']) {
    if (manifest[field] !== undefined) {
      if (!Array.isArray(manifest[field])
        || manifest[field].some(id => typeof id !== 'string' || id.length === 0)) {
        throw new Error(`Profile manifest "${field}" must be an array of non-empty strings`);
      }
    }
  }

  if (manifest.degradations !== undefined) {
    if (!Array.isArray(manifest.degradations)) {
      throw new Error('Profile manifest "degradations" must be an array');
    }
    for (const degradation of manifest.degradations) {
      if (!degradation || typeof degradation !== 'object'
        || typeof degradation.capability !== 'string'
        || typeof degradation.behavior !== 'string'
        || typeof degradation.reason !== 'string') {
        throw new Error('Each profile degradation needs capability, behavior, and reason strings');
      }
    }
  }
}

/**
 * 校验插件引用
 * 
 * @param {PluginReference} ref - 插件引用
 * @throws {Error} 校验失败
 */
function validatePluginReference(ref) {
  if (!ref || typeof ref !== 'object') {
    throw new Error('Plugin reference must be an object');
  }
  
  if (!ref.id || typeof ref.id !== 'string') {
    throw new Error('Plugin reference must have a valid "id" string');
  }
  
  if (ref.range !== undefined && typeof ref.range !== 'string') {
    throw new Error('Plugin reference "range" must be a string');
  }
  
  if (ref.exactVersion !== undefined && typeof ref.exactVersion !== 'string') {
    throw new Error('Plugin reference "exactVersion" must be a string');
  }
  
  if (ref.optional !== undefined && typeof ref.optional !== 'boolean') {
    throw new Error('Plugin reference "optional" must be a boolean');
  }
}

/**
 * 校验 Node 支持信息
 * 
 * @param {NodeSupport} nodeSupport - Node 支持信息
 * @throws {Error} 校验失败
 */
function validateNodeSupport(nodeSupport) {
  if (!nodeSupport || typeof nodeSupport !== 'object') {
    throw new Error('Node support must be an object');
  }
  
  if (!nodeSupport.minimum || typeof nodeSupport.minimum !== 'string') {
    throw new Error('Node support must have a valid "minimum" version string');
  }
  
  if (nodeSupport.tested && !Array.isArray(nodeSupport.tested)) {
    throw new Error('Node support "tested" must be an array');
  }
}
