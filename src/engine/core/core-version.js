/**
 * Core release and compatibility policy.
 *
 * Core follows SemVer independently from Plugin SDK, Evidence and Frame
 * Protocol. The repository is private for now, so this small implementation
 * deliberately supports the range forms needed by manifests and lock plans.
 */
export const CORE_VERSION = '0.1.0';
export const CORE_VERSION_POLICY = Object.freeze({
  major: 'breaking public API or behavior contract',
  minor: 'backward-compatible public capability',
  patch: 'backward-compatible fix or parity correction',
});

export function parseCoreVersion(value) {
  if (typeof value !== 'string' || !/^\d+\.\d+\.\d+$/.test(value)) {
    throw new TypeError(`Core version must be SemVer major.minor.patch: "${value}"`);
  }
  const parts = value.split('.').map(Number);
  if (parts.some(part => !Number.isSafeInteger(part))) {
    throw new TypeError(`Core version is outside the safe integer range: "${value}"`);
  }
  return Object.freeze({ major: parts[0], minor: parts[1], patch: parts[2] });
}

export function assertCoreVersion(value = CORE_VERSION) {
  parseCoreVersion(value);
  return value;
}

export function satisfiesCoreVersionRange(version, range) {
  const actual = parseCoreVersion(version);
  if (typeof range !== 'string' || range.length === 0) return false;
  if (range === '*') return true;

  const operator = range.match(/^(\^|~|>=|>|<=|<)?(\d+\.\d+\.\d+)$/);
  if (!operator) return false;
  const requested = parseCoreVersion(operator[2]);
  switch (operator[1] ?? '=') {
    case '=': return sameVersion(actual, requested);
    case '^': return actual.major === requested.major && compare(actual, requested) >= 0;
    case '~': return actual.major === requested.major
      && actual.minor === requested.minor
      && compare(actual, requested) >= 0;
    case '>=': return compare(actual, requested) >= 0;
    case '>': return compare(actual, requested) > 0;
    case '<=': return compare(actual, requested) <= 0;
    case '<': return compare(actual, requested) < 0;
    default: return false;
  }
}

export function assertCoreVersionSatisfies(range, version = CORE_VERSION) {
  assertCoreVersion(version);
  if (!satisfiesCoreVersionRange(version, range)) {
    const error = new Error(
      `Core version "${version}" does not satisfy required range "${range}"`,
    );
    error.code = 'CORE_VERSION_UNSUPPORTED';
    error.version = version;
    error.range = range;
    throw error;
  }
  return version;
}

function compare(left, right) {
  return left.major - right.major
    || left.minor - right.minor
    || left.patch - right.patch;
}

function sameVersion(left, right) {
  return compare(left, right) === 0;
}
