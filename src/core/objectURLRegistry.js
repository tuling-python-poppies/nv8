/**
 * ObjectURL Registry
 * 
 * 跨 Realm 的 Blob URL 注册表，用于管理 createObjectURL/revokeObjectURL
 */

/**
 * 创建 ObjectURL Registry
 * 
 * @returns {ObjectURLRegistry}
 */
export function createObjectURLRegistry() {
  // url -> { blob, createdAt, realmId }
  const urlMap = new Map();
  
  // blob -> url
  const blobMap = new WeakMap();
  
  let urlCounter = 0;
  
  return {
    /**
     * 创建 Object URL
     * 
     * @param {Blob|MediaSource} object - Blob 或 MediaSource 对象
     * @param {string} realmId - Realm ID
     * @returns {string} - Object URL
     */
    createObjectURL(object, realmId) {
      // 检查是否已存在
      const existingUrl = blobMap.get(object);
      if (existingUrl) {
        return existingUrl;
      }
      
      // 生成新的 URL
      const url = `blob:https://nv8.local/${++urlCounter}`;
      
      urlMap.set(url, {
        object,
        createdAt: Date.now(),
        realmId,
      });
      
      blobMap.set(object, url);
      
      return url;
    },
    
    /**
     * 撤销 Object URL
     * 
     * @param {string} url - Object URL
     */
    revokeObjectURL(url) {
      const entry = urlMap.get(url);
      if (!entry) return;
      
      urlMap.delete(url);
      // WeakMap 会自动清理
    },
    
    /**
     * 获取 Object URL 对应的对象
     * 
     * @param {string} url - Object URL
     * @returns {Blob|MediaSource|null}
     */
    getObject(url) {
      const entry = urlMap.get(url);
      return entry ? entry.object : null;
    },
    
    /**
     * 检查 URL 是否存在
     * 
     * @param {string} url - Object URL
     * @returns {boolean}
     */
    hasURL(url) {
      return urlMap.has(url);
    },
    
    /**
     * 获取 URL 信息
     * 
     * @param {string} url - Object URL
     * @returns {Object|null}
     */
    getInfo(url) {
      const entry = urlMap.get(url);
      if (!entry) return null;
      
      return {
        url,
        createdAt: entry.createdAt,
        realmId: entry.realmId,
        type: entry.object.type || 'unknown',
        size: entry.object.size || 0,
      };
    },
    
    /**
     * 清理指定 Realm 的所有 URL
     * 
     * @param {string} realmId - Realm ID
     */
    clearRealm(realmId) {
      const urlsToDelete = [];
      
      for (const [url, entry] of urlMap.entries()) {
        if (entry.realmId === realmId) {
          urlsToDelete.push(url);
        }
      }
      
      for (const url of urlsToDelete) {
        urlMap.delete(url);
      }
    },
    
    /**
     * 清理所有 URL
     */
    clearAll() {
      urlMap.clear();
    },
    
    /**
     * 获取所有 URL 列表
     * 
     * @returns {Array<string>}
     */
    getAllURLs() {
      return Array.from(urlMap.keys());
    },
    
    /**
     * 获取统计信息
     * 
     * @returns {Object}
     */
    getStats() {
      const byRealm = new Map();
      
      for (const [url, entry] of urlMap.entries()) {
        const realmId = entry.realmId;
        if (!byRealm.has(realmId)) {
          byRealm.set(realmId, 0);
        }
        byRealm.set(realmId, byRealm.get(realmId) + 1);
      }
      
      return {
        total: urlMap.size,
        byRealm: Object.fromEntries(byRealm),
      };
    },
  };
}

/**
 * @typedef {Object} ObjectURLRegistry
 * @property {function} createObjectURL - 创建 Object URL
 * @property {function} revokeObjectURL - 撤销 Object URL
 * @property {function} getObject - 获取 URL 对应的对象
 * @property {function} hasURL - 检查 URL 是否存在
 * @property {function} getInfo - 获取 URL 信息
 * @property {function} clearRealm - 清理指定 Realm 的所有 URL
 * @property {function} clearAll - 清理所有 URL
 * @property {function} getAllURLs - 获取所有 URL 列表
 * @property {function} getStats - 获取统计信息
 */
