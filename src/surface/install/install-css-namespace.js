import { defineGlobalConstructor } from "../../engine/webidl/descriptor.js";
import { createCSSNamespace } from "../api/css/css-namespace-global.js";

/**
 * 安装 `CSS` 命名空间全局。
 *
 * 命名空间对象的构造留在 api 文件里，全局定义走本仓库统一的 descriptor
 * helper。`CSS` 是普通对象（没有自己的 prototype），`defineGlobalConstructor`
 * 对它只做 value descriptor 安装，形状与 `enumerable: false` 的标准全局一致。
 */
export function installCSSNamespace() {
  defineGlobalConstructor("CSS", createCSSNamespace());
}
