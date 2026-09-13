# NV8 示例

这些示例使用仓库源码作为入口，均可在仓库根目录运行。Node 18–24 需要
`--experimental-vm-modules`，项目脚本已经包含该参数：

```bash
node --experimental-vm-modules examples/basic-eval.mjs
node --experimental-vm-modules examples/protocol-collector.mjs
node --experimental-vm-modules examples/pagination.mjs
```

## 示例说明

| 文件 | 场景 | 网络行为 |
|---|---|---|
| `basic-eval.mjs` | 创建最小 Profile，执行一次 Realm 求值 | 无真实网络 |
| `protocol-collector.mjs` | Artifact → Protocol → Collector 完整链路 | 使用 stub transport，不出网 |
| `pagination.mjs` | 有界 cursor 分页、结果落地与去重 | 使用 stub transport，不出网 |

示例刻意不把真实凭据写入源码，也不默认开启真实网络。生产环境必须显式配置
Collector 的 `NetworkPolicy` allowlist，并通过凭据管理器注入 origin-bound 凭据。
页面脚本只能在 Realm 内运行，不能直接访问 Collector、文件系统或网络出口。
