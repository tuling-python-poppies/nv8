import { installEventTarget } from "../../install/install-event-target.js";
import { installEvent } from "../../install/install-event.js";
import { installCustomEvent } from "../../install/install-custom-event.js";

const EVENTS_INSTALLER_URL = new URL(
  "../../install/install-events.js",
  import.meta.url,
);

/**
 * @nv8/plugin-events
 * 
 * Event 和 EventTarget 基础
 * 
 * 提供能力：
 * - events.base: Event, CustomEvent, EventTarget
 */
export const eventsPlugin = {
  id: "@nv8/plugin-events",
  version: "1.0.0",
  capabilities: ["events.base"],
  dependencies: ["@nv8/plugin-webidl"],
  supports: { realms: ['root', 'iframe', 'worker', 'worklet'] },
  
  install(sandbox, registry, config) {
    // 安装 EventTarget
    installEventTarget();
    
    // 安装 Event
    installEvent();
    
    // 安装 CustomEvent
    installCustomEvent();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "EventTarget");
    registry.reserveGlobalSurface(this.id, "Event");
    registry.reserveGlobalSurface(this.id, "CustomEvent");
    registry.reserveGlobalSurface(this.id, "AnimationEvent");
    registry.reserveGlobalSurface(this.id, "CloseEvent");
    registry.reserveGlobalSurface(this.id, "ErrorEvent");
    registry.reserveGlobalSurface(this.id, "FormDataEvent");
    registry.reserveGlobalSurface(this.id, "HashChangeEvent");
    registry.reserveGlobalSurface(this.id, "MediaQueryListEvent");
    registry.reserveGlobalSurface(this.id, "PageTransitionEvent");
    registry.reserveGlobalSurface(this.id, "PopStateEvent");
    registry.reserveGlobalSurface(this.id, "ProgressEvent");
    registry.reserveGlobalSurface(this.id, "PromiseRejectionEvent");
    registry.reserveGlobalSurface(this.id, "StorageEvent");
    registry.reserveGlobalSurface(this.id, "SubmitEvent");
    registry.reserveGlobalSurface(this.id, "ToggleEvent");
    registry.reserveGlobalSurface(this.id, "TrackEvent");
    registry.reserveGlobalSurface(this.id, "TransitionEvent");
    registry.reserveGlobalSurface(this.id, "MutationObserver");
    registry.reserveGlobalSurface(this.id, "MutationRecord");
    registry.reserveGlobalSurface(this.id, "WebKitMutationObserver");
  },
  
  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(EVENTS_INSTALLER_URL);
    if (!module?.namespace?.installEvents) {
      throw new Error('Realm module loader cannot install Events');
    }
    module.namespace.installEvents();
    context.exports.events = true;
  },
  
  reset(sandbox, registry) {
    // Event 系统不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
