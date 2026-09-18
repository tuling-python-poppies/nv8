# 目标 Playbook：抖音 BDMS（a_bogus）

> 适配日期：2026-09-18 · 测试代码：`C:\Users\poppies\Desktop\nv8代码测试目录\douyin-bdms\`
> 原始案例：`D:\code_repository\爬虫逆向\代码测试\抖音补环境\`（execjs + jsdom/vm2）

## 1. 目标画像

| 项 | 值 |
|---|---|
| 入口 | `get_a_bogus(fullUrl)` → `string`（a_bogus 查询参数） |
| 脚本 | `1.douyin.js`，单文件 380KB（webpack 打包的 BDMS 运行时） |
| 资源 | 无 wasm / 无外部文件 |
| 原方案 | `require('./mod_jsdom')`（jsdom window + 手写 navigator + 空 XHR 占位，
  Proxy 包 window/document/navigator/location/screen 打调试日志）；
  另备 vm2 两套变体 |
| 调用链 | `new XMLHttpRequest()` → `Object.assign(xhr, 配置)` → `xhr.send(null)`；
  BDMS 替换 XMLHttpRequest 并在 send 时计算签名，写入 `window.a_bogus` |

## 2. nv8 适配（三处改动）

1. 删除第一行 `require('./mod_jsdom')` —— nv8 原生提供 window/document/
   navigator/location/screen/XMLHttpRequest，不需要 jsdom 与 Proxy 调试层。
2. 末尾 `console.log(get_a_bogus(ab_url))` 改为 `globalThis.__sign = get_a_bogus;`
   （保留 `var ab_url` 一行作为样例 URL，客户端从 target.js 读取它）。
3. 用常驻服务跑：`sign-server.mjs`（本目录副本）+ `client.py`；无资产参数。

## 3. 实测结果（Node 22 / child-process）

| 指标 | 值 |
|---|---|
| 预热 | 0.8–1.2s（进程 + Realm + 380KB 脚本求值 + surface 安装） |
| 单次签名 | 9–14ms（常驻；返回值 `kind=string`，196 字符） |
| 多次调用 | 每次 a_bogus 不同（内嵌时间戳，预期） |
| 原实现对照 | execjs 一次性 ~866ms/次（每次调用都重新编译执行脚本） |
| 原实现 a_bogus | 168 字符（jsdom 简化环境） |

线上验收（2026-09-18，新会话）：

- 会话来源：CloakBrowser（Chromium 146，headless）访问目标用户页，捕获真实 API 请求
  （含 cookie、`a_bogus`、`x-secsdk-web-signature`、timestamp）并用其 cookies 复现。
- **精确重放捕获请求 → HTTP 200 + 真实 `aweme_list`**（旧的 2025-04 会话 403 属过期，
  不是签名问题；见下方矩阵）。
- **当前接口要求两个签名**：`a_bogus`（BDMS）**和** `x-secsdk-web-signature`
  （字节 secsdk / Argus 插件）。只换 `a_bogus`（nv8 与原实现都一样）→
  `403 Blocked by ArgusSecurityPlugin Sign Invalid`——两个签名与 URL 强耦合，
  单独替换 a_bogus 必然无效。

| 实验 | 内容 | 结果 |
|---|---|---|
| A | 捕获 URL + 浏览器双签名，Python/curl_cffi 重放 | **200**（真实数据） |
| B | A 去掉 `x-secsdk-web-signature` | 403 `Signature Not Found` |
| C | A 的 `a_bogus` 换成 nv8 生成的 | 403 `Sign Invalid` |
| D | A 的 `a_bogus` 换成原 jsdom 实现生成的 | 403 `Sign Invalid` |
| E | nv8 的 a_bogus + 无 secsdk | 403 `Signature Not Found` |

页面内实验（CloakBrowser 同源 XHR）：手动 XHR 不会被 secsdk 重写
（fresh URL 一律 "Not Found"），原捕获 URL 在页面内重放仍 200；secsdk 运行时
（`lf-security.bytegoofy.com/obj/security-secsdk/runtime_bundler_34.js`，
策略 `webSign`）只处理应用自身的请求层，且签名器在模块闭包内（`window.use`
等入口在页面上不可见）。

**结论**：旧版纯 a_bogus 方案在当前站点无法通过；要让 nv8 产出可用的抖音签名，
必须先移植 secsdk 签名器（新的逆向任务，运行时依赖远端策略配置），
或改用不要求第二签名的目标验证签名管线。

## 4. 最小 surface 集（实测观察）

必需：`window`/`document`/`navigator`/`location`/`screen`/`XMLHttpRequest`
（BDMS 会替换 XMLHttpRequest 原型，nv8 的原始实现不影响流程）。
未触发：wasm、Worker、Canvas、WebGL、Intl/时区敏感路径——抖音签名不需要这些，
但保留完整 surface 不影响结果（仅预热成本）。

## 5. 检测面清单（已观察到的耦合）

- **环境采集**：a_bogus 载荷长度随环境集合变化（jsdom 简化 168 → nv8 全量 196）。
  长度本身不是错误；但 Realm 指纹与发包头不一致（如 Realm 是 Edge/Windows、
  请求头写 macOS Chrome）是明显的风控面。适配时要显式对齐
  `fingerprint.navigator`（platform/UA）与发送头。
- **location**：签名输入是完整 URL（含 query），BDMS 还会参考 `location.href`
  基线；`--page-url` 必须用目标域（本案例 `https://www.douyin.com/`）。
- **时间**：a_bogus 内嵌时间戳/时间差，逐次调用必变；不存在"固定期望值"回归，
  验收只检查格式（base64url 字符集、长度量级）与接口响应。
- **第二签名（2026-09 起）**：接口同时校验 `x-secsdk-web-signature`，且它与
  `a_bogus`、URL 三元耦合；只复现 a_bogus 会在线上得到 403
  `Signature Not Found`（缺 secsdk）或 `Sign Invalid`（替换了 a_bogus）。

## 6. 复现

```bash
# 测试目录（已含 node_modules 软链到 D:/develop_software/Nv8）
cd C:\Users\poppies\Desktop\nv8代码测试目录\douyin-bdms
python client.py --signs 3        # 预热 + 连续 3 次签名
```

对照原实现：`cd D:\code_repository\爬虫逆向\代码测试\抖音补环境; node 1.douyin.js`
（需要上级 `node_modules` 里有 jsdom）。
