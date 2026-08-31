import { CSS_PROPERTY_NAMES } from "./css-property-names.js";
import {
  normalizeCSSPropertyName,
  parseCSSDeclarations,
  readCSSDeclarations,
  serializeCSSDeclarations,
  writeCSSDeclarations,
} from "./css-style-declaration-state.js";

/**
 * 每个 style 对象上的 CSS 属性访问器。
 *
 * ## 为什么装在**实例**上而不是原型上
 *
 * 真实 Edge 151 实测：
 *
 * ```
 * Object.getOwnPropertyNames(CSSStyleDeclaration.prototype).length  → 10
 * Object.getOwnPropertyNames(div.style).length                      → 745
 * ```
 *
 * 原型上只有 `constructor` / `cssText` / `cssFloat` / `getPropertyValue` /
 * `setProperty` / `removeProperty` / `item` / `length` / `parentRule` /
 * `getPropertyPriority` 这 10 个；CSS 属性全部是 style 对象的自有属性。
 * 装到原型上会让 `edge-member-parity` 报 745 个多余成员。
 *
 * ## 已知的形状偏差
 *
 * 真实 Edge 里这些是**可写数据属性**（`writable: true`，`value: ""`），
 * 由 V8 的 named property interceptor 在赋值时拦截。纯 JS 复刻不出「数据属性
 * 同时拦截赋值」——只能用访问器或 Proxy：
 *
 * - **访问器**（当前选择）：功能完全正确（`cssText` 与 `style` 属性自动同步），
 *   代价是 `getOwnPropertyDescriptor` 显示 `get`/`set` 而不是 `value`/`writable`。
 * - **Proxy**：descriptor 形状可以伪装成数据属性，但引入代理对象自身的可检测面。
 *
 * 选访问器是因为读写语义正确比 descriptor 形状更重要——脚本天天读写
 * `el.style.display`，极少去查它的 descriptor。这条偏差登记在
 * `tests/edge-behavior-parity-test.js`。
 *
 * ## 未设置的属性读作空字符串
 *
 * 迁移前未设置的属性读作 `undefined`（原型上压根没有这些访问器），
 * 于是 `typeof el.style.display` 是 `'undefined'` 而不是 `'string'`。
 * 这是最常被触碰的行为，脚本里 `el.style.display === 'none'` 这类判断到处都是。
 */

/** 从 fixture 采集的真实属性名清单，顺序即真实枚举顺序。 */
let propertyNames = CSS_PROPERTY_NAMES;

/**
 * 注入 CSS 属性名清单。
 *
 * 由安装层在启动时调用，避免运行时模块去读文件。
 *
 * @param {string[]} names
 */
export function configureCSSPropertyNames(names) {
  propertyNames = Object.freeze([...names]);
}

/**
 * 当前生效的属性名清单。
 *
 * @returns {readonly string[]}
 */
export function cssPropertyNames() {
  return propertyNames;
}

/**
 * 在一个 style 对象上安装全部 CSS 属性访问器。
 *
 * 惰性调用（首次访问元素的 `.style` 时），单个对象约 0.26ms。
 *
 * @param {object} declaration
 * @param {boolean} [readonly] computed style 为只读
 */
export function installCSSPropertyAccessors(declaration, readonly = false) {
  const names = cssPropertyNames();
  for (const name of names) {
    const cssName = normalizeCSSPropertyName(name);
    Object.defineProperty(declaration, name, {
      get() {
        return readCSSDeclarations(this).get(cssName)?.value ?? "";
      },
      set(value) {
        if (readonly) {
          // 真实 Edge 实测：computed style 赋值抛 NoModificationAllowedError，
          // 而不是静默忽略。
          throw createNoModificationAllowedError(name);
        }
        const declarations = readCSSDeclarations(this);
        const text = `${value}`.trim();
        if (text === "") declarations.delete(cssName);
        else declarations.set(cssName, { value: text, priority: "" });
        writeCSSDeclarations(this, declarations);
      },
      enumerable: true,
      configurable: true,
    });
  }
}

/**
 * 构造与真实浏览器同文案的 NoModificationAllowedError。
 *
 * 真实 Edge 实测（文案里**属性名出现两次**，容易漏掉后半句）：
 * `Failed to set a named property 'color' on 'CSSStyleDeclaration':
 *  These styles are computed, and therefore the 'color' property is read-only.`
 *
 * @param {string} name
 * @returns {Error}
 */
function createNoModificationAllowedError(name) {
  const message = `Failed to set a named property '${name}' on `
    + `'CSSStyleDeclaration': These styles are computed, and therefore `
    + `the '${name}' property is read-only.`;
  const DOMExceptionConstructor = globalThis.DOMException;
  if (typeof DOMExceptionConstructor === "function") {
    return new DOMExceptionConstructor(message, "NoModificationAllowedError");
  }
  const error = new Error(message);
  error.name = "NoModificationAllowedError";
  return error;
}

export { parseCSSDeclarations, serializeCSSDeclarations };
