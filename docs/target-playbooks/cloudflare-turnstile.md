# 目标 Playbook：五秒盾（Cloudflare Turnstile）离线握手

> 案例工作区 `五秒盾/`（WSL 合集 `nv8代码测试/`）

## 1. 验收模型（两级，如实记录）

| 级别 | 条件 | 说明 |
|---|---|---|
| `submit` | 捕获 `/fo/` POST | 原案例目标。**离线不可复现**：api.js 只在 `event.isTrusted` 的交互下自动提交；实测真实 Camoufox 不点击时同样拿不到 token（`interactiveBegin → widgetStale → interactiveTimeout`，`cf-turnstile-response` 始终为空）。是否自动放行由服务端风险判定决定 |
| `handshake` | 四条件同时成立（**当前可达上限**，exit 0 门槛） | `extraParamsReplied` + `executeSent` + `widgetRendered` + `workerConstructed` |
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

**submit 仍被挑战引擎阻塞**：挑战启动代码在 nv8 内抛
`Uncaught TypeError: Cannot read properties of null (reading 'eval')`（挑战自身用
Trusted Types 保护动态 eval；该异常在真实浏览器不复现），最终 `fail` / 300010。
这是 nv8 保真度缺口，需要专项对齐后才能宣称线上 submit——本项目如实记录，
不用握手冒充通过。原案例 8 月那次 `status: complete` 是碰上非交互放行，不可稳定复现。

## 6. 边界

- 离线只证明「捕获的 challenge 在 nv8 里能走到握手完成」，不代表线上通过；真实网络出口归 Python。
- 素材换轮需重新采集；`live_refresh.mjs` 已能无浏览器完成刷新。
