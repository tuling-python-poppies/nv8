import {
  CAPABILITY_STATUS,
  hostCapabilityStatus,
} from '../../engine/core/host-capabilities.js';

export const PROFILE_CAPABILITY_POLICIES = Object.freeze({
  DEGRADE: 'degrade',
  STRICT: 'strict',
  IGNORE: 'ignore',
});

/**
 * Resolve profile host requirements before any Realm is created.
 * Required capabilities always fail. Optional capabilities become explicit
 * diagnostics unless strict policy is requested.
 */
export function resolveProfileCapabilities(
  profile = {},
  hostCapabilities,
  { policy = PROFILE_CAPABILITY_POLICIES.DEGRADE } = {},
) {
  if (!Object.values(PROFILE_CAPABILITY_POLICIES).includes(policy)) {
    throw new TypeError(`unknown profile capability policy: ${policy}`);
  }
  const required = normalizeCapabilityList(profile.requiredCapabilities);
  const declaredDegradations = (profile.degradations ?? [])
    .map(item => item?.capability)
    .filter(id => typeof id === 'string');
  const optional = normalizeCapabilityList([
    ...(profile.optionalCapabilities ?? []),
    ...declaredDegradations,
  ]).filter(id => !required.includes(id));
  const problems = [];
  const degradations = [];

  for (const featureId of required) {
    const status = hostCapabilityStatus(hostCapabilities, featureId);
    if (status.status !== CAPABILITY_STATUS.AVAILABLE) {
      problems.push({ featureId, required: true, ...status });
    }
  }
  for (const featureId of optional) {
    const status = hostCapabilityStatus(hostCapabilities, featureId);
    if (status.status === CAPABILITY_STATUS.AVAILABLE) continue;
    const declared = (profile.degradations ?? []).find(item => item.capability === featureId);
    degradations.push(Object.freeze({
      capability: featureId,
      status: status.status,
      behavior: declared?.behavior ?? 'Capability is unavailable; profile-specific fallback applies',
      reason: declared?.reason ?? status.reason,
    }));
    if (policy === PROFILE_CAPABILITY_POLICIES.STRICT) {
      problems.push({ featureId, required: false, ...status });
    }
  }

  if (problems.length > 0) {
    const error = new Error(
      `Profile "${profile.id ?? 'default'}" cannot run with the selected host capabilities: `
      + problems.map(item => `${item.featureId} (${item.status}: ${item.reason})`).join('; '),
    );
    error.code = 'PROFILE_CAPABILITY_UNAVAILABLE';
    error.context = Object.freeze({
      profileId: profile.id ?? 'default',
      policy,
      problems: Object.freeze(problems.map(item => Object.freeze({ ...item }))),
    });
    error.suggestions = Object.freeze(problems.map(item => (
      item.required
        ? `Choose a host with "${item.featureId}" or remove it from requiredCapabilities`
        : `Choose degrade policy or remove "${item.featureId}" from optionalCapabilities`
    )));
    throw error;
  }

  return Object.freeze({
    policy,
    required: Object.freeze([...required]),
    optional: Object.freeze([...optional]),
    degradations: Object.freeze(degradations),
  });
}

function normalizeCapabilityList(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new TypeError('profile capabilities must be arrays');
  const result = [];
  for (const id of value) {
    if (typeof id !== 'string' || id.length === 0 || id.length > 128) {
      throw new TypeError('profile capability ids must be non-empty strings');
    }
    if (!result.includes(id)) result.push(id);
  }
  return result.sort();
}
