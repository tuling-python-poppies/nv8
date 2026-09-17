/**
 * Profile Factory - Profile 创建和管理
 * 
 * 负责：
 * 1. 创建和配置 Profile
 * 2. Profile 继承和组合
 *
 * 插件装配的 Lock Plan 由 `engine/core/plugin-lock-plan.js` 统一实现
 * （`nv8.plugin-lock/v1`），不再在 config 层保留第二套简化方案。
 */

import { createHash } from 'node:crypto';
import { validateProfileManifest } from './profile-schema.js';

/**
 * 创建 Profile
 * 
 * @param {ProfileManifest|string} manifestOrId - Profile manifest 或 profile ID
 * @returns {Profile}
 */
export function createProfile(manifestOrId) {
  // 如果传入字符串，从内置 profiles 查找
  if (typeof manifestOrId === 'string') {
    const builtIn = getBuiltInProfile(manifestOrId);
    if (builtIn) {
      return builtIn;
    }
    
    // 如果找不到，创建一个简化的 profile
    return createProfile({
      id: manifestOrId,
      version: '0.0.0',
      name: manifestOrId,
      plugins: [],
    });
  }
  
  // 处理 base 继承
  if (manifestOrId.base) {
    const baseProfile = getBuiltInProfile(manifestOrId.base);
    if (!baseProfile) {
      throw new Error(`Base profile "${manifestOrId.base}" not found`);
    }
    
    // 继承 base profile 并覆盖
    const { base, ...overrides } = manifestOrId;
    const manifest = {
      ...baseProfile,
      ...overrides,
      plugins: [...(baseProfile.plugins || []), ...(overrides.plugins || [])],
      config: {
        ...(baseProfile.config || {}),
        ...(overrides.config || {}),
      },
    };
    
    return createProfileInternal(manifest);
  }
  
  return createProfileInternal(manifestOrId);
}

/**
 * 获取内置 Profile（延迟加载避免循环依赖）
 * 
 * @param {string} id - Profile ID
 * @returns {Profile|null}
 */
function getBuiltInProfile(id) {
  // 直接从全局注册表获取，避免循环依赖
  // built-in-profiles.js 在模块加载时会注册到 profileRegistry
  if (!globalThis.__NV8_PROFILE_REGISTRY__) {
    globalThis.__NV8_PROFILE_REGISTRY__ = {};
  }
  
  return globalThis.__NV8_PROFILE_REGISTRY__[id] || null;
}

/**
 * 内部：创建 Profile（不处理继承）
 * 
 * @param {ProfileManifest} manifest - Profile manifest
 * @returns {Profile}
 */
function createProfileInternal(manifest) {
  // Ensure required fields exist with defaults
  const normalizedManifest = {
    version: '0.0.0',
    name: manifest.id || 'Custom Profile',
    description: '',
    ...manifest,
    plugins: manifest.plugins || [],
  };
  
  validateProfileManifest(normalizedManifest);
  
  // Calculate profile digest
  const digest = computeProfileDigest(normalizedManifest);
  
  return Object.freeze({
    schema: 'nv8.profile/v1',
    ...normalizedManifest,
    digest,
    
    /**
     * 继承另一个 Profile
     * 
     * @param {Profile} baseProfile - 基础 Profile
     * @returns {Profile}
     */
    extend(baseProfile) {
      const extended = createProfile({
        ...baseProfile,
        ...manifest,
        plugins: [...(baseProfile.plugins || []), ...(manifest.plugins || [])],
        pluginPins: {
          ...(baseProfile.pluginPins || {}),
          ...(manifest.pluginPins || {}),
        },
        config: {
          ...(baseProfile.config || {}),
          ...(manifest.config || {}),
        },
        degradations: [
          ...(baseProfile.degradations || []),
          ...(manifest.degradations || []),
        ],
      });
      // Remove schema from nested call to avoid duplication
      const { schema, ...rest } = extended;
      return { schema: 'nv8.profile/v1', ...rest };
    },
    
    /**
     * 覆盖配置
     * 
     * @param {Object} overrides - 配置覆盖
     * @returns {Profile}
     */
    withConfig(overrides) {
      return createProfile({
        ...manifest,
        config: {
          ...(manifest.config || {}),
          ...overrides,
        },
      });
    },
    
    /**
     * 添加插件
     * 
     * @param {PluginReference[]} additionalPlugins - 额外插件
     * @returns {Profile}
     */
    withPlugins(additionalPlugins) {
      return createProfile({
        ...manifest,
        plugins: [...(manifest.plugins || []), ...additionalPlugins],
      });
    },
  });
}

/**
 * 计算 Profile 摘要
 * 
 * @param {Profile} profile - Profile
 * @returns {string} SHA-256 hex digest
 */
function computeProfileDigest(profile) {
  const canonical = JSON.stringify(
    {
      id: profile.id,
      version: profile.version,
      plugins: profile.plugins,
      config: profile.config,
    },
    (key, value) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value)
          .sort()
          .reduce((sorted, k) => {
            sorted[k] = value[k];
            return sorted;
          }, {});
      }
      return value;
    }
  );
  
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}
