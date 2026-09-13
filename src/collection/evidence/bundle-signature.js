/**
 * Evidence Bundle manifest signatures.
 *
 * Signatures cover the canonical JSON form of the manifest with its `signature`
 * field removed. The public key is deliberately not taken from the manifest:
 * callers must provide a trusted key by keyId, otherwise a bundle could trust
 * a key that it supplied itself.
 */

import {
  createPrivateKey,
  createPublicKey,
  KeyObject,
  sign,
  verify,
} from 'node:crypto';
import { canonicalJson } from '../request-protocol/canonical-json.js';

export const BUNDLE_SIGNATURE_ALGORITHM = 'ed25519';
export const BUNDLE_SIGNATURE_VERSION = 1;

function unsignedManifest(manifest) {
  if (manifest === null || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new TypeError('manifest must be an object');
  }
  const { signature: _signature, ...unsigned } = manifest;
  return unsigned;
}

function signingBytes(manifest) {
  return Buffer.from(canonicalJson(unsignedManifest(manifest)), 'utf8');
}

function normalizeKeyId(keyId) {
  if (typeof keyId !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(keyId)) {
    throw new TypeError('keyId must contain 1-128 safe identifier characters');
  }
  return keyId;
}

function keyObject(key, kind) {
  if (key instanceof KeyObject) return key;
  try {
    return kind === 'private' ? createPrivateKey(key) : createPublicKey(key);
  } catch (error) {
    throw new TypeError(`invalid ${kind} key`, { cause: error });
  }
}

/**
 * Return a signed manifest copy. The private key may be a PEM/DER key or a
 * Node KeyObject. The returned signature contains no public key material.
 */
export function signEvidenceManifest(manifest, privateKey, { keyId } = {}) {
  const normalizedKeyId = normalizeKeyId(keyId);
  const key = keyObject(privateKey, 'private');
  if (key.asymmetricKeyType !== BUNDLE_SIGNATURE_ALGORITHM) {
    throw new TypeError('private key must be an Ed25519 key');
  }
  const signature = sign(null, signingBytes(manifest), key).toString('base64');
  return {
    ...unsignedManifest(manifest),
    signature: {
      version: BUNDLE_SIGNATURE_VERSION,
      algorithm: BUNDLE_SIGNATURE_ALGORITHM,
      keyId: normalizedKeyId,
      value: signature,
    },
  };
}

/**
 * Verify a manifest against a caller-supplied trusted key map or iterable of
 * [keyId, key] pairs. Returns structured verification metadata on success.
 */
export function verifyEvidenceManifest(manifest, trustedKeys) {
  const signature = manifest?.signature;
  if (signature === null || typeof signature !== 'object' || Array.isArray(signature)) {
    return { valid: false, reason: 'missing-signature' };
  }
  if (signature.version !== BUNDLE_SIGNATURE_VERSION) {
    return { valid: false, reason: 'unsupported-version' };
  }
  if (signature.algorithm !== BUNDLE_SIGNATURE_ALGORITHM) {
    return { valid: false, reason: 'unsupported-algorithm' };
  }
  try {
    normalizeKeyId(signature.keyId);
  } catch {
    return { valid: false, reason: 'invalid-key-id' };
  }
  if (!isBase64(signature.value)) {
    return { valid: false, reason: 'invalid-signature' };
  }

  const key = trustedKey(trustedKeys, signature.keyId);
  if (key === undefined) return { valid: false, reason: 'untrusted-key' };
  try {
    const publicKey = keyObject(key, 'public');
    if (publicKey.asymmetricKeyType !== BUNDLE_SIGNATURE_ALGORITHM) {
      return { valid: false, reason: 'invalid-key-type' };
    }
    const valid = verify(
      null,
      signingBytes(manifest),
      publicKey,
      Buffer.from(signature.value, 'base64'),
    );
    return valid
      ? { valid: true, algorithm: signature.algorithm, keyId: signature.keyId }
      : { valid: false, reason: 'signature-mismatch' };
  } catch {
    return { valid: false, reason: 'invalid-signature' };
  }
}

function isBase64(value) {
  return typeof value === 'string'
    && value.length > 0
    && value.length % 4 === 0
    && /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

function trustedKey(trustedKeys, keyId) {
  if (trustedKeys instanceof Map) return trustedKeys.get(keyId);
  if (trustedKeys !== null && typeof trustedKeys === 'object') return trustedKeys[keyId];
  if (typeof trustedKeys !== 'string'
    && trustedKeys !== undefined
    && trustedKeys !== null
    && Symbol.iterator in Object(trustedKeys)) {
    for (const [candidate, key] of trustedKeys) {
      if (candidate === keyId) return key;
    }
  }
  return undefined;
}

export function manifestSigningBytes(manifest) {
  return signingBytes(manifest);
}
