import { installHTMLElement } from "../../install/install-html-element.js";
import { installHTMLUnknownElement } from "../../install/install-html-unknown-element.js";
import { installHTMLDivElement } from "../../install/install-html-div-element.js";
import { installHTMLSpanElement } from "../../install/install-html-span-element.js";
import { installHTMLAnchorElement } from "../../install/install-html-anchor-element.js";
import { installHTMLImageElement } from "../../install/install-html-image-element.js";
import { installHTMLScriptElement } from "../../install/install-html-script-element.js";
import { installHTMLLinkElement } from "../../install/install-html-link-element.js";
import { installHTMLStyleElement } from "../../install/install-html-style-element.js";
import { installHTMLMetaElement } from "../../install/install-html-meta-element.js";
import { installHTMLHeadElement } from "../../install/install-html-head-element.js";
import { installHTMLBodyElement } from "../../install/install-html-body-element.js";
import { installHTMLFormElement } from "../../install/install-html-form-element.js";
import { installHTMLInputElement } from "../../install/install-html-input-element.js";
import { installHTMLButtonElement } from "../../install/install-html-button-element.js";
import { installHTMLTextAreaElement } from "../../install/install-html-text-area-element.js";
import { installHTMLSelectElement } from "../../install/install-html-select-element.js";
import { installHTMLOptionElement } from "../../install/install-html-option-element.js";
import { installHTMLIFrameElement } from "../../install/install-html-iframe-element.js";
import { installHTMLCanvasElement } from "../../install/install-html-canvas-element.js";

const HTML_ELEMENTS_INSTALLER_URL = new URL(
  "../../install/install-html-elements.js",
  import.meta.url,
);
const IFRAME_REALMS_INSTALLER_URL = new URL(
  "../../install/install-iframe-realms.js",
  import.meta.url,
);

/**
 * @nv8/plugin-html-elements
 * 
 * HTML 元素类型（除媒体元素外）
 * 
 * 提供能力：
 * - html.base: HTMLElement 基类
 * - html.structural: div, span, body, head 等结构元素
 * - html.interactive: a, form, input, button 等交互元素
 * - html.embedded: iframe, canvas, img 等嵌入元素
 */
export const htmlElementsPlugin = {
  id: "@nv8/plugin-html-elements",
  version: "1.0.0",
  capabilities: ["html.base", "html.structural", "html.interactive", "html.embedded"],
  dependencies: ["@nv8/plugin-dom-core", "@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装基础 HTML 元素
    installHTMLElement();
    installHTMLUnknownElement();
    
    // 安装结构元素
    installHTMLDivElement();
    installHTMLSpanElement();
    installHTMLHeadElement();
    installHTMLBodyElement();
    
    // 安装交互元素
    installHTMLAnchorElement();
    installHTMLFormElement();
    installHTMLInputElement();
    installHTMLButtonElement();
    installHTMLTextAreaElement();
    installHTMLSelectElement();
    installHTMLOptionElement();
    
    // 安装嵌入元素
    installHTMLImageElement();
    installHTMLIFrameElement();
    installHTMLCanvasElement();
    
    // 安装文档元素
    installHTMLScriptElement();
    installHTMLLinkElement();
    installHTMLStyleElement();
    installHTMLMetaElement();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "HTMLElement");
    registry.reserveGlobalSurface(this.id, "HTMLUnknownElement");
    registry.reserveGlobalSurface(this.id, "HTMLDivElement");
    registry.reserveGlobalSurface(this.id, "HTMLSpanElement");
    registry.reserveGlobalSurface(this.id, "HTMLAnchorElement");
    registry.reserveGlobalSurface(this.id, "HTMLImageElement");
    registry.reserveGlobalSurface(this.id, "HTMLScriptElement");
    registry.reserveGlobalSurface(this.id, "HTMLLinkElement");
    registry.reserveGlobalSurface(this.id, "HTMLStyleElement");
    registry.reserveGlobalSurface(this.id, "HTMLMetaElement");
    registry.reserveGlobalSurface(this.id, "HTMLHeadElement");
    registry.reserveGlobalSurface(this.id, "HTMLBodyElement");
    registry.reserveGlobalSurface(this.id, "HTMLFormElement");
    registry.reserveGlobalSurface(this.id, "HTMLInputElement");
    registry.reserveGlobalSurface(this.id, "HTMLButtonElement");
    registry.reserveGlobalSurface(this.id, "HTMLTextAreaElement");
    registry.reserveGlobalSurface(this.id, "HTMLSelectElement");
    registry.reserveGlobalSurface(this.id, "HTMLOptionElement");
    registry.reserveGlobalSurface(this.id, "HTMLIFrameElement");
    registry.reserveGlobalSurface(this.id, "HTMLCanvasElement");
  },
  
  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(HTML_ELEMENTS_INSTALLER_URL);
    if (!module?.namespace?.installHTMLElementFamily) {
      throw new Error('Realm module loader cannot install HTML elements');
    }
    module.namespace.installHTMLElementFamily();
    const iframeInstaller = await context.moduleLoader?.importUrlAsync(
      IFRAME_REALMS_INSTALLER_URL,
    );
    iframeInstaller?.namespace?.installIFrameRealms?.(
      context.runtime?.childRealmFactory ?? null,
      context.pageUrl,
    );
    context.exports.htmlElements = true;
  },
  
  reset(sandbox, registry) {
    // HTML 元素不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
