import {
  registerNativeFunction,
} from "../../engine/webidl/native-function.js";

/**
 * 让 Realm 内 `Intl.DateTimeFormat` 与 `Date.prototype.toLocale*` 的
 * **默认 timeZone** 跟随 profile，而不是跟随宿主进程的 ICU 默认时区。
 *
 * ## 为什么需要它
 *
 * `child-process` 后端可以通过 `TZ` 环境变量让子进程的 ICU 使用 profile
 * 时区；但 `worker-thread` 后端与宿主共享同一份 ICU 状态，线程级 `TZ`
 * 不会改写已初始化的默认时区。实测表现：
 *
 *   profile.timezone = "Asia/Shanghai"（宿主在 UTC 机器上）
 *   new Intl.DateTimeFormat().resolvedOptions().timeZone  → "UTC"
 *
 * 这是一个一眼可见的内部矛盾（`navigator` / `screen` 都按 profile，只有
 * 时区按宿主机），同类问题与此前的 Intl 默认 locale 完全一致（见
 * install-intl-default-locale.js）。
 *
 * ## 约束
 *
 * 只改 Realm 自己的 `Intl` / `Date.prototype`：本模块经 Realm 的
 * moduleLoader 求值，`Intl` 是 Realm 的绑定，不会影响 Node 宿主全局。
 *
 * 只在调用方**没有提供 timeZone** 时注入默认值；显式传入的 timeZone
 * （包括 `undefined` 以外的任何值）原样透传。身份保全与 locale 版本一致：
 * `name` / `length` / `prototype` / `prototype.constructor` / 静态方法 /
 * 原生 toString 全部保持。
 */

/** `Date.prototype` 上依赖默认时区的本地化方法。 */
const LOCALE_METHODS = [
  "toLocaleString",
  "toLocaleDateString",
  "toLocaleTimeString",
];

/**
 * @param {string} timeZone profile 的 `fingerprint.timezone`
 */
export function installIntlDefaultTimeZone(timeZone) {
  const normalized = `${timeZone ?? ""}`.trim();
  if (normalized === "") return;

  const Original = Intl.DateTimeFormat;
  if (typeof Original !== "function") return;

  const wrapper = function DateTimeFormat(...args) {
    const patched = withDefaultTimeZone(args, normalized);
    return new.target === undefined
      ? Reflect.apply(Original, this, patched)
      : Reflect.construct(Original, patched, new.target);
  };

  // name / length 必须与原构造器一致（edge-lengths fixture 会逐个比）
  Object.defineProperty(wrapper, "name", {
    value: "DateTimeFormat",
    configurable: true,
  });
  Object.defineProperty(wrapper, "length", {
    value: Original.length,
    configurable: true,
  });
  wrapper.prototype = Original.prototype;
  // 不改 constructor 回链的话
  // `new Intl.DateTimeFormat().constructor === Intl.DateTimeFormat` 会变 false。
  Object.defineProperty(Original.prototype, "constructor", {
    value: wrapper,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  for (const key of Reflect.ownKeys(Original)) {
    if (["name", "length", "prototype"].includes(key)) continue;
    const descriptor = Object.getOwnPropertyDescriptor(Original, key);
    if (descriptor !== undefined) Object.defineProperty(wrapper, key, descriptor);
  }
  registerNativeFunction(wrapper, "DateTimeFormat");
  Intl.DateTimeFormat = wrapper;

  for (const name of LOCALE_METHODS) {
    const original = Date.prototype[name];
    if (typeof original !== "function") continue;
    const method = function (...args) {
      return Reflect.apply(
        original,
        this,
        withDefaultTimeZone(args, normalized, /* optionsIndex */ 1),
      );
    };
    Object.defineProperty(method, "name", {
      value: name,
      configurable: true,
    });
    Object.defineProperty(method, "length", {
      value: original.length,
      configurable: true,
    });
    registerNativeFunction(method, name);
    Date.prototype[name] = method;
  }
}

/**
 * 只在目标位置**没有 timeZone** 时填入默认值。
 *
 * - DateTimeFormat：options 在参数 1，缺失/为 null 时补 `{ timeZone }`。
 * - Date.toLocale*：options 在参数 1，规则同上。
 *
 * `timeZone: undefined` 按规范表示「用默认」，因此也替换；`null` 等
 * 显式非法值不再动——那会改变错误语义。
 *
 * @param {unknown[]} args
 * @param {string} timeZone
 * @param {number} [optionsIndex=1]
 * @returns {unknown[]}
 */
function withDefaultTimeZone(args, timeZone, optionsIndex = 1) {
  const options = args[optionsIndex];
  if (options === undefined || options === null) {
    const patched = [...args];
    while (patched.length < optionsIndex) patched.push(undefined);
    patched[optionsIndex] = { timeZone };
    return patched;
  }
  if (typeof options === "object" && options.timeZone === undefined) {
    const patched = [...args];
    patched[optionsIndex] = { ...options, timeZone };
    return patched;
  }
  return args;
}
