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
 * - `cssom` —— UA 默认样式表决定的计算值与 CSSStyleDeclaration 语义
 * - `canvas` —— Canvas / TextMetrics 的接口形状（**不含字形宽度**）
 * - `eventTiming` —— 事件阶段、传播中断、once / 重复监听器语义
 * - `crossRealm` —— iframe Realm 的对象身份、跨 Realm `instanceof`、自引用
 * - `urlParsing` —— `new URL()` 的校验与规范化
 */

/**
 * 把任意求值结果压成可比较的形状。
 *
 * 报错统一取 `name` 与 `message`：真实 Chromium 的 WebIDL 报错文案是固定
 * 模板（例如 `Failed to execute 'X' on 'Y': N arguments required...`），
 * 文案本身就是可检测特征，不能只比 `name`。
 */
export const NORMALIZE_HELPER = `
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
    // 只报**形状**，不报内容。第一版把偏移与时区名替换成占位符就以为够了，
    // 结果时间部分（`08:00:00`）仍然跟着采集机的时区走——把机器时区烙进了
    // fixture。改成正则匹配 + 各段长度，彻底与时区无关。
    expression: `() => {
      const value = new Date(0).toString();
      const pattern = /^[A-Z][a-z]{2} [A-Z][a-z]{2} \\d{2} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT[+-]\\d{4} \\(.+\\)$/;
      return 'matches=' + pattern.test(value)
        + '|segments=' + value.split(' ').length;
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
  // 一样崩，见 REMAINING_TASKS 的独立条目）。共用一个也更贴近真实脚本行为。
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
]);

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
