# 目标 Playbook：小红书（`x-s` / `x-s-common`）

> 案例工作区 `小红书/`（WSL 合集 `nv8代码测试/`）

## 1. 目标画像

| 项 | 值 |
|---|---|
| 签名链 | 页面内 `window._webmsxyw(uri, data)` 产出中间态 `XYW_…`；**最终请求头**是 `x-s: XYS_…` + `x-s-common`（含 `localStorage` 的 `b1` 设备指纹） |
| 核心 | `x3 = window.mnsv2(canonicalInput, dataMd5, urlMd5)`（288KB mns 运行时，挂在 `window.mnsv2`）+ 自定义 base64 表 |
| 出口 | 真实请求（`POST /api/sns/web/v1/homefeed` 等）属 Python 侧 |

## 2. 离线签名契约（逐字段对齐线上模块）

```text
c   = uri（载荷为对象/数组时 JSON.stringify 后拼接，字符串直接拼；data null → ""）
u   = md5(c) → x5      p = md5(uri)
x3  = window.mnsv2(c, u, p)
x0=签名版本  x1="xhs-pc-web"  x2=平台  x4=载荷类型
ssk = localStorage.webSsk["xhs-pc-web"]
S   = nonce(13) ‖ sha1(ssk ‖ nonce) ‖ ssk[32:]
x6  = b64(sha1(md5bytes(16) ‖ S))      x7 = b64(S)
x-s = "XYS_" + 自定义表base64(JSON.stringify({x0..x7}))
```

- 自定义 base64 表：`ZmserbBoHQtNP+wOcza/LpngG8yJq42KWYj0DSfdikx3VT16IlUAFM97hECvuRX5`
- **缺 `x6/x7` 是旧 runner 线上 406 的直接原因**；缺 `x-s-common` 首页推荐被风控软拦（HTTP 461、0 条）。

## 3. 验收（离线自证）

解码 `x-s` 核对：`x0/x1/x2` 与常量一致、`x5 === md5(canonicalInput)`（证明 `x3` 针对当前请求、
而非返回常量/缓存）、`x3` 非空。

## 4. 线上验收（实测）

```bash
python fetch_signed.py homefeed      # 调 sign_offline.mjs 产签名 → curl_cffi 联网发包
```

- 离线签名（NV8 里跑站点 mns 运行时）+ 联网发包 → **HTTP 200 / 37301 字节 /
  `code=0 success=true msg=成功` / 28 条真实笔记**（浏览器无关出数；历史会话出过
  30 条 / 41388 字节）。
- Windows 控制台注意：`UnicodeEncodeError` 是 `ValueError` 的子类，打印笔记标题会
  撞上 `except ValueError` 的「非 JSON 响应」分支——脚本已加 UTF-8 stdout 兜底。
- 设备材料为会话级：`webSsk`（ECDH 换取）、`b1`（长度轮转）、`cookies.json`（含 `a1`）、
  `x-s-common`（`x9` 派生算法未定，采集一次写入 `signer.local.json` 复用）。

## 5. 踩坑与边界

- `removeChild` 以非 Node 参数调用：真实浏览器同样抛 `TypeError`（nv8 文案即规范文案）——
  是**工件需求**，换任何运行时都要打同一补丁（iv8 侧亦然）。
- mns 运行时是 `eval` 出来的源码，不是静态 URL 内容（用 `Debugger.getScriptSource` 抓带 `_0x30ce91` 的脚本）。
- 游客会话连续请求触发 `code=300011`，换新会话恢复。
- mnsv2 的输入是 144 字节二进制布局（`SignInputBuilder`），按原实现逐字段移植。
