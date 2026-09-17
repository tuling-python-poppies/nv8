import { createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';

const PLUGIN_LOCK_SIGNATURE_ALGORITHM = 'ed25519';

/**
 * Sign a lock plan without embedding a trust root in the plan.
 * The caller owns key distribution and must provide the public key for verify.
 */
export function signPluginLockPlan(plan, { keyId, privateKey }) {
  assertKeyId(keyId);
  if (privateKey === undefined || privateKey === null) {
    throw new TypeError('privateKey is required to sign a plugin lock plan');
  }
  const unsigned = withoutSignature(plan);
  const signature = sign(null, Buffer.from(canonicalJson(unsigned), 'utf8'), privateKey);
  return Object.freeze({
    ...unsigned,
    signature: Object.freeze({
      algorithm: PLUGIN_LOCK_SIGNATURE_ALGORITHM,
      keyId,
      value: signature.toString('base64'),
    }),
  });
}

/**
 * Verify a plan using a caller-supplied public key. Returns false for an
 * unsigned plan or an unknown/malformed signature, and never trusts key data
 * carried by the plan itself.
 */
export function verifyPluginLockPlan(plan, { keyId, publicKey }) {
  if (plan === null || typeof plan !== 'object') return false;
  if (plan.signature === undefined || plan.signature === null) return false;
  if (plan.signature.algorithm !== PLUGIN_LOCK_SIGNATURE_ALGORITHM) return false;
  if (typeof plan.signature.keyId !== 'string' || plan.signature.keyId !== keyId) return false;
  if (typeof plan.signature.value !== 'string' || publicKey === undefined || publicKey === null) {
    return false;
  }
  // Node's verify() also accepts a private KeyObject; reject it explicitly so
  // the verification boundary cannot accidentally receive signing material.
  if (publicKey?.type === 'private') return false;
  try {
    const signature = Buffer.from(plan.signature.value, 'base64');
    return verify(
      null,
      Buffer.from(canonicalJson(withoutSignature(plan)), 'utf8'),
      publicKey,
      signature,
    );
  } catch {
    return false;
  }
}

export function assertPluginLockSignature(plan, options) {
  if (!verifyPluginLockPlan(plan, options)) {
    const error = new Error('Plugin lock plan signature is missing or invalid');
    error.code = 'PLUGIN_LOCK_SIGNATURE_INVALID';
    throw error;
  }
  return plan;
}

function assertKeyId(keyId) {
  if (typeof keyId !== 'string' || keyId.length === 0 || keyId.length > 128) {
    throw new TypeError('keyId must be a non-empty string of at most 128 characters');
  }
}

function withoutSignature(plan) {
  if (plan === null || typeof plan !== 'object' || Array.isArray(plan)) {
    throw new TypeError('plugin lock plan must be an object');
  }
  const { signature: ignored, ...unsigned } = plan;
  return unsigned;
}

function canonicalJson(value, path = [], seen = new Set()) {
  if (value === null) return 'null';
  const type = typeof value;
  if (type === 'string' || type === 'boolean' || type === 'number') {
    if (type === 'number' && !Number.isFinite(value)) throw new TypeError('non-finite lock value');
    return JSON.stringify(value === 0 ? 0 : value);
  }
  if (type !== 'object') throw new TypeError(`unsupported lock value at ${path.join('.')}`);
  if (seen.has(value)) throw new TypeError('circular plugin lock plan');
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      return `[${value.map((item, index) => canonicalJson(item, [...path, index], seen)).join(',')}]`;
    }
    const keys = Object.keys(value).filter(key => value[key] !== undefined).sort();
    return `{${keys.map(key => `${JSON.stringify(key)}:${canonicalJson(value[key], [...path, key], seen)}`).join(',')}}`;
  } finally {
    seen.delete(value);
  }
}
