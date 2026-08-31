/**
 * Profile Registry - Profile 注册和管理
 * 
 * 负责：
 * 1. Profile 注册和版本管理
 * 2. Profile 查找和解析
 * 3. Lock Plan 缓存和验证
 */

import { validateProfileManifest } from './profile-schema.js';
import { generateProfileLockPlan, validateLockPlan } from './profile-factory.js';

/**
 * 创建 Profile Registry
 * 
 * @returns {ProfileRegistry}
 */
export function createProfileRegistry() {
  const profiles = new Map(); // profile-id -> Profile[]
  const lockPlanCache = new Map(); // cache-key -> ProfileLockPlan
  
  return {
    /**
     * 注册 Profile
     * 
     * @param {Profile} profile - Profile
     */
    register(profile) {
      validateProfileManifest(profile);
      
      if (!profiles.has(profile.id)) {
        profiles.set(profile.id, []);
      }
      
      const versions = profiles.get(profile.id);
      
      // 检查是否已经注册了相同版本
      const existing = versions.find(p => p.version === profile.version);
      if (existing) {
        throw new Error(
          `Profile "${profile.id}@${profile.version}" is already registered`
        );
      }
      
      versions.push(profile);
    },
    
    /**
     * 批量注册 Profile
     * 
     * @param {Profile[]} profileList - Profile 列表
     */
    registerAll(profileList) {
      for (const profile of profileList) {
        this.register(profile);
      }
    },
    
    /**
     * 查找 Profile
     * 
     * @param {string} profileId - Profile ID
     * @param {string} [version] - 版本（可选，默认最新版本）
     * @returns {Profile|null}
     */
    find(profileId, version = null) {
      const versions = profiles.get(profileId);
      if (!versions || versions.length === 0) {
        return null;
      }
      
      if (version) {
        return versions.find(p => p.version === version) || null;
      }
      
      // 返回最新版本（按语义版本排序）
      return versions.sort((a, b) => {
        return compareVersions(b.version, a.version);
      })[0];
    },
    
    /**
     * 获取所有已注册的 Profile
     * 
     * @returns {Profile[]}
     */
    getAll() {
      const allProfiles = [];
      for (const versions of profiles.values()) {
        allProfiles.push(...versions);
      }
      return allProfiles;
    },
    
    /**
     * 生成并缓存 Lock Plan
     * 
     * @param {Profile} profile - Profile
     * @param {Map<string, Plugin[]>} availablePlugins - 可用插件
     * @param {Object} hostCapabilities - 宿主能力
     * @returns {ProfileLockPlan}
     */
    generateLockPlan(profile, availablePlugins, hostCapabilities) {
      // 生成缓存键
      const cacheKey = computeCacheKey(profile, hostCapabilities);
      
      // 检查缓存
      if (lockPlanCache.has(cacheKey)) {
        return lockPlanCache.get(cacheKey);
      }
      
      // 生成新的 lock plan
      const lockPlan = generateProfileLockPlan(
        profile,
        availablePlugins,
        hostCapabilities
      );
      
      // 缓存
      lockPlanCache.set(cacheKey, lockPlan);
      
      return lockPlan;
    },
    
    /**
     * 验证 Lock Plan
     * 
     * @param {ProfileLockPlan} lockPlan - Lock plan
     * @param {Object} currentHost - 当前宿主信息
     * @returns {ValidationResult}
     */
    validateLockPlan(lockPlan, currentHost) {
      return validateLockPlan(lockPlan, currentHost);
    },
    
    /**
     * 清除 Lock Plan 缓存
     */
    clearLockPlanCache() {
      lockPlanCache.clear();
    },
    
    /**
     * 获取统计信息
     * 
     * @returns {Object}
     */
    getStats() {
      return {
        profileCount: profiles.size,
        totalVersions: Array.from(profiles.values()).reduce(
          (sum, versions) => sum + versions.length,
          0
        ),
        cachedLockPlans: lockPlanCache.size,
      };
    },
  };
}

/**
 * 计算缓存键
 * 
 * @param {Profile} profile - Profile
 * @param {Object} hostCapabilities - 宿主能力
 * @returns {string}
 */
function computeCacheKey(profile, hostCapabilities) {
  const hostKey = JSON.stringify({
    nodeVersion: process.versions.node,
    v8Version: process.versions.v8,
    features: hostCapabilities || {},
  });
  
  return `${profile.id}@${profile.version}:${createHash(hostKey)}`;
}

/**
 * 创建简单哈希（用于缓存键）
 * 
 * @param {string} input - 输入字符串
 * @returns {string}
 */
function createHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * 比较语义版本
 * 
 * @param {string} v1 - 版本 1
 * @param {string} v2 - 版本 2
 * @returns {number} 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(n => parseInt(n, 10));
  const parts2 = v2.split('.').map(n => parseInt(n, 10));
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  
  return 0;
}
