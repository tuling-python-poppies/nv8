import { installCrypto } from "../../install/install-crypto.js";

const CRYPTO_INSTALLER_URL = new URL(
  "../../install/install-crypto.js",
  import.meta.url,
);

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
    // Pass realm identifier for proper state scoping
    module.namespace.installCrypto(context.realm);
    context.exports.crypto = true;
  },
  
  async reset(context) {
    // Crypto state is owned by the Realm module graph.
  },
  
  async dispose(context) {
    // Crypto state is released with the Realm.
  },
};
