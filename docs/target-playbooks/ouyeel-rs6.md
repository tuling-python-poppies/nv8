# 目标 Playbook：欧冶 ouyeel（瑞数 RS6 *P）

> 适配日期：2026-09-29 · 测试代码：案例工作区 `ouyeel/`（harness 见其 `js_reverse_cache/recon/`）
> 采集基准：有头 Edge 154.0.4258.37（CDP oracle）+ curl_cffi 重放

## 1. 目标画像

| 项 | 值 |
|---|---|
| 防护 | 瑞数信息 6 代（RS6）：首次请求返回 202 挑战页（内联 `$_ts` 种子 + 外链 VM 脚本） |
| 令牌 | `*P` cookie：VM 在事件循环内计算，先写出 provisional 值，随后页面自 reload |
| 通过标志 | 携带正确 `*P` 的重载返回真实页面（200）；业务接口返回真实 JSON |
| 验收基准 | **第一次写出的 provisional `*P`**（本目标实测 235 字符档）；fire 之后的最终形态（363 档）是行为/时序演变，验收不需要 |

## 2. 引擎级缺口（本次适配补齐，均已提交）

1. **`document.all` 的 `[[IsHTMLDDA]]` 语义**：typeof 为 `undefined`、falsy、
   与 `null` 宽松相等，但属性访问正常。真机反向实验证实：真 DDA 通过，undefined /
   普通对象 / 功能完整对象一律被识别封禁。宿主以 `--allow-natives-syntax` 启动时经
   `vm.runInThisContext` 取 `%GetUndetectable` 创建并注入；**worker/子进程必须继承
   该 flag**，否则静默降级 → 全链封禁。
2. **form 命名属性遮蔽**：`form[name/id]` 返回控件并遮蔽 `id`/`innerText` 等原型
   访问器（RS6 用同名 input 构造陷阱）。描述符对齐真机
   `{writable:false, enumerable:false, configurable:true}`。
3. 字体探测走 `span.offsetWidth` 的内联文本度量、WebGL 精度/扩展表/渲染器串格式、
   `performance.now` 0.1ms 量子等高保真项（引擎修复批次）。

## 3. 重放要点

- 铸 `*P`：`node --allow-natives-syntax` 跑 VM；从 cookie setter 捕获的**首个写出值**
  （provisional，挑战后 ~100ms）即验收令牌。
- 重放：curl_cffi（JA3 对齐 edge101）+ 种子会话 cookie（`*O`/`cookiesession1`/`cna`）
  + provisional `*P`。先 GET 页面确认过闸（真实 HTML），再 POST 业务接口
  （可选携带 VM 生成的签名 URL）。
- `*P` 与环境无关（冻结时间下 cookie 值逐字节一致）；环境自洽 = 请求头身份
  （UA/品牌）与 Realm 档案一致即可。

## 4. 实测结果（2026-09-29）

| 项 | 值 |
|---|---|
| 端到端 | 3/3 通过：landing 200 真实页面 + boot 200（种下 `SHGTSESSIONID`/`staticVersion`）+ 业务接口 200 真实 JSON |
| `*P` 规模 | 约 150,300+ 字符（三次：150338 / 150346 / 150317） |
| 铸造成本 | provisional 写出约在挑战后 100ms |
| 对照实现 | iv8（V8 + Python）侦察线同样通过；nv8 为主交付 |

## 5. 方法（可复用）

浏览器 oracle：真机 Edge（CDP）在同一挑战上采集 ground truth（`*P`、探测应答、
header 身份），本地运行时补同一个挑战并逐字节对拍；差异全部收敛后再上线上验收。
RS6 的 `*P` 不可字段级对拍（雪崩），因此验收以「服务端接受」为准。
