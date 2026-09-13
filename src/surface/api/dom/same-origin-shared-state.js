import { currentOrigin } from "../../../infra/navigation/navigation-state.js";

/**
 * 同源共享状态的跨 Realm 容器。
 *
 * localStorage / sessionStorage / cookie 按规范是 **origin 作用域**：同源的
 * iframe 与父页面共享，跨源隔离。NV8 的每个 Realm 是独立的 vm context 和独立
 * 的模块实例，模块级 WeakMap 无法跨 Realm；宿主侧又没有向 surface 暴露可存放
 * 共享状态的对象。可用的通道是**父窗口对象链**：同源父窗口直接持有真实父
 * global（见 window-messaging.js 的说明），于是可以沿 `parent` 向上走到最近的
 * 同源祖先窗口，把容器挂在它身上。
 *
 * 容器用 `Symbol.for` 键：符号注册表在一个 isolate 内跨 context 共享，父 Realm
 * 与子 Realm 拿到的是同一个符号。跨源时 `parent` 是受限 facade（
 * `Object.create(null)`，没有 `document`），探测失败即回退到当前 Realm 自身，
 * 隔离不受影响。
 *
 * 已知偏差：根窗口的 own symbol 列表会多出这一个键。相比「同源 iframe 读写
 * 完全隔离」的行为错误，这个代价是必要的；键不可枚举、不可写，正常页面代码
 * 不会碰到。
 */
const SHARED_STATE_SYMBOL = Symbol.for("@nv8/state/same-origin");

const MAX_PARENT_DEPTH = 256;

/**
 * 最近的同源祖先窗口（顶层窗口返回自身）。
 *
 * @returns {object}
 */
function sameOriginHost() {
  let host = globalThis;
  for (let depth = 0; depth < MAX_PARENT_DEPTH; depth += 1) {
    let parent;
    try {
      parent = host.parent;
    } catch {
      return host;
    }
    if (parent === null || parent === undefined || parent === host) return host;
    // 同源父窗口交出来的是真实 global，能读到 document；
    // 跨源 facade 没有 document 属性，访问得到 undefined。
    let document;
    try {
      document = parent.document;
    } catch {
      return host;
    }
    if (document === undefined || document === null) return host;
    host = parent;
  }
  return host;
}

function sharedContainer() {
  const host = sameOriginHost();
  let container = host[SHARED_STATE_SYMBOL];
  if (container === undefined) {
    container = new Map();
    Object.defineProperty(host, SHARED_STATE_SYMBOL, {
      value: container,
      writable: false,
      enumerable: false,
      configurable: true,
    });
  }
  return container;
}

/**
 * 取当前 origin 的具名共享状态，不存在时用 `create()` 建一个。
 *
 * @template T
 * @param {string} kind 同一 origin 内的命名空间（localStorage / sessionStorage / cookies）
 * @param {() => T} create
 * @returns {{value: T, created: boolean}}
 */
export function originScopedState(kind, create) {
  const container = sharedContainer();
  const origin = currentOrigin();
  let bucket = container.get(origin);
  if (bucket === undefined) {
    bucket = new Map();
    container.set(origin, bucket);
  }
  if (bucket.has(kind)) {
    return { value: bucket.get(kind), created: false };
  }
  const value = create();
  bucket.set(kind, value);
  return { value, created: true };
}
