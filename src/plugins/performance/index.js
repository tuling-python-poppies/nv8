import { installPerformance } from "../../surface/install/install-performance.js";
import { installPerformanceEntry } from "../../surface/install/install-performance-entry.js";
import { installPerformanceLongtail } from "../../surface/install/install-performance-longtail.js";

const PERFORMANCE_INSTALLER_URL = new URL(
  "../../surface/install/install-performance.js",
  import.meta.url,
);
const PERFORMANCE_ENTRY_INSTALLER_URL = new URL(
  "../../surface/install/install-performance-entry.js",
  import.meta.url,
);
const PERFORMANCE_LONGTAIL_INSTALLER_URL = new URL(
  "../../surface/install/install-performance-longtail.js",
  import.meta.url,
);

/**
 * @nv8/plugin-performance
 * 
 * Performance API
 * 
 * 提供能力：
 * - performance.base: Performance 对象和性能监控
 */
export const performancePlugin = {
  id: "@nv8/plugin-performance",
  version: "1.0.0",
  capabilities: ["performance.base"],
  dependencies: ["@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装 Performance API
    installPerformanceEntry();
    installPerformanceLongtail();
    installPerformance();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "Performance");
    registry.reserveGlobalSurface(this.id, "PerformanceEntry");
    registry.reserveGlobalSurface(this.id, "PerformanceObserver");
    registry.reserveGlobalSurface(this.id, "PerformanceObserverEntryList");
    registry.reserveGlobalSurface(this.id, "performance");
    registry.reserveGlobalSurface(this.id, "EventCounts");
    registry.reserveGlobalSurface(this.id, "LargestContentfulPaint");
    registry.reserveGlobalSurface(this.id, "LayoutShift");
    registry.reserveGlobalSurface(this.id, "LayoutShiftAttribution");
    registry.reserveGlobalSurface(this.id, "PerformanceElementTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceEventTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceLongAnimationFrameTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceLongTaskTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceNavigation");
    registry.reserveGlobalSurface(this.id, "PerformanceNavigationTiming");
    registry.reserveGlobalSurface(this.id, "PerformancePaintTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceResourceTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceScriptTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceServerTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceTiming");
    registry.reserveGlobalSurface(this.id, "PerformanceTimingConfidence");
    registry.reserveGlobalSurface(this.id, "TaskAttributionTiming");
    registry.reserveGlobalSurface(this.id, "VisibilityStateEntry");
  },

  async activate(context) {
    const installer = await context.moduleLoader?.importUrlAsync(PERFORMANCE_INSTALLER_URL);
    const entryInstaller = await context.moduleLoader?.importUrlAsync(PERFORMANCE_ENTRY_INSTALLER_URL);
    const longtailInstaller = await context.moduleLoader?.importUrlAsync(PERFORMANCE_LONGTAIL_INSTALLER_URL);
    if (!installer?.namespace?.installPerformance
      || !entryInstaller?.namespace?.installPerformanceEntry
      || !longtailInstaller?.namespace?.installPerformanceLongtail) {
      throw new Error('Realm module loader cannot install Performance');
    }
    entryInstaller.namespace.installPerformanceEntry();
    longtailInstaller.namespace.installPerformanceLongtail();
    installer.namespace.installPerformance();
    context.exports.performance = true;
  },
  
  async reset(context) {
    context.global.performance?.clearMarks?.();
    context.global.performance?.clearMeasures?.();
  },
  
  async dispose(context) {
    context.global.performance?.clearMarks?.();
    context.global.performance?.clearMeasures?.();
  },
};
