/**
 * Realm 作用域状态工具
 *
 * 用于把模块级可变状态迁到显式作用域。设计目标是让迁移改动最小：
 * 原先 `let singleton = null` 的模块，只需换成 `createRealmSlot()`，
 * 调用点从 `singleton` 改为 `slot.get(realm)`。
 *
 * 三种作用域：
 * - `realm`   每个 Realm 独立（Window、Worker、iframe 各自一份）
 * - `origin`  同 origin 的 Realm 共享（localStorage、cookie 语义）
 * - `sandbox` 整个 Sandbox 共享（SharedWorker 图、ServiceWorker 注册表）
 *
 * 实现用 WeakMap 键控作用域宿主对象，因此宿主销毁后状态自动可回收，
 * 不需要显式注销。
 */

/** 作用域类型 */
export const STATE_SCOPE = Object.freeze({
  REALM: 'realm',
  ORIGIN: 'origin',
  SANDBOX: 'sandbox',
});

/**
 * 创建一个按宿主对象键控的状态槽。
 *
 * @template T
 * @param {object} [options]
 * @param {() => T} [options.create] 首次访问时的初始化函数
 * @param {string} [options.label] 诊断标签
 * @param {string} [options.scope] {@link STATE_SCOPE}
 * @returns {{
 *   get(host: object): T,
 *   peek(host: object): T|undefined,
 *   set(host: object, value: T): T,
 *   has(host: object): boolean,
 *   clear(host: object): boolean,
 *   readonly label: string,
 *   readonly scope: string,
 * }}
 */
export function createStateSlot(options = {}) {
  const {
    create = () => undefined,
    label = 'anonymous',
    scope = STATE_SCOPE.REALM,
  } = options;

  if (typeof create !== 'function') {
    throw new TypeError(`createStateSlot(${label}): options.create must be a function`);
  }
  if (!Object.values(STATE_SCOPE).includes(scope)) {
    throw new TypeError(
      `createStateSlot(${label}): unknown scope "${scope}"`
    );
  }

  const store = new WeakMap();

  function assertHost(host, method) {
    if (host === null || (typeof host !== 'object' && typeof host !== 'function')) {
      throw new TypeError(
        `${label}.${method}() requires a scope host object, received ${host === null ? 'null' : typeof host}`
      );
    }
    return host;
  }

  return Object.freeze({
    get label() { return label; },
    get scope() { return scope; },

    /** 读取状态，不存在时用 create() 初始化 */
    get(host) {
      assertHost(host, 'get');
      if (store.has(host)) return store.get(host);
      const value = create();
      store.set(host, value);
      return value;
    },

    /** 读取状态，不存在时返回 undefined（不初始化） */
    peek(host) {
      assertHost(host, 'peek');
      return store.get(host);
    },

    set(host, value) {
      assertHost(host, 'set');
      store.set(host, value);
      return value;
    },

    has(host) {
      assertHost(host, 'has');
      return store.has(host);
    },

    /** 移除状态。返回是否确实删除了。 */
    clear(host) {
      assertHost(host, 'clear');
      return store.delete(host);
    },
  });
}

/**
 * Realm 作用域槽的便捷构造。
 *
 * @template T
 * @param {() => T} create
 * @param {string} [label]
 */
export function createRealmSlot(create, label = 'realm-state') {
  return createStateSlot({ create, label, scope: STATE_SCOPE.REALM });
}

/**
 * 按字符串键（如 origin）在宿主内二级键控的状态槽。
 *
 * 用于 origin 作用域：宿主是 Sandbox，二级键是 origin 字符串。
 * 这样同 origin 的多个 Realm 共享状态，跨 origin 相互隔离。
 *
 * @template T
 * @param {object} [options]
 * @param {(key: string) => T} [options.create]
 * @param {string} [options.label]
 * @param {number} [options.maxKeys] 每个宿主的键数上限，防止无界增长
 */
export function createKeyedStateSlot(options = {}) {
  const {
    create = () => undefined,
    label = 'keyed-state',
    maxKeys = 256,
  } = options;

  if (!Number.isInteger(maxKeys) || maxKeys <= 0) {
    throw new TypeError(`createKeyedStateSlot(${label}): maxKeys must be a positive integer`);
  }

  const store = new WeakMap();

  function bucket(host) {
    if (host === null || (typeof host !== 'object' && typeof host !== 'function')) {
      throw new TypeError(`${label}: requires a scope host object`);
    }
    let map = store.get(host);
    if (map === undefined) {
      map = new Map();
      store.set(host, map);
    }
    return map;
  }

  return Object.freeze({
    get label() { return label; },
    get scope() { return STATE_SCOPE.ORIGIN; },

    get(host, key) {
      const map = bucket(host);
      if (map.has(key)) return map.get(key);
      if (map.size >= maxKeys) {
        const error = new RangeError(
          `${label} exceeded maxKeys (${maxKeys}) for this scope host`
        );
        error.code = 'ERR_NV8_STATE_KEY_LIMIT';
        throw error;
      }
      const value = create(key);
      map.set(key, value);
      return value;
    },

    peek(host, key) {
      return store.get(host)?.get(key);
    },

    set(host, key, value) {
      bucket(host).set(key, value);
      return value;
    },

    has(host, key) {
      return store.get(host)?.has(key) === true;
    },

    keys(host) {
      return [...(store.get(host)?.keys() ?? [])].sort();
    },

    clear(host, key) {
      if (key === undefined) return store.delete(host);
      return store.get(host)?.delete(key) === true;
    },

    size(host) {
      return store.get(host)?.size ?? 0;
    },
  });
}
