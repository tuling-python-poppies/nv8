/**
 * Profile Module - 统一导出
 */

export { createProfile, generateProfileLockPlan, validateLockPlan, loadProfileFromLockPlan, saveLockPlan, loadLockPlan } from './profile-factory.js';
export { validateProfileManifest, validateProfileLockPlan } from './profile-schema.js';
export { resolveProfileCapabilities, PROFILE_CAPABILITY_POLICIES } from './capability-policy.js';
export { LEGACY_FULL_POLICY, validateLegacyFullPolicy } from './legacy-full-policy.js';
export { createProfileRegistry } from './profile-registry.js';
import {
  minimalProfile,
  minimalFetchProfile,
  domReplayProfile,
  legacyFullProfile,
  browserProfileForEdgeVersion150,
} from './built-in-profiles.js';

export {
  minimalProfile,
  minimalFetchProfile,
  domReplayProfile,
  legacyFullProfile,
  browserProfileForEdgeVersion150,
};

/**
 * profiles registry - 导出所有内置 profiles
 */
export const profiles = {
  'minimal': minimalProfile,
  'minimal-fetch': minimalFetchProfile,
  'dom-replay': domReplayProfile,
  'legacy-full': legacyFullProfile,
  'browser-profile-edge-v150': browserProfileForEdgeVersion150,
};
