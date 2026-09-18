# 目标适配协议与 playbook

> 面向「把某个站点的签名/风控脚本接进 nv8 常驻签名服务」的适配协议与逐目标记录。
> 协议来自真实目标的共同需求；通用的是运行协议和生命周期，不是任意站点的零适配兼容。

## 1. 适配协议

一个目标 = 一份「补环境脚本 + 可选资源 + 入口声明」，由常驻签名服务
（`sign-server.mjs`，stdio JSON-lines）承载：

| 动作 | 请求 | 响应 | 说明 |
|---|---|---|---|
| health | `{"action":"ping"}` | `{pong, warmupMs}` | 就绪探针；进程启动响应即 ready |
| sign | `{"action":"sign","args":[...]}` | `{kind,result,elapsedMs}` | 按位置参数调用入口函数；`kind` 是入口返回值类型 |
| reset | `{"action":"reload"}` | `{reloaded,warmupMs}` | 重建 Realm（保留模块缓存之外的进程状态由目标自决） |
| close | `{"action":"close"}` | `{closed}` | 关闭沙箱并退出 |
| eval | `{"action":"eval","source":"..."}` | 任意值 | 调试用；不构成适配面 |

目标侧要求（最小集）：

1. 脚本在 Realm 全局暴露入口：`globalThis.__sign = <function>`（名字可配）。
2. 去掉原环境的 bootstrap（如 `require('./mod_jsdom')`、vm2 包装）——nv8 提供
   `window/document/navigator/location/screen/XMLHttpRequest` 等完整 surface。
3. 资源通过 `--asset name=path` 注入；脚本内用 `require('fs').readFileSync` 按
   basename 读取（wasm/文本/JSON 都是原始字节，自行解释）。
4. `null` 参数语义用 `mapNullToUndefined` 声明（gdtv 的默认参数依赖 undefined）。

## 2. 已暴露的边界

- **返回值形状不预假设**：gdtv 返回对象（headers），抖音返回字符串（a_bogus）。
  服务端统一 `{kind, result}`，由调用方解释——不要再用 `Object.fromEntries`
  之类的目标专属包装。
- **同步和异步入口**：`sign` / `init` 会等待 Promise；所有请求按 FIFO 串行进入同一 Realm。
- **一个目标一个服务进程**：不同 session 共享目标脚本和资源定义，但不共享 Sandbox 内的
  Cookie、Storage、全局变量和有状态 SDK。
- **环境采集型签名**：如抖音 BDMS，a_bogus 内嵌 Realm 环境采集值。
  Realm 指纹（UA/平台/屏幕）必须与发包层声明一致，否则线上可能被判定矛盾。
- **脚本加载边界**：服务入口接收已打包脚本；`require` 只为声明资源提供
  `readFileSync`，不会自动解析任意 npm/CommonJS 模块。
- **网络边界**：服务本身不发送真实业务请求。目标 fetch/XHR 受 nv8 profile 和网络策略约束，
  外部 client 负责真实请求、headers、代理和线上验收。

## 3. Playbook 索引

| 目标 | 文档 | 状态 |
|---|---|---|
| 荔枝网 gdtv（wasm 签名 + 请求头） | 见案例目录 `2026_9_14_wasm逆向 - 2/nv8_run/` | 已接入（含线上 200 验收） |
| 抖音 BDMS（a_bogus） | [douyin-bdms.md](douyin-bdms.md) | 已接入（本地验证；线上受旧会话限制） |
