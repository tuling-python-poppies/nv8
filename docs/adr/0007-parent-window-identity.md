# ADR-0007：同源 `parent` / `top` 的对象身份

- 状态：**已定案 —— 选 A + C**（2026-09 落地，见文末「落地记录」）
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

## 决定

**A + C**：`parent` / `top` 返回真实的父 global，并用「`parent` getter 兼作
incumbent 标记」把 `event.source` 补回来。

定案时补充的一条实测，改变了权重分配：**在子帧内部，最常见的嵌入检测本来就是
对的**。

```
top !== self                   true    ✓ 真实亦然
parent !== window              true    ✓
parent === self                false   ✓
frameElement !== null          true    ✓
parent.document === document   true    ✗ 真实是 false
```

所以前面那 4 处身份不符只在**父侧**可见（`f.contentWindow.parent === window`），
那是个罕见得多的写法。**指纹价值不高，真正的风险是 `parent.document`。**

从逆向的角度这条决定性：反爬 SDK 与验证码组件**故意**跑在 iframe 里（为了拿干净
的 intrinsics），然后回头读 `parent.document.referrer` / `parent.location.href` /
`parent.document.cookie`，这些经常直接进签名 payload。读错了脚本照样跑完、照样吐
出格式正常的 token，只是算错了输入——本地零信号，只在服务端被拒。
「停住的失败指向问题；算错的失败指向任何地方。」

C 与 A 一起做而不是分两步，原因是：只做 A 就必须把两条**正确的**断言
（`event.source` 必须是子窗口）改成登记的已知差异——那是削弱正确的测试来迁就实现。
C 只有约 20 行，做了就不用削。

### 为什么最初设想的 A′ 不成立

原本计划里 A′ 是「让 `event.source` 变成 `null`，把静默错误变成响的错误」。
它**不可实现**：父窗口自发的 `window.postMessage(x, '*')` 在真实浏览器里
`event.source === window` 是**正确**的，而父侧分辨不出「子帧在调我的
postMessage」与「我自己在调」——正是 C 要解决的那个问题。无条件置 `null` 会
弄坏一条本来正确的路径，去让一条错误的路径更响，方向是错的。

所以 A′ 塌进了 C：有了 incumbent，自发 post 保持 `source === window`（正确），
子帧直写 post 得到 `source === 子窗口`（正确），只有别名跨任务的写法退化。

## 落地记录

- `configureWindowMessaging()` 同源分支直接交出 `parentWindow` /
  `topWindow ?? parentWindow`，删掉 `createSameOriginParentFacade()`
- `windowParent()` / `windowTop()` 调 `notifyParentIncumbent()`；
  `notifyIncumbent` 挂在 `parentPostMessage` 函数对象上随同一条通道下发
  ——这样不必往 `bootstrapRoot()` 的 40+ 个位置参数里再穿一个
- `windowPostMessage()` 的自投递分支用 `consumeIncumbentSource() ?? globalThis`
- incumbent **用后即清 + 微任务末清空**：只读了 `parent` 却没发消息时，
  残留登记不能让之后一次父窗口自发的 post 被误记成来自子帧
- 跨源分支不动：`createWindowFacade()` 只暴露规范允许的成员，不依赖原型委托，
  没有同一个问题。有专门断言防止「顺手把跨源也改成真对象」

`tests/iframe-realm-test.js` 的
`Core iframe creates same-origin child Realm and contentDocument` 原先断言
`parent === window` 为 **false**——**测试固化了缺陷**，已改成 `true`。

新增 `tests/iframe-parent-identity-test.js`（6 项），断言分三组：跨帧 DOM 读取
（真正的目的）、身份、跨源门面不受影响。incumbent 只锁**方向安全**
（一个子帧的消息永不记到兄弟头上），刻意不锁别名写法退化到哪个具体值——那取决于
微任务与宏任务的相对时序，写成契约就是把一次偶然调度当契约。

763 项在 Node 18 / 20 / 22 / 24 四档全绿。

## 未决（留给后续）

- 别名 + 跨任务写法的 `event.source` 仍退化。要精确需要真正的 incumbent 栈，
  依赖宿主侧介入，与 ADR-0004 的池位账目是同一类架构工作
- 空白 iframe 的 `location.href` 仍是父页面 URL 而非 `about:blank`：那是
  origin/URL 解耦改造，单独立项

## 相关

- `src/api/window/window-messaging.js`：`configureWindowMessaging()`、
  `createSameOriginParentFacade()`、`windowParent()`、`windowTop()`
- `src/api/dom/html-iframe-element-realm-state.js`：`parentPostMessage` 闭包
  （子 → 父的正确路由已经在这里，按 element 一个）
- `docs/adr/0004-dynamic-iframe-timing.md`：动态 iframe 的 `contentWindow`。
  本 ADR 的四处不符在**静态** iframe 上就复现，两者独立；但 ADR-0004 落地后
  若父子链仍不符，那条经典探针照样过不去，所以本 ADR 应当先决
