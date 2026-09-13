/**
 * Plugin SDK - Index
 * 
 * 统一导出所有 Plugin SDK 模块
 */

export { definePlugin, parseVersionRange, satisfiesVersionRange, compareVersions } from './define-plugin.js';
export {
  CURRENT_PLUGIN_API_VERSION,
  SUPPORTED_PLUGIN_API_MAJORS,
  normalizePluginApiVersion,
  assertSupportedPluginApiVersion,
} from './api-version.js';
export {
  buildCapabilityIndex,
  resolvePluginDependencies,
  canRunInRealm,
  canRunInProfile,
  findPluginsByCapability,
  hasCapability,
  validateDependencies,
  printDependencyTree,
} from './capability-matcher.js';
export {
  createStateRegistry,
  createStateAccessor,
  StateScope,
} from './state-registry.js';
