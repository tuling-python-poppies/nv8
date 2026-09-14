/**
 * Plugin SDK - Capability Matcher
 * 
 * 用于匹配和解析插件依赖关系。
 */

import { satisfiesVersionRange } from './define-plugin.js';

const PLUGIN_ID_PATTERN = /^(?:@[a-z][a-z0-9-]*\/)?[a-z][a-z0-9-]*$/;
const PLUGIN_REQUEST_PATTERN = /^((?:@[a-z][a-z0-9-]*\/)?[a-z][a-z0-9-]*)(?:@(.+))?$/;

/**
 * 构建插件能力索引
 * 
 * @param {Plugin[]} plugins - 已注册的插件列表
 * @returns {CapabilityIndex} 能力索引
 */
export function buildCapabilityIndex(plugins) {
  const index = new Map(); // capability-name -> Plugin[]
  
  for (const plugin of plugins) {
    for (const capability of plugin.provides) {
      const key = capability.name;
      
      if (!index.has(key)) {
        index.set(key, []);
      }
      
      index.get(key).push({
        plugin,
        capability,
      });
    }
  }
  
  return index;
}

/**
 * 解析插件依赖图
 * 
 * 输入：需要加载的插件 ID 列表
 * 输出：按依赖顺序排列的插件列表（拓扑排序）
 * 
 * @param {string[]} requestedPluginIds - 请求的插件 ID (可带版本 'id@version')
 * @param {Plugin[]} availablePlugins - 可用的插件列表
 * @returns {ResolvedPlugins} 解析结果
 */
export function resolvePluginDependencies(requestedPluginIds, availablePlugins) {
  const matchingPlugins = availablePlugins.map(normalizePluginForMatching);
  // 1. 构建插件索引
  const pluginIndex = new Map(); // id -> Plugin[]
  
  for (const plugin of matchingPlugins) {
    if (!pluginIndex.has(plugin.id)) {
      pluginIndex.set(plugin.id, []);
    }
    pluginIndex.get(plugin.id).push(plugin);
  }

  // 能力提供者索引：requires 可以声明能力名而不是插件 id，
  // 解析阶段必须与 validateDependencies 使用同一语义（IKFDA4）。
  const capabilityIndex = buildCapabilityIndex(matchingPlugins);
  
  // 2. 解析请求的插件
  const requestedPlugins = [];
  
  for (const requestStr of requestedPluginIds) {
    const { id, version } = parsePluginRequest(requestStr);
    const plugin = findMatchingPlugin(id, version, pluginIndex);
    
    if (!plugin) {
      throw new Error(
        `Plugin "${id}" version "${version}" not found. ` +
        `Available: ${getAvailableVersions(id, pluginIndex).join(', ') || 'none'}`
      );
    }
    
    requestedPlugins.push(plugin);
  }
  
  // 3. 递归收集所有依赖
  const visited = new Set(); // plugin.id@version
  const resolved = []; // 最终排序的插件列表
  const resolving = new Set(); // 正在解析的插件（用于检测循环依赖）
  
  for (const plugin of requestedPlugins) {
    resolveDependenciesRecursive(
      plugin,
      pluginIndex,
      capabilityIndex,
      visited,
      resolved,
      resolving,
    );
  }
  
  return {
    plugins: resolved,
    count: resolved.length,
  };
}

/**
 * 递归解析依赖
 */
function resolveDependenciesRecursive(
  plugin,
  pluginIndex,
  capabilityIndex,
  visited,
  resolved,
  resolving,
) {
  const key = `${plugin.id}@${plugin.version}`;
  
  // 已经处理过
  if (visited.has(key)) {
    return;
  }
  
  // 检测循环依赖
  if (resolving.has(key)) {
    throw new Error(
      `Circular dependency detected: ${Array.from(resolving).join(' -> ')} -> ${key}`
    );
  }
  
  resolving.add(key);
  
  // 先递归处理所有依赖
  for (const requirement of plugin.requires) {
    const depPlugin = findMatchingPlugin(
      requirement.id,
      requirement.version,
      pluginIndex
    ) ?? findCapabilityProvider(
      requirement.id,
      requirement.version,
      capabilityIndex,
    );
    
    if (!depPlugin) {
      if (requirement.optional) {
        continue; // 可选依赖不存在，跳过
      }
      
      throw new Error(
        `Plugin "${plugin.id}@${plugin.version}" requires ` +
        `"${requirement.id}@${requirement.version}" but it was not found. ` +
        `Available: ${getAvailableVersions(requirement.id, pluginIndex).join(', ') || 'none'}`
      );
    }
    
    resolveDependenciesRecursive(
      depPlugin,
      pluginIndex,
      capabilityIndex,
      visited,
      resolved,
      resolving,
    );
  }
  
  // 依赖都处理完了，添加自己
  resolving.delete(key);
  visited.add(key);
  resolved.push(plugin);
}

/**
 * 在能力索引里查找满足版本要求的提供者插件。
 */
function findCapabilityProvider(capabilityName, versionRange, capabilityIndex) {
  const providers = capabilityIndex.get(capabilityName);
  if (!providers || providers.length === 0) {
    return null;
  }
  const matching = providers.filter((entry) =>
    satisfiesVersionRange(entry.capability.version, versionRange)
  );
  if (matching.length === 0) {
    return null;
  }
  matching.sort((a, b) => compareVersions(b.plugin.version, a.plugin.version));
  return matching[0].plugin;
}

function normalizePluginForMatching(plugin) {
  if (plugin === null || typeof plugin !== 'object') {
    throw new TypeError('Plugin must be an object');
  }
  if (Array.isArray(plugin.requires) && Array.isArray(plugin.provides)) {
    return plugin;
  }
  const rawRequires = plugin.requires ?? plugin.dependencies ?? [];
  const rawProvides = plugin.provides ?? plugin.capabilities ?? [];
  if (!Array.isArray(rawRequires) || !Array.isArray(rawProvides)) {
    throw new TypeError(`Plugin "${plugin.id ?? '<unknown>'}" dependency metadata must be arrays`);
  }
  return {
    ...plugin,
    requires: rawRequires.map(parseRequirement),
    provides: rawProvides.map((capability) => (
      typeof capability === 'string'
        ? { name: capability, version: '1.0.0' }
        : {
          ...capability,
          name: capability.name,
          version: capability.version ?? '1.0.0',
        }
    )),
  };
}

function parseRequirement(requirement) {
  if (requirement !== null && typeof requirement === 'object') {
    const id = `${requirement.id ?? ''}`;
    if (!isPluginId(id)) throw new Error(`Invalid requirement format: ${JSON.stringify(requirement)}`);
    return {
      id,
      version: `${requirement.range ?? requirement.version ?? '*'}`,
      optional: requirement.optional === true,
    };
  }
  const match = `${requirement}`.match(PLUGIN_REQUEST_PATTERN);
  if (!match) throw new Error(`Invalid requirement format: "${requirement}"`);
  return { id: match[1], version: match[2] || '*', optional: false };
}

function isPluginId(value) {
  return PLUGIN_ID_PATTERN.test(value);
}

/**
 * 解析插件请求
 *
 * 同时接受两种调用方形态：
 * - 字符串：'plugin-id' / 'plugin-id@1.0.0'
 * - 对象：{ id, range }（仓库自身 Profile 的 PluginReference）或 { id, version }
 */
function parsePluginRequest(requestStr) {
  if (requestStr !== null && typeof requestStr === 'object') {
    const id = `${requestStr.id ?? ''}`;
    const version = requestStr.range ?? requestStr.version ?? '*';
    if (!isPluginId(id)) {
      throw new Error(`Invalid plugin request format: ${JSON.stringify(requestStr)}`);
    }
    return { id, version: `${version}` };
  }

  const match = `${requestStr}`.match(PLUGIN_REQUEST_PATTERN);
  
  if (!match) {
    throw new Error(`Invalid plugin request format: "${requestStr}"`);
  }
  
  return {
    id: match[1],
    version: match[2] || '*',
  };
}

/**
 * 查找匹配版本的插件
 */
function findMatchingPlugin(id, versionRange, pluginIndex) {
  const candidates = pluginIndex.get(id);
  
  if (!candidates || candidates.length === 0) {
    return null;
  }
  
  // 查找满足版本范围的插件
  const matching = candidates.filter(plugin =>
    satisfiesVersionRange(plugin.version, versionRange)
  );
  
  if (matching.length === 0) {
    return null;
  }
  
  // 返回最高版本
  matching.sort((a, b) => compareVersions(b.version, a.version));
  return matching[0];
}

/**
 * 获取可用版本列表
 */
function getAvailableVersions(id, pluginIndex) {
  const candidates = pluginIndex.get(id);
  if (!candidates) return [];
  return candidates.map(p => p.version);
}

/**
 * 比较版本号（从 define-plugin.js 复制）
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
 * 验证插件能否在指定 realm 类型中运行
 */
export function canRunInRealm(plugin, realmType) {
  return plugin.supports.realms.includes(realmType);
}

/**
 * 验证插件能否在指定 profile 中运行
 */
export function canRunInProfile(plugin, profileId) {
  // null 表示支持所有 profile
  if (plugin.supports.profiles === null) {
    return true;
  }
  
  return plugin.supports.profiles.includes(profileId);
}

/**
 * 查找提供指定能力的插件
 */
export function findPluginsByCapability(capabilityName, plugins) {
  return plugins.filter(plugin =>
    plugin.provides.some(cap => cap.name === capabilityName)
  );
}

/**
 * 检查插件是否提供指定能力
 */
export function hasCapability(plugin, capabilityName, versionRange = '*') {
  for (const capability of plugin.provides) {
    if (
      capability.name === capabilityName &&
      satisfiesVersionRange(capability.version, versionRange)
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * 验证所有插件依赖是否满足
 */
export function validateDependencies(plugins) {
  const errors = [];
  const capabilityIndex = buildCapabilityIndex(plugins);
  
  // 构建插件索引 (id -> Plugin[])
  const pluginIndex = new Map();
  for (const plugin of plugins) {
    if (!pluginIndex.has(plugin.id)) {
      pluginIndex.set(plugin.id, []);
    }
    pluginIndex.get(plugin.id).push(plugin);
  }
  
  for (const plugin of plugins) {
    for (const requirement of plugin.requires) {
      // 先检查是否有插件提供这个 ID
      const pluginProviders = pluginIndex.get(requirement.id);
      const capProviders = capabilityIndex.get(requirement.id);
      
      // 如果既没有插件也没有能力提供者
      if ((!pluginProviders || pluginProviders.length === 0) && 
          (!capProviders || capProviders.length === 0)) {
        if (!requirement.optional) {
          errors.push(
            `Plugin "${plugin.id}@${plugin.version}" requires ` +
            `"${requirement.id}@${requirement.version}" but no provider was found`
          );
        }
        continue;
      }
      
      // 检查版本匹配（插件或能力）
      let hasMatch = false;
      
      if (pluginProviders) {
        const matchingPlugins = pluginProviders.filter(p =>
          satisfiesVersionRange(p.version, requirement.version)
        );
        if (matchingPlugins.length > 0) {
          hasMatch = true;
        }
      }
      
      if (!hasMatch && capProviders) {
        const matchingCaps = capProviders.filter(p =>
          satisfiesVersionRange(p.capability.version, requirement.version)
        );
        if (matchingCaps.length > 0) {
          hasMatch = true;
        }
      }
      
      if (!hasMatch && !requirement.optional) {
        const availableVersions = [];
        if (pluginProviders) {
          availableVersions.push(...pluginProviders.map(p => p.version));
        }
        if (capProviders) {
          availableVersions.push(...capProviders.map(p => p.capability.version));
        }
        
        errors.push(
          `Plugin "${plugin.id}@${plugin.version}" requires ` +
          `"${requirement.id}@${requirement.version}" but only found: ` +
          availableVersions.join(', ')
        );
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 检测循环依赖
 * @param {Plugin[]} plugins - 插件列表
 * @returns {{hasCycle: boolean, cycles: string[][]}} 循环依赖检测结果
 */
export function detectCircularDependencies(plugins) {
  const graph = new Map(); // plugin.id -> [依赖的 plugin.id]
  const pluginMap = new Map();
  
  // 构建依赖图
  for (const plugin of plugins) {
    pluginMap.set(plugin.id, plugin);
    const deps = [];
    
    for (const req of plugin.requires) {
      if (req.optional) continue; // 可选依赖不参与循环检测
      deps.push(req.id);
    }
    
    graph.set(plugin.id, deps);
  }
  
  const cycles = [];
  const visited = new Set();
  const recStack = new Set();
  const path = [];
  
  function dfs(nodeId) {
    visited.add(nodeId);
    recStack.add(nodeId);
    path.push(nodeId);
    
    const deps = graph.get(nodeId) || [];
    
    for (const depId of deps) {
      if (!visited.has(depId)) {
        dfs(depId);
      } else if (recStack.has(depId)) {
        // 找到循环。不能在这里提前 return：遗留的 path/recStack 会让
        // 后续顶层节点的 DFS 把无环节点误报成环（IKFDA4）。
        const cycleStart = path.indexOf(depId);
        if (cycleStart !== -1) {
          cycles.push(path.slice(cycleStart).concat(depId));
        }
      }
    }
    
    path.pop();
    recStack.delete(nodeId);
  }
  
  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }
  
  return {
    hasCycle: cycles.length > 0,
    cycles,
  };
}

/**
 * 打印依赖树（用于调试）
 */
export function printDependencyTree(plugins, indent = 0) {
  const lines = [];
  const prefix = '  '.repeat(indent);
  
  for (const plugin of plugins) {
    lines.push(`${prefix}${plugin.id}@${plugin.version}`);
    
    if (plugin.provides.length > 0) {
      const caps = plugin.provides.map(c => `${c.name}@${c.version}`).join(', ');
      lines.push(`${prefix}  → provides: ${caps}`);
    }
    
    if (plugin.requires.length > 0) {
      const reqs = plugin.requires.map(r => {
        const mark = r.optional ? '(optional)' : '';
        return `${r.id}@${r.version}${mark}`;
      }).join(', ');
      lines.push(`${prefix}  → requires: ${reqs}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} ResolvedPlugins
 * @property {Plugin[]} plugins - 按依赖顺序排列的插件
 * @property {number} count - 插件数量
 * 
 * @typedef {Map<string, PluginCapabilityPair[]>} CapabilityIndex
 * 
 * @typedef {Object} PluginCapabilityPair
 * @property {Plugin} plugin - 插件
 * @property {Capability} capability - 能力
 */
