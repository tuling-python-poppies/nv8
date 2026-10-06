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

export function installCrypto(realm = globalThis, entropy = null) {

    delete Crypto.prototype.constructor;
    defineGlobalConstructor(Crypto.name, Crypto);

    delete SubtleCrypto.prototype.constructor;
    defineGlobalConstructor(SubtleCrypto.name, SubtleCrypto);

    delete CryptoKey.prototype.constructor;
    defineGlobalConstructor(CryptoKey.name, CryptoKey);

  const { crypto, subtle } = createCryptoObjects(realm, entropy);
  method(Crypto, "getRandomValues", 1, cryptoGetRandomValues);
  defineConstructorBacklink(Crypto.prototype, Crypto);
  getter(Crypto, "subtle", value => cryptoSubtle(value, subtle));
  method(Crypto, "randomUUID", 0, cryptoRandomUUID);
  defineToStringTag(Crypto.prototype, "Crypto");

  method(SubtleCrypto, "decrypt", 3, ((((["decrypt", 3, subtleDecrypt]))[2])));
method(SubtleCrypto, "deriveBits", 2, ((((["deriveBits", 2, subtleDeriveBits]))[2])));
method(SubtleCrypto, "deriveKey", 5, ((((["deriveKey", 5, subtleDeriveKey]))[2])));
method(SubtleCrypto, "digest", 2, ((((["digest", 2, subtleDigest]))[2])));
method(SubtleCrypto, "encrypt", 3, ((((["encrypt", 3, subtleEncrypt]))[2])));
method(SubtleCrypto, "exportKey", 2, ((((["exportKey", 2, subtleExportKey]))[2])));
method(SubtleCrypto, "generateKey", 3, ((((["generateKey", 3, subtleGenerateKey]))[2])));
method(SubtleCrypto, "importKey", 5, ((((["importKey", 5, subtleImportKey]))[2])));
method(SubtleCrypto, "sign", 3, ((((["sign", 3, subtleSign]))[2])));
method(SubtleCrypto, "unwrapKey", 7, ((((["unwrapKey", 7, subtleUnwrapKey]))[2])));
method(SubtleCrypto, "verify", 4, ((((["verify", 4, subtleVerify]))[2])));
method(SubtleCrypto, "wrapKey", 4, ((((["wrapKey", 4, subtleWrapKey]))[2])));
  finish(SubtleCrypto);

    getter(CryptoKey, "type", value => cryptoKeyProperty(value, "type"));

    getter(CryptoKey, "extractable", value => cryptoKeyProperty(value, "extractable"));

    getter(CryptoKey, "algorithm", value => cryptoKeyProperty(value, "algorithm"));

    getter(CryptoKey, "usages", value => cryptoKeyProperty(value, "usages"));

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
