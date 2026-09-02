# ADR-0007：同源 `parent` / `top` 的对象身份

- 状态：**待决策**（选项 A 已实测，见「实测记录」；未合入）
- 日期：2026-09
- 依赖：ADR-0004（动态 iframe 时序）、ADR-0006（三层对齐职责）

## 背景

本来这条是当作「指纹偏差」立项的：同源 iframe 里 `parent === window` 为 false。
动手前做了一轮实测，结论比预期严重得多——**现在的实现不是在身份与消息路由之间
取舍，它对 `parent` 上的绝大多数属性是静默错误的。**

### 实测一：身份

在一个**静态** iframe 上测（`contentWindow` 可用，所以与 ADR-0004 的动态时序
无关）：

| 探测 | NV8 | 真实浏览器 |
|---|---|---|
| `contentWindow.parent === window` | false | true |
| `contentWindow.top === window` | false | true |
| `contentWindow.parent.window === contentWindow.parent` | false | true |
| `contentWindow.parent.self === contentWindow.parent` | false | true |
| `contentWindow.origin` | 已正确继承 | 同 |

### 实测二：`parent.document` 静默返回**子**文档（严重）

父页面放 `<div id="parent-only">`，子文档放 `<div id="child-only">`，
然后**在子 Realm 内部**执行：

```
own document has child-only          true
own document has parent-only         false
parent.document has parent-only      false   ← 真实浏览器: true
parent.document has child-only       true    ← 真实浏览器: false
parent.document === document         true    ← 真实浏览器: false
```

同源子 frame 里 `parent.document.*` 读到的是**自己的**文档。不报错、不为 null，
返回一个形状完全正常的 `HTMLDocument`。`parent.document.cookie`、
`parent.document.referrer`、`parent.document.querySelector('#token')`
——全部静默读错对象。`parent.location` 同样。

这已经不是指纹层面的问题，是**静默的错误数据**，比抛错危险得多。

### 根因：`Object.create(parentWindow)` 不是可用的跨 Realm 委托机制

`window-messaging.js` 的 `createSameOriginParentFacade()` 返回
`Object.create(parentWindow)`，再覆盖 `postMessage` / `window` / `self` 三个自有
属性。它存在的唯一理由是让 `parent.postMessage()` 投递出去的事件带上**子** Realm
的 `source` / `origin`。

问题在于原型委托对 vm 全局对象**只有一半有效**。同一次实测里，父 Realm 先在自己
全局上放一个普通数据属性 `__parentMarker`，再把**真实的父 global** 直接塞给子
Realm 作为对照：

| 访问方式 | 普通数据属性 | `document` / `location` |
|---|---|---|
| facade（`Object.create(parentWindow)`） | ✅ 委托成功 | ❌ 返回**子**的 |
| 直接持有父 global | ✅ | ✅ 返回**父**的，含 `#parent-only` |

普通属性沿原型链正常委托；而 `document` / `location` 这类由 contextify 拦截器
支撑的访问器**不跟随原型**，会落回访问方所在 Realm 的全局。

所以 facade 只忠实暴露它自己那三个属性，其余一切静默降级成子 Realm 自己的值。
这不是「取舍」，是一处缺陷。

### 实测三：facade 换掉之后，代价究竟是什么

把 `state.parentFacade` 直接换成真实的 `parentWindow`，同源子 Realm 发消息给
父：

| 路径 | `event.origin` | `event.source` |
|---|---|---|
| facade（现状） | `https://parent.test` | 子窗口 ✅ |
| 真实父 global | `https://parent.test` | **父窗口自己** ❌ |

`event.origin` **两者相同**——同源场景下父子 origin 本来就一样，所以 facade 在
origin 上并没有提供额外正确性。跨源子 frame 走的是另一条路径
（`createWindowFacade`），不受本 ADR 影响。

唯一实测到的损失是 `event.source`：它从子窗口变成父窗口自己。这会打断标准的
应答写法 `event.source.postMessage(reply, event.origin)`。

全量套件在该改动下 3 项红：

- `same-origin iframe parent.postMessage preserves child source`（真实回归）
- `same-origin iframe parent bridge enforces targetOrigin`（真实回归）
- `Core iframe creates same-origin child Realm and contentDocument`
  ——这一项断言 `parent === window` 为 **false**，把缺陷写进了期望值。
  它应当改成 `true`，不算回归

## 为什么无法两全

真实浏览器靠 **incumbent settings object** 决定 `event.source`：调用
`otherWindow.postMessage()` 时，引擎知道「当前正在执行的是哪个 Realm」。

NV8 的两个 Realm 是两个 vm context，`parent.postMessage(...)` 是子 Realm 的 JS
直接调用父 Realm 的函数对象，中间没有宿主环节。父 Realm 的实现无从得知调用者：

- `this` 在两种调用下都是父 global（子调 `parent.postMessage` 与父调
  `window.postMessage` 完全一样）
- 父 global 上只能有**一个** `postMessage`，无法按子 Realm 分身
- 用 `new Error().stack` 反推调用方所在 Realm：可行但脆弱，且本仓已有
  `sanitize-stack.js` 在做相反的事（抹掉宿主栈），互相打架

## 选项

### A. `parent` / `top` 返回真实的父 global

- 优点：
  - 4 处身份全部正确
  - **`parent.document` / `parent.location` 变正确**——修掉静默错误数据
  - 删掉 `createSameOriginParentFacade()`，少一层永远只能半对的抽象
- 缺点：`event.source` 在子 → 父方向变成父窗口自己，应答写法断掉
- 已实测，见上

### B. 保留 facade，只把身份泄漏面压小

在 facade 上把 `window` / `self` 指向 facade 自身，让
`parent.window === parent` 成立。

- 优点：改动最小
- 缺点：
  - `parent === window` 仍为 false
  - **`parent.document` 仍然错**——根本问题没动
  - 反而多一层：`parent.window === window`（父视角）从 true 变 false
- 判断：治表不治里，不推荐

### C. A + 用「`parent` getter 兼作 incumbent 标记」补回 `event.source`

`parent` 在子 Realm 里是 getter，每次求值都会执行。`parent.postMessage(x, '*')`
是单个表达式：先跑 getter，紧接着取 `.postMessage` 并调用，中间不可能插入其他
Realm 的代码（单线程）。所以 getter 可以顺手登记「当前 incumbent 是我」，父
Realm 的 `postMessage` 消费一次后清除。

- 优点：直写形式（绝大多数真实写法）下 `event.source` **精确正确**，同时拿到 A
  的全部好处
- 缺点：
  - 别名形式 `const p = parent; setTimeout(() => p.postMessage(...))` 会退化成
    A 的行为（source 为父窗口）。退化方向是安全的，但不精确
  - 需要一条子 → 父的 Realm 间状态通道，是新机制
  - incumbent 何时清除要定死（用后即清 / 微任务末），否则会误attribute
- 判断：能两全，但引入的机制有可述的失效边界，值得单独评审

### D. 接受现状

- 优点：零风险
- 缺点：**留着一处静默错误数据**。`parent.document` 读错文档不会有任何征兆，
  而反爬与广告代码大量使用它

## 倾向

倾向 **A，并在同一轮里评估 C**。理由：

1. 两侧都是静默错误，但影响面差一个量级。`parent.document` 错会波及子 frame 对
   父文档的**每一次**访问；`event.source` 错只影响跨 frame 消息的应答一条路径，
   而且应答收不到时调用方通常能察觉。
2. facade 在 origin 上并没有换来额外正确性（实测同源两者相同），所以它的收益比
   原先以为的小。
3. A 会删掉一层抽象；C 是在 A 之上加一个可选的精确化，可以分两步走。

## 未决

- 选 A 还是 A+C
- 若选 A：`event.source` 差距要登记到
  `tests/edge-behavior-parity-test.js` 的 `KNOWN_BEHAVIOR_DIFFERENCES`，
  并写明 incumbent 的原理，避免后来者以为是漏改
- `Core iframe creates same-origin child Realm and contentDocument` 的期望值
  要从 `false, false` 改成 `true, true`——它现在把缺陷当成契约

## 相关

- `src/api/window/window-messaging.js`：`configureWindowMessaging()`、
  `createSameOriginParentFacade()`、`windowParent()`、`windowTop()`
- `src/api/dom/html-iframe-element-realm-state.js`：`parentPostMessage` 闭包
  （子 → 父的正确路由已经在这里，按 element 一个）
- `docs/adr/0004-dynamic-iframe-timing.md`：动态 iframe 的 `contentWindow`。
  本 ADR 的四处不符在**静态** iframe 上就复现，两者独立；但 ADR-0004 落地后
  若父子链仍不符，那条经典探针照样过不去，所以本 ADR 应当先决
