import { randomFillSync, randomUUID } from "node:crypto";
import { installCrypto } from "../../surface/install/install-crypto.js";

const CRYPTO_INSTALLER_URL = new URL(
  "../../surface/install/install-crypto.js",
  import.meta.url,
);

/**
 * 传给 Realm 安装器的宿主熵源。
 *
 * 这个模块在宿主进程求值（Plugin 由 presets 静态 import），所以 `node:crypto`
 * 在这里可用；Realm 内的模块加载器禁止 `node:` specifier，安装器自身拿不到。
 * 两个函数都是纯函数对象，跨 vm context 调用合法，Realm 内的
 * `crypto.getRandomValues` / `randomUUID` / `generateKey` 都经它们取熵。
 */
const HOST_CRYPTO_ENTROPY = Object.freeze({
  randomFill(bytes) {
    randomFillSync(bytes);
    return bytes;
  },
  randomUUID,
});

/**
 * @nv8/plugin-crypto
 * 
 * Web Crypto API
 * 
 * 提供能力：
 * - crypto.base: Crypto 对象
 * - crypto.subtle: SubtleCrypto 对象
 */
export const cryptoPlugin = {
  id: "@nv8/plugin-crypto",
  version: "1.0.0",
  capabilities: ["crypto.base", "crypto.subtle"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装 Crypto API（包含 SubtleCrypto）
    // Legacy path: use globalThis as realm identifier
    installCrypto(globalThis);
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Crypto");
    registry.reserveGlobalSurface(this.id, "SubtleCrypto");
    registry.reserveGlobalSurface(this.id, "CryptoKey");
    registry.reserveGlobalSurface(this.id, "crypto");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(CRYPTO_INSTALLER_URL);
    if (!module?.namespace?.installCrypto) {
      throw new Error('Realm module loader cannot install Crypto');
    }
    // Pass realm identifier for proper state scoping and host entropy for
    // CSPRNG-backed random output (the realm module graph cannot import node:crypto).
    module.namespace.installCrypto(context.realm, HOST_CRYPTO_ENTROPY);
    context.exports.crypto = true;
  },
  
  async reset(context) {
    // Crypto state is owned by the Realm module graph.
  },
  
  async dispose(context) {
    // Crypto state is released with the Realm.
  },
};
