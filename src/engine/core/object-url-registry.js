/**
 * Object URL Registry
 * 
 * 跨 Realm 的 Blob 和 Object URL 注册表。
 * 管理 Blob 数据和 Object URL 的生命周期。
 */

/**
 * 创建 Object URL 注册表
 * 
 * @returns {ObjectURLRegistry}
 */
export function createObjectURLRegistry() {
  const blobRecords = new WeakMap();
  const objectURLRecords = new Map();
  
  return Object.freeze({
    /**
     * 注册 Blob 对象及其数据
     * 
     * @param {any} value - Blob 对象
     * @param {Uint8Array} bytes - Blob 数据
     * @param {string} type - MIME 类型
     */
    registerBlob(value, bytes, type) {
      const copy = new Uint8Array(bytes.length);
      for (let index = 0; index < bytes.length; index += 1) {
        copy[index] = bytes[index];
      }
      blobRecords.set(value, {
        bytes: copy,
        type: `${type}`,
      });
    },
    
    /**
     * 检查 Blob 是否已注册
     * 
     * @param {any} value - Blob 对象
     * @returns {boolean}
     */
    hasBlob(value) {
      return blobRecords.has(value);
    },
    
    /**
     * 注册 Object URL
     * 
     * @param {string} url - Object URL
     * @param {any} value - Blob 对象
     * @returns {boolean} 是否注册成功
     */
    register(url, value) {
      if (objectURLRecords.has(url)) return false;
      const blob = blobRecords.get(value);
      if (blob === undefined) return false;
      objectURLRecords.set(url, {
        bytes: blob.bytes,
        type: blob.type,
        origin: new URL(url).origin,
      });
      return true;
    },
    
    /**
     * 撤销 Object URL
     * 
     * @param {string} url - Object URL
     */
    revoke(url) {
      objectURLRecords.delete(url);
    },
    
    /**
     * 解析 Object URL
     * 
     * @param {string} url - Object URL
     * @returns {{bytes: Uint8Array, type: string, origin: string}|undefined}
     */
    resolve(url) {
      return objectURLRecords.get(url);
    },
    
    /**
     * 清空所有 Object URL
     */
    clear() {
      objectURLRecords.clear();
    },
  });
}

/**
 * @typedef {Object} ObjectURLRegistry
 * @property {(value: any, bytes: Uint8Array, type: string) => void} registerBlob - 注册 Blob
 * @property {(value: any) => boolean} hasBlob - 检查 Blob 是否已注册
 * @property {(url: string, value: any) => boolean} register - 注册 Object URL
 * @property {(url: string) => void} revoke - 撤销 Object URL
 * @property {(url: string) => {bytes: Uint8Array, type: string, origin: string}|undefined} resolve - 解析 Object URL
 * @property {() => void} clear - 清空所有 Object URL
 */
