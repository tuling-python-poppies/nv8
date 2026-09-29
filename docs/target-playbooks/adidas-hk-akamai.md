# 目标 Playbook：Akamai Bot Manager（阿迪达斯 HK）

> 案例工作区 `Akamai-阿迪达斯/`（WSL 合集 `nv8代码测试/`）

## 1. 两条通道

| 通道 | 文件 | 说明 |
|---|---|---|
| **离线**（默认） | `sensor_runner.mjs` | 合成 sensor + replay 应答传感器端点；全程不联网、不写文件，产出被标记包裹的 JSON 工件 |
| **live** | `akamai_sensor_generator.mjs` | GET 真挑战页 → 挑战 cookie + sensor 脚本 URL → GET 真 sensor（约 500KB）→ nv8 内执行 → 捕获 sensor POST |

## 2. 验收

| 级别 | 条件 |
|---|---|
| `verified` | 捕获 sensor POST（`bodyByteLength > 0`）**且** `outcome === "replayed"`（离线保证） |
| `captured` | 捕获到 POST，但不是 replay 应答 |
| `none` | 未捕获 |

传感器端点**运行期派生**（去掉挑战页 URL 的 query）——Akamai 的挂载路径与 `?v=<uuid>` 会轮换，不硬编码。

## 3. 实测

- 离线：sensor POST 4210 字节、`application/json`、`outcome=replayed`；原始 Python 单测 **8/8 通过**。
- **线上全链（实测）**：`akamai_sensor_generator.mjs` 抓真挑战页（真 sensor 约 500KB）→
  NV8 执行 → 捕获 sensor POST 4623 字节 → Python（`curl_cffi`）转发 **HTTP 200**、
  拿到 `ak_bmsc` 等准入 cookie → 请求 SFCC `Search-UpdateGrid` → **HTTP 200 / 459KB /
  48 件真实商品**（真实商品名与价格，如 `KV4428 … HK$ 1,199.00`）。
- 运行方式（reference）：`python main.py`；`node_modules/nv8` 指向本机 nv8 根
  （Windows 下 junction 即可），Node 22/24 均可；合集补齐了被裁掉的 `utils/logger.py`。

## 4. 边界

- 离线通道用**合成 sensor**，证明的是链路（nv8 能执行 sensor 形状脚本、能 hook 并捕获 POST、
  端点由 replay 应答），不是真实 Akamai sensor 的算法；真实 sensor 走 live 通道。
- 最终出口归 Python（`curl_cffi`），nv8 只做 sensor 窄工件。
- 移植中未发现 NV8 框架自身的问题。
