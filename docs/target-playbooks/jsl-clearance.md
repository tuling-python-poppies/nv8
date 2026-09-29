# 目标 Playbook：加速乐（`__jsl_clearance_s`）

> 案例工作区 `加速乐/`（WSL 合集 `nv8代码测试/`）

## 1. 目标画像

| 项 | 值 |
|---|---|
| 结构 | 三段：① 首请求下发 `__jsluid_s` + 一小段 `document.cookie=…` 明文脚本（eval 即得第一段值）；② 带 cookie 再请求 → 混淆二段 `<script>`（**必须在浏览器环境里跑**）；③ 带最终 cookie 请求内容页 |
| 覆盖范围 | nv8 只负责第 ② 段（环境复现）；①③ 为真实网络出口，属 Python 侧 |
| 验收 | **离线自证**：二段脚本自带 `ct = sha256(__jsl_clearance_s)`，`sha256(算出的 cookie 值) === ct` 即通过（`ha` 声明 md5/sha1/sha256 时按声明算法） |

## 2. 适配（NV8 形态）

- `EdgeSandbox` + 捕获产物 `js_reverse_cache/source/jsl_stage2_script.js`（**轮次绑定**）
- 二段脚本的 cookie 写入在 `setTimeout` 回调里 → runner 必须 pump（默认 4000ms）
- 诊断：tap `Document.prototype.cookie` 的 setter（`execution.cookieWrites`）、tap `alert`（失败分支信号）

## 3. 踩坑

- **cookie 写入在异步回调里**：不等就直接读会永远是空串，且没有任何报错（表现为"脚本跑了但什么都没发生"）。
- **字符名是拼出来的**：写入是 `document[_0x4bd1('0x52','POcw') + 'ie'] = value`，静态 grep `cookie` 搜不到，字符串表还是二次加密的。
- **`alert` 是静默 no-op**：环境不满足的分支走 `alert(...)`；nv8 里 alert 存在、不抛、不阻塞、无信号，与"什么都没发生"同形——必须 tap 才能区分。

## 4. 运行与结果

```
node --experimental-vm-modules main.mjs        # NV8_ROOT 可指向任意 nv8 根
```

实测：`level=verified`（47 字符 cookie，sha256 与脚本内 `ct` 逐字匹配）。

## 5. 边界

- 二段脚本与那一轮 `ct/chars/bts` 绑定，换轮需重新捕获。
- 脚本会顺带改 `location`，nv8 里不会真的跳转，符合离线自证预期。
