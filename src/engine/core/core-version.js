/**
 * Core release and compatibility policy.
 *
 * Core follows SemVer independently from Plugin SDK, Evidence and Frame
 * Protocol. The repository is private for now, so this small implementation
 * deliberately supports the range forms needed by manifests and lock plans.
 */
export const CORE_VERSION = '0.1.0';

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
    case '^': return actual.major === requested.major
      && (requested.major !== 0 || actual.minor === requested.minor)
      && (requested.major !== 0 || requested.minor !== 0 || actual.patch === requested.patch)
      && compare(actual, requested) >= 0;
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

function compare(left, right) {
  return left.major - right.major
    || left.minor - right.minor
    || left.patch - right.patch;
}

function sameVersion(left, right) {
  return compare(left, right) === 0;
}
