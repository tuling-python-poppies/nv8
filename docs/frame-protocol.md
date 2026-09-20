# NV8 Frame Protocol 表示格式

NV8 的宿主与 Sandbox 后端之间使用固定头部的二进制 Frame Protocol。JSON 只用于
上层诊断和可审计结果，不进入宿主↔后端的传输帧；这样可以保持值类型、长度限制和
错误处理可确定。

## Frame 布局

每个 Frame 按网络字节序（big-endian）编码：

| 偏移 | 字节数 | 字段 | 说明 |
|---:|---:|---|---|
| 0 | 4 | `magic` | 固定 `0x45444745`，ASCII `EDGE` |
| 4 | 2 | `version` | 当前协议版本 `1` |
| 6 | 2 | `opcode` | 无符号 16-bit 操作码；响应使用 `RESPONSE_FLAG` |
| 8 | 4 | `requestId` | 无符号 32-bit 请求关联 ID |
| 12 | 4 | `payloadLength` | 无符号 32-bit payload 字节数 |
| 16 | N | `payload` | typed value 编码结果 |

头部固定为 **16 字节**。一个输入 chunk 可以包含半个 Frame、多个 Frame 或多个
Frame 的组合；`FrameReader` 必须在完整 Frame 到达后才回调，不允许把 chunk 边界
当成消息边界。

## Payload 表示

Payload 使用 `ValueTag` typed value 编码，而不是 JSON：

- `undefined`、`null`、布尔值和数字拥有独立 tag；
- 字符串使用长度受限的 UTF-8 字节；
- `Uint8Array` 使用 bytes tag；
- 数组和普通 record 递归编码，并受深度、数组长度、字段数和总 payload 限制；
- `Error`、EvaluationResult、TraceEntry 使用专用结构化 tag；
- 不接受任意 class instance、函数、symbol 或宿主句柄。

`encodeFramedValue(opcode, requestId, value)` 负责一次性写入头部和 typed payload；
`FrameReader` 先验证 magic、version 和 payload 长度，再把 `{ opcode, requestId,
payload }` 交给上层解码。上层必须使用同一组协议限制调用 `decodeValue()`。

协议限制来自双方同源的 `limits` 配置。当前客户端按以下顺序启动：

1. 按默认协议上限编码一个小的 `UPDATE_LIMITS`（opcode `15`）请求，只含协议限制白名单。
2. 后端在尚未创建 Runtime 时应用限制并更新 `FrameReader`，回传确认。
3. 客户端**等待确认后**发送 `INIT`；较大的 replay/HTML 已按协商限制解析，
   不再出现“16MiB 配置包在读到配置前被默认 8MiB 拒绝”的问题。

`UPDATE_LIMITS` 只允许在 Runtime 未初始化时使用。直接发送小 `INIT` 的旧客户端仍可工作；
新客户端连接不认识此 opcode 的旧后端会显式失败，双方应使用匹配的软件版本。
池化线程在 `CLOSE` 后恢复默认协议限制，允许下一租户重新协商。
公开 API 的 `limits` 接受并校验 `maxPayloadBytes`、`maxValueDepth`、`maxArrayLength`、
`maxFieldCount`、`maxStringBytes`、`maxBytesLength`；`maxPayloadBytes` **不包含**16 字节帧头。

`OPEN_INSPECTOR`（opcode `16`）由 child-process 后端在已初始化的 Runtime 子进程中
打开 Node/V8 inspector，返回 `{ url, alreadyOpen }`。URL 是独立于 Frame Protocol
的 CDP WebSocket 地址，不能在现有帧通道中转发；worker-thread 后端返回结构化错误。

编码失败时后端必须回结构化 `ERROR`，并保留真实错误码（`LIMIT_STRING_BYTES`、
`LIMIT_BYTES`、`LIMIT_PAYLOAD_BYTES` 等），不得改写成与根因无关的限制名。

## 生命周期和失败规则

- `requestId` 只在连接内关联请求和响应，不能作为跨进程安全凭据；
- 未知 request ID、响应 opcode 不匹配、错误 magic/version、payload 超限或 typed
  value 解码失败都属于协议错误；
- 协议错误使连接不可继续复用，后端必须终止/关闭当前 transport，并拒绝 pending
  请求；不能静默丢帧后继续处理后续输入；
- `CLOSE` 是显式生命周期操作，成功响应后才允许回收后端资源；
- 协议只传输经过限制和结构化编码的值，不传递 Node stream、socket、函数闭包或
  Realm 对象。

## 版本策略

`PROTOCOL_VERSION` 是 Frame 表示格式版本，独立于 Core SemVer、Plugin SDK
`apiVersion`、Evidence schema 和 Protocol artifact schema。头部格式或 typed value
tag 的不兼容变化必须升级 protocol major；向后兼容的新增能力应通过新 opcode、
可选字段或新的版本协商策略引入，不能让旧后端猜测未知 payload。

当前后端仅接受版本 `1`。版本错误在 FrameReader 层立即拒绝，避免把错误版本的
payload 交给 Realm 或 RequestHandler。
