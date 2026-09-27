import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireDOMTokenList } from "./dom-token-list-state.js";
import { requireElement } from "./element-state.js";

// 各属性的“受支持 token 集合”与真实 Chromium(Edge 152 同源引擎)逐一实测对齐。
//
// supports() 与 add()/remove() 不同：它不做 token 合法性校验——空串、含空白的
// token 都只是“不在集合里”，返回 false 而不抛;比对前仅按 ASCII 小写归一
// (对应 Chromium 的 token.LowerASCII())。只有当该 DOMTokenList 关联的属性
// 根本没有受支持集合时(classList 的 class、element.part、output.htmlFor 等)
// 才抛 TypeError。
//
// 这些 Set 是纯查表常量、从不 mutate,跨 Realm 共享无可观察差异,因此
// audit:state 不计入(见 scripts/audit-module-state.mjs 对 const Set 的判定)。
const SANDBOX_TOKENS = new Set([
  "allow-downloads",
  "allow-forms",
  "allow-modals",
  "allow-orientation-lock",
  "allow-pointer-lock",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
  "allow-presentation",
  "allow-same-origin",
  "allow-same-site-none-cookies",
  "allow-scripts",
  "allow-storage-access-by-user-activation",
  "allow-top-navigation",
  "allow-top-navigation-by-user-activation",
]);

// <a> / <area> / <form> / SVG <a> 的 rel —— Chromium 只认这三个。
const REL_ANCHOR_TOKENS = new Set(["noopener", "noreferrer", "opener"]);

// <link> 的 rel —— 与 a/area/form 完全不同的集合。
const REL_LINK_TOKENS = new Set([
  "alternate",
  "apple-touch-icon",
  "canonical",
  "compression-dictionary",
  "dns-prefetch",
  "icon",
  "manifest",
  "modulepreload",
  "next",
  "preconnect",
  "prefetch",
  "preload",
  "prerender",
  "stylesheet",
]);

// script / style / link 的 blocking。
const BLOCKING_TOKENS = new Set(["render"]);

// video / audio 的 controlsList。
const CONTROLS_LIST_TOKENS = new Set([
  "nodownload",
  "nofullscreen",
  "noremoteplayback",
]);

function supportedTokenSet(state) {
  switch (state.attributeName) {
    case "sandbox":
      return SANDBOX_TOKENS;
    case "blocking":
      return BLOCKING_TOKENS;
    case "controlslist":
      return CONTROLS_LIST_TOKENS;
    case "rel":
      return requireElement(state.element).localName === "link"
        ? REL_LINK_TOKENS
        : REL_ANCHOR_TOKENS;
    default:
      // class / part / for 等没有受支持 token 的上下文。
      return null;
  }
}

export const supports = {
  supports(token) {
    const state = requireDOMTokenList(this);
    const set = supportedTokenSet(state);
    if (set === null) {
      throw new TypeError(
        "Failed to execute 'supports' on 'DOMTokenList': DOMTokenList has no supported tokens.",
      );
    }
    const normalized = `${token}`.replace(/[A-Z]/gu, (letter) => letter.toLowerCase());
    return set.has(normalized);
  },
}.supports;
registerNativeFunction(supports, "supports");
