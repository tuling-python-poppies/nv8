/**
 * Evidence Bundle schema compatibility policy.
 *
 * Bundle schema versions use `major.minor`. A loader may read an older minor
 * version within the same major only when the caller explicitly enables legacy
 * compatibility. Newer minors are never guessed at: they may add required
 * fields whose meaning this loader does not know.
 */

export const SUPPORTED_SCHEMA_VERSIONS = Object.freeze(['1.0']);

export function parseSchemaVersion(version) {
  if (typeof version !== 'string' || !/^\d+\.\d+$/.test(version)) {
    return null;
  }
  const [major, minor] = version.split('.').map(Number);
  return { major, minor, value: version };
}

export function compareSchemaVersions(left, right) {
  const a = parseSchemaVersion(left);
  const b = parseSchemaVersion(right);
  if (a === null || b === null) {
    throw new TypeError('schema versions must use major.minor format');
  }
  return a.major - b.major || a.minor - b.minor;
}

/**
 * Classify a bundle version against the versions this loader knows.
 *
 * `compatible-legacy` is opt-in because accepting an old schema without an
 * explicit migration audit can hide missing fields. The current schema is
 * always `current`; every other result must be handled by the caller.
 */
export function resolveSchemaCompatibility(
  version,
  supportedVersions = SUPPORTED_SCHEMA_VERSIONS,
  { allowLegacy = true } = {},
) {
  const candidate = parseSchemaVersion(version);
  if (candidate === null) return { compatible: false, reason: 'invalid' };

  const supported = supportedVersions
    .map(parseSchemaVersion)
    .filter(Boolean)
    .sort((a, b) => b.major - a.major || b.minor - a.minor);
  const current = supported[0];
  if (current === undefined) throw new TypeError('supportedVersions must not be empty');

  if (candidate.value === current.value) {
    return { compatible: true, mode: 'current', version: candidate.value };
  }
  if (candidate.major !== current.major) {
    return { compatible: false, reason: 'major-mismatch' };
  }
  if (candidate.minor > current.minor) {
    return { compatible: false, reason: 'newer-minor' };
  }
  if (!allowLegacy) {
    return { compatible: false, reason: 'legacy-disabled' };
  }
  return { compatible: true, mode: 'compatible-legacy', version: candidate.value };
}

export function isSchemaVersionCompatible(version, options = {}) {
  return resolveSchemaCompatibility(version, options.supportedVersions, options).compatible;
}
