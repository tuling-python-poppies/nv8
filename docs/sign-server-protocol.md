# 常驻签名服务协议

`examples/sign-server.mjs` 是一个通用的 stdio JSON-lines 运行器。它只负责把目标脚本
放进 nv8 Realm，并串行调度目标入口；真实网络请求仍由调用方完成。

这里的“通用”指**服务协议和运行生命周期不绑定某个站点**，不是“任意网站脚本无需适配
即可运行”。每个新目标仍需要一份能在 nv8 Realm 中加载的脚本、明确的入口和资源清单；
如果目标依赖特殊浏览器表面、动态模块、在线 bootstrap 或站点专属状态，仍需要目标适配。

### 适配边界

- 目标脚本必须在启动时暴露一个全局函数，默认名为 `__sign`，也可以用
  `--sign-entry` 或请求字段 `signEntry` 改名。
- `--script` 是一个已打包的脚本文件。服务只提供受限的 `require("fs").readFileSync`，
  用于读取已声明资源；不会替目标自动解析任意 npm/CommonJS 依赖。需要模块图时先打包，
  或直接使用 nv8 的 `evaluateModule` API。
- `--asset` 只注入脚本明确声明的本地资源。WASM、JSON 和二进制不会自动从网络下载，
  也不会猜测第一个资源。
- 目标脚本可以使用 nv8 已安装的浏览器表面，包括 DOM、存储、Crypto、WASM 和异步 API；
  但具体 surface/profile、指纹参数和网络回放策略仍由 Sandbox 配置决定。
- 服务进程本身不发送业务请求，也不代替调用方维护真实 HTTP headers、代理、验证码或
  站点登录流程。目标的 `fetch` / XHR 是否可用，取决于 nv8 的网络策略和离线回放配置。
- 目标若把签名逻辑绑定到真实浏览器的版本、字体、屏幕、时间或会话状态，仍必须把这些
  条件配置到 Sandbox，并让外部发包层保持一致；协议通用性不会消除这些业务约束。

因此，新增目标的最小交付物不是只换一个 `--script` 路径，而是：脚本入口、资源清单、
必要的 Realm 配置、session 初始化方式，以及一组目标自己的签名样本。

## 启动

```bash
node examples/sign-server.mjs \
  --script ./target.js \
  --asset app.wasm=./app.wasm \
  --asset config.json=./config.json \
  --init-entry __init \
  --reset-entry __reset \
  --health-entry __health
```

资源名是目标脚本传给 `readFileSync` 的 basename。类型默认按扩展名推断：`.wasm` 是
`wasm`，`.json` 是 `json`，常见文本扩展名是 `text`，其余是 `binary`。需要覆盖推断时：

```bash
--asset payload.bin=./payload.dat --asset-kind payload.bin=wasm
```

目标脚本中的 `require("fs").readFileSync(name)` 返回 Realm 内的 `Uint8Array`；传入
`"utf8"` 或 `{ encoding: "utf8" }` 时返回文本。未知资源会报错，不会静默回退到第一个
资源。资源通过 `evaluateWithPayload` 注入，避免启动时的 base64 字符串和逐字符解码。

## 请求

每行一个 JSON 对象，响应保持同一个 `id`。所有请求按输入顺序进入单 FIFO，单个 Realm
不会被并发调用。

```json
{"id":1,"action":"ping"}
{"id":2,"action":"init","args":["token"],"sessionId":"default"}
{"id":3,"action":"sign","args":["GET","https://example.test/"],"sessionId":"default"}
{"id":4,"action":"health","sessionId":"default"}
{"id":5,"action":"reset","sessionId":"default"}
{"id":6,"action":"reload","sessionId":"default"}
{"id":7,"action":"close"}
```

`sign` 和 `init` 会等待同步返回值或 Promise 结算。返回值统一为：

```json
{"kind":"object","result":{"signature":"..."},"elapsedMs":4}
```

`null` 与 `undefined` 保持区分：默认传入 JSON `null` 就是 JavaScript `null`；只有请求
明确设置 `"mapNullToUndefined":true` 时才转换。函数、Symbol 等不能通过 JSON 返回时只
保留 `kind`。

目标函数返回键值对数组时，可以在 `sign` 请求设置 `"resultFormat":"entries"`，服务端
会在 Realm 内执行 `Object.fromEntries`；默认格式是 `json`，不猜目标返回结构。

## Session

每个 session 都有独立 Sandbox，因此 cookie、localStorage、sessionStorage、全局变量和
有状态 SDK 不会互相污染。`default` 会在服务启动时创建，其余 session 显式创建：

```json
{"id":10,"action":"session","op":"create","sessionId":"account-a",
 "state":{"cookies":{"sid":"abc"},"localStorage":{"uid":"42"}},
 "init":true,"initArgs":["abc"]}
{"id":11,"action":"sign","sessionId":"account-a","args":["url"]}
{"id":12,"action":"session","op":"export","sessionId":"account-a"}
{"id":13,"action":"session","op":"reset","sessionId":"account-a"}
{"id":14,"action":"session","op":"close","sessionId":"account-a"}
```

`--max-sessions` 默认 8。服务端不会无限创建 session；调用方应在账号/设备会话结束时
发送 `session/close`。

目标入口通过启动参数配置：`--sign-entry`、`--init-entry`、`--reset-entry`、
`--health-entry`。也可以在请求中覆盖对应的 `signEntry`、`initEntry`、`resetEntry` 或
`healthEntry`。

## 新目标验收清单

接入一个新目标时，至少验证以下项目：

1. 入口名不是服务的隐含约定，使用目标自己的函数名仍可调用。
2. 同步值、Promise、`null`、`undefined` 和目标实际返回结构都能稳定传输。
3. 每个外部文件都通过命名资源读取，资源内容和类型不依赖加载顺序。
4. 两个 session 的 cookie、storage、全局计数器和 SDK 状态互不污染。
5. `reset` / `reload` 后按目标预期保留或清除状态。
6. 连续签名样本与原实现一致；最终 HTTP 请求由外部 client 完成并单独验收。
