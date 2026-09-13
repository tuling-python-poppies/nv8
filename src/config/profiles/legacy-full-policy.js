/**
 * legacy-full 维护策略。
 *
 * legacy-full 是兼容入口，不是 plugin 模式的覆盖率竞赛目标。它必须保持
 * 可复现、可回滚，并且每次表面或 bootstrap 变更都要经过完整 baseline 门禁。
 */

export const LEGACY_FULL_POLICY = Object.freeze({
  profileId: 'legacy-full',
  status: 'maintained-compatibility',
  releasePolicy: 'bugfix-and-parity-only',
  pluginDrift: 'fail-closed',
  requiredBaseline: Object.freeze([
    'edge-behavior',
    'edge-members',
    'edge-surface',
    'bootstrap-order',
  ]),
  supportedNodeMajors: Object.freeze([18, 20, 22, 24]),
});

/**
 * 检查 legacy-full 的维护元数据是否仍然符合策略。
 *
 * @param {object} profile
 * @returns {Readonly<object>}
 */
export function validateLegacyFullPolicy(profile) {
  if (!profile || profile.id !== LEGACY_FULL_POLICY.profileId) {
    throw new TypeError('legacy-full policy requires the legacy-full profile');
  }
  if (profile.experimental !== true) {
    throw new Error('legacy-full must remain explicitly experimental');
  }
  if (profile.config?.legacy?.compatibilityMode !== true
    || profile.config?.legacy?.bootstrapBehavior !== 'preserve') {
    throw new Error('legacy-full must preserve legacy bootstrap compatibility');
  }
  const maintenance = profile.maintenance;
  if (maintenance?.policy !== LEGACY_FULL_POLICY.releasePolicy
    || maintenance.pluginDrift !== LEGACY_FULL_POLICY.pluginDrift
    || JSON.stringify(maintenance.requiredBaselines) !== JSON.stringify(LEGACY_FULL_POLICY.requiredBaseline)) {
    throw new Error('legacy-full maintenance metadata does not match its compatibility policy');
  }
  const testedMajors = new Set(
    (profile.nodeSupport?.tested ?? []).map(version => Number.parseInt(version, 10)),
  );
  if (LEGACY_FULL_POLICY.supportedNodeMajors.some(major => !testedMajors.has(major))) {
    throw new Error('legacy-full must declare tested Node versions for every supported major');
  }
  const pluginIds = new Set((profile.plugins ?? []).map(plugin => plugin.id ?? plugin));
  for (const required of ['@nv8/plugin-webidl', '@nv8/plugin-window', '@nv8/plugin-worker']) {
    if (!pluginIds.has(required)) {
      throw new Error(`legacy-full is missing required compatibility plugin ${required}`);
    }
  }
  if (!Array.isArray(profile.nodeSupport?.tested)
    || profile.nodeSupport.tested.length === 0) {
    throw new Error('legacy-full must declare at least one tested Node version');
  }
  return Object.freeze({
    profileId: LEGACY_FULL_POLICY.profileId,
    releasePolicy: LEGACY_FULL_POLICY.releasePolicy,
    requiredBaseline: [...LEGACY_FULL_POLICY.requiredBaseline],
  });
}
