/**
 * Realm-scoped Crypto state management
 * 
 * Manages per-Realm crypto random state and key storage.
 */

const cryptoObjects = new WeakSet();
const subtleObjects = new WeakSet();
const keyState = new WeakMap();
const cryptoRealms = new WeakMap();
const subtleRealms = new WeakMap();

// Per-Realm crypto state storage
const realmCryptoState = new WeakMap();

/**
 * Initialize crypto state for a Realm.
 *
 * `entropy` 是宿主在 Realm 外准备好、经 moduleLoader 传进来的熵源，形如
 * `{ randomFill(bytes), randomUUID() }`。Plugin 路径由 `cryptoPlugin.activate`
 * 从 `node:crypto` 注入；legacy bootstrap 拿不到宿主对象时保持为 null，
 * 由 `crypto-runtime.js` 用按 Realm 采集的种子初始化 HMAC-DRBG。
 *
 * 迁移前这里保存的是固定种子 0x6d2b79f5 的 xorshift32 状态——每个 Realm
 * 的随机序列完全一样，跨沙箱可预测，等于没有随机源。
 *
 * @param {object} realm
 * @param {{randomFill?: Function, randomUUID?: Function}|null} [entropy]
 */
export function initializeCryptoState(realm, entropy = null) {
  const existing = realmCryptoState.get(realm);
  if (existing !== undefined) {
    if (existing.entropy === null && entropy !== null) {
      existing.entropy = normalizeEntropy(entropy);
    }
    return existing;
  }

  const state = {
    // 宿主熵源；没有时由 crypto-runtime.js 的 DRBG 兜底。
    entropy: normalizeEntropy(entropy),
    // HMAC-SHA256 DRBG 延迟创建——没有宿主熵源时才需要。
    drbg: null,
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
 * 过滤宿主熵源：只有真的可调用才接受，避免把页面对象误当熵源。
 *
 * @param {{randomFill?: Function, randomUUID?: Function}|null|undefined} value
 * @returns {{randomFill?: Function, randomUUID?: Function}|null}
 */
function normalizeEntropy(value) {
  if (value === null || typeof value !== "object") return null;
  const randomFill = typeof value.randomFill === "function"
    ? value.randomFill
    : null;
  const randomUUID = typeof value.randomUUID === "function"
    ? value.randomUUID
    : null;
  if (randomFill === null && randomUUID === null) return null;
  return Object.freeze({ randomFill, randomUUID });
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

export function associateCryptoRealm(value, realm, subtle = false) {
  (subtle ? subtleRealms : cryptoRealms).set(value, realm);
}

export function getCryptoRealm(value, subtle = false) {
  const realm = (subtle ? subtleRealms : cryptoRealms).get(value);
  if (realm === undefined) throw new TypeError("Illegal invocation");
  return realm;
}

/**
 * Set key state for a CryptoKey
 */
export function setKeyState(key, state) {
  keyState.set(key, state);
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
