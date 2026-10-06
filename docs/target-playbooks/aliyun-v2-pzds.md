# 目标 Playbook：阿里云验证码 V2（PZDS / FeiLin 设备 profile）单轮闭环

> 案例工作区：PZDS 项目内 `nv8版本/`（本文档不含账号态、会话值或本地绝对路径）

## 1. 验收模型（分级，如实记录）

| 级别 | 条件 | 说明 |
|---|---|---|
| `device-log2` | 同轮 InitCaptchaV2 200 + Log2 200 + `window.um.getToken()` 非空 | 采集级：单轮设备 profile 成立 |
| `online-t001` | Python updater 用采集 profile 在线拿 `VerifyCode=T001` / `VerifyResult=true` | **线上通过级别**：设备 profile 被服务端接受，且验证链真通过 |
| `business` | 业务接口 `success=true` + records 非空 | 端到端：该 profile 驱动纯协议业务重放成功 |

实测：feilin033（2026-09-30）与 feilin038（2026-10-06，滚动升级期）均达 `business` 级。

## 2. 链路与素材形态

请求形态（Chrome 抓包确认为准）：

- **WAF challenge HTML**：业务接口带签名头才返回；由 Python 纯协议抓取，作为 page HTML 注入（页面 URL = 站点 origin）。
- **SDK**：`https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js?t=<cacheBuster>`，由 challenge 内联脚本运行时动态 append。
- **FeiLin 设备 JS**（按 cohort）：`https://g.alicdn.com/captcha-frontend/FeiLin/<version>/feilin<NNN>.<hash>.js`。
- **动态 UI 分片**：`https://g.alicdn.com/captcha-frontend/dynamicJS/<StaticPath>.js`（`StaticPath` 来自 Init 响应，运行期才可知）。
- **接口**：InitCaptchaV2 / UploadLog → `https://<会话前缀>.captcha-pro-open.aliyuncs.com/`；Log2 / Log3 → `https://device.captcha-open.aliyuncs.com/`。
- **产出**：页面 `window.um.getToken()`（device token，供设备侧使用）。

## 3. 适配要点

- **不走 sign-server 常驻模式**：本目标验收依赖 XHR/token 侧效应，按 Provider 指引使用
  `EdgeSandbox + networkRelay + networkRequests` 路径。
- **页面 `<script>` 边界与 loader shim**：nv8 页面脚本只支持精确 URL replay，而本目标的
  脚本 URL 运行期才可知（含 Init 返回的 `StaticPath`）。host 侧 shim：
  拦截 `Node.prototype.appendChild/insertBefore` 中带 `src` 的 SCRIPT → 经 Realm `fetch`
  （走 networkRelay）取回源码 → **indirect eval** 执行 → 在原节点派发 `load`/`error`。
  两个坑：① 解析期内联脚本触发的插入发生在 nv8 动态脚本观察器建立**之前**，靠观察器会丢；
  ② 节点不要插入 DOM，否则观察器就绪后会二次执行。
- **relay 白名单**：engine 侧 `origins: ["https://"]`；helper 侧按后缀白名单
  `*.aliyuncs.com` / `*.alicdn.com`。Init 主机带会话前缀（`<acw_tc 值>.captcha-pro-open...`），
  固定前缀匹配不够用。helper 需为缺失 `Access-Control-Allow-Origin` 的响应补齐
  （静态 CDN 不设 CORS，否则 Realm fetch 会拒绝真 200）。
- **指纹一致性**：`fingerprint.browserMajorVersion=150` + 自定义 Chrome UA
  （含 `Chrome/150.`、不带 `Edg/` 合法）。**Realm UA 必须与 Python 发包层 UA 逐字一致**，
  否则采集出的 profile 会被服务端判为环境矛盾。
- **环境持久化与沙箱生命周期**：FeiLin 把设备标识（如字段 71/73）写入 localStorage/cookie。
  单沙箱多轮运行子进程堆持续增长（约第 5 轮 OOM，实测 ~900MB）→ **每轮独立沙箱**；
  第 1 轮结束导出 `{localStorage, cookie}` 种子，后续轮在页面脚本执行前注入，
  复刻「同一浏览器 profile 预热」语义。
- **轮次完成条件**：`getToken()` 非空 **且** Log2 请求已出现。seed 轮可能先返回缓存
  token，提前关闭会截断 Log2，产出不可用轮次。
- **cohort 滚动升级**：服务端随机分发多版本（实测 038/039 并行）。按 stale 报错锁定版本
  采样不足时分级加大轮数（12→24→48）重试；不混合不同 cohort 的样本拼 profile。
- **field21 形态差异**（采集侧不感知，推断在 Python updater）：feilin033 为逐位置
  digit/letter 变换（需专用构造器）；feilin038/039 回归经典 `sourceKey/xorMask`。

## 4. 运行（案例工作区）

```powershell
python main.py                              # 入口：业务采集；stale 时自动 nv8 刷新
python capture_pzds_nv8.py --rounds 12      # 只刷新 profile（采集 + updater）
python capture_pzds_nv8.py --rounds 12 --capture-only   # 只采集落 artifact
```

依赖：Node >= 18.18（22+ 建议）、项目内 `nv8` file: 依赖、Python helper（curl_cffi）。

## 5. 实测记录

- 网络形态：每轮 6-7 个请求（SDK / Init / FeiLin / dynamicJS / Log2 / Log3）。
- 采集：12/12 轮 token+Log2，relay 分段配对 12/12；111 字段 schema（nv8 环境触发，服务端接受）。
- 在线：`T001 / true`；业务 `success=true`、10 条 records。
- 滚动期：12 轮命中 10/12 → 升级到 24 轮采到 19/19 目标版本后通过。
- 案例工作区 `recon/` 留有：shim 语义回归探针、任意 artifact 字段稳定性检查、
  field21 通用拟合器（升级新代际时先跑）。

## 6. 边界

- device token 与设备链只服务设备侧；Log3 / VerifyCaptchaV2 / 业务重放仍由 Python 出网，
  本 playbook 不含协议实现细节。
- nv8 默认 Edge UA-CH 品牌与自定义 Chrome UA 存在少量差异，当前服务端未触发；
  若触发需对齐 `fingerprint.navigator.userAgentData`。
- 素材 URL 随 cohort 变化（FeiLin 版本号、dynamicJS `StaticPath`），采集时实时取，
  不做静态 replay 固化；WAF challenge HTML 需要业务登录态与签名头。
