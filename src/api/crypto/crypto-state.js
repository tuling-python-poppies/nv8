/**
 * Realm-scoped Crypto state management
 * 
 * Manages per-Realm crypto random state and key storage.
 */

const cryptoObjects = new WeakSet();
const subtleObjects = new WeakSet();
const keyState = new WeakMap();

// Per-Realm crypto state storage
const realmCryptoState = new WeakMap();

/**
 * Initialize crypto state for a Realm
 */
export function initializeCryptoState(realm) {
  if (realmCryptoState.has(realm)) {
    return realmCryptoState.get(realm);
  }
  
  const state = {
    randomState: 0x6d2b79f5,
  };
  
  realmCryptoState.set(realm, state);
  return state;
}

/**
 * Get crypto state for a Realm
 */
export function getCryptoState(realm) {
  const state = realmCryptoState.get(realm);
  if (!state) {
    throw new Error('Crypto state not initialized for this Realm');
  }
  return state;
}

/**
 * Generate a random byte using the Realm's PRNG state
 */
export function randomByte(realm) {
  const state = getCryptoState(realm);
  state.randomState ^= state.randomState << 13;
  state.randomState ^= state.randomState >>> 17;
  state.randomState ^= state.randomState << 5;
  return state.randomState & 0xff;
}

/**
 * Mark a crypto object as valid
 */
export function markCryptoObject(crypto) {
  cryptoObjects.add(crypto);
}

/**
 * Mark a subtle crypto object as valid
 */
export function markSubtleObject(subtle) {
  subtleObjects.add(subtle);
}

/**
 * Check if value is a valid crypto object
 */
export function isCryptoObject(value) {
  return cryptoObjects.has(value);
}

/**
 * Check if value is a valid subtle crypto object
 */
export function isSubtleObject(value) {
  return subtleObjects.has(value);
}

/**
 * Set key state for a CryptoKey
 */
export function setKeyState(key, state) {
  keyState.set(key, state);
}

/**
 * Get key state for a CryptoKey
 */
export function getKeyState(key) {
  return keyState.get(key);
}

/**
 * Require a valid crypto object
 */
export function requireCrypto(value) {
  if (!cryptoObjects.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}

/**
 * Require a valid subtle crypto object
 */
export function requireSubtle(value) {
  if (!subtleObjects.has(value)) {
    throw new TypeError("Illegal invocation");
  }
}

/**
 * Require a valid crypto key and return its state
 */
export function requireKey(value) {
  const state = keyState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

/**
 * Clean up crypto state for a Realm
 */
export function cleanupCryptoState(realm) {
  realmCryptoState.delete(realm);
}
