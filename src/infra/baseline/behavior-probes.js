/**
 * 行为层对等性探针定义
 *
 * 前两层（全局名、原型成员名+descriptor）只看**形状**。这一层看**行为**：
 * 同一段代码在真实浏览器和 NV8 里跑出来的结果是否一致。
 *
 * ## 为什么探针定义要放在共享模块里
 *
 * 采集脚本（注入真实 Edge 页面）和测试（注入 NV8 沙箱）必须跑**完全相同**的
 * 表达式。各写一份必然漂移，漂移后比较结果就没有意义了。
 *
 * ## 探针的准入条件
 *
 * 每个探针的结果必须满足：
 *
 * 1. **跨运行确定** —— 同一环境重复跑结果相同。沿用 observability 的规则：
 *    字段只要在重复运行间变化，它就不属于行为契约。
 *  2. **与机器无关** —— 不能依赖 CPU 核数、内存、屏幕、语言、时区、GPU 型号。
 *    这些是机器指纹，照抄反而把环境钉死在一台机器上。
 * 3. **可序列化** —— 结果要能进 JSON 并逐字比较。
 *
 * 因此探针只取「结构性事实」：报错类型与文案、`toString` 形态、
 * 类型标签、非法接收者的行为。这些在真实浏览器里由引擎固定产出，
 * 而恰恰是检测脚本最常摸的地方。
 *
 * ## 分类
 *
 * - `nativeToString` —— 原生函数的 `toString()` 形态
 * - `illegalInvocation` —— 用错接收者调用访问器/方法
 * - `argumentCount` —— 少传参数时的 WebIDL 报错
 * - `constructorGuard` —— 不带 `new` 调用构造器
 * - `typeTag` —— `Object.prototype.toString.call()` 与 `Symbol.toStringTag`
 * - `arityMetadata` —— 方法与构造器的 `length`（WebIDL 的必需参数个数）
 * - `errorShape` —— `Error.stack` 首行、错误构造器身份、`toString` 形态
 * - `collections` —— 集合类的可迭代性与类型标签
 * - `worker` —— Worker 构造器、实例和终止行为
 * - `cssom` —— UA 默认样式表决定的计算值与 CSSStyleDeclaration 语义
 * - `canvas` —— Canvas / TextMetrics 的接口形状（**不含字形宽度**）
 * - `fontMetrics` —— 字体声明解析与稳定 TextMetrics 关系（**不含绝对字宽**）
 * - `domRange` —— Range 边界、文本克隆和 Selection 初始语义
 * - `eventTiming` —— 事件阶段、传播中断、once / 重复监听器语义
 * - `crossRealm` —— iframe Realm 的对象身份、跨 Realm `instanceof`、自引用
 * - `urlParsing` —— `new URL()` 的校验与规范化
 * - `svg` —— SVG 元素、命名空间和几何接口的稳定语义
 * - `observers` —— Mutation/Resize/IntersectionObserver 的同步接口语义
 * - `animations` —— Web Animations 默认状态与接口语义
 */

/**
 * 把任意求值结果压成可比较的形状。
 *
 * 报错统一取 `name` 与 `message`：真实 Chromium 的 WebIDL 报错文案是固定
 * 模板（例如 `Failed to execute 'X' on 'Y': N arguments required...`），
 * 文案本身就是可检测特征，不能只比 `name`。
 */
const NORMALIZE_HELPER = `
  const probe = (fn) => {
    let value;
    try {
      value = fn();
    } catch (error) {
      return { threw: true, name: String(error && error.name), message: String(error && error.message) };
    }
    return { threw: false, value: typeof value === 'string' ? value : String(value) };
  };
`;

/**
 * 探针清单。
 *
 * 每项 `{ id, category, expression }`，`expression` 必须是一个返回值可被
 * `probe()` 包裹的函数体表达式。
 */
export const BEHAVIOR_PROBES = Object.freeze([
  // ---------------------------------------------- 原生函数 toString
  // 检测脚本最常摸的一处：包装或用 JS 重实现的函数 toString 会露馅。
  {
    id: 'toString/addEventListener',
    category: 'nativeToString',
    expression: '() => EventTarget.prototype.addEventListener.toString()',
  },
  {
    id: 'toString/documentGetElementById',
    category: 'nativeToString',
    expression: '() => Document.prototype.getElementById.toString()',
  },
  {
    id: 'toString/getter-document-readyState',
    category: 'nativeToString',
    expression: "() => Object.getOwnPropertyDescriptor(Document.prototype, 'readyState').get.toString()",
  },
  {
    id: 'toString/Event-constructor',
    category: 'nativeToString',
    expression: '() => Event.toString()',
  },
  {
    id: 'toString/functionToString-itself',
    category: 'nativeToString',
    expression: '() => Function.prototype.toString.toString()',
  },
  {
    id: 'toString/name-of-getter',
    category: 'nativeToString',
    expression: "() => Object.getOwnPropertyDescriptor(Document.prototype, 'readyState').get.name",
  },
  {
    id: 'toString/length-of-addEventListener',
    category: 'nativeToString',
    expression: '() => String(EventTarget.prototype.addEventListener.length)',
  },

  // ---------------------------------------------- 非法接收者
  // 原型访问器套在普通对象上，真实浏览器抛 TypeError: Illegal invocation。
  {
    id: 'illegal/document-readyState-on-object',
    category: 'illegalInvocation',
    expression: "() => Object.getOwnPropertyDescriptor(Document.prototype, 'readyState').get.call({})",
  },
  {
    id: 'illegal/node-nodeType-on-object',
    category: 'illegalInvocation',
    expression: "() => Object.getOwnPropertyDescriptor(Node.prototype, 'nodeType').get.call({})",
  },
  {
    id: 'illegal/addEventListener-on-object',
    category: 'illegalInvocation',
    expression: "() => EventTarget.prototype.addEventListener.call({}, 'x', () => {})",
  },
  {
    id: 'illegal/event-type-on-object',
    category: 'illegalInvocation',
    expression: "() => Object.getOwnPropertyDescriptor(Event.prototype, 'type').get.call({})",
  },
  {
    id: 'illegal/blob-size-on-object',
    category: 'illegalInvocation',
    expression: "() => Object.getOwnPropertyDescriptor(Blob.prototype, 'size').get.call({})",
  },
  {
    id: 'illegal/getElementById-on-object',
    category: 'illegalInvocation',
    expression: "() => Document.prototype.getElementById.call({}, 'x')",
  },

  // ---------------------------------------------- 参数个数
  // Chromium 的模板：Failed to execute 'X' on 'Y': N arguments required, but only M present.
  {
    id: 'args/addEventListener-zero',
    category: 'argumentCount',
    expression: '() => document.addEventListener()',
  },
  {
    id: 'args/addEventListener-one',
    category: 'argumentCount',
    expression: "() => document.addEventListener('click')",
  },
  {
    id: 'args/getElementById-zero',
    category: 'argumentCount',
    expression: '() => document.getElementById()',
  },
  {
    id: 'args/createElement-zero',
    category: 'argumentCount',
    expression: '() => document.createElement()',
  },
  {
    id: 'args/dispatchEvent-zero',
    category: 'argumentCount',
    expression: '() => document.dispatchEvent()',
  },
  {
    id: 'args/dispatchEvent-wrong-type',
    category: 'argumentCount',
    expression: "() => document.dispatchEvent('not-an-event')",
  },
  {
    id: 'args/setAttribute-one',
    category: 'argumentCount',
    expression: "() => document.createElement('div').setAttribute('a')",
  },

  // ---------------------------------------------- 构造器守卫
  {
    id: 'ctor/Event-without-new',
    category: 'constructorGuard',
    expression: "() => Event('click')",
  },
  {
    id: 'ctor/Event-no-args',
    category: 'constructorGuard',
    expression: '() => new Event()',
  },
  {
    id: 'ctor/Blob-without-new',
    category: 'constructorGuard',
    expression: '() => Blob([])',
  },
  {
    id: 'ctor/Node-illegal',
    category: 'constructorGuard',
    expression: '() => new Node()',
  },
  {
    id: 'ctor/Document-allowed',
    category: 'constructorGuard',
    expression: '() => String(new Document() instanceof Document)',
  },

  // ---------------------------------------------- 实参个数（成体系检查）
  // 检查已下沉到 definePrototypeMethod / defineGlobalFunction，
  // 用 WebIDL 的 `length`（= 必需参数个数）自动推导，而不是逐个方法手写。
  {
    id: 'args/querySelector-zero',
    category: 'argumentCount',
    expression: '() => document.querySelector()',
  },
  {
    id: 'args/appendChild-zero',
    category: 'argumentCount',
    expression: '() => document.body.appendChild()',
  },
  {
    id: 'args/insertBefore-one',
    category: 'argumentCount',
    expression: "() => document.body.insertBefore(document.createElement('i'))",
  },
  {
    id: 'args/getAttribute-zero',
    category: 'argumentCount',
    expression: "() => document.createElement('div').getAttribute()",
  },
  {
    id: 'args/attachShadow-zero',
    category: 'argumentCount',
    expression: "() => document.createElement('div').attachShadow()",
  },
  {
    id: 'args/urlSearchParams-get-zero',
    category: 'argumentCount',
    expression: '() => new URLSearchParams().get()',
  },
  {
    id: 'args/headers-forEach-zero',
    category: 'argumentCount',
    expression: '() => new Headers().forEach()',
  },
  {
    id: 'args/domTokenList-forEach-zero',
    category: 'argumentCount',
    expression: "() => document.createElement('div').classList.forEach()",
  },
  {
    id: 'args/atob-zero',
    category: 'argumentCount',
    expression: '() => atob()',
  },
  {
    id: 'args/btoa-zero',
    category: 'argumentCount',
    expression: '() => btoa()',
  },
  {
    id: 'args/structuredClone-zero',
    category: 'argumentCount',
    expression: '() => structuredClone()',
  },
  {
    id: 'args/scrollTo-zero-allowed',
    category: 'argumentCount',
    expression: "() => { document.createElement('div').scrollTo(); return 'no-throw'; }",
  },

  // ---------------------------------------------- 方法 arity 元数据
  // WebIDL 的 length 等于必需参数个数。实测 3476 个方法全部一致，
  // 这里抽样锚定，防止将来包装方法时丢掉 length。
  {
    id: 'arity/addEventListener',
    category: 'arityMetadata',
    expression: '() => String(EventTarget.prototype.addEventListener.length)',
  },
  {
    id: 'arity/insertBefore',
    category: 'arityMetadata',
    expression: '() => String(Node.prototype.insertBefore.length)',
  },
  {
    id: 'arity/querySelector',
    category: 'arityMetadata',
    expression: '() => String(Document.prototype.querySelector.length)',
  },
  {
    id: 'arity/Event-constructor',
    category: 'arityMetadata',
    expression: '() => String(Event.length)',
  },
  {
    id: 'arity/Blob-constructor',
    category: 'arityMetadata',
    expression: '() => String(Blob.length)',
  },
  {
    id: 'arity/atob',
    category: 'arityMetadata',
    expression: '() => String(atob.length)',
  },
  {
    id: 'arity/nonConstructible-PictureInPictureEvent',
    category: 'arityMetadata',
    expression: '() => String(PictureInPictureEvent.length)',
  },

  // ---------------------------------------------- Error.stack 形态
  {
    id: 'stack/error-first-line',
    category: 'errorShape',
    expression: "() => new Error('probe').stack.split('\\n')[0]",
  },
  {
    id: 'stack/typeerror-name',
    category: 'errorShape',
    expression: '() => { try { null.x; } catch (error) { return error.constructor.name; } return "no-throw"; }',
  },
  {
    id: 'stack/domexception-name',
    category: 'errorShape',
    expression: "() => { try { document.createElement('div').attachShadow({ mode: 'open' }); document.createElement('div').attachShadow({ mode: 'open' }); return 'no-throw'; } catch (error) { return error.constructor.name; } }",
  },
  {
    id: 'stack/error-toString',
    category: 'errorShape',
    expression: "() => String(new TypeError('probe'))",
  },

  // ---------------------------------------------- 集合与迭代语义
  {
    id: 'iter/nodeList-iterable',
    category: 'collections',
    expression: "() => String(typeof document.querySelectorAll('div')[Symbol.iterator])",
  },
  {
    id: 'iter/nodeList-tag',
    category: 'collections',
    expression: "() => Object.prototype.toString.call(document.querySelectorAll('div'))",
  },
  {
    id: 'iter/htmlCollection-not-iterable',
    category: 'collections',
    expression: '() => String(typeof document.getElementsByTagName("div")[Symbol.iterator])',
  },
  {
    id: 'iter/classList-tag',
    category: 'collections',
    expression: "() => Object.prototype.toString.call(document.createElement('div').classList)",
  },
  {
    id: 'iter/nodeList-entries-type',
    category: 'collections',
    expression: "() => String(typeof document.querySelectorAll('div').entries)",
  },
  {
    id: 'iter/urlSearchParams-toStringTag',
    category: 'collections',
    expression: '() => Object.prototype.toString.call(new URLSearchParams())',
  },

  // ---------------------------------------------- Worker 同步入口契约
  // 只取构造器拒绝、实例形状和终止幂等性；异步脚本执行与消息时序另建专门
  // 生命周期测试，避免把调度时序误写成同步行为基线。
  {
    id: 'worker/constructor-no-args',
    category: 'worker',
    expression: '() => new Worker()',
  },
  {
    id: 'worker/invalid-type',
    category: 'worker',
    expression: "() => new Worker('data:text/javascript,', { type: 'classic-module' })",
  },
  {
    id: 'worker/invalid-credentials',
    category: 'worker',
    expression: "() => new Worker('data:text/javascript,', { credentials: 'same-site' })",
  },
  {
    id: 'worker/unsupported-scheme',
    category: 'worker',
    expression: "() => { try { new Worker('javascript:postMessage(1)'); return 'no-throw'; } catch (error) { return error.name; } }",
  },
  {
    id: 'worker/cross-origin',
    category: 'worker',
    expression: "() => { try { new Worker('https://worker.example.test/worker.js'); return 'no-throw'; } catch (error) { return error.name; } }",
  },
  {
    id: 'worker/instance-tag',
    category: 'worker',
    expression: "() => { const worker = new Worker('data:text/javascript,'); const tag = Object.prototype.toString.call(worker); worker.terminate(); return tag; }",
  },
  {
    id: 'worker/terminate-idempotent',
    category: 'worker',
    expression: "() => { const worker = new Worker('data:text/javascript,'); const first = worker.terminate(); const second = worker.terminate(); return String(first) + '|' + String(second); }",
  },
  {
    id: 'worker/terminate-illegal-receiver',
    category: 'worker',
    expression: '() => Worker.prototype.terminate.call({})',
  },

  // ---------------------------------------------- CSSOM 计算值
  // 只取 UA 默认样式表决定的、与机器无关的属性。字号/行高受系统设置影响，
  // 不能进探针；`display` / `position` / `visibility` 这类是确定的。
  {
    id: 'cssom/div-display',
    category: 'cssom',
    expression: "() => getComputedStyle(document.createElement('div')).display",
  },
  {
    id: 'cssom/span-display',
    category: 'cssom',
    expression: "() => getComputedStyle(document.createElement('span')).display",
  },
  {
    id: 'cssom/div-position',
    category: 'cssom',
    expression: "() => getComputedStyle(document.createElement('div')).position",
  },
  {
    id: 'cssom/div-visibility',
    category: 'cssom',
    expression: "() => getComputedStyle(document.createElement('div')).visibility",
  },
  {
    id: 'cssom/computed-tag',
    category: 'cssom',
    expression: "() => Object.prototype.toString.call(getComputedStyle(document.createElement('div')))",
  },
  {
    id: 'cssom/inline-style-tag',
    category: 'cssom',
    expression: "() => Object.prototype.toString.call(document.createElement('div').style)",
  },
  {
    id: 'cssom/inline-style-length-empty',
    category: 'cssom',
    expression: "() => String(document.createElement('div').style.length)",
  },
  {
    id: 'cssom/inline-style-roundtrip',
    category: 'cssom',
    expression: "() => { const e = document.createElement('div'); e.style.color = 'red'; return e.style.cssText; }",
  },
  {
    id: 'cssom/setProperty-then-item',
    category: 'cssom',
    expression: "() => { const e = document.createElement('div'); e.style.setProperty('z-index', '3'); return e.style.item(0) + '=' + e.style.getPropertyValue('z-index'); }",
  },
  {
    id: 'cssom/computed-readonly-setter',
    category: 'cssom',
    expression: "() => { const s = getComputedStyle(document.createElement('div')); s.color = 'blue'; return s.color; }",
  },

  // ---------------------------------------------- 已挂载元素的计算值
  // 只取 UA 默认样式表决定的属性。`width` / `height` 取决于视口与排版
  // （实测 div 的 width 是 740px），不能进探针。
  {
    id: 'cssom/attached-div-display',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      const value = getComputedStyle(el).display;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-span-display',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('span');
      document.body.appendChild(el);
      const value = getComputedStyle(el).display;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-li-display',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('li');
      document.body.appendChild(el);
      const value = getComputedStyle(el).display;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-script-display',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('script');
      document.body.appendChild(el);
      const value = getComputedStyle(el).display;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-default-color',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      const value = getComputedStyle(el).color;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-default-background',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      const value = getComputedStyle(el).backgroundColor;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-button-background',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('button');
      document.body.appendChild(el);
      const value = getComputedStyle(el).backgroundColor;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/inline-color-serialized',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('div');
      el.style.color = 'red';
      document.body.appendChild(el);
      const value = getComputedStyle(el).color;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/inline-hex-color-serialized',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('div');
      el.style.color = '#0f8';
      document.body.appendChild(el);
      const value = getComputedStyle(el).color;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/inline-rgba-color-serialized',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('div');
      el.style.color = 'rgba(1, 2, 3, 0.5)';
      document.body.appendChild(el);
      const value = getComputedStyle(el).color;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-p-margin',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('p');
      document.body.appendChild(el);
      const value = getComputedStyle(el).marginTop;
      document.body.removeChild(el);
      return value;
    }`,
  },
  {
    id: 'cssom/attached-table-display',
    category: 'cssom',
    expression: `() => {
      const el = document.createElement('table');
      document.body.appendChild(el);
      const value = getComputedStyle(el).display + '|' + getComputedStyle(el).boxSizing;
      document.body.removeChild(el);
      return value;
    }`,
  },

  // ---------------------------------------------- Canvas 形状
  // **不取字形宽度**——`measureText` 的结果取决于已安装字体，是机器指纹。
  // 只取接口形状与空画布的编码前缀。
  {
    id: 'canvas/context-tag',
    category: 'canvas',
    expression: "() => Object.prototype.toString.call(document.createElement('canvas').getContext('2d'))",
  },
  {
    id: 'canvas/default-size',
    category: 'canvas',
    expression: "() => { const c = document.createElement('canvas'); return c.width + 'x' + c.height; }",
  },
  {
    id: 'canvas/dataurl-prefix',
    category: 'canvas',
    expression: "() => document.createElement('canvas').toDataURL().slice(0, 22)",
  },
  {
    id: 'canvas/dataurl-unsupported-type',
    category: 'canvas',
    expression: "() => document.createElement('canvas').toDataURL('image/nonexistent').slice(0, 22)",
  },
  {
    id: 'canvas/textmetrics-tag',
    category: 'canvas',
    expression: "() => Object.prototype.toString.call(document.createElement('canvas').getContext('2d').measureText('x'))",
  },
  {
    id: 'canvas/textmetrics-members',
    category: 'canvas',
    expression: '() => Object.getOwnPropertyNames(TextMetrics.prototype).sort().join(",")',
  },
  {
    id: 'canvas/unknown-context',
    category: 'canvas',
    expression: "() => String(document.createElement('canvas').getContext('nv8-unknown'))",
  },
  {
    id: 'canvas/default-fillStyle',
    category: 'canvas',
    expression: "() => document.createElement('canvas').getContext('2d').fillStyle",
  },
  {
    id: 'canvas/default-font',
    category: 'canvas',
    expression: "() => document.createElement('canvas').getContext('2d').font",
  },

  // ---------------------------------------------- 字体度量与 Canvas 文本
  // 绝对字形宽度依赖机器字体安装，不直接进入 fixture；这里锁定浏览器固定的
  // 字体解析规则、空字符串边界、TextMetrics 形状和 monospace 的线性关系。
  {
    id: 'font/invalid-font-keeps-default',
    category: 'fontMetrics',
    expression: `() => {
      const context = document.createElement('canvas').getContext('2d');
      const before = context.font;
      context.font = 'not a valid font declaration';
      return before + '|' + context.font;
    }`,
  },
  {
    id: 'font/font-shorthand-roundtrip',
    category: 'fontMetrics',
    expression: `() => {
      const context = document.createElement('canvas').getContext('2d');
      context.font = 'italic 700 12px serif';
      return context.font;
    }`,
  },
  {
    id: 'font/empty-text-metrics',
    category: 'fontMetrics',
    expression: `() => {
      const metrics = document.createElement('canvas')
        .getContext('2d').measureText('');
      return [
        metrics.width,
        metrics.actualBoundingBoxLeft,
        metrics.actualBoundingBoxRight,
        Number.isFinite(metrics.fontBoundingBoxAscent),
        Number.isFinite(metrics.fontBoundingBoxDescent),
        Object.prototype.toString.call(metrics),
      ].join('|');
    }`,
  },
  {
    id: 'font/metrics-finite-shape',
    category: 'fontMetrics',
    expression: `() => {
      const metrics = document.createElement('canvas')
        .getContext('2d').measureText('Edge');
      const names = [
        'width', 'actualBoundingBoxAscent', 'actualBoundingBoxDescent',
        'actualBoundingBoxLeft', 'actualBoundingBoxRight',
        'fontBoundingBoxAscent', 'fontBoundingBoxDescent',
        'hangingBaseline', 'alphabeticBaseline', 'ideographicBaseline',
      ];
      return names.every(name => Number.isFinite(metrics[name]))
        + '|' + (metrics.width > 0)
        + '|' + Object.keys(metrics).length;
    }`,
  },
  {
    id: 'font/monospace-width-linearity',
    category: 'fontMetrics',
    expression: `() => {
      const context = document.createElement('canvas').getContext('2d');
      context.font = '10px monospace';
      const one = context.measureText('A').width;
      const two = context.measureText('AA').width;
      return [
        one > 0,
        Math.abs(two - one * 2) < 0.000001,
      ].join('|');
    }`,
  },

  // ---------------------------------------------- DOM / Range / Selection
  {
    id: 'dom/range-initial-state',
    category: 'domRange',
    expression: `() => {
      const range = document.createRange();
      return [
        range.startContainer === document,
        range.endContainer === document,
        range.startOffset,
        range.endOffset,
        range.collapsed,
        range.commonAncestorContainer === document,
        range.toString(),
      ].join('|');
    }`,
  },
  {
    id: 'dom/range-select-node-contents',
    category: 'domRange',
    expression: `() => {
      const root = document.createElement('div');
      root.append('alpha', document.createElement('b'), 'omega');
      const range = document.createRange();
      range.selectNodeContents(root);
      const clone = range.cloneContents();
      return [
        range.startContainer === root,
        range.endContainer === root,
        range.startOffset,
        range.endOffset,
        range.toString(),
        clone.textContent,
        clone.childNodes.length,
      ].join('|');
    }`,
  },
  {
    id: 'dom/range-text-boundaries',
    category: 'domRange',
    expression: `() => {
      const text = document.createTextNode('abcdef');
      const range = document.createRange();
      range.setStart(text, 1);
      range.setEnd(text, 4);
      return [
        range.toString(),
        range.startContainer === text,
        range.endContainer === text,
        range.startOffset,
        range.endOffset,
        range.collapsed,
      ].join('|');
    }`,
  },
  {
    id: 'dom/range-invalid-boundary',
    category: 'domRange',
    expression: `() => {
      const text = document.createTextNode('abc');
      const range = document.createRange();
      try {
        range.setStart(text, 4);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'dom/selection-initial-state',
    category: 'domRange',
    expression: `() => {
      const selection = getSelection();
      return [
        Object.prototype.toString.call(selection),
        selection.rangeCount,
        selection.type,
        selection.anchorNode === null,
        selection.focusNode === null,
        selection.isCollapsed,
        selection.toString(),
      ].join('|');
    }`,
  },

  // ---------------------------------------------- Storage 行为
  {
    id: 'storage/empty-state-and-tag',
    category: 'storage',
    expression: `() => {
      const storage = localStorage;
      return [
        Object.prototype.toString.call(storage),
        storage.length,
        storage.key(0),
        storage.getItem('missing'),
      ].join('|');
    }`,
  },
  {
    id: 'storage/string-coercion-and-lifecycle',
    category: 'storage',
    expression: `() => {
      const storage = sessionStorage;
      storage.clear();
      storage.setItem(7, null);
      storage.setItem('name', undefined);
      const first = storage.getItem('7');
      const second = storage.getItem('name');
      storage.removeItem(7);
      return [first, second, storage.length, storage.getItem('7'), storage.key(0)].join('|');
    }`,
  },
  {
    id: 'storage/clear-and-illegal-receiver',
    category: 'storage',
    expression: `() => {
      const storage = localStorage;
      storage.clear();
      storage.setItem('x', '1');
      storage.clear();
      let error = 'none';
      try { Storage.prototype.getItem.call({}, 'x'); } catch (caught) {
        error = caught.name + ':' + caught.message;
      }
      return storage.length + '|' + storage.getItem('x') + '|' + error;
    }`,
  },
  {
    id: 'storage/missing-argument-error',
    category: 'storage',
    expression: `() => {
      try { localStorage.setItem('only-key'); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },

  // ---------------------------------------------- Fetch 请求/响应行为
  {
    id: 'fetch/request-defaults',
    category: 'fetch',
    expression: `() => {
      const request = new Request('/api/items');
      return [
        Object.prototype.toString.call(request),
        request.method,
        (() => {
          const url = new URL(request.url);
          return url.pathname;
        })(),
        request.mode,
        request.credentials,
        request.redirect,
        request.referrer,
        request.bodyUsed,
        request.body === null,
      ].join('|');
    }`,
  },
  {
    id: 'fetch/request-body-normalization',
    category: 'fetch',
    expression: `() => {
      const request = new Request('/submit', { method: 'post', body: 'hello' });
      return [
        request.method,
        request.headers.get('content-type'),
        request.body !== null,
        request.bodyUsed,
      ].join('|');
    }`,
  },
  {
    id: 'fetch/response-defaults',
    category: 'fetch',
    expression: `() => {
      const response = new Response('ok');
      return [
        Object.prototype.toString.call(response),
        response.status,
        response.ok,
        response.type,
        response.url,
        response.redirected,
        response.body !== null,
        response.bodyUsed,
      ].join('|');
    }`,
  },
  {
    id: 'fetch/get-body-rejected',
    category: 'fetch',
    expression: `() => {
      try {
        new Request('/items', { method: 'GET', body: 'x' });
        return 'no-throw';
      } catch (error) { return error.name + ':' + error.message; }
    }`,
  },

  // ---------------------------------------------- Crypto 输入校验与对象关系
  {
    id: 'crypto/object-shape',
    category: 'crypto',
    expression: `() => [
      Object.prototype.toString.call(crypto),
      Object.prototype.toString.call(crypto.subtle),
      crypto.subtle === crypto.subtle,
      typeof crypto.getRandomValues,
      typeof crypto.randomUUID,
    ].join('|')`,
  },
  {
    id: 'crypto/random-values-identity',
    category: 'crypto',
    expression: `() => {
      const bytes = new Uint8Array(8);
      const returned = crypto.getRandomValues(bytes);
      return [
        returned === bytes,
        bytes.length,
        bytes.some(value => value !== 0),
      ].join('|');
    }`,
  },
  {
    id: 'crypto/random-values-type-error',
    category: 'crypto',
    expression: `() => {
      try { crypto.getRandomValues(new DataView(new ArrayBuffer(8))); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },
  {
    id: 'crypto/random-values-limit-error',
    category: 'crypto',
    expression: `() => {
      try { crypto.getRandomValues(new Uint8Array(65537)); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },

  // ---------------------------------------------- XHR 初始状态与输入校验
  {
    id: 'xhr/initial-state',
    category: 'xhr',
    expression: `() => {
      const xhr = new XMLHttpRequest();
      return [
        Object.prototype.toString.call(xhr),
        xhr.readyState,
        xhr.status,
        xhr.statusText,
        xhr.responseType,
        xhr.responseURL,
        xhr.withCredentials,
        xhr.timeout,
        Object.prototype.toString.call(xhr.upload),
      ].join('|');
    }`,
  },
  {
    id: 'xhr/open-normalizes-request',
    category: 'xhr',
    expression: `() => {
      const xhr = new XMLHttpRequest();
      const events = [];
      xhr.addEventListener('readystatechange', () => events.push(xhr.readyState));
      xhr.open('post', '/api/items', false);
      return [xhr.readyState, xhr.responseURL, xhr.responseType, events.join(',')].join('|');
    }`,
  },
  {
    id: 'xhr/send-before-open-error',
    category: 'xhr',
    expression: `() => {
      try { new XMLHttpRequest().send(); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },
  {
    id: 'xhr/header-before-open-error',
    category: 'xhr',
    expression: `() => {
      try { new XMLHttpRequest().setRequestHeader('X-Test', '1'); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },

  // ---------------------------------------------- WebSocket 离线初始状态
  // 不触发真实连接：只验证构造器 URL 规范化、初始状态和同步输入错误。
  {
    id: 'websocket/initial-state',
    category: 'websocket',
    expression: `() => {
      const socket = new WebSocket('ws://example.test/chat');
      return [
        Object.prototype.toString.call(socket),
        socket.url,
        socket.readyState,
        socket.protocol,
        socket.extensions,
        socket.bufferedAmount,
        socket.binaryType,
      ].join('|');
    }`,
  },
  {
    id: 'websocket/send-before-open-error',
    category: 'websocket',
    expression: `() => {
      const socket = new WebSocket('wss://example.test/chat');
      try { socket.send('x'); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },
  {
    id: 'websocket/https-scheme-normalization',
    category: 'websocket',
    expression: `() => new WebSocket('https://example.test/chat').url`,
  },
  {
    id: 'websocket/invalid-close-code-error',
    category: 'websocket',
    expression: `() => {
      const socket = new WebSocket('ws://example.test/chat');
      try { socket.close(1001); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },

  // ---------------------------------------------- IndexedDB 同步契约
  {
    id: 'indexeddb/factory-shape',
    category: 'indexedDB',
    expression: `() => [
      Object.prototype.toString.call(indexedDB),
      indexedDB === indexedDB,
      typeof indexedDB.open,
      typeof indexedDB.deleteDatabase,
      typeof indexedDB.cmp,
      Object.prototype.toString.call(IDBKeyRange),
    ].join('|')`,
  },
  {
    id: 'indexeddb/key-range-bound',
    category: 'indexedDB',
    expression: `() => {
      const range = IDBKeyRange.bound(1, 10, true, false);
      return [
        Object.prototype.toString.call(range),
        range.lower,
        range.upper,
        range.lowerOpen,
        range.upperOpen,
        range.includes(1),
        range.includes(10),
      ].join('|');
    }`,
  },
  {
    id: 'indexeddb/key-range-only',
    category: 'indexedDB',
    expression: `() => {
      const range = IDBKeyRange.only('key');
      return [range.lower, range.upper, range.lowerOpen, range.upperOpen, range.includes('key')].join('|');
    }`,
  },
  {
    id: 'indexeddb/invalid-key-error',
    category: 'indexedDB',
    expression: `() => {
      try { indexedDB.cmp({}, 1); return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },

  // ---------------------------------------------- 音频指纹
  //
  // 音频是排得上前五的真实指纹向量，此前**一个探针都没有**——而 surface 里
  // `AudioContext` / `OfflineAudioContext` / `OscillatorNode` / `AnalyserNode` /
  // `AudioBuffer` 全都在。形状完整、行为未验证，是最容易出「看起来对但算出来
  // 不一样」的地方。
  //
  // 刻意**不**把渲染出来的样本值写成探针。典型的音频指纹是
  // `OfflineAudioContext` → oscillator → compressor → `startRendering()` →
  // 把 buffer 求和取哈希，而那条链的浮点结果可能随 CPU 的 SIMD 路径变化。
  // 按 ADR-0005，机器相关的值不能进浏览器身份；写成探针还会违反「跨运行确定、
  // 与机器无关」的准入条件。渲染值另有单独的调查记录。
  //
  // 这里取的是引擎固定产出的**结构性事实**：默认参数、参数范围、类型标签、
  // 非法实参的报错形态。这些既是脚本真的会读的（很多指纹脚本先核对默认值，
  // 对不上直接判定为伪造环境），也满足准入条件。
  {
    id: 'audio/offline-context-shape',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 44100, 44100);
      return [
        ctx.sampleRate,
        ctx.length,
        ctx.destination.channelCount,
        ctx.destination.maxChannelCount,
        ctx.destination.channelCountMode,
        ctx.destination.channelInterpretation,
        ctx.state,
        Object.prototype.toString.call(ctx),
      ].join('|');
    }`,
  },
  {
    id: 'audio/offline-context-invalid-length',
    category: 'audio',
    expression: `() => {
      try {
        new OfflineAudioContext(1, 0, 44100);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'audio/offline-context-invalid-rate',
    category: 'audio',
    expression: `() => {
      try {
        new OfflineAudioContext(1, 44100, 1);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'audio/offline-context-arity',
    category: 'audio',
    expression: `() => {
      try {
        new OfflineAudioContext(1);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'audio/oscillator-defaults',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const node = ctx.createOscillator();
      return [
        node.type,
        node.frequency.defaultValue,
        node.frequency.minValue,
        node.frequency.maxValue,
        node.detune.defaultValue,
        node.detune.minValue,
        node.detune.maxValue,
        node.numberOfInputs,
        node.numberOfOutputs,
        Object.prototype.toString.call(node),
        Object.prototype.toString.call(node.frequency),
      ].join('|');
    }`,
  },
  {
    id: 'audio/analyser-defaults',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const node = ctx.createAnalyser();
      return [
        node.fftSize,
        node.frequencyBinCount,
        node.minDecibels,
        node.maxDecibels,
        node.smoothingTimeConstant,
      ].join('|');
    }`,
  },
  {
    id: 'audio/analyser-invalid-fftsize',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const node = ctx.createAnalyser();
      try {
        node.fftSize = 100;
        return 'no-throw:' + node.fftSize;
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'audio/compressor-defaults',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const node = ctx.createDynamicsCompressor();
      return [
        node.threshold.defaultValue,
        node.knee.defaultValue,
        node.ratio.defaultValue,
        node.attack.defaultValue,
        node.release.defaultValue,
        node.reduction,
      ].join('|');
    }`,
  },
  {
    id: 'audio/gain-defaults',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const node = ctx.createGain();
      return [
        node.gain.defaultValue,
        node.gain.minValue,
        node.gain.maxValue,
        node.channelCount,
        node.channelCountMode,
      ].join('|');
    }`,
  },
  {
    id: 'audio/buffer-shape',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const buffer = ctx.createBuffer(2, 100, 22050);
      return [
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate,
        buffer.duration,
        buffer.getChannelData(0).length,
        Object.prototype.toString.call(buffer),
        Object.prototype.toString.call(buffer.getChannelData(0)),
      ].join('|');
    }`,
  },
  {
    id: 'audio/buffer-invalid-channel',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const buffer = ctx.createBuffer(1, 100, 22050);
      try {
        buffer.getChannelData(5);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'audio/cross-context-connect',
    category: 'audio',
    expression: `() => {
      const a = new OfflineAudioContext(1, 128, 44100);
      const b = new OfflineAudioContext(1, 128, 44100);
      try {
        a.createGain().connect(b.destination);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'audio/param-illegal-receiver',
    category: 'audio',
    expression: `() => {
      const ctx = new OfflineAudioContext(1, 128, 44100);
      const setter = Object.getOwnPropertyDescriptor(
        AudioParam.prototype, 'value',
      ).set;
      try {
        setter.call({}, 1);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'audio/context-constructor-guard',
    category: 'audio',
    expression: `() => {
      try {
        OfflineAudioContext(1, 128, 44100);
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },

  // ---------------------------------------------- Intl / 时区
  //
  // 每个探针都**显式传 locale**，不用默认 locale。原因是采集器不传 `--lang`，
  // 默认 locale 会跟采集机的系统语言走——那正是 ADR-0005 里 `fontFamily` 踩过的
  // 坑（采集机的中文系统语言被烙进 fixture）。显式传 locale 之后探针与采集机
  // 无关，只依赖浏览器自带的 ICU 数据，那是 browser build 的属性。
  //
  // **刻意不测任何依赖时区的输出**。实测 Chromium 在 Windows 上**不理 `TZ`
  // 环境变量**、只跟随操作系统时区：给采集器传 `TZ=UTC`，
  // `Intl.DateTimeFormat().resolvedOptions().timeZone` 仍然是本机的
  // `Asia/Shanghai`。所以时区相关的值采集器锁不住，会把采集机的时区烙进 fixture。
  // （NV8 自己能锁：`childEnvironment()` 会给子进程设 `TZ`，Node 认这个变量。）
  {
    id: 'intl/namespace-members',
    category: 'intl',
    // 剔掉 `DurationFormat`：它只在 Node 24 的 V8 里有，18–22 没有。整份成员表
    // 混进一个宿主版本相关的名字，这个探针就会在四档 Node 里给不同结果，
    // 而行为层没有版本门控机制。剔掉之后其余 12 个名字仍然逐个受检。
    expression: `() => Object.getOwnPropertyNames(Intl)
      .filter((name) => name !== 'DurationFormat')
      .sort().join(',')`,
  },
  {
    id: 'intl/datetimeformat-resolved-keys',
    category: 'intl',
    // 只取 key 集合，不取值——值里含 timeZone。
    expression: `() => Object.keys(
      new Intl.DateTimeFormat('en-US').resolvedOptions(),
    ).sort().join(',')`,
  },
  {
    id: 'intl/numberformat',
    category: 'intl',
    expression: `() => [
      new Intl.NumberFormat('en-US').format(1234567.891),
      new Intl.NumberFormat('zh-CN').format(1234567.891),
      new Intl.NumberFormat('de-DE').format(1234567.891),
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(12.5),
    ].join('|')`,
  },
  {
    id: 'intl/listformat',
    category: 'intl',
    expression: `() => [
      new Intl.ListFormat('en-US').format(['a', 'b', 'c']),
      new Intl.ListFormat('zh-CN').format(['a', 'b', 'c']),
    ].join('|')`,
  },
  {
    id: 'intl/relativetimeformat',
    category: 'intl',
    expression: `() => [
      new Intl.RelativeTimeFormat('en-US').format(-1, 'day'),
      new Intl.RelativeTimeFormat('zh-CN').format(-1, 'day'),
    ].join('|')`,
  },
  {
    id: 'intl/collator-order',
    category: 'intl',
    expression: `() => ['b', 'a', 'B', 'A', 'ä']
      .sort(new Intl.Collator('de-DE').compare).join(',')`,
  },
  {
    id: 'intl/displaynames',
    category: 'intl',
    expression: `() => [
      new Intl.DisplayNames('en-US', { type: 'region' }).of('CN'),
      new Intl.DisplayNames('zh-CN', { type: 'region' }).of('US'),
      new Intl.DisplayNames('en-US', { type: 'language' }).of('zh-Hant'),
    ].join('|')`,
  },
  {
    id: 'intl/pluralrules',
    category: 'intl',
    expression: `() => [
      new Intl.PluralRules('en-US').select(1),
      new Intl.PluralRules('en-US').select(2),
      new Intl.PluralRules('zh-CN').select(2),
    ].join('|')`,
  },
  {
    id: 'intl/segmenter-resolved',
    category: 'intl',
    expression: `() => {
      const options = new Intl.Segmenter('zh-CN', { granularity: 'word' })
        .resolvedOptions();
      return options.locale + '|' + options.granularity;
    }`,
  },
  {
    id: 'intl/invalid-locale',
    category: 'intl',
    expression: `() => {
      try {
        new Intl.NumberFormat('!!');
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'intl/invalid-timezone',
    category: 'intl',
    expression: `() => {
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: 'Not/AZone' });
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'intl/date-tostring-shape',
    category: 'intl',
    // 只报**形状**，不报内容。这条探针的期望值前后错了两次，错法一样：
    //
    // 第一版把偏移与时区名替换成占位符就以为够了，结果时间部分（`08:00:00`）
    // 仍然跟着采集机的时区走。
    //
    // 第二版改成正则 + `split(' ').length`，注释还写着「彻底与时区无关」——
    // 但**段数把时区名的词数算了进来**，而词数取决于渲染语言：中文系统是
    // `(中国标准时间)` 1 个词，英文系统是 `(China Standard Time)` 3 个词。
    // fixture 于是记下 7，在英文环境的机器上跑出 9。采集机的系统语言又一次
    // 被烙进了契约——与 ADR-0005 的 `fontFamily` 是同一个坑。
    //
    // 现在只数括号**之前**那段（恒为 6）。整体形状——括号内非空、GMT±HHMM
    // ——由正则守。
    expression: `() => {
      const value = new Date(0).toString();
      const pattern = /^[A-Z][a-z]{2} [A-Z][a-z]{2} \\d{2} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT[+-]\\d{4} \\(.+\\)$/;
      const head = value.slice(0, value.indexOf(' ('));
      return 'matches=' + pattern.test(value)
        + '|headSegments=' + head.split(' ').length;
    }`,
  },
  {
    id: 'intl/date-toutcstring',
    category: 'intl',
    // UTC 系列与时区无关，可以整串比。
    expression: `() => [
      new Date(0).toUTCString(),
      new Date(0).toISOString(),
      new Date(0).toJSON(),
    ].join('|')`,
  },

  // ---------------------------------------------- Performance 时间精度
  //
  // `performance.now()` 的粒度是**浏览器策略**（非 cross-origin-isolated 上下文
  // 会被钳到 100µs），不是机器测量值，所以跨运行确定、可以进探针。
  //
  // 但**不测具体耗时**：那是机器性能，进 fixture 就是烙一个机器指纹。
  {
    id: 'perf/now-type-and-origin',
    category: 'performance',
    expression: `() => [
      typeof performance.now(),
      typeof performance.timeOrigin,
      Object.prototype.toString.call(performance),
      typeof performance.now,
    ].join('|')`,
  },
  {
    id: 'perf/now-clamped-to-100us',
    category: 'performance',
    // Chromium 在非隔离上下文把 now() 钳到 0.1ms 的整数倍。取多个样本全部检验，
    // 只报布尔——报具体数值就变成机器性能了。
    expression: `() => {
      const samples = [];
      for (let index = 0; index < 50; index += 1) samples.push(performance.now());
      const clamped = samples.every(
        (value) => Math.abs(value * 10 - Math.round(value * 10)) < 1e-6,
      );
      const monotonic = samples.every(
        (value, index) => index === 0 || value >= samples[index - 1],
      );
      return 'clamped=' + clamped + '|monotonic=' + monotonic;
    }`,
  },
  {
    id: 'perf/mark-missing-argument',
    category: 'performance',
    expression: `() => {
      try {
        performance.mark();
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'perf/measure-unknown-mark',
    category: 'performance',
    expression: `() => {
      try {
        performance.measure('probe', 'nv8-nonexistent-mark');
        return 'no-throw';
      } catch (error) { return error.name + ': ' + error.message; }
    }`,
  },
  {
    id: 'perf/entry-shape',
    category: 'performance',
    expression: `() => {
      performance.clearMarks();
      const entry = performance.mark('nv8-probe');
      const found = performance.getEntriesByName('nv8-probe');
      performance.clearMarks();
      return [
        Object.prototype.toString.call(entry),
        entry.entryType,
        entry.name,
        entry.duration,
        found.length,
        Object.prototype.toString.call(found),
      ].join('|');
    }`,
  },

  // ---------------------------------------------- 事件时序细节
  {
    id: 'event/phase-order',
    category: 'eventTiming',
    expression: `() => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);
      const log = [];
      parent.addEventListener('probe', e => log.push('capture:' + e.eventPhase), true);
      child.addEventListener('probe', e => log.push('target:' + e.eventPhase));
      parent.addEventListener('probe', e => log.push('bubble:' + e.eventPhase));
      child.dispatchEvent(new Event('probe', { bubbles: true }));
      return log.join('|');
    }`,
  },
  {
    id: 'event/stopPropagation-blocks-bubble',
    category: 'eventTiming',
    expression: `() => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);
      const log = [];
      child.addEventListener('probe', e => { log.push('child'); e.stopPropagation(); });
      parent.addEventListener('probe', () => log.push('parent'));
      child.dispatchEvent(new Event('probe', { bubbles: true }));
      return log.join('|');
    }`,
  },
  {
    id: 'event/stopImmediatePropagation',
    category: 'eventTiming',
    expression: `() => {
      const target = document.createElement('div');
      const log = [];
      target.addEventListener('probe', e => { log.push('first'); e.stopImmediatePropagation(); });
      target.addEventListener('probe', () => log.push('second'));
      target.dispatchEvent(new Event('probe'));
      return log.join('|');
    }`,
  },
  {
    id: 'event/once-runs-once',
    category: 'eventTiming',
    expression: `() => {
      const target = document.createElement('div');
      let count = 0;
      target.addEventListener('probe', () => { count += 1; }, { once: true });
      target.dispatchEvent(new Event('probe'));
      target.dispatchEvent(new Event('probe'));
      return String(count);
    }`,
  },
  {
    id: 'event/duplicate-listener-ignored',
    category: 'eventTiming',
    expression: `() => {
      const target = document.createElement('div');
      let count = 0;
      const handler = () => { count += 1; };
      target.addEventListener('probe', handler);
      target.addEventListener('probe', handler);
      target.dispatchEvent(new Event('probe'));
      return String(count);
    }`,
  },
  {
    id: 'event/phase-after-dispatch',
    category: 'eventTiming',
    expression: `() => {
      const target = document.createElement('div');
      const event = new Event('probe');
      target.dispatchEvent(event);
      return event.eventPhase + '|' + String(event.currentTarget) + '|' + (event.target === target);
    }`,
  },
  {
    id: 'event/preventDefault-non-cancelable',
    category: 'eventTiming',
    expression: `() => {
      const event = new Event('probe');
      event.preventDefault();
      return String(event.defaultPrevented);
    }`,
  },
  {
    id: 'event/dispatch-returns-false-when-cancelled',
    category: 'eventTiming',
    expression: `() => {
      const target = document.createElement('div');
      target.addEventListener('probe', e => e.preventDefault());
      return String(target.dispatchEvent(new Event('probe', { cancelable: true })));
    }`,
  },
  {
    id: 'event/redispatch-while-dispatching',
    category: 'eventTiming',
    expression: `() => {
      const target = document.createElement('div');
      const event = new Event('probe');
      let error = 'none';
      target.addEventListener('probe', () => {
        try { target.dispatchEvent(event); } catch (e) { error = e.name; }
      });
      target.dispatchEvent(event);
      return error;
    }`,
  },

  // ---------------------------------------------- 跨 Realm 对象身份
  // iframe 是另一个 Realm，内建对象与原型链都是独立的一套。反爬脚本常用
  // 「从干净 iframe 里取原生函数」来对比主 Realm 有没有被改过。
  //
  // **全部共用一个 iframe**：每个探针各建一个会连开十几个子 Realm，而实测
  // NV8 在动态创建第 8 个 iframe 时子进程会 SIGABRT（与预热池无关，关掉池
  // 一样崩，见独立登记条目）。共用一个也更贴近真实脚本行为。
  {
    id: 'realm/identity-bundle',
    category: 'crossRealm',
    expression: `() => {
      const frame = document.createElement('iframe');
      document.body.appendChild(frame);
      const win = frame.contentWindow;
      if (win === null) return 'contentWindow-null';
      const doc = frame.contentDocument;
      const foreignArray = new win.Array(1, 2);
      const foreignElement = doc.createElement('div');
      const foreignError = new win.TypeError('probe');
      const parts = [
        Object.prototype.toString.call(win),
        Object.prototype.toString.call(doc),
        'docMatches=' + (doc === win.document),
        'arrayDiffers=' + (win.Array !== Array),
        'instanceofAcross=' + ([] instanceof win.Array),
        'isArrayForeign=' + Array.isArray(foreignArray),
        'foreignInstanceofLocal=' + (foreignArray instanceof Array),
        Object.prototype.toString.call(foreignElement),
        'elementInstanceofLocal=' + (foreignElement instanceof HTMLDivElement),
        'elementInstanceofForeign=' + (foreignElement instanceof win.HTMLDivElement),
        'errorInstanceofLocal=' + (foreignError instanceof TypeError),
        Object.prototype.toString.call(foreignError),
        'selfRef=' + (win.window === win) + ',' + (win.self === win),
        'parentIsUs=' + (win.parent === window),
        'topMatches=' + (win.top === window.top),
        'frameElementMatches=' + (win.frameElement === frame),
        'href=' + win.location.href,
      ];
      frame.remove();
      return parts.join(' | ');
    }`,
  },
  {
    id: 'realm/foreign-native-toString',
    category: 'crossRealm',
    expression: `() => {
      const frame = document.createElement('iframe');
      document.body.appendChild(frame);
      const win = frame.contentWindow;
      if (win === null) return 'contentWindow-null';
      const value = win.EventTarget.prototype.addEventListener.toString();
      frame.remove();
      return value;
    }`,
  },

  // ---------------------------------------------- URL 解析
  // `new URL()` 放在 try/catch 里做输入校验是极常见的写法，`url.href` 的
  // 规范化结果也常被直接比较。实测 NV8 的 URL 构造器几乎不校验也不规范化。
  //
  // 注意真实浏览器与 Node 并不完全一致：`https://a b/` 浏览器接受并把空格
  // 编码成 `%20`，Node 直接抛。所以基准必须是浏览器，不能拿 Node 当代理。
  {
    id: 'url/malformed-percent',
    category: 'urlParsing',
    expression: "() => { try { return new URL('http://%', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },
  {
    id: 'url/malformed-bracket',
    category: 'urlParsing',
    expression: "() => { try { return new URL('http://[', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },
  {
    id: 'url/empty-host',
    category: 'urlParsing',
    expression: "() => { try { return new URL('http://', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },
  {
    id: 'url/multiple-colons-in-authority',
    category: 'urlParsing',
    expression: "() => { try { return new URL('http://a:b:c/', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },
  {
    id: 'url/space-in-host-encoded',
    category: 'urlParsing',
    expression: "() => { try { return new URL('https://a b/', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },
  {
    id: 'url/unknown-scheme-normalization',
    category: 'urlParsing',
    expression: "() => { try { return new URL('nv8-unknown://x', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },
  {
    id: 'url/scheme-relative',
    category: 'urlParsing',
    expression: "() => { try { return new URL('//x', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },
  {
    id: 'url/valid-passthrough',
    category: 'urlParsing',
    expression: "() => { try { return new URL('https://ok.test/p?q=1#h', 'https://t.test/p').href; } catch (error) { return 'THROWS ' + error.name; } }",
  },

  // ---------------------------------------------- 类型标签
  {
    id: 'tag/window',
    category: 'typeTag',
    expression: '() => Object.prototype.toString.call(window)',
  },
  {
    id: 'tag/document',
    category: 'typeTag',
    expression: '() => Object.prototype.toString.call(document)',
  },
  {
    id: 'tag/div',
    category: 'typeTag',
    expression: "() => Object.prototype.toString.call(document.createElement('div'))",
  },
  {
    id: 'tag/unknown-element',
    category: 'typeTag',
    expression: "() => Object.prototype.toString.call(document.createElement('nv8-unknown'))",
  },
  {
    id: 'tag/event',
    category: 'typeTag',
    expression: "() => Object.prototype.toString.call(new Event('x'))",
  },
  {
    id: 'tag/navigator',
    category: 'typeTag',
    expression: '() => Object.prototype.toString.call(navigator)',
  },
  {
    id: 'tag/location',
    category: 'typeTag',
    expression: '() => Object.prototype.toString.call(location)',
  },
  {
    id: 'tag/documentPrototype',
    category: 'typeTag',
    expression: '() => Object.prototype.toString.call(Document.prototype)',
  },

  // ---------------------------------------------- SVG 同步接口语义
  {
    id: 'svg/element-namespace-and-tag',
    category: 'svg',
    expression: `() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      return [svg.namespaceURI, svg.localName, Object.prototype.toString.call(svg)].join('|');
    }`,
  },
  {
    id: 'svg/element-interface-shape',
    category: 'svg',
    expression: `() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      return [
        typeof svg.createSVGPoint,
        typeof svg.createSVGMatrix,
        rect instanceof SVGRectElement,
        Object.prototype.toString.call(rect),
      ].join('|');
    }`,
  },
  {
    id: 'svg/viewbox-animated-rect',
    category: 'svg',
    expression: `() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const viewBox = svg.viewBox;
      return [
        Object.prototype.toString.call(viewBox),
        Object.prototype.toString.call(viewBox.baseVal),
        viewBox.baseVal.x,
        viewBox.baseVal.width,
        viewBox.animVal === viewBox.baseVal,
      ].join('|');
    }`,
  },
  {
    id: 'svg/point-default-and-mutation',
    category: 'svg',
    expression: `() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const point = svg.createSVGPoint();
      const before = point.x + '|' + point.y;
      point.x = 3;
      point.y = -4;
      return [before, point.x, point.y, Object.prototype.toString.call(point)].join('|');
    }`,
  },
  {
    id: 'svg/length-constructor-guard',
    category: 'svg',
    expression: '() => new SVGLength()',
  },

  // ---------------------------------------------- Observer 同步接口语义
  {
    id: 'observers/mutation-shape',
    category: 'observers',
    expression: `() => {
      const observer = new MutationObserver(() => {});
      const result = [
        Object.prototype.toString.call(observer),
        typeof observer.observe,
        typeof observer.disconnect,
        typeof observer.takeRecords,
      ].join('|');
      observer.disconnect();
      return result;
    }`,
  },
  {
    id: 'observers/mutation-empty-records',
    category: 'observers',
    expression: `() => {
      const observer = new MutationObserver(() => {});
      const records = observer.takeRecords();
      observer.disconnect();
      return [Array.isArray(records), records.length, Object.prototype.toString.call(records)].join('|');
    }`,
  },
  {
    id: 'observers/resize-shape',
    category: 'observers',
    expression: `() => {
      const observer = new ResizeObserver(() => {});
      const result = [
        Object.prototype.toString.call(observer),
        typeof observer.observe,
        typeof observer.disconnect,
        typeof observer.unobserve,
      ].join('|');
      observer.disconnect();
      return result;
    }`,
  },
  {
    id: 'observers/intersection-shape',
    category: 'observers',
    expression: `() => {
      const observer = new IntersectionObserver(() => {});
      const result = [
        Object.prototype.toString.call(observer),
        typeof observer.observe,
        typeof observer.disconnect,
        typeof observer.unobserve,
        observer.root,
      ].join('|');
      observer.disconnect();
      return result;
    }`,
  },
  {
    id: 'observers/mutation-illegal-disconnect',
    category: 'observers',
    expression: '() => MutationObserver.prototype.disconnect.call({})',
  },

  // ---------------------------------------------- Web Animations 同步接口语义
  {
    id: 'animations/element-empty-list',
    category: 'animations',
    expression: `() => {
      const element = document.createElement('div');
      const animations = element.getAnimations();
      return [Array.isArray(animations), animations.length, Object.prototype.toString.call(animations)].join('|');
    }`,
  },
  {
    id: 'animations/default-animation-state',
    category: 'animations',
    expression: `() => {
      const animation = new Animation();
      const result = [
        Object.prototype.toString.call(animation),
        animation.playState,
        animation.pending,
        animation.currentTime,
        animation.playbackRate,
      ].join('|');
      animation.cancel();
      return result;
    }`,
  },
  {
    id: 'animations/prototype-method-shape',
    category: 'animations',
    expression: `() => [
      typeof Animation.prototype.play,
      typeof Animation.prototype.pause,
      typeof Animation.prototype.finish,
      typeof Animation.prototype.cancel,
      Animation.prototype.play.length,
      Animation.prototype.cancel.length,
    ].join('|')`,
  },
  {
    id: 'animations/keyframe-effect-defaults',
    category: 'animations',
    expression: `() => {
      const effect = new KeyframeEffect(null, [], {});
      const timing = effect.getTiming();
      return [
        Object.prototype.toString.call(effect),
        timing.duration,
        timing.delay,
        timing.iterations,
        effect.composite,
      ].join('|');
    }`,
  },
  {
    id: 'animations/animation-illegal-cancel',
    category: 'animations',
    expression: '() => Animation.prototype.cancel.call({})',
  },

  // ---------------------------------------------- 现有网络/存储接口的深层同步语义
  {
    id: 'storage/insertion-order-and-removal',
    category: 'storage',
    expression: `() => {
      const storage = sessionStorage;
      storage.clear();
      storage.setItem('b', '2');
      storage.setItem('a', '1');
      const before = [storage.length, storage.key(0), storage.key(1)].join('|');
      storage.removeItem('b');
      return [before, storage.length, storage.key(0), storage.getItem('b')].join('|');
    }`,
  },
  {
    id: 'storage-property-access-coercion',
    category: 'storage',
    expression: `() => {
      const storage = sessionStorage;
      storage.clear();
      storage.setItem('answer', 42);
      return [storage.answer, storage.missing, Object.prototype.hasOwnProperty.call(storage, 'answer')].join('|');
    }`,
  },
  {
    id: 'fetch/request-header-normalization',
    category: 'fetch',
    expression: `() => {
      const request = new Request('/items', { method: 'POST', headers: { 'X-Test': 'value' }, body: 'x' });
      return [request.method, request.headers.get('x-test'), request.bodyUsed, request.credentials].join('|');
    }`,
  },
  {
    id: 'fetch/response-header-and-clone',
    category: 'fetch',
    expression: `() => {
      const response = new Response('ok', { status: 201, headers: { 'X-Test': 'value' } });
      const clone = response.clone();
      return [response.status, response.ok, response.headers.get('x-test'), clone !== response, clone.bodyUsed].join('|');
    }`,
  },
  {
    id: 'crypto/random-values-view',
    category: 'crypto',
    expression: `() => {
      const view = new Uint16Array(2);
      const returned = crypto.getRandomValues(view);
      return [returned === view, view.byteLength, view.length, Object.prototype.toString.call(returned)].join('|');
    }`,
  },
  {
    id: 'crypto/random-values-illegal-receiver',
    category: 'crypto',
    expression: '() => Crypto.prototype.getRandomValues.call({}, new Uint8Array(1))',
  },
  {
    id: 'xhr/initial-state-deep',
    category: 'xhr',
    expression: `() => {
      const xhr = new XMLHttpRequest();
      return [xhr.readyState, xhr.responseType, xhr.withCredentials, xhr.timeout, Object.prototype.toString.call(xhr)].join('|');
    }`,
  },
  {
    id: 'xhr/response-type-validation',
    category: 'xhr',
    expression: `() => {
      const xhr = new XMLHttpRequest();
      try { xhr.responseType = 'invalid'; return 'no-throw'; }
      catch (error) { return error.name + ':' + error.message; }
    }`,
  },
  {
    id: 'indexedDB/key-order-comparison',
    category: 'indexedDB',
    expression: `() => [
      indexedDB.cmp(1, 2),
      indexedDB.cmp('a', 'a'),
      indexedDB.cmp([1], [2]),
    ].join('|')`,
  },
  {
    id: 'indexedDB/key-range-shape',
    category: 'indexedDB',
    expression: `() => {
      const range = IDBKeyRange.bound(1, 5, true, false);
      return [range.lower, range.upper, range.lowerOpen, range.upperOpen, range.includes(3)].join('|');
    }`,
  },
]);

/** 允许的探针分类。分类是报告和对等测试的稳定维度，不能由拼写漂移产生新组。 */
const BEHAVIOR_PROBE_CATEGORIES = Object.freeze([
  'nativeToString',
  'illegalInvocation',
  'argumentCount',
  'constructorGuard',
  'typeTag',
  'arityMetadata',
  'errorShape',
  'collections',
  'worker',
  'cssom',
  'canvas',
  'fontMetrics',
  'domRange',
  'eventTiming',
  'crossRealm',
  'urlParsing',
  'storage',
  'fetch',
  'crypto',
  'xhr',
  'websocket',
  'indexedDB',
  'audio',
  'intl',
  'performance',
  'svg',
  'observers',
  'animations',
]);

/**
 * 校验共享探针定义。
 *
 * 采集脚本和对等测试都调用同一个门禁，避免某一端接受坏 thunk 或新分类，
 * 另一端却静默生成或比较错误 fixture。这里只编译箭头函数，不执行探针正文。
 *
 * @param {readonly object[]} probes
 * @returns {readonly object[]}
 */
export function validateBehaviorProbeDefinitions(probes = BEHAVIOR_PROBES) {
  if (!Array.isArray(probes)) {
    throw new TypeError('behavior probes must be an array');
  }
  const ids = new Set();
  const categories = new Set(BEHAVIOR_PROBE_CATEGORIES);
  for (const entry of probes) {
    if (entry === null || typeof entry !== 'object') {
      throw new TypeError('behavior probe entries must be objects');
    }
    if (typeof entry.id !== 'string' || entry.id.length === 0 || ids.has(entry.id)) {
      throw new TypeError(`behavior probe id must be unique and non-empty: ${entry.id}`);
    }
    if (typeof entry.category !== 'string' || !categories.has(entry.category)) {
      throw new TypeError(`unknown behavior probe category: ${entry.category}`);
    }
    if (typeof entry.expression !== 'string' || !entry.expression.startsWith('()')) {
      throw new TypeError(`behavior probe must be a zero-argument thunk: ${entry.id}`);
    }
    let thunk;
    try {
      thunk = new Function(`return (${entry.expression});`)();
    } catch (error) {
      throw new TypeError(`invalid behavior probe expression: ${entry.id}`, { cause: error });
    }
    if (typeof thunk !== 'function') {
      throw new TypeError(`behavior probe expression is not a function: ${entry.id}`);
    }
    ids.add(entry.id);
  }
  return probes;
}

validateBehaviorProbeDefinitions();

/**
 * 生成在目标环境里执行全部探针的表达式。
 *
 * 返回的表达式求值为一个 JSON 字符串，键是探针 id。
 *
 * @returns {string}
 */
export function buildProbeExpression() {
  const entries = BEHAVIOR_PROBES
    .map(entry => `  ${JSON.stringify(entry.id)}: probe(${entry.expression}),`)
    .join('\n');
  return `(() => {
${NORMALIZE_HELPER}
  return JSON.stringify({
${entries}
  });
})()`;
}
