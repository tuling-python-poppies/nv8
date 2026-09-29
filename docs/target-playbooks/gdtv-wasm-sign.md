# 目标 Playbook：荔枝网 gdtv（wasm 签名 + 请求头）

> 适配日期：2026-09-17 · 测试代码：案例工作区 `nv8_run/`（本仓库外，脚本清单见下）
> 关联材料：发包层对比报告（B5）结论并入本文

## 1. 目标画像

| 项 | 值 |
|---|---|
| 入口 | 目标脚本自调 `get_encrypt_headers()`；签名入口 `globalThis.__sign` 返回**加密后的请求头对象** |
| 资源 | `lizhi.wasm`（脚本内以 `require('fs').readFileSync` 读取字节后实例化） |
| 业务 | `https://gdtv-api.gdtv.cn/api/channel/v1/channel/2`（频道数据：`pk/name/childChannels` 等） |
| 通过标志 | 200 + 数据结构一致，无 challenge/risk/captcha 标记 |
| 原方案 | 每次 subprocess 调 node 一次性执行目标脚本 |

案例工作区文件：`1.荔枝网.js`（原脚本）· `2.荔枝网.py`（一次性流程）·
`3.nv8补环境测试.js`（nv8 适配脚本，含 `__sign` 入口）· `lizhi.wasm` ·
`nv8_run/`（`run.mjs` 一次性运行、`sign-server.mjs` 常驻服务、`client.py` Python 客户端、
`send-layer.py` 发包层指纹对比）。

## 2. nv8 适配（三处）

1. `EdgeSandbox` + `batchEvaluate([probe, setup, source, pump])`：
   - `probe`：检查 `window/self/globalThis` 身份、`window instanceof Window`、
     `document.location === location`、`WebAssembly/TextDecoder` 可用；
   - `setup`：注入 wasm 字节（base64 → `Uint8Array`）与最小 `require('fs')` 垫片
     （`readFileSync` 返回 wasm 字节），并劫持 `console.log` 收集输出；
   - `source`：目标脚本；`pump`：空转 2s 让异步回调跑完。
2. 脚本内自调函数产出 JSON 行，收集后取最后一条可解析 JSON 为签名结果。
3. **常驻化**：`sign-server.mjs`（stdio JSON-lines：ping/sign/reload/close，
   预热一次后每次签名毫秒级）+ `client.py`（`--signs N` 计时、`--send` 直接发包验证）。

## 3. 发包层（B5 结论，签名与发包解耦）

- **curl_cffi（Chrome profile）**：HTTP/2 + 浏览器形状 ClientHello；
  **HTTP/2 Akamai 指纹与真机 Chrome 152 逐字节一致**
  （SETTINGS `65536/0/6291456/262144`、WINDOW_UPDATE `15663105`、优先级帧 `m,a,s,p`）。
- 已知差距：
  - JA4 扩展数 16 vs 真机 17（当时 curl_cffi 最高 chrome142 profile）；
  - JA3 逐连接随机化（真机 Chrome 同样逐连接变化，不能单值比对）；
  - **TCP SYN 层不同**（curl_cffi `65535 / mss,nop,ws,nop,nop,sok` vs Chrome
    `64240 / mss,sackOK,ts,nop,ws`）——**curl_cffi 只改善 TLS/HTTP2，不覆盖
    p0f/TCP**；需要 TCP 一致时换网络栈（Rust sidecar 路线）。
- **业务头必须显式给全套**并保持顺序：`:method/:authority/:scheme/:path`、
  `sec-ch-ua` 三件套、`upgrade-insecure-requests`、`user-agent`、`accept`、
  `sec-fetch-site/mode/user/dest`、`accept-encoding`、`accept-language`、`priority`；
  业务头按传入顺序落其后。不要依赖 curl_cffi 默认头（默认是 macOS 模板）。
- 验证矩阵：`requests` 与 `curl_cffi(chrome142)` 各携新签名均 **200**、逐字段结构一致、
  无风控标记——说明该接口对两种指纹都放行；**这不能证明"过风控"**，只证明当前
  目标未因换发包层而拒绝。

## 4. 实测结果

| 指标 | 值 |
|---|---|
| 单次签名 | 毫秒级（常驻热沙箱；预热 0.8–1.2s） |
| 线上验收 | HTTP 200 + 真实频道数据 |

## 5. 复现

```
node run.mjs                     # 一次性：跑目标脚本并打印签名 JSON
python client.py --signs 50      # 常驻服务：预热 + 连续签名计时
python client.py --send          # 签名 + requests 发包验证
python send-layer.py fingerprint --all
python send-layer.py send --engine curl_cffi --impersonate chrome142 \
  --url https://gdtv-api.gdtv.cn/api/channel/v1/channel/2 --headers-json headers.json
```

`send-layer.py` 依赖：标准库 + 可选 `requests` / `curl_cffi`。
