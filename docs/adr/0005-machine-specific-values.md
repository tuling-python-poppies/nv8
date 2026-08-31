# ADR-0005：机器相关值不进浏览器身份

- 状态：已接受
- 日期：2026-01
- 依赖：ADR-0001

## 背景

指纹字段分两类，混在一起处理会造成两种相反的错误：

| 类别 | 例子 | 要求 |
|---|---|---|
| **浏览器身份** | UA、brands、`Edg/` 版本号、平台、vendor | 必须与真实浏览器一致 |
| **机器特征** | CPU 核数、内存、屏幕尺寸、语言、GPU 型号、字体族 | 必须是中性默认值 |

错误一：浏览器身份用了臆造值 → 与真实浏览器不符，直接暴露。
错误二：机器特征照抄采集机器 → 把指纹钉死在一台机器上，群体里唯一，
**比中性默认值更可疑**。

## 决策

**采集数据时必须逐字段判定属于哪一类。** 浏览器身份照抄；机器特征取中性值。

判定不能靠直觉——同一个数据源里两类字段是混在一起的。

## 已经踩过的三次

这条规则是踩出来的，三次都发生在"扩大采集范围"之后：

### 一、WebGL renderer

采集得到 `unmaskedRenderer: "ANGLE (Microsoft, Microsoft Basic Render Driver
(0x0000008C) Direct3D11 vs_5_0 ps_5_0, D3D11)"`。

那是 headless 环境的软件渲染器。照抄会让每个 NV8 实例都声称在用软件渲染
——真实用户里这个比例极低。改为从 `gpu-profiles.js` 的真实 GPU 组合里取。

同时发现一个**结构性**错误：`gl.VENDOR` / `gl.RENDERER` 是 Chromium 的
**固定值**（`"WebKit"` / `"WebKit WebGL"`），与 GPU 无关；GPU 信息只走
`WEBGL_debug_renderer_info` 的 UNMASKED_* 参数。原实现把 GPU 串放在了
masked 参数上。

### 二、hardwareConcurrency / deviceMemory / languages

采集机器是 28 核 / 16GB / 4 种语言。这三项都没有照抄，保留中性默认值，
并加了一条断言确认 `hardwareConcurrency` 与采集机器**不同**——防止将来
有人"顺手对齐"。

### 三、CSS `fontFamily`（最隐蔽）

扩大 UA 默认样式表采集范围后，`fontFamily` 被记成 `"Noto Sans SC"`。

这不是浏览器默认值，是**采集机器的中文系统语言**决定的。实测：

```
(默认，中文环境)     fontFamily: "Noto Sans SC"      language: zh-CN
--lang=en-US        fontFamily: "Times New Roman"   language: en-US
```

而 NV8 的 profile 声明 `languages: ['en-US', 'en']`。若不修，会造出
"UA 说 en-US、字体族说中文"的自相矛盾配置。

修法不是手改这一个值，而是**采集时锁定 locale**
（`--lang=en-US --accept-lang=en-US,en`），让整份数据集与 profile 声明一致。

前两次是主动警惕才避开的，第三次是扩大采集面后**新引入**的。

## 推论

**每次扩大采集范围，都要重新过一遍这个检查。** 不能假设"上次查过了"——
新采的字段里必然可能混进新的机器特征。

具体做法：

1. 采集脚本锁定一切能锁的环境变量（locale、窗口尺寸、GPU 模式）
2. 新增字段先问"换台机器会变吗"，会变就不能照抄
3. 对刻意不照抄的字段加断言，锁住"故意不一致"这个事实

## 相关实现

- `src/fingerprint/gpu-profiles.js` —— 5 套真实 GPU 组合，字段由
  「厂商 + 型号 + 驱动」推导；`validateGpuIdentity()` 挡住内部矛盾
- `scripts/collect-edge-ua-defaults.mjs` —— 锁定 `--lang=en-US`
- `tests/fingerprint-calibration-test.js` —— 断言机器特征与采集机器不同
- `tests/webgl-parity-test.js` —— 断言 masked 参数不泄漏 GPU 信息
- `docs/edge-parity.md` —— 「机器相关字段不能照抄」一节
