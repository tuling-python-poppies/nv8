const CANVAS_2D_INSTALLER_URL = new URL(
  "../../surface/install/install-canvas-2d.js",
  import.meta.url,
);

/**
 * @nv8/plugin-canvas
 *
 * Canvas 2D 表面。
 *
 * ## 它原来是个空壳
 *
 * `install()` 里只有一句「Canvas 实现待补充，暂时只提供占位」，却声明了
 * `canvas.base` 能力。后果不是「少装了点东西」，是**能力声明说谎**：profile
 * 认为 `canvas.base` 已提供，ADR-0002 那套缺失能力诊断因此看不见这个洞。
 * 实测加不加这个插件，surface 一模一样。
 *
 * 而 Canvas 本身早就实现了（`src/api/canvas/`）。plugin 模式下的症状是「半装」：
 * `HTMLCanvasElement` 由 `html-elements` 提供，`canvas.getContext('2d')` 也能拿到
 * 对象，但
 *
 *   typeof CanvasRenderingContext2D  → "undefined"
 *   String(ctx)                      → "[object Object]"
 *
 * 真实浏览器分别是 `"function"` 与 `"[object CanvasRenderingContext2D]"`。
 * 构造器没暴露、`Symbol.toStringTag` 没设，都是可检测特征。
 *
 * ## 为什么装在 activate 而不是 install
 *
 * `install(sandbox, registry, config)` 这种三参数签名会被 `normalizePlugin`
 * 判为 legacy，而 `installPlugin` 对 legacy 插件**直接跳过**——因为那些
 * `install-*` 函数操作的是宿主的 `globalThis`，在 Realm 建立之前跑会污染宿主进程。
 * 表面必须在 `activate` 里通过 Realm 的 moduleLoader 装（与 `dom-core` 一致）。
 *
 * `DOMMatrix` 刻意不在这里装：它不是 canvas 专属（SVG 与 Web Animations 也用），
 * 归 legacy 的几何段。plugin 模式下 `ctx.getTransform()` 因此仍不可用——那是
 * plugin 模式覆盖面的问题，不是这个插件的职责。
 */
export const canvasPlugin = {
  id: "@nv8/plugin-canvas",
  version: "1.0.0",
  capabilities: ["canvas.base"],
  dependencies: ["html.base"],

  install(sandbox, registry, config) {
    // 逐个字面量而不是循环：`collectGlobalSurfaceMap` 靠**静态正则**扫这些调用
    // （因为 7 个插件的 `install()` 依赖真实 sandbox/config，执行它取不到），
    // 变量参数解析不到。`HTMLCanvasElement` 归 html-elements，不在这里。
    registry.reserveGlobalSurface(this.id, "ImageData");
    registry.reserveGlobalSurface(this.id, "TextMetrics");
    registry.reserveGlobalSurface(this.id, "CanvasGradient");
    registry.reserveGlobalSurface(this.id, "CanvasPattern");
    registry.reserveGlobalSurface(this.id, "Path2D");
    registry.reserveGlobalSurface(this.id, "OffscreenCanvasRenderingContext2D");
    registry.reserveGlobalSurface(this.id, "CanvasRenderingContext2D");
    registry.reserveGlobalSurface(this.id, "OffscreenCanvas");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(CANVAS_2D_INSTALLER_URL);
    if (!module?.namespace?.installCanvas2D) {
      throw new Error('Realm module loader cannot install Canvas 2D');
    }
    module.namespace.installCanvas2D();
    context.exports.canvas2d = true;
  },

  reset(sandbox, registry) {
    // 无实例级状态：context 对象挂在各自的 canvas 元素上，随元素一起回收。
  },

  dispose(sandbox, registry) {
    // 同上。
  },
};
