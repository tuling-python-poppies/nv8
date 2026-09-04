import {
  Crypto,
  CryptoKey,
  SubtleCrypto,
  createCryptoObjects,
  cryptoGetRandomValues,
  cryptoKeyProperty,
  cryptoRandomUUID,
  cryptoSubtle,
  subtleDeriveBits,
  subtleDeriveKey,
  subtleDecrypt,
  subtleDigest,
  subtleEncrypt,
  subtleExportKey,
  subtleGenerateKey,
  subtleImportKey,
  subtleSign,
  subtleUnwrapKey,
  subtleVerify,
  subtleWrapKey,
} from "../api/crypto/crypto-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installCrypto(realm = globalThis) {
  do {
    delete ((([Crypto, SubtleCrypto, CryptoKey])[0])).prototype.constructor;
    defineGlobalConstructor(((([Crypto, SubtleCrypto, CryptoKey])[0])).name, ((([Crypto, SubtleCrypto, CryptoKey])[0])));
  } while (false);
do {
    delete ((([Crypto, SubtleCrypto, CryptoKey])[1])).prototype.constructor;
    defineGlobalConstructor(((([Crypto, SubtleCrypto, CryptoKey])[1])).name, ((([Crypto, SubtleCrypto, CryptoKey])[1])));
  } while (false);
do {
    delete ((([Crypto, SubtleCrypto, CryptoKey])[2])).prototype.constructor;
    defineGlobalConstructor(((([Crypto, SubtleCrypto, CryptoKey])[2])).name, ((([Crypto, SubtleCrypto, CryptoKey])[2])));
  } while (false);
  const { crypto, subtle } = createCryptoObjects(realm);
  method(Crypto, "getRandomValues", 1, cryptoGetRandomValues);
  defineConstructorBacklink(Crypto.prototype, Crypto);
  getter(Crypto, "subtle", value => cryptoSubtle(value, subtle));
  method(Crypto, "randomUUID", 0, cryptoRandomUUID);
  defineToStringTag(Crypto.prototype, "Crypto");

  do {method(SubtleCrypto, ("decrypt"), (3), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[0]))[2])));} while (false);
do {method(SubtleCrypto, ("deriveBits"), (2), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[1]))[2])));} while (false);
do {method(SubtleCrypto, ("deriveKey"), (5), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[2]))[2])));} while (false);
do {method(SubtleCrypto, ("digest"), (2), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[3]))[2])));} while (false);
do {method(SubtleCrypto, ("encrypt"), (3), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[4]))[2])));} while (false);
do {method(SubtleCrypto, ("exportKey"), (2), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[5]))[2])));} while (false);
do {method(SubtleCrypto, ("generateKey"), (3), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[6]))[2])));} while (false);
do {method(SubtleCrypto, ("importKey"), (5), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[7]))[2])));} while (false);
do {method(SubtleCrypto, ("sign"), (3), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[8]))[2])));} while (false);
do {method(SubtleCrypto, ("unwrapKey"), (7), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[9]))[2])));} while (false);
do {method(SubtleCrypto, ("verify"), (4), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[10]))[2])));} while (false);
do {method(SubtleCrypto, ("wrapKey"), (4), ((((([
    ["decrypt", 3, subtleDecrypt],
    ["deriveBits", 2, subtleDeriveBits],
    ["deriveKey", 5, subtleDeriveKey],
    ["digest", 2, subtleDigest],
    ["encrypt", 3, subtleEncrypt],
    ["exportKey", 2, subtleExportKey],
    ["generateKey", 3, subtleGenerateKey],
    ["importKey", 5, subtleImportKey],
    ["sign", 3, subtleSign],
    ["unwrapKey", 7, subtleUnwrapKey],
    ["verify", 4, subtleVerify],
    ["wrapKey", 4, subtleWrapKey],
  ])[11]))[2])));} while (false);
  finish(SubtleCrypto);

  do {
    getter(CryptoKey, ("type"), value => cryptoKeyProperty(value, ("type")));
  } while (false);
do {
    getter(CryptoKey, ("extractable"), value => cryptoKeyProperty(value, ("extractable")));
  } while (false);
do {
    getter(CryptoKey, ("algorithm"), value => cryptoKeyProperty(value, ("algorithm")));
  } while (false);
do {
    getter(CryptoKey, ("usages"), value => cryptoKeyProperty(value, ("usages")));
  } while (false);
  finish(CryptoKey);

  const cryptoGetter = Object.getOwnPropertyDescriptor({
    get crypto() { return crypto; },
  }, "crypto").get;
  registerNativeGetter(cryptoGetter, "crypto");
  Object.defineProperty(globalThis, "crypto", {
    get: cryptoGetter,
    enumerable: true,
    configurable: true,
  });
}

function getter(constructor, name, operation) {
  const callback = function () { return operation(this); };
  registerNativeGetter(callback, name);
  definePrototypeGetter(constructor.prototype, name, callback);
}

function method(constructor, name, length, operation) {
  const callback = {
    [name](...args) { return operation(this, ...args); },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(constructor.prototype, name, callback);
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
