/**
 * Profile Factory - Profile 创建和管理
 * 
 * 负责：
 * 1. 创建和配置 Profile
 * 2. 生成 Profile Lock Plan
 * 3. 验证和加载 Lock Plan
 * 4. Profile 继承和组合
 */

import { createHash } from 'node:crypto';
import { validateProfileManifest, validateProfileLockPlan } from './profile-schema.js';

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
 * 生成 Profile Lock Plan
 * 
 * @param {Profile} profile - Profile
 * @param {Map<string, Plugin[]>} availablePlugins - 可用插件（plugin-id -> versions）
 * @param {Object} hostCapabilities - 宿主能力
 * @returns {ProfileLockPlan}
 */
export function generateProfileLockPlan(profile, availablePlugins, hostCapabilities) {
  // 简化版：直接从 profile.plugins 构建 lock plan
  // TODO: 实现完整的依赖解析（使用 PluginResolver）
  
  const pluginLocks = [];
  
  for (let i = 0; i < profile.plugins.length; i++) {
    const pluginRef = profile.plugins[i];
    const versions = availablePlugins.get(pluginRef.id);
    
    if (!versions || versions.length === 0) {
      if (!pluginRef.optional) {
        throw new Error(
          `Required plugin "${pluginRef.id}" is not available`
        );
      }
      continue;
    }
    
    // 选择版本
    let selectedVersion;
    
    if (pluginRef.exactVersion) {
      selectedVersion = versions.find(p => p.version === pluginRef.exactVersion);
    } else if (profile.pluginPins && profile.pluginPins[pluginRef.id]) {
      selectedVersion = versions.find(
        p => p.version === profile.pluginPins[pluginRef.id]
      );
    } else {
      // 使用第一个匹配的版本
      selectedVersion = versions[0];
    }
    
    if (!selectedVersion) {
      if (!pluginRef.optional) {
        throw new Error(
          `Cannot find compatible version for plugin "${pluginRef.id}"`
        );
      }
      continue;
    }
    
    pluginLocks.push({
      id: selectedVersion.id,
      version: selectedVersion.version,
      provides: (selectedVersion.provides || []).map(p => 
        typeof p === 'string' ? p : p.name
      ),
      installOrder: i,
    });
  }
  
  // 计算 profile digest
  const profileDigest = computeProfileDigest(profile);
  
  // 创建 lock plan
  const lockPlan = {
    schema: 'nv8.lock/v1',
    profileId: profile.id,
    profileVersion: profile.version,
    profileDigest,
    createdAt: new Date().toISOString(),
    plugins: pluginLocks,
    config: profile.config || {},
    host: {
      nodeVersion: process.versions.node,
      v8Version: process.versions.v8,
      features: hostCapabilities || {},
    },
    digest: '', // 稍后计算
  };
  
  // 计算摘要
  lockPlan.digest = computeLockPlanDigest(lockPlan);
  
  return Object.freeze(lockPlan);
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

/**
 * 计算 Lock Plan 摘要
 * 
 * @param {ProfileLockPlan} lockPlan - Lock plan（不含 digest 字段）
 * @returns {string} SHA-256 hex digest
 */
function computeLockPlanDigest(lockPlan) {
  // 创建规范化的 JSON（排除 digest 字段）
  const { digest, ...planWithoutDigest } = lockPlan;
  
  const canonical = JSON.stringify(planWithoutDigest, (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // 对象键按字典序排序
      return Object.keys(value)
        .sort()
        .reduce((sorted, k) => {
          sorted[k] = value[k];
          return sorted;
        }, {});
    }
    return value;
  });
  
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/**
 * 验证 Profile Lock Plan
 * 
 * @param {ProfileLockPlan} lockPlan - Lock plan
 * @param {Object} currentHost - 当前宿主信息
 * @returns {ValidationResult}
 */
export function validateLockPlan(lockPlan, currentHost) {
  const errors = [];
  const warnings = [];
  
  try {
    validateProfileLockPlan(lockPlan);
  } catch (err) {
    errors.push(`Lock plan validation failed: ${err.message}`);
    return { valid: false, errors, warnings };
  }
  
  // 验证摘要
  const computedDigest = computeLockPlanDigest(lockPlan);
  if (computedDigest !== lockPlan.digest) {
    errors.push(
      `Lock plan digest mismatch: expected ${lockPlan.digest}, got ${computedDigest}`
    );
  }
  
  // 检查 Node 版本兼容性
  if (currentHost && currentHost.nodeVersion) {
    const currentNodeMajor = parseInt(currentHost.nodeVersion.split('.')[0], 10);
    const lockNodeMajor = parseInt(lockPlan.host.nodeVersion.split('.')[0], 10);
    
    if (currentNodeMajor !== lockNodeMajor) {
      warnings.push(
        `Node major version mismatch: lock plan was created with Node ${lockPlan.host.nodeVersion}, ` +
        `current is ${currentHost.nodeVersion}`
      );
    }
  }
  
  // 检查宿主能力差异
  if (currentHost && currentHost.features) {
    const lockFeatures = lockPlan.host.features || {};
    const currentFeatures = currentHost.features || {};
    
    for (const [feature, required] of Object.entries(lockFeatures)) {
      if (required && !currentFeatures[feature]) {
        errors.push(
          `Required host feature "${feature}" is not available in current environment`
        );
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 从 Lock Plan 加载 Profile
 * 
 * @param {ProfileLockPlan} lockPlan - Lock plan
 * @param {Map<string, Plugin[]>} availablePlugins - 可用插件
 * @returns {Profile}
 */
export function loadProfileFromLockPlan(lockPlan, availablePlugins) {
  validateProfileLockPlan(lockPlan);
  
  // 从 lock plan 重建插件引用
  const plugins = lockPlan.plugins.map(lock => ({
    id: lock.id,
    exactVersion: lock.version,
  }));
  
  // 创建 pluginPins
  const pluginPins = {};
  for (const lock of lockPlan.plugins) {
    pluginPins[lock.id] = lock.version;
  }
  
  return createProfile({
    id: lockPlan.profileId,
    version: lockPlan.profileVersion,
    name: `Locked Profile (${lockPlan.profileId})`,
    description: `Profile loaded from lock plan created at ${lockPlan.createdAt}`,
    plugins,
    pluginPins,
    config: lockPlan.config,
    nodeSupport: {
      minimum: lockPlan.host.nodeVersion,
      tested: [lockPlan.host.nodeVersion],
    },
  });
}

/**
 * 保存 Lock Plan 到文件
 * 
 * @param {ProfileLockPlan} lockPlan - Lock plan
 * @param {string} filePath - 文件路径
 * @returns {Promise<void>}
 */
export async function saveLockPlan(lockPlan, filePath) {
  const fs = await import('node:fs/promises');
  const content = JSON.stringify(lockPlan, null, 2);
  await fs.writeFile(filePath, content, 'utf8');
}

/**
 * 从文件加载 Lock Plan
 * 
 * @param {string} filePath - 文件路径
 * @returns {Promise<ProfileLockPlan>}
 */
export async function loadLockPlan(filePath) {
  const fs = await import('node:fs/promises');
  const content = await fs.readFile(filePath, 'utf8');
  const lockPlan = JSON.parse(content);
  validateProfileLockPlan(lockPlan);
  return lockPlan;
}
