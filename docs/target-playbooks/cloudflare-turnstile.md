# 目标 Playbook：五秒盾（Cloudflare Turnstile）离线握手

> 案例工作区 `五秒盾/`（WSL 合集 `nv8代码测试/`）

## 1. 验收模型（分级，如实记录）

| 级别 | 条件 | 说明 |
|---|---|---|
| `token` | 父页 `cf-turnstile-response` 非空 + 挑战发出 `complete` | 新上限。需 `networkRelay` 实时网络（纯无浏览器实达 773 字符 token）；纯静态 replay 无法桥接多轮服务端编排 |
| `submit` | 捕获 `/fo/` POST | 静态 replay 下也能捕获提交，但拿不到后续轮次响应 |
| `handshake` | 四条件同时成立 | `extraParamsReplied` + `executeSent` + `widgetRendered` + `workerConstructed`；静态 replay 的可达上限（exit 0 门槛） |
| `none` | 未达握手 | exit 1 |

## 2. 适配要点

- 素材**轮次绑定**：`turnstile_parent.html` / `turnstile_api.js` / `turnstile_challenge.html`；
  `config.widgetId` 必须与该轮 challenge 文档里的 `_cf_chl_opt.EnOnL8` 一致，否则 api.js 查不到挂件状态、不会回话。
- 补偿桩**按模式定位**（换版本时变量名/函数名都会变，不要死字符串）：
  - widgetId 生成器：按「36 字符集 + `widgetMap.has`」定位并整体替换为固定返回；
  - 调用栈字段：按正则 `cs:<fn>(o),event:` 定位替换；
  - 资源计时：页面级包一层 `performance.getEntriesByType`，为该轮 api.js URL 返回合成条目。
- **握手观察放在挑战侧**：父页 tap 跨源 `contentWindow.postMessage` 依赖沙箱宽松行为（真实浏览器会
  SecurityError）；改为在 replay 的挑战文档前置探针，由挑战侧监听入站 `message` 并回报父页。

## 3. 踩坑（重要）

**不要用 `Object.setPrototypeOf(obj, TypedIface.prototype)` 伪造类型化 Web 对象。**
`instanceof` 能过，但没有真实内部槽位——api.js 深拷贝走 `toJSON`（`PerformanceEntry.prototype.toJSON`）
会抛 `Illegal invocation`，把 message 处理器整个打断。正确做法：普通对象 + `Symbol.hasInstance`。
另外：**事件监听器里抛出的异常在 nv8 里没有任何信号**（不触发 `window.onerror`），排查时靠
`handlerErrors` / `challengeHarness` 诊断字段。

## 4. 运行

```
node --experimental-vm-modules main.mjs
NV8_PROOF_DUMP_TRACE=1 node --experimental-vm-modules main.mjs   # 额外导出完整 trace
```

诊断字段：`consoleLog` / `handlerErrors` / `challengeHarness` / `sentMessages` /
`parentMessages` / `resources` / `stringifyFails`。

## 5. 线上素材刷新（实测）

案例工作区带 `live_refresh.mjs`：**无浏览器**刷新当轮素材并接管验收。

```bash
set NV8_ROOT=<nv8-root> && node --experimental-vm-modules live_refresh.mjs
# 抓活 api.js → NV8 里跑活 api.js 发现当轮挑战 URL → Node fetch 真挑战 HTML
# → 写 js_reverse_cache/live/ + config.local.json → 再跑 main.mjs
```

两个关键点：

- 挑战 iframe 建在 **closed shadow root** 里（页面脚本查不到、`iframeCount=0`），
  src 只能通过 tap `HTMLIFrameElement.prototype.src` setter /
  `Element.prototype.setAttribute("src")` 获得（网络捕获里也没有 iframe 请求）。
- api.js 靠 `performance.getEntriesByType("resource")` 看到自己的加载记录才继续
  渲染 → 需要资源计时补偿 shim（`buildResourceTimingShim`）。

实测（非交互测试页，sitekey `0x4AAAAAAABS7vwvV6VFfMcD`）：

```text
api.js 86732 字节；发现挑战 URL（widgetId=l3gat）；真挑战 HTML 263791 字节
用活素材跑 main.mjs：握手 4/4 全过（extraParamsReplied / executeSent / widgetRendered / workerConstructed）
```

**本轮定位并修复的 NV8 保真度缺口**（详见 ADR-0004 修订与相关提交）：

- 动态 iframe 的 `contentWindow` 同步为 null：挑战在 `appendChild` 后同表达式取
  「干净窗口」并 `eval`，旧实现在 SDK 内部直接 `TypeError`。修复后已挂载 iframe 的
  首次读取即拿到初始 `about:blank` 窗口（懒物化；预热池命中则同步），detached 才为
  null；案例 runner 开 `limits.prewarmChildRealms: 3`。
- api.js 改为页面 `<script>` 真加载（replay 供给，去 async/defer、对齐 302 后的
  `/v0/b/<build>/api.js`）——`cs` 字段由此是**真实调用栈**，不再需要旧版硬编码伪造。
- 抓取/转发出口统一 curl_cffi + 与运行时逐字一致的 Edge 151 UA / `sec-ch-ua` / `zh-CN`。

**当前线上状态（通过）**：纯无浏览器链路线上拿到真 token（父页 `cf-turnstile-response`
已填充、挑战发出 `complete` 事件，773/794 字符两档 @ ~15-18s）。历史采样（~25 轮）
单轮通过 ~80%+；**失败轮 = 服务端分派交互变体**（`init` 消息的 `mode` 字段非
`non-interactive`，需挑战 iframe 内真实点击，NV8 无法完成，以 `interactiveEnd` 收场），
失败与中继时延无关（失败样本往返 4.0s 与成功的 3.3-5.4s 同区间）；runner 依
`init.mode` 秒级早退，案例侧 `relay_solve.mjs` 自动重试兜底。架构即「页面逻辑留在
NV8，网络交给外部传输」：

- NV8 跑真挑战页 JS：Worker PoW、payload 构造、消息守卫（`isTrusted`/origin/source）、
  多轮服务端编排的流程控制；
- `networkRelay` 外部中继：页面 `fetch` 交给常驻 Python helper（curl_cffi 会话 +
  代理，与素材刷新的 Edge 151 头逐字一致）真发请求、真响应回喂页面。

运行（案例工作区）：

```bash
set TURNSTILE_PROXY=http://127.0.0.1:7890
node relay_solve.mjs        # live_refresh → main(TURNSTILE_RELAY=1)，含失败重试
node sample_relay.mjs 6     # 稳定性采样（output/sample-summary.json）
```

**本轮定位并修复的 NV8 缺口（均已提交、带测试）**：

1. Worker 消息事件未标记 `isTrusted`：挑战 worker 用
   `e.isTrusted && e.origin === '' && e.source === null` 守卫决定是否执行投递的 PoW
   代码；不标记时 worker 收到消息但什么都不做，挑战空转 ~50s 超时。
2. 预热池只服务根页 origin 的空白 iframe：嵌套 Realm（挑战 iframe 内部）的干净
   窗口永远 miss 池、同步读取为 null（`null.eval` 根因之一）。
3. 跨源 iframe 门面身份不稳定：先给同源临时窗口、后换门面会让父页保存的引用失配，
   挑战消息因 `event.source` 不匹配被整批丢弃。
4. replay 增强：`urlPattern` 通配 + `bodyEncoding: "latin1"` 二进制保真。
5. 新增 `networkRelay` 外部传输中继（详见 `docs/user-guide.md` 8.6；含 fetch-replay
   SW 分支 replay-miss 挂起修复、INIT 白名单漏字段修复）。
6. Worker Realm 未接中继缝：worker 发出的 fetch 永远静默 replay-miss（本案例的
   `/pat/` 即来自 worker）。接线后经中继拿到真实 401（挑战优雅忽略）；brunhild 域名
   的 telemetry GET 在当前代理下 SSL 握手被拒，fail-open 为 replay-miss，不影响 token。

混合链（`browser_solve.py`）保留为对照/兜底路径。原案例 8 月那次
`status: complete` 是碰上非交互放行，与本轮的可复现链路无关。

### 混合链（备选对照路径）

浏览器压缩到**唯一一步**——过 CF 拿 token；素材刷新与挑战运行全部在 NV8（无浏览器）：

```bash
set TURNSTILE_PROXY=http://127.0.0.1:7890
node hybrid_solve.mjs      # live_refresh.mjs → main.mjs → browser_solve.py
```

| 步骤 | 执行者 | 说明 |
| --- | --- | --- |
| 素材刷新 | NV8 | 发现当轮挑战 URL、抓真 api.js / 挑战 HTML |
| 挑战运行 | NV8 | 活挑战跑完全部检查（握手 4/4 证据） |
| token | Camoufox（唯一浏览器步骤） | `cf-turnstile-response` 688 字符 |

实测：`output/hybrid-result.json` → nv8 handshake 4/4 + browser `tokenLength=688`，
ok=true。对接真实站点时导出的 token / `cf_clearance` + cookies 由 curl_cffi 出数，
浏览器不参与业务请求。

## 6. 边界

- 原「离线只到握手、token 归浏览器」的边界已被 `networkRelay` 打通：页面 JS 与网络
  传输显式分工（NV8 不实现真实网络栈，helper 不参与页面逻辑）。
- token 真伪的最终校验需要站点 secret 走 siteverify；当前证据 = `complete` 事件 +
  773 字符 token + 两轮复现一致。
- 素材换轮需重新采集；`live_refresh.mjs` 已能无浏览器完成刷新。
