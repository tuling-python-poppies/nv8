# 常驻签名服务协议

`examples/sign-server.mjs` 是一个通用的 stdio JSON-lines 运行器。它只负责把目标脚本
放进 nv8 Realm，并串行调度目标入口；真实网络请求仍由调用方完成。

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
