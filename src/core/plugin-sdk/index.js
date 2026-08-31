/**
 * Plugin SDK - Index
 * 
 * 统一导出所有 Plugin SDK 模块
 */

export { definePlugin, parseVersionRange, satisfiesVersionRange, compareVersions } from './define-plugin.js';
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
