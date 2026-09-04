/**
 * Plugin Registry - 简化版本
 * 
 * 用于注册和解析插件依赖
 */

/**
 * 创建插件注册表
 * 
 * @returns {PluginRegistry}
 */
export function createPluginRegistry() {
  const plugins = new Map(); // plugin-id -> plugin
  
  return {
    /**
     * 注册插件
     */
    register(plugin) {
      const normalized = normalizePlugin(plugin);
      if (plugins.has(normalized.id)) {
        throw new Error(`Plugin "${normalized.id}" is already registered`);
      }
      plugins.set(normalized.id, normalized);
    },
    
    /**
     * 获取插件
     */
    get(pluginId) {
      return plugins.get(pluginId);
    },
    
    /**
     * 检查是否已注册
     */
    has(pluginId) {
      return plugins.has(pluginId);
    },
    
    /**
     * 解析插件依赖，返回安装顺序
     * 
     * @returns {Plugin[]}
     */
    resolve() {
      const allPlugins = Array.from(plugins.values()).sort((left, right) => (
        left.id.localeCompare(right.id)
      ));
      const resolved = [];
      const visited = new Set();
      const visiting = new Set();
      
      function visit(plugin) {
        if (resolved.includes(plugin)) {
          return;
        }
        
        if (visiting.has(plugin.id)) {
          throw new Error(`Circular dependency detected: ${plugin.id}`);
        }
        
        visiting.add(plugin.id);
        
        // 访问依赖
        const requires = plugin.requires || plugin.manifest?.requires || [];
        const sortedRequires = [...requires].sort((left, right) => (
          `${left}`.localeCompare(`${right}`)
        ));
        for (const dep of sortedRequires) {
          const dependencyId = typeof dep === 'string'
            ? dependencyName(dep)
            : dep.name || dep.id;
          const depPlugin = findPluginForDependency(plugins, dependencyId);
          if (!depPlugin) {
            const error = new Error(
              `Plugin "${plugin.id}" requires "${dependencyId}", but it's not registered`,
            );
            error.code = 'DEPENDENCY_MISSING';
            error.pluginId = plugin.id;
            error.dependencyId = dependencyId;
            throw error;
          }
          const range = typeof dep === 'string' ? dependencyRange(dep) : dep.version || dep.range;
          if (range && !satisfiesVersion(depPlugin.version, range)) {
            const error = new Error(
              `Plugin "${plugin.id}" requires "${dependencyId}@${range}", but ${depPlugin.version} is installed`,
            );
            error.code = 'DEPENDENCY_VERSION_MISMATCH';
            error.pluginId = plugin.id;
            error.dependencyId = dependencyId;
            error.required = range;
            error.actual = depPlugin.version;
            throw error;
          }
          visit(depPlugin);
        }
        
        visiting.delete(plugin.id);
        visited.add(plugin.id);
        resolved.push(plugin);
      }
      
      // 访问所有插件
      for (const plugin of allPlugins) {
        visit(plugin);
      }
      
      return resolved;
    },
    
    /**
     * 获取所有已注册的插件
     */
    getAll() {
      return Array.from(plugins.values());
    },
  };
}

/**
 * Convert legacy Phase 3 plugin objects to the single-context contract.
 */
function dependencyName(value) {
  const text = `${value}`;
  if (text.startsWith('@')) {
    const at = text.indexOf('@', 1);
    return at < 0 ? text : text.slice(0, at);
  }
  return text.split('@', 1)[0];
}

function dependencyRange(value) {
  const text = `${value}`;
  if (text.startsWith('@')) {
    const at = text.indexOf('@', 1);
    return at < 0 ? null : text.slice(at + 1) || null;
  }
  const at = text.indexOf('@');
  return at < 0 ? null : text.slice(at + 1) || null;
}

function satisfiesVersion(version, range) {
  const actual = parseVersion(version);
  if (!actual) return false;
  const normalized = `${range}`.trim();
  if (normalized === '*' || normalized === '') return true;
  const match = normalized.match(/^(?:\^|~|>=|>|=)?(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!match) return version === normalized;
  const required = [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
  if (normalized.startsWith('^')) {
    return actual[0] === required[0] && compareVersion(actual, required) >= 0;
  }
  if (normalized.startsWith('~')) {
    return actual[0] === required[0] && actual[1] === required[1]
      && compareVersion(actual, required) >= 0;
  }
  if (normalized.startsWith('>=')) return compareVersion(actual, required) >= 0;
  if (normalized.startsWith('>')) return compareVersion(actual, required) > 0;
  return compareVersion(actual, required) === 0;
}

function parseVersion(value) {
  const match = `${value}`.match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
}

function compareVersion(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function findPluginForDependency(plugins, dependencyId) {
  const direct = plugins.get(dependencyId);
  if (direct) return direct;
  
  for (const plugin of plugins.values()) {
    const provides = plugin.provides || [];
    if (provides.some(capability => (
      typeof capability === 'string'
        ? capability === dependencyId
        : capability.name === dependencyId || capability.id === dependencyId
    ))) {
      return plugin;
    }
  }
  
  // Legacy manifests sometimes used capability-like IDs such as dom-core.base.
  const legacyId = dependencyId.endsWith('.base')
    ? dependencyId.slice(0, -'.base'.length)
    : dependencyId;
  return plugins.get(`@nv8/plugin-${legacyId}`) || null;
}

export function normalizePlugin(plugin) {
  if (plugin === null || typeof plugin !== 'object') {
    throw new TypeError('Plugin must be an object');
  }
  if (typeof plugin.id !== 'string' || typeof plugin.version !== 'string') {
    throw new TypeError('Plugin must define string id and version');
  }
  if (typeof plugin.install !== 'function') {
    throw new TypeError(`Plugin "${plugin.id}" must define install(context)`);
  }
  
  // SDK plugins already use the canonical context contract.
  if (plugin.dependencies === undefined && plugin.capabilities === undefined) {
    return plugin;
  }
  
  const requires = plugin.requires || plugin.dependencies || [];
  const provides = plugin.provides || plugin.capabilities || [];
  const isLegacy = plugin.install.length >= 2;
  const legacyInstall = plugin.install;
  const legacyReset = plugin.reset;
  const legacyDispose = plugin.dispose;
  const legacyUninstall = plugin.uninstall;
  const normalized = {
    ...plugin,
    requires: [...requires],
    provides: [...provides],
    manifest: plugin.manifest || {
      id: plugin.id,
      version: plugin.version,
      requires: [...requires],
      provides: [...provides],
      realms: ['root', 'worker', 'iframe', 'worklet'],
    },
    install: isLegacy
      ? context => legacyInstall.call(
        plugin,
        createLegacySandboxContext(context),
        context.surfaceRegistry,
        context.globals,
      )
      : plugin.install,
    reset: isLegacy
      ? context => legacyReset?.call(
        plugin,
        createLegacySandboxContext(context),
        context.surfaceRegistry,
      )
      : plugin.reset,
    dispose: isLegacy
      ? context => legacyDispose?.call(
        plugin,
        createLegacySandboxContext(context),
        context.surfaceRegistry,
      )
      : plugin.dispose,
    uninstall: isLegacy
      ? context => legacyUninstall?.call(
        plugin,
        createLegacySandboxContext(context),
        context.surfaceRegistry,
      )
      : plugin.uninstall,
    legacy: true,
    _installed: false,
    _exports: null,
  };
  return normalized;
}

function createLegacySandboxContext(context) {
  return {
    id: context.sandboxId,
    realm: context.realm || null,
    state: context.state,
    globals: context.globals,
  };
}
