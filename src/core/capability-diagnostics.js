/**
 * 缺失能力诊断（ADR-0002，已按实测修订）
 *
 * 目标：plugin 模式按需组装，目标脚本用到未装载的能力时，用户要能知道
 * 「缺什么能力、该加载哪个插件」，而不是只得到裸 `ReferenceError`。
 *
 * ## 为什么不用「抛错的 getter」作为默认方案
 *
 * 最初的设计是为未装载的全局安装抛结构化错误的 getter。实测发现两个障碍：
 *
 * **障碍一：宿主侧 defineProperty 在 vm 里不生效。**
 * `vm.createContext(sandbox)` 之后，对宿主 `sandbox` 对象新增的访问器属性
 * 不会同步进 contextified global。实测：
 *
 * ```
 * 裸标识符 probeA          → 原生 ReferenceError（getter 未被调用）
 * globalThis.probeA        → undefined（getter 未被调用）
 * 'probeA' in globalThis   → true（in 检查穿透到宿主对象）
 * ```
 *
 * 必须在 vm **内部**执行 `defineProperty` 才生效。
 *
 * **障碍二：`typeof` 语义与取值抛错不可兼得。**
 * 在 vm 内部装 getter 后，`typeof X` 也会抛错——这是语言规范决定的：
 * `typeof` 只在标识符**完全未声明**时才返回 `'undefined'`，对「已声明但
 * 取值抛错」的绑定会传播错误。
 *
 * 于是 ADR-0002 原本的两条要求在同一属性上冲突：
 * - 「`typeof X` 返回 `'undefined'` 不抛错」
 * - 「取值抛结构化错误」
 *
 * 大量目标脚本用 `typeof X === 'undefined'` 做特性探测，破坏它比缺少诊断
 * 更危险。因此默认方案改为**不修改全局**。
 *
 * ## 修订后的方案
 *
 * 默认：全局保持原状，`typeof` / `in` / 取值全部与浏览器一致（未装载即
 * 原生 `ReferenceError`）。诊断通过**查询 API** 提供：
 *
 * ```js
 * realm.explainMissingGlobal('document')
 * // { globalName, capability, plugin, loadedCapabilities }
 *
 * realm.diagnoseError(error)   // 从 ReferenceError 反查建议
 * ```
 *
 * 可选：`capabilityDiagnostics: 'strict'` 显式开启 getter 模式，取值给出
 * 结构化错误。代价是 `typeof` 探测会抛错，仅适合调试期。
 */

/** 诊断错误码 */
export const MISSING_CAPABILITY_CODE = 'ERR_NV8_CAPABILITY_NOT_LOADED';

/**
 * 不应安装诊断的全局名。
 *
 * 这些是 Window 接口的**成员属性/方法**，不是能力入口全局。
 * 为它们安装诊断会偏离浏览器行为：
 *
 * - `onmessage` / `onmessageerror`：事件处理器属性。浏览器里未设置时
 *   返回 `null`，不是抛错。抛错会让 `if (self.onmessage)` 这类写法失败。
 * - `postMessage`：方法而非构造函数。它的缺失已经能从
 *   `MessageChannel` / `MessagePort` 的诊断里得到提示。
 */
export const DIAGNOSTIC_EXEMPT_GLOBALS = Object.freeze(new Set([
  'onmessage',
  'onmessageerror',
  'postMessage',
]));

/**
 * 缺失能力错误。
 *
 * 继承 `ReferenceError` 而非 `Error`：目标脚本里常见
 * `try { X } catch (e) { if (e instanceof ReferenceError) ... }` 这类判断，
 * 换基类会改变脚本走向。
 */
export class CapabilityNotLoadedError extends ReferenceError {
  constructor({ globalName, capability, plugin, loadedCapabilities }) {
    const hint = plugin === null
      ? `no registered plugin provides "${globalName}"`
      : `load plugin "${plugin}"`;
    super(
      `${globalName} is not defined: capability "${capability}" was not loaded; ${hint}`
    );
    this.name = 'CapabilityNotLoadedError';
    this.code = MISSING_CAPABILITY_CODE;
    this.globalName = globalName;
    this.capability = capability;
    this.plugin = plugin;
    this.loadedCapabilities = Object.freeze([...(loadedCapabilities ?? [])].sort());
  }
}

/**
 * 从插件源码静态解析「全局名 → 提供者」映射。
 *
 * 为何静态解析而不是执行 `install()`：
 *
 * 最初的实现是在采集模式下调用 `install()` 并捕获
 * `reserveGlobalSurface()`。但 28 个插件里有 7 个的 `install()` 依赖真实
 * sandbox/config（如读 `config.url`），存根不够就抛错，导致 `document`、
 * `Worker` 等关键全局采集不到。把存根补到够用等于猜测每个插件需要什么，
 * 脉络很脆。
 *
 * 静态解析不需要模拟运行环境。代价是拿不到非字面量参数——实测 118 处调用
 * 中 115 处是字面量，剩下 3 处是多行排版的字面量，正则跨行匹配即可覆盖。
 *
 * @param {readonly object[]} plugins
 * @returns {Promise<Map<string, { plugin: string, capability: string }>>}
 */
export async function collectGlobalSurfaceMap(plugins) {
  const { readFile } = await import('node:fs/promises');
  const map = new Map();

  for (const plugin of plugins ?? []) {
    if (typeof plugin?.id !== 'string') continue;

    const source = await readPluginSource(plugin, readFile);
    if (source === null) continue;

    const capability = plugin.capabilities?.[0] ?? plugin.id;
    for (const name of parseReservedSurfaces(source)) {
      if (map.has(name)) continue;
      map.set(name, { plugin: plugin.id, capability });
    }
  }

  return map;
}

/**
 * 从源码提取 `reserveGlobalSurface()` 的字面量参数。
 *
 * 正则允许跨行，因为部分调用被格式化成多行。
 *
 * @param {string} source
 * @returns {string[]}
 */
export function parseReservedSurfaces(source) {
  const names = [];
  const pattern = /reserveGlobalSurface\(\s*[^,]+,\s*["'`]([^"'`]+)["'`]\s*,?\s*\)/g;
  for (const match of source.matchAll(pattern)) {
    names.push(match[1]);
  }
  return names;
}

async function readPluginSource(plugin, readFile) {
  const candidates = [];
  if (typeof plugin.sourceUrl === 'string' || plugin.sourceUrl instanceof URL) {
    candidates.push(plugin.sourceUrl);
  }
  const shortName = plugin.id.replace(/^@nv8\/plugin-/, '');
  candidates.push(new URL(`../plugins/${shortName}/index.js`, import.meta.url));

  for (const candidate of candidates) {
    try {
      return await readFile(candidate, 'utf8');
    } catch {
      // 试下一个候选
    }
  }
  return null;
}

/**
 * 创建诊断查询器。
 *
 * 这是**默认**诊断途径：不修改 Realm 全局，因此 `typeof` / `in` / 取值
 * 语义与浏览器完全一致。
 *
 * @param {object} options
 * @param {Map<string, object>} options.surfaceMap
 * @param {readonly string[]} [options.loadedCapabilities]
 * @param {(name: string) => boolean} [options.isLoaded] 判断某全局是否已装载
 * @returns {Readonly<object>}
 */
export function createCapabilityExplainer(options = {}) {
  const surfaceMap = options.surfaceMap ?? new Map();
  const loadedCapabilities = Object.freeze(
    [...(options.loadedCapabilities ?? [])].sort()
  );
  const isLoaded = options.isLoaded ?? (() => false);

  /** 从 ReferenceError 消息里提取标识符 */
  const extractName = (message) => {
    const match = /^(\w[\w$]*) is not defined/.exec(String(message ?? ''));
    return match === null ? null : match[1];
  };

  /**
   * 解释某个全局为何不可用。已装载或名字未知时返回 null。
   *
   * 用闭包内具名函数而非对象方法 + `this`：查询器常被解构使用
   * （`const { diagnose } = realm.capabilityExplainer`），依赖 `this`
   * 会在那种写法下静默失效。
   */
  function explain(globalName) {
    if (isLoaded(globalName)) return null;
    const provider = surfaceMap.get(globalName);
    if (provider === undefined) return null;
    return Object.freeze({
      globalName,
      capability: provider.capability,
      plugin: provider.plugin,
      loadedCapabilities,
    });
  }

  /**
   * 把 `ReferenceError` 转成结构化诊断，无法解释时返回 null。
   *
   * 不用 `error instanceof Error` 判类型：错误从 vm context 抛出时，
   * vm 内部的 `Error` 与宿主的 `Error` 是不同的构造函数，跨 Realm
   * `instanceof` 恒为 false。实测就是这个原因让 diagnose 一直返回 null。
   * 改为鸭子类型检查 message 字段。
   */
  function diagnose(error) {
    if (error === null || typeof error !== 'object') return null;
    if (typeof error.message !== 'string') return null;
    const name = extractName(error.message);
    if (name === null) return null;
    const explanation = explain(name);
    if (explanation === null) return null;
    return new CapabilityNotLoadedError(explanation);
  }

  /** 给定一组全局名，反推应加载的插件 */
  function suggest(globalNames) {
    return suggestPluginsFor(surfaceMap, globalNames);
  }

  return Object.freeze({
    loadedCapabilities,
    explain,
    diagnose,
    suggest,
  });
}

/**
 * 严格模式：在 Realm **内部**为未装载的全局安装抛错 getter。
 *
 * 必须在 vm 内部执行 `defineProperty`——宿主侧新增的访问器不会同步进
 * contextified global（见文件头说明）。
 *
 * **代价**：`typeof X` 也会抛错，破坏特性探测。仅适合调试期显式开启。
 *
 * **注意**：getter 抛出的错误由 vm Realm 构造，其 `loadedCapabilities` 等
 * 数组属性是 vm 的 Array。宿主侧比较时用 `[...arr]` 或 `deepEqual`，
 * `deepStrictEqual` 会因构造函数不同而失败。
 *
 * @param {object} options
 * @param {(source: string) => unknown} options.evaluate Realm 内求值函数
 * @param {Map<string, object>} options.surfaceMap
 * @param {readonly string[]} [options.loadedCapabilities]
 * @returns {string[]} 实际安装了诊断的全局名
 */
export function installStrictCapabilityDiagnostics(options = {}) {
  const { evaluate, surfaceMap = new Map(), loadedCapabilities = [] } = options;
  if (typeof evaluate !== 'function') {
    throw new TypeError('installStrictCapabilityDiagnostics requires an evaluate function');
  }

  const targets = [];
  for (const [globalName, provider] of surfaceMap) {
    if (DIAGNOSTIC_EXEMPT_GLOBALS.has(globalName)) continue;
    targets.push({
      name: globalName,
      capability: provider.capability,
      plugin: provider.plugin,
    });
  }
  if (targets.length === 0) return [];

  const installed = evaluate(`(() => {
    const targets = ${JSON.stringify(targets)};
    const loaded = ${JSON.stringify([...loadedCapabilities].sort())};
    const code = ${JSON.stringify(MISSING_CAPABILITY_CODE)};
    const installed = [];
    for (const target of targets) {
      if (target.name in globalThis) continue;
      Object.defineProperty(globalThis, target.name, {
        get() {
          const hint = target.plugin === null
            ? 'no registered plugin provides "' + target.name + '"'
            : 'load plugin "' + target.plugin + '"';
          const error = new ReferenceError(
            target.name + ' is not defined: capability "' + target.capability
            + '" was not loaded; ' + hint,
          );
          error.name = 'CapabilityNotLoadedError';
          error.code = code;
          error.globalName = target.name;
          error.capability = target.capability;
          error.plugin = target.plugin;
          error.loadedCapabilities = loaded;
          throw error;
        },
        configurable: true,
        enumerable: false,
      });
      installed.push(target.name);
    }
    return installed.sort();
  })()`);

  // 复制成宿主数组：vm 内部返回的 Array 与宿主 Array 不是同一构造函数，
  // 直接外传会让调用方的 Array.isArray / deepStrictEqual 等操作出意外
  // （与跨 Realm `instanceof Error` 同源的问题）。
  return installed === null || installed === undefined
    ? []
    : Array.from(installed, (name) => String(name));
}

/**
 * 移除严格模式诊断，恢复无痕状态。
 *
 * @param {(source: string) => unknown} evaluate
 * @param {readonly string[]} globalNames
 */
export function removeStrictCapabilityDiagnostics(evaluate, globalNames) {
  if (typeof evaluate !== 'function' || !Array.isArray(globalNames)) return;
  if (globalNames.length === 0) return;
  evaluate(`(() => {
    for (const name of ${JSON.stringify([...globalNames])}) {
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
      if (descriptor && typeof descriptor.get === 'function') delete globalThis[name];
    }
  })()`);
}

/**
 * 给定全局名，查询应加载哪个插件。
 *
 * @param {Map<string, object>} surfaceMap
 * @param {readonly string[]} globalNames
 * @returns {{ plugins: string[], capabilities: string[], unknown: string[] }}
 */
export function suggestPluginsFor(surfaceMap, globalNames) {
  const plugins = new Set();
  const capabilities = new Set();
  const unknown = [];

  for (const name of globalNames ?? []) {
    const provider = surfaceMap.get(name);
    if (provider === undefined) {
      unknown.push(name);
      continue;
    }
    plugins.add(provider.plugin);
    capabilities.add(provider.capability);
  }

  return {
    plugins: [...plugins].sort(),
    capabilities: [...capabilities].sort(),
    unknown: unknown.sort(),
  };
}
