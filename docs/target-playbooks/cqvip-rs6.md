# 目标 Playbook：中文期刊 cqvip（瑞数 RS6 *P）

> 适配日期：2026-09-29 · 测试代码：案例工作区 `中文期刊/`（主流程 `live_fetch.py` + `rs_live_solve.mjs`，工具清单见 §5）
> 采集基准：真机 Edge 154.0.4258.37；另有通过的 iv8 实现作对照

## 1. 目标画像

| 项 | 值 |
|---|---|
| 防护 | 瑞数 RS6：落地页返回 412 挑战页（内联 `$_ts` 种子 + 外链 VM 脚本） |
| 令牌 | `6HZbKHDjIEcgT`：页面脚本先写 provisional（实测 300 字符档），随后再演变（321 档）；服务端只认**首个 provisional** |
| 通过标志 | 携种子 + 首个 provisional 重放 `SearchList` 返回 200 + 真实检索数据（total≈1596 万） |
| 失败形态 | **HTTP 200 但 0 字节**（静默拒收）；412 则表示挑战过期/会话不对 |

## 2. 关键结论（两次踩坑的核心）

1. **必须整页自然加载挑战页**：手动挑 `r='m'` 脚本逐个执行会造成内联脚本
   **重复执行 + 生命周期错位**，P 内容被静默污染（长度、探测序列看起来都对，仍被拒）。
   正确做法（与 iv8 的 `page.load`、欧冶 mint 的 `EXTERNAL_VM` 一致）：
   种子 cookie 注入 `<head>` 的脚本、外链 RS 脚本保留 `<script src>` 由 `replay` 提供、
   解析器按文档顺序执行一次。
2. **首个 provisional 即验收令牌**：cookie jar 里的最终形态（321 档）会被 200/0 拒收。

## 3. 引擎级缺口（本目标逼出来的 nv8 修复）

1. **`getImageData` 曾带 ±1 像素噪音**（早期"反指纹"设计）：目标用「纯色填充的
   像素必须逐像素一致」鉴别模拟画布，噪音直接触发降级分支（跳过字形探测系列）。
   真机画布是确定性的，已删除噪音。
2. canvas 文本度量：固定 0.6em/字符 → 逐字形 advance 表；`ctx.font` /
   `style.fontFamily` / canvas 颜色读回按 Chromium 规则串行化。
3. WebGL `getShaderPrecisionFormat`：`LOW_INT`(0x8df3) 曾漏进 float 分支返回
   23,127,127，真机为 0,31,30。
4. matchMedia 布尔上下文查询（`(any-pointer)`/`(any-hover)`/`(color-gamut)` 等）
   真机为 true；canPlayType `audio/wav; codecs="1"` → probably、`audio/x-m4a;…` → maybe。
5. 字体枚举：真机 463 个候选（16 字符 @114px）逐族对拍归零（缺字体会把「已装」
   判成「未装」）。
6. `btoa`/`atob` 错误文案补 WebIDL 前缀；`documentElement`/`body` 的 client/offset
   尺寸按视口返回（曾为 0）。

## 4. 运行

```
python live_fetch_natural.py    # 或 live_fetch.py（主流程，同样是一次性自然加载）
```

流程：抓挑战（412）→ `rs_live_solve.mjs` 在 nv8 自然加载求解并取**首个 provisional**
→ 携种子 + `enable_*` + 首个 P 重放 `SearchList`。

失败排查：
- **200/0 字节** = P 内容被静默判偏：先查加载方式（是否双重执行），再查守卫触发
  （用案例目录的 `wide_hooks.js` 宽钩子与真机 Edge 对拍有序读值流）。
- **412** = 挑战过期（重新走一遍）或会话/种子不对。

## 5. 方法（可复用）

- 真机 Edge 冻结挑战（本地服务器复刻挑战页 + 种子）+ 同轮 nv8 求解 + **立即重放**，
  是判定"P 是否被接受"的最硬实验（本目标据此定位到加载方式问题）。
- 宽钩子（`wide_hooks.js`）+ 多集对比（`diff_wide2.py`）可定位"谁读了什么对方没读"；
  `probe-intrinsics.mjs`（nv8 仓库 `scripts/`）用于检查目标是否枚举 Window 表面。
