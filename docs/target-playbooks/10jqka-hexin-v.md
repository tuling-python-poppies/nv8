# 目标 Playbook：同花顺（`hexin-v`）

> 案例工作区 `同花顺/`（WSL 合集 `nv8代码测试/`）

## 1. 目标画像

| 项 | 值 |
|---|---|
| 入口 | `chameleon.1.7.min.js` 在页面环境运行后写 cookie `v`（即 `hexin-v`） |
| 验收 | 格式正则：`value.length === 60 && /^A[A-Za-z0-9_-]{59}$/`（另校验捕获脚本 SHA256 完整性） |
| 出口 | 带 `hexin-v` 请求 `q.10jqka.com.cn` 属 Python 侧 |

## 2. 适配要点

- **服务端时间必须刷新**：脚本硬编码 `var TOKEN_SERVER_TIME=…;`，执行前替换成当轮
  （正则/作用域同原案例），否则结果的时间基准是旧的。
- 原案例分析文档点名的两条环境要求，**NV8 原生满足**（runner 显式检验）：
  - `document.cookie` 的**过期删除**（expires 过期 → 删除）——不做则脚本不进最终 `v` 生成分支；
  - `navigator.plugins` **array-like**（存在、length、item、索引访问）。

## 3. 运行与结果

```
node --experimental-vm-modules main.mjs
```

实测 `level=verified`：`v` 为 60 字符、前缀 `A`、格式合法。动态凭据落盘只留长度、摘要与前缀。

## 4. 线上验收（实测）

案例工作区带出口：先跑 `main.mjs` 生成 `hexin-v`，再由 `live_fetch.py` 带凭据请求
真实行情接口（涨跌幅榜 ajax 页，公开行情、无需登录）：

```bash
node --experimental-vm-modules main.mjs          # 产出 output/proof-result.json
python live_fetch.py                             # 带 hexin-v 联网发包
```

实测：

```text
NV8 生成 hexin-v: len=60 prefix=A9_QE4mJyS3-
HTTP 200  bytes=17982
解析出 20 条股票行情，前 3 条：
  {"代码": "301716", "名称": "N瑞富",  "现价": "578.88", "涨跌幅": "653.16"}
  {"代码": "920202", "名称": "N泰凯",  "现价": "26.16",  "涨跌幅": "246.49"}
  {"代码": "920779", "名称": "武汉蓝电", "现价": "28.40",  "涨跌幅": "29.98"}
```

即：NV8 产出的 `hexin-v` 被目标站认可，真实数据出数。

## 5. 边界

- 脚本是捕获产物（SHA256 记录在 `config.example.json` 的 `expectedSha256`），换版本需重新捕获。
- 移植过程中未遇到 NV8 框架自身的问题。
