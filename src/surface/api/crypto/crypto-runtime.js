import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { aesDecrypt, aesEncrypt } from "./aes.js";
import { sha1, sha384, sha512 } from "./hash.js";
import {
  initializeCryptoState,
  markCryptoObject,
  markSubtleObject,
  randomByte as realmRandomByte,
  requireCrypto,
  requireSubtle,
  requireKey,
  setKeyState,
} from "./crypto-state.js";

export function Crypto() {
  throw new TypeError("Illegal constructor");
}
export function SubtleCrypto() {
  throw new TypeError("Illegal constructor");
}
export function CryptoKey() {
  throw new TypeError("Illegal constructor");
}
for (const constructor of [Crypto, SubtleCrypto, CryptoKey]) {
  registerNativeFunction(constructor, constructor.name);
}

export function createCryptoObjects(realm) {
  // Initialize crypto state for this Realm
  initializeCryptoState(realm);
  
  const subtle = Object.create(SubtleCrypto.prototype);
  markSubtleObject(subtle);
  const crypto = Object.create(Crypto.prototype);
  markCryptoObject(crypto);
  
  // Store realm association
  crypto.__nv8Realm = realm;
  subtle.__nv8Realm = realm;
  
  return { crypto, subtle };
}

export function cryptoGetRandomValues(crypto, array) {
  requireCrypto(crypto);
  if (!ArrayBuffer.isView(array) || array instanceof DataView) {
    const detail = array instanceof DataView
      ? "ArrayBufferView is of type 'DataView', which is not an integer array type"
      : "ArrayBufferView is not an integer array type";
    throw new DOMException(
      `Failed to execute 'getRandomValues' on 'Crypto': The provided ${detail}.`,
      "TypeMismatchError",
    );
  }
  if (array.byteLength > 65_536) {
    throw new DOMException(
      `Failed to execute 'getRandomValues' on 'Crypto': The ArrayBufferView's byte length (${array.byteLength}) exceeds the number of bytes of entropy available via this API (65536).`,
      "QuotaExceededError",
    );
  }
  const realm = crypto.__nv8Realm;
  const bytes = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = realmRandomByte(realm);
  }
  return array;
}

export function cryptoRandomUUID(crypto) {
  requireCrypto(crypto);
  const bytes = cryptoGetRandomValues(crypto, new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}`
    + `-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}`
    + `-${hex.slice(10).join("")}`;
}

export function cryptoSubtle(crypto, subtle) {
  requireCrypto(crypto);
  return subtle;
}

export function cryptoKeyProperty(key, name) {
  const state = requireKey(key);
  return state[name];
}

export async function subtleDigest(subtle, algorithm, data) {
  requireSubtle(subtle);
  return toArrayBuffer(digestBytes(algorithmName(algorithm), bytesOf(data)));
}

export async function subtleEncrypt(subtle, algorithm, key, data) {
  requireSubtle(subtle);
  const state = requireKey(key);
  const name = algorithmName(algorithm);
  if (!name.startsWith("AES-") || state.algorithm.name !== name) unsupported();
  return toArrayBuffer(aesEncrypt(algorithm, state.bytes, bytesOf(data)));
}

export async function subtleDecrypt(subtle, algorithm, key, data) {
  requireSubtle(subtle);
  const state = requireKey(key);
  const name = algorithmName(algorithm);
  if (!name.startsWith("AES-") || state.algorithm.name !== name) unsupported();
  return toArrayBuffer(aesDecrypt(algorithm, state.bytes, bytesOf(data)));
}

export async function subtleImportKey(
  subtle,
  format,
  keyData,
  algorithm,
  extractable,
  keyUsages,
) {
  requireSubtle(subtle);
  if (`${format}` !== "raw") unsupported();
  const normalized = normalizeKeyAlgorithm(algorithm);
  return createKey(
    bytesOf(keyData),
    normalized,
    Boolean(extractable),
    normalizeUsages(keyUsages),
  );
}

export async function subtleExportKey(subtle, format, key) {
  requireSubtle(subtle);
  const state = requireKey(key);
  if (!state.extractable) {
    throw new DOMException("The key is not extractable.", "InvalidAccessError");
  }
  if (`${format}` !== "raw") unsupported();
  return toArrayBuffer(state.bytes);
}

export async function subtleSign(subtle, algorithm, key, data) {
  requireSubtle(subtle);
  const state = requireKey(key);
  if (algorithmName(algorithm) !== "HMAC" || state.algorithm.name !== "HMAC") {
    unsupported();
  }
  return toArrayBuffer(hmac(
    state.algorithm.hash.name,
    state.bytes,
    bytesOf(data),
  ));
}

export async function subtleVerify(subtle, algorithm, key, signature, data) {
  const actual = new Uint8Array(await subtleSign(subtle, algorithm, key, data));
  const expected = bytesOf(signature);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual[index] ^ expected[index];
  }
  return difference === 0;
}

export async function subtleWrapKey(
  subtle,
  format,
  key,
  wrappingKey,
  wrapAlgorithm,
) {
  const exported = await subtleExportKey(subtle, format, key);
  return subtleEncrypt(subtle, wrapAlgorithm, wrappingKey, exported);
}

export async function subtleUnwrapKey(
  subtle,
  format,
  wrappedKey,
  unwrappingKey,
  unwrapAlgorithm,
  unwrappedKeyAlgorithm,
  extractable,
  keyUsages,
) {
  const raw = await subtleDecrypt(
    subtle,
    unwrapAlgorithm,
    unwrappingKey,
    wrappedKey,
  );
  return subtleImportKey(
    subtle,
    format,
    raw,
    unwrappedKeyAlgorithm,
    extractable,
    keyUsages,
  );
}

export async function subtleDeriveBits(subtle, algorithm, baseKey, length) {
  requireSubtle(subtle);
  const state = requireKey(baseKey);
  const bitLength = Number(length);
  if (!Number.isInteger(bitLength) || bitLength < 0 || bitLength % 8 !== 0) {
    throw new DOMException("The length must be a non-negative multiple of 8.", "OperationError");
  }
  const name = algorithmName(algorithm);
  let output;
  if (name === "PBKDF2" && state.algorithm.name === "PBKDF2") {
    const hash = algorithmName(algorithm.hash);
    output = pbkdf2(
      state.bytes,
      bytesOf(algorithm.salt),
      Number(algorithm.iterations),
      bitLength / 8,
      hash,
    );
  } else if (name === "HKDF" && state.algorithm.name === "HKDF") {
    const hash = algorithmName(algorithm.hash);
    output = hkdf(
      state.bytes,
      bytesOf(algorithm.salt),
      bytesOf(algorithm.info),
      bitLength / 8,
      hash,
    );
  } else {
    unsupported();
  }
  return toArrayBuffer(output);
}

export async function subtleDeriveKey(
  subtle,
  algorithm,
  baseKey,
  derivedKeyType,
  extractable,
  keyUsages,
) {
  const length = Number(derivedKeyType?.length ?? 256);
  const bits = await subtleDeriveBits(subtle, algorithm, baseKey, length);
  return subtleImportKey(
    subtle,
    "raw",
    bits,
    derivedKeyType,
    extractable,
    keyUsages,
  );
}

export async function subtleGenerateKey(
  subtle,
  algorithm,
  extractable,
  keyUsages,
) {
  requireSubtle(subtle);
  const realm = subtle.__nv8Realm;
  const normalized = normalizeKeyAlgorithm(algorithm);
  const bitLength = Number(normalized.length ?? (normalized.name === "HMAC" ? 256 : 256));
  const bytes = new Uint8Array(bitLength / 8);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = realmRandomByte(realm);
  }
  return createKey(bytes, normalized, Boolean(extractable), normalizeUsages(keyUsages));
}

export async function subtleUnsupported(subtle) {
  requireSubtle(subtle);
  unsupported();
}

function createKey(bytes, algorithm, extractable, usages) {
  const key = Object.create(CryptoKey.prototype);
  setKeyState(key, {
    type: "secret",
    extractable,
    algorithm: Object.freeze({ ...algorithm }),
    usages: Object.freeze([...usages]),
    bytes: bytes.slice(),
  });
  return key;
}

function normalizeKeyAlgorithm(algorithm) {
  const name = algorithmName(algorithm);
  if (!["HMAC", "PBKDF2", "HKDF", "AES-GCM", "AES-CBC", "AES-CTR"].includes(name)) {
    unsupported();
  }
  if (name === "HMAC") {
    const hash = algorithmName(algorithm?.hash ?? "SHA-256");
    digestBytes(hash, new Uint8Array());
    return { name, hash: Object.freeze({ name: hash }), length: Number(algorithm?.length ?? 256) };
  }
  if (name.startsWith("AES-")) {
    const length = Number(algorithm?.length ?? 256);
    if (![128, 192, 256].includes(length)) {
      throw new DOMException("The AES key length is invalid.", "DataError");
    }
    return { name, length };
  }
  return { name };
}

function normalizeUsages(usages) {
  return [...(usages ?? [])].map(value => `${value}`);
}

function algorithmName(value) {
  const name = typeof value === "string" ? value : value?.name;
  return `${name}`.toUpperCase();
}

function bytesOf(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  throw new TypeError("A BufferSource is required");
}

function sha256(input) {
  const constants = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const bitLength = input.length * 8;
  const paddedLength = Math.ceil((input.length + 9) / 64) * 64;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(input);
  bytes[input.length] = 0x80;
  const view = new DataView(bytes.buffer);
  view.setUint32(paddedLength - 4, bitLength >>> 0);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000));
  const hash = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const words = new Uint32Array(64);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4);
    }
    for (let index = 16; index < 64; index += 1) {
      const w15 = words[index - 15];
      const w2 = words[index - 2];
      const s0 = rotate(w15, 7) ^ rotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rotate(w2, 17) ^ rotate(w2, 19) ^ (w2 >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const s1 = rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25);
      const choose = (e & f) ^ (~e & g);
      const first = (h + s1 + choose + constants[index] + words[index]) >>> 0;
      const s0 = rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const second = (s0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + first) >>> 0;
      d = c; c = b; b = a; a = (first + second) >>> 0;
    }
    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }
  const output = new Uint8Array(32);
  const outputView = new DataView(output.buffer);
  hash.forEach((value, index) => outputView.setUint32(index * 4, value));
  return output;
}

function hmac(hash, key, data) {
  const blockSize = ["SHA-384", "SHA-512"].includes(hash) ? 128 : 64;
  let normalized = key;
  if (normalized.length > blockSize) normalized = digestBytes(hash, normalized);
  const digestLength = digestBytes(hash, new Uint8Array()).length;
  const inner = new Uint8Array(blockSize + data.length);
  const outer = new Uint8Array(blockSize + digestLength);
  for (let index = 0; index < blockSize; index += 1) {
    const value = normalized[index] ?? 0;
    inner[index] = value ^ 0x36;
    outer[index] = value ^ 0x5c;
  }
  inner.set(data, blockSize);
  outer.set(digestBytes(hash, inner), blockSize);
  return digestBytes(hash, outer);
}

function pbkdf2(password, salt, iterations, length, hash) {
  digestBytes(hash, new Uint8Array());
  if (!Number.isInteger(iterations) || iterations <= 0) {
    throw new DOMException("Iterations must be positive.", "OperationError");
  }
  const output = new Uint8Array(length);
  for (let block = 1, offset = 0; offset < length; block += 1) {
    const input = new Uint8Array(salt.length + 4);
    input.set(salt);
    new DataView(input.buffer).setUint32(salt.length, block);
    let current = hmac(hash, password, input);
    const combined = current.slice();
    for (let iteration = 1; iteration < iterations; iteration += 1) {
      current = hmac(hash, password, current);
      for (let index = 0; index < combined.length; index += 1) {
        combined[index] ^= current[index];
      }
    }
    const count = Math.min(combined.length, length - offset);
    output.set(combined.subarray(0, count), offset);
    offset += count;
  }
  return output;
}

function hkdf(key, salt, info, length, hash) {
  const digestLength = digestBytes(hash, new Uint8Array()).length;
  const actualSalt = salt.length === 0 ? new Uint8Array(digestLength) : salt;
  const pseudoRandomKey = hmac(hash, actualSalt, key);
  const output = new Uint8Array(length);
  let previous = new Uint8Array();
  for (let block = 1, offset = 0; offset < length; block += 1) {
    if (block > 255) throw new DOMException("The requested length is too large.", "OperationError");
    const input = new Uint8Array(previous.length + info.length + 1);
    input.set(previous);
    input.set(info, previous.length);
    input[input.length - 1] = block;
    previous = hmac(hash, pseudoRandomKey, input);
    const count = Math.min(previous.length, length - offset);
    output.set(previous.subarray(0, count), offset);
    offset += count;
  }
  return output;
}

function digestBytes(name, input) {
  if (name === "SHA-1") return sha1(input);
  if (name === "SHA-256") return sha256(input);
  if (name === "SHA-384") return sha384(input);
  if (name === "SHA-512") return sha512(input);
  unsupported();
}

function rotate(value, bits) {
  return (value >>> bits) | (value << (32 - bits));
}

// randomByte is now imported from crypto-state.js

function toArrayBuffer(bytes) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

// requireCrypto, requireSubtle, requireKey are now imported from crypto-state.js

function unsupported() {
  throw new DOMException("The requested algorithm is not supported.", "NotSupportedError");
}
