import { installCanvasGradient } from './install-canvas-gradient.js';
import { installCanvasPattern } from './install-canvas-pattern.js';
import {
  installCanvasRenderingContext2D,
} from './install-canvas-rendering-context-2d.js';
import { installImageData } from './install-image-data.js';
import { installOffscreenCanvas } from './install-offscreen-canvas.js';
import {
  installOffscreenCanvasRenderingContext2D,
} from './install-offscreen-canvas-rendering-context-2d.js';
import { installPath2D } from './install-path-2d.js';
import { installTextMetrics } from './install-text-metrics.js';

/**
 * Canvas 2D 表面的聚合安装器。
 *
 * 顺序照 `bootstrap-root.js`：context 类要求 `CanvasGradient` /
 * `CanvasPattern` / `ImageData` / `TextMetrics` / `Path2D` 已经就绪。
 *
 * 存在的理由与 `install-dom-core.js` 相同——插件的 `activate` 钩子只能通过
 * Realm 的 moduleLoader 加载**一个**模块，安装函数必须在 Realm 的模块图里执行。
 * 从宿主侧直接 import 这些 `install-*` 会把表面装到宿主的 globalThis 上。
 */
export function installCanvas2D() {
  installImageData();
  installTextMetrics();
  installCanvasGradient();
  installCanvasPattern();
  installPath2D();
  installOffscreenCanvasRenderingContext2D();
  installCanvasRenderingContext2D();
  installOffscreenCanvas();
}
