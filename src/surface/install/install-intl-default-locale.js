import {
  registerNativeFunction,
} from "../../engine/webidl/native-function.js";

/**
 * 让 `Intl` 的**默认 locale** 跟随 profile，而不是跟随宿主机器。
 *
 * ## 为什么必须做这件事
 *
 * 实测（Windows，中文系统）：
 *
 * ```
 * profile 声明 locale=en-US / navigator.language=en-US
 *   Intl.DateTimeFormat().resolvedOptions().locale  → "zh-CN"   ← 宿主机器的
 *   new Intl.ListFormat().format(['a','b','c'])     → "a、b和c"  ← 宿主机器的
 * ```
 *
 * 也就是说 `Intl` 的默认 locale 来自操作系统，**profile 完全不起作用**。后果有两层：
 *
 * 1. **内部矛盾**：`navigator.language` 说 en-US，而 `Intl` 说 zh-CN。
 *    `Intl.DateTimeFormat().resolvedOptions()` 与 `navigator.language` 是最常被
 *    一起读的一对字段，对不上是一眼可见的伪造痕迹。
 * 2. **身份随机器变**：同一个 profile 在中文机器上和英文机器上给出不同身份。
 *    这与 ADR-0005 的铁律直接冲突，也与 `module-bundle.json` 那次「本机命中率恒为 0」
 *    是同一类错——把宿主环境的偶然属性当成了产品行为。
 *
 * 真实浏览器的默认 locale 是**浏览器 UI 语言**（等于 `navigator.language`），
 * 不是操作系统语言。所以这里用 `navigator.language` 作为默认 locale。
 *
 * ## 为什么只能在 Realm 里做
 *
 * Node 的 ICU 默认 locale 由操作系统决定，实测**改不了**：
 *
 * - `LANG` / `LC_ALL` 环境变量在 Windows 上不生效（仍返回 zh-CN）
 * - 没有 `--icu-default-locale` 这个 flag（`node: bad option`）
 * - `vm.createContext()` 没有 locale 选项
 *
 * 所以只能在 Realm 内接管：**只在调用方没传 locales 时**替换成 profile 的 locale。
 * 显式传了 locale 的调用一律原样透传——包装的目的是修默认值，不是改语义。
 *
 * ## 身份保全
 *
 * 每个包装都要保住 `name` / `length` / `prototype` / `prototype.constructor` /
 * 静态方法 / 原生 `toString`。少一个就换来一个新的可检测面：
 * 比如不改 `prototype.constructor`，`new Intl.NumberFormat().constructor ===
 * Intl.NumberFormat` 就会变成 false。
 */

/** 带默认 locale 的 `Intl` 构造器。 */
const INTL_CONSTRUCTORS = [
  "Collator",
  "DateTimeFormat",
  "DisplayNames",
  "DurationFormat",
  "ListFormat",
  "NumberFormat",
  "PluralRules",
  "RelativeTimeFormat",
  "Segmenter",
];

/**
 * 带默认 locale 的原型方法，`[宿主对象, 方法名, locales 参数位置]`。
 *
 * `localeCompare` 的 locales 在第 2 位，其余都在第 1 位。位置写错会把用户传的
 * 参数挤掉，那比不修更糟。
 */
const LOCALE_METHODS = [
  [Date.prototype, "toLocaleString", 0],
  [Date.prototype, "toLocaleDateString", 0],
  [Date.prototype, "toLocaleTimeString", 0],
  [Number.prototype, "toLocaleString", 0],
  [BigInt.prototype, "toLocaleString", 0],
  [String.prototype, "localeCompare", 1],
  [String.prototype, "toLocaleUpperCase", 0],
  [String.prototype, "toLocaleLowerCase", 0],
];

/**
 * @param {string} locale profile 的 `navigator.language`
 */
export function installIntlDefaultLocale(locale) {
  const normalized = `${locale ?? ""}`;
  if (normalized === "") return;

  for (const name of INTL_CONSTRUCTORS) {
    const original = Intl[name];
    if (typeof original !== "function") continue;
    Intl[name] = wrapIntlConstructor(original, name, normalized);
  }

  for (const [target, name, localesIndex] of LOCALE_METHODS) {
    const original = target[name];
    if (typeof original !== "function") continue;
    target[name] = wrapLocaleMethod(original, name, localesIndex, normalized);
  }
}

function wrapIntlConstructor(original, name, locale) {
  const wrapper = function (...args) {
    const patched = withDefaultLocale(args, 0, locale);
    // `Intl.NumberFormat(...)` 不带 new 也合法，两条路都要转发。
    // `new.target` 透传是为了让子类化仍然工作。
    return new.target === undefined
      ? Reflect.apply(original, this, patched)
      : Reflect.construct(original, patched, new.target);
  };

  // name / length 必须与原构造器一致。当前没有逐项比 Intl arity 的断言
  // （behavior probe 只抽查少数接口，edge-lengths fixture 只是采集产物），
  // 但包装函数少这两个属性就多一个可检测面，保持一致零成本。
  Object.defineProperty(wrapper, "name", { value: name, configurable: true });
  Object.defineProperty(wrapper, "length", {
    value: original.length,
    configurable: true,
  });
  wrapper.prototype = original.prototype;
  // 不改 constructor 回链的话
  // `new Intl.NumberFormat().constructor === Intl.NumberFormat` 会变 false。
  Object.defineProperty(original.prototype, "constructor", {
    value: wrapper,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  // 静态方法（supportedLocalesOf 等）连同 descriptor 一起搬过来
  for (const key of Reflect.ownKeys(original)) {
    if (["name", "length", "prototype"].includes(key)) continue;
    const descriptor = Object.getOwnPropertyDescriptor(original, key);
    if (descriptor !== undefined) Object.defineProperty(wrapper, key, descriptor);
  }
  registerNativeFunction(wrapper, name);
  return wrapper;
}

function wrapLocaleMethod(original, name, localesIndex, locale) {
  const wrapper = function (...args) {
    return Reflect.apply(original, this, withDefaultLocale(args, localesIndex, locale));
  };
  Object.defineProperty(wrapper, "name", { value: name, configurable: true });
  Object.defineProperty(wrapper, "length", {
    value: original.length,
    configurable: true,
  });
  registerNativeFunction(wrapper, name);
  return wrapper;
}

/**
 * 只在该位置**没有值**时填入默认 locale。
 *
 * 判据是 `undefined`，与规范一致：`undefined` 表示「用默认」，而 `null` /
 * `[]` 是调用方明确给出的值，不能替换——那会改变语义而不只是改默认值。
 */
function withDefaultLocale(args, index, locale) {
  if (args.length > index && args[index] !== undefined) return args;
  const patched = [...args];
  while (patched.length <= index) patched.push(undefined);
  patched[index] = locale;
  return patched;
}
