/**
 * 目标脚本的动态 `import()`（ADR-0003）
 *
 * 策略：从 Evidence Bundle / replay 解析，未命中给结构化拒绝，
 * **任何情况下不触达真实网络**。
 *
 * 与静态 import 共用同一套解析规则，避免「`import x from` 行但
 * `await import()` 不行」这种不一致。
 */

import vm from 'node:vm';
import { Buffer } from 'node:buffer';

/** 未命中 replay 的错误码，与 fetch/XHR 的 replay-miss 同族 */
export const MODULE_REPLAY_MISS_CODE = 'ERR_NV8_MODULE_REPLAY_MISS';

/** specifier 无法解析的错误码 */
export const MODULE_SPECIFIER_CODE = 'ERR_NV8_MODULE_SPECIFIER_UNSUPPORTED';

/**
 * 不对目标脚本开放的 specifier 前缀。
 *
 * 只拦 `node:`——它直指宿主内建模块。
 *
 * 注意**不能**拦 `/`：那是根相对 URL（相对 origin），浏览器里完全合法。
 * 迁移前的实现把它当「绝对文件路径」拦掉，导致 `import('/mod/a.js')` 这种
 * 最常见的写法直接失败。
 *
 * `file:` 与其他非网络协议由最终解析结果的协议白名单拦截，比前缀匹配可靠：
 * `/etc/passwd` 配上 http referrer 解析成 `https://origin/etc/passwd`，
 * 是普通 URL，走 replay 未命中即可，不构成文件读取风险。
 */
const HOST_PREFIXES = Object.freeze(['node:']);

/** 允许的网络协议 */
const NETWORK_PROTOCOLS = Object.freeze(['http:', 'https:']);

/**
 * 解析 specifier 为绝对 URL。
 *
 * @param {string} specifier
 * @param {string} referrer 发起 import 的模块 URL
 * @returns {{ kind: 'data'|'url', url: string }}
 * @throws 带 `ERR_NV8_MODULE_SPECIFIER_UNSUPPORTED` 的 TypeError
 */
export function resolveModuleSpecifier(specifier, referrer) {
  if (typeof specifier !== 'string') {
    throw specifierError(
      'Module specifier must be a string',
      { specifier: String(specifier), referrer },
    );
  }

  if (specifier.startsWith('data:')) {
    return { kind: 'data', url: specifier };
  }

  for (const prefix of HOST_PREFIXES) {
    if (specifier.startsWith(prefix)) {
      throw specifierError(
        `Failed to resolve module specifier "${specifier}": host modules are not exposed`,
        { specifier, referrer },
      );
    }
  }

  // 浏览器承认三类合法 specifier：相对路径、根相对路径（含协议相对
  // `//host/path`）、完整 URL。只有裸 specifier 需要 import map。
  const isRelative = specifier.startsWith('./')
    || specifier.startsWith('../')
    || specifier.startsWith('/');
  const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(specifier);

  if (!isRelative && !hasProtocol) {
    // 裸 specifier。浏览器在没有 import map 时同样抛这个错，
    // 保持一致比擅自支持更好。
    throw specifierError(
      `Failed to resolve module specifier "${specifier}"`,
      { specifier, referrer },
    );
  }

  let resolved;
  try {
    resolved = new URL(specifier, referrer);
  } catch {
    throw specifierError(
      `Failed to resolve module specifier "${specifier}" against "${referrer}"`,
      { specifier, referrer },
    );
  }

  if (!NETWORK_PROTOCOLS.includes(resolved.protocol)) {
    throw specifierError(
      `Unsupported module protocol "${resolved.protocol}"`,
      { specifier, referrer },
    );
  }

  return { kind: 'url', url: resolved.href };
}

/**
 * 解码 `data:` URL 里的模块源码。
 *
 * @param {string} url
 * @returns {string}
 */
export function decodeDataModule(url) {
  const comma = url.indexOf(',');
  if (comma === -1) {
    throw specifierError('Malformed data: module URL', { specifier: url, referrer: null });
  }
  const meta = url.slice('data:'.length, comma);
  const payload = url.slice(comma + 1);
  return meta.endsWith(';base64')
    ? Buffer.from(payload, 'base64').toString('utf8')
    : decodeURIComponent(payload);
}

/**
 * 创建动态 import 处理器。
 *
 * 返回的函数直接作为 `vm.Script` / `vm.SourceTextModule` 的
 * `importModuleDynamically` 使用。
 *
 * @param {object} options
 * @param {object} options.context Realm 的 vm context
 * @param {(url: string) => string|null} options.resolveSource
 *   按绝对 URL 取模块源码；未命中返回 null
 * @param {() => readonly string[]} [options.availableUrls]
 *   可用模块 URL 列表，仅用于未命中时的诊断
 * @param {Map<string, object>} [options.cache] per-Realm 模块缓存
 * @returns {(specifier: string, referrer?: object) => Promise<object>}
 */
export function createDynamicImporter(options) {
  const {
    context,
    resolveSource,
    availableUrls = () => [],
    allowUrl = () => true,
    cache = new Map(),
  } = options;
  let disposed = false;
  const pending = new Set();

  if (typeof resolveSource !== 'function') {
    throw new TypeError('createDynamicImporter requires resolveSource');
  }

  /**
   * 只**创建**模块实例并入缓存，不做链接。
   *
   * 链接与创建必须分离。边递归边 `link()` 会把仍处于 `linking` 状态的模块
   * 交给 linker 回调，Node 直接报
   * `can not be resolved on module ... that is not linked`——循环依赖必然踩到。
   *
   * 正确做法是：只在**根模块**上调一次 `link()`，让 Node 自己遍历整个图，
   * linker 回调里只查表或新建实例。Node 内部的链接机制本身能处理循环。
   *
   * （同一个坑在 `src/realm/module-loader.js` 的异步路径上也踩过。）
   */
  function lifecycleError() {
    const error = new TypeError('Realm module evaluation was cancelled');
    error.code = 'ERR_NV8_MODULE_EVALUATION_CANCELLED';
    return error;
  }

  function assertActive() {
    if (disposed) throw lifecycleError();
  }

  function track(operation) {
    assertActive();
    let cancel;
    const cancellation = new Promise((_, reject) => {
      cancel = reject;
    });
    const entry = { cancel };
    pending.add(entry);
    const work = Promise.resolve().then(operation);
    return Promise.race([work, cancellation]).finally(() => {
      pending.delete(entry);
    });
  }

  function instantiate(url, source) {
    assertActive();
    const cached = cache.get(url);
    if (cached !== undefined) return cached;

    const module = new vm.SourceTextModule(source, {
      context,
      identifier: url,
      initializeImportMeta(meta) {
        meta.url = url;
      },
      // 嵌套动态 import 递归走同一条路径
      importModuleDynamically: (specifier) => importDynamic(specifier, url),
    });
    cache.set(url, module);
    return module;
  }

  /**
   * 链接模块图。linker 只创建实例，不递归链接。
   *
   * per-module in-flight promise：并发 `import()` 同一个模块时，第二个
   * 调用者必须等待第一次链接完成，而不是看到 status==='linking' 就直接
   * 去 evaluate（那会抛 ERR_VM_MODULE_STATUS，IKFD9L）。
   */
  const linkInFlight = new WeakMap();

  function linkGraph(module) {
    assertActive();
    if (module.status === 'linked' || module.status === 'evaluated') {
      return Promise.resolve();
    }
    let inFlight = linkInFlight.get(module);
    if (inFlight !== undefined) return inFlight;
    inFlight = (async () => {
      if (module.status === 'unlinked') {
        await module.link(async (specifier, referencingModule) => {
          const referrer = normalizeReferrer(referencingModule, module.identifier);
          const target = resolveModuleSpecifier(specifier, referrer);
          assertUrlAllowed(target.url, specifier, referrer);
          const childSource = target.kind === 'data'
            ? decodeDataModule(target.url)
            : requireSource(target.url, specifier, referrer);
          return instantiate(target.url, childSource);
        });
      }
      assertActive();
    })();
    inFlight.finally(() => {
      if (linkInFlight.get(module) === inFlight) linkInFlight.delete(module);
    }).catch(() => {});
    linkInFlight.set(module, inFlight);
    return inFlight;
  }

  /**
   * 求值一个已（或正在）链接的模块，同样按模块缓存 in-flight promise。
   */
  const evaluateInFlight = new WeakMap();

  function evaluateModule(module) {
    assertActive();
    if (module.status === 'evaluated') return Promise.resolve(module);
    let inFlight = evaluateInFlight.get(module);
    if (inFlight !== undefined) return inFlight;
    inFlight = (async () => {
      await linkGraph(module);
      assertActive();
      if (module.status !== 'evaluated') {
        await module.evaluate();
        assertActive();
      }
      return module;
    })();
    inFlight.finally(() => {
      if (evaluateInFlight.get(module) === inFlight) evaluateInFlight.delete(module);
    }).catch(() => {});
    evaluateInFlight.set(module, inFlight);
    return inFlight;
  }

  function assertUrlAllowed(url, specifier, referrer) {
    if (allowUrl(url) === true) return;
    const error = new TypeError(`Module execution blocked by script policy: ${url}`);
    error.code = 'ERR_NV8_SCRIPT_POLICY_REJECTED';
    error.reason = 'module-not-allowed';
    error.specifier = specifier;
    error.referrer = referrer;
    throw error;
  }

  function requireSource(url, specifier, referrer) {
    const source = resolveSource(url);
    if (source === null || source === undefined) {
      throw replayMissError({ specifier, resolvedUrl: url, referrer, availableUrls });
    }
    return source;
  }

  /**
   * 处理一次动态 import。
   *
   * `referrer` 可以是 URL 字符串，也可以是 Node 传入的 referrer **对象**。
   * `importModuleDynamically(specifier, referrer)` 的第二参在 Node 里是
   * `vm.SourceTextModule` / `vm.Script` 实例而非字符串——直接当字符串用会让
   * `new URL(specifier, referrer)` 拿到 "[object Object]" 而解析失败。
   *
   * @param {string} specifier
   * @param {string|object} referrer
   * @returns {Promise<object>} 模块命名空间
   */
  async function importDynamic(specifier, referrer) {
    return track(async () => {
      const referrerUrl = normalizeReferrer(referrer, options.defaultReferrer);
      const target = resolveModuleSpecifier(specifier, referrerUrl);
      assertUrlAllowed(target.url, specifier, referrerUrl);
      const source = target.kind === 'data'
        ? decodeDataModule(target.url)
        : requireSource(target.url, specifier, referrerUrl);

      const module = instantiate(target.url, source);
      await evaluateModule(module);
      return module.namespace;
    });
  }

  /**
   * 加载并求值一个**入口**模块（静态依赖图 + 求值）。
   *
   * 让调用方不必自己写 `link()`——自己写很容易踩「边递归边 link」的坑，
   * 循环依赖时会失败。
   *
   * @param {string} source
   * @param {string} url 该模块的绝对 URL
   * @returns {Promise<object>} vm.SourceTextModule
   */
  async function loadEntryModule(source, url) {
    return track(async () => {
      const module = instantiate(url, source);
      await linkGraph(module);
      assertActive();
      return module;
    });
  }

  async function evaluateEntryModule(source, url) {
    return track(async () => {
      const module = instantiate(url, source);
      await evaluateModule(module);
      return module;
    });
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    const error = lifecycleError();
    for (const entry of pending) entry.cancel(error);
    pending.clear();
    cache.clear();
  }

  // 主用法是直接作为 importModuleDynamically 传入，因此返回函数本体；
  // 入口加载能力挂成属性，避免调用方各自实现 link。
  importDynamic.loadEntryModule = loadEntryModule;
  importDynamic.evaluateEntryModule = evaluateEntryModule;
  importDynamic.cache = cache;
  importDynamic.dispose = dispose;
  return importDynamic;
}

/**
 * 构造 replay 未命中错误。
 *
 * 必须回答「我该把什么加进 Bundle」——原先笼统的
 * "Network module loading is unavailable" 做不到这一点。
 */
function replayMissError({ specifier, resolvedUrl, referrer, availableUrls }) {
  const available = [...availableUrls()].sort();
  const error = new TypeError(
    `No offline replay entry for dynamic import "${specifier}" `
    + `(resolved to ${resolvedUrl})`
  );
  error.code = MODULE_REPLAY_MISS_CODE;
  error.specifier = specifier;
  error.resolvedUrl = resolvedUrl;
  error.referrer = referrer ?? null;
  error.availableModules = Object.freeze(available);
  error.suggestions = Object.freeze([
    `Add ${resolvedUrl} to the evidence bundle or replay fixture`,
    available.length > 0
      ? `Known module URLs: ${available.slice(0, 5).join(', ')}`
      : 'No module URLs are currently available for replay',
  ]);
  return error;
}

/**
 * 把 referrer 归一化为 URL 字符串。
 *
 * @param {string|object|undefined} referrer
 * @param {string} [fallback]
 * @returns {string}
 */
function normalizeReferrer(referrer, fallback = 'https://sandbox.test/') {
  if (typeof referrer === 'string' && referrer.length > 0) return referrer;
  if (referrer !== null && typeof referrer === 'object') {
    // vm.SourceTextModule 有 identifier；vm.Script 有 filename
    const candidate = referrer.identifier ?? referrer.filename ?? referrer.url;
    if (typeof candidate === 'string' && candidate.length > 0) return candidate;
  }
  return fallback;
}

function specifierError(message, { specifier, referrer }) {
  const error = new TypeError(message);
  error.code = MODULE_SPECIFIER_CODE;
  error.specifier = specifier;
  error.referrer = referrer ?? null;
  return error;
}

/**
 * 拒绝所有动态 import。
 *
 * 用于内部受信模块和 Worklet——前者是 NV8 自身代码（放开只增加攻击面），
 * 后者的规范本身不支持动态 import。
 *
 * @param {string} specifier
 * @param {string} [context] 诊断用的场景描述
 */
export function rejectDynamicImport(specifier, context = 'this context') {
  const error = new TypeError(
    `Dynamic import is not available in ${context}`
  );
  error.code = MODULE_SPECIFIER_CODE;
  error.specifier = String(specifier);
  throw error;
}

/**
 * 兼容旧入口。
 *
 * 保留是因为 `runtime-pool.js` 有三处引用；行为改为按 ADR-0003 先做
 * specifier 校验，让「裸 specifier」和「宿主模块」这两类得到与浏览器
 * 一致的消息，而不是笼统的网络不可用。
 *
 * @param {string} specifier
 * @param {string} [referrer]
 */
export function rejectUserImport(specifier, referrer = 'https://sandbox.test/') {
  // 校验会为裸 specifier / 宿主前缀抛出精确错误
  const target = resolveModuleSpecifier(specifier, referrer);
  throw replayMissError({
    specifier,
    resolvedUrl: target.url,
    referrer,
    availableUrls: () => [],
  });
}
