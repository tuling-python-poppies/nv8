# Web IDL Foundation Plugin

## 概述

Web IDL Foundation 是 NV8 插件系统的基石插件，提供 Web IDL 规范的基础工具和原生函数注册机制。

## 提供的能力

### 1. `webidl-tools` (v1.0.0)

Web IDL descriptor 和类型转换工具：
- Descriptor 生成器
- 类型转换函数
- 跨 realm 方法包装

### 2. `native-function-registry` (v1.0.0)

原生函数注册和 Function.prototype.toString 模拟：
- 注册原生函数签名
- 拦截 Function.prototype.toString
- 跨 realm 函数源码共享

## 依赖

无（最底层插件）

## 支持的 Realm

- `window` - 主窗口环境
- `worker` - Web Worker 环境
- `worklet` - Worklet 环境

## 使用方式

### 在其他插件中依赖

```javascript
import { definePlugin } from '../../core/plugin-sdk/define-plugin.js';

export default definePlugin({
  id: 'my-plugin',
  version: '1.0.0',
  
  capabilities: {
    requires: [
      { name: 'webidl-tools', version: '^1.0.0' },
      { name: 'native-function-registry', version: '^1.0.0' },
    ],
  },
  
  async install(surface, context) {
    // 访问 webidl-foundation 导出的工具
    const webidl = context.getPlugin('webidl-foundation');
    
    // 获取 descriptor 工具
    const descriptor = await webidl.exports.getDescriptor();
    
    // 获取类型转换工具
    const conversions = await webidl.exports.getConversions();
    
    // 使用 native function registry
    const registry = webidl.exports.registry;
  },
});
```

## 导出 API

### `registry`

原生函数注册表对象：

```javascript
{
  register(callback, source): void
  has(callback): boolean
  source(callback): string | undefined
  clear(): void
}
```

### `getDescriptor()`

异步获取 Web IDL descriptor 工具：

```javascript
const descriptor = await webidl.exports.getDescriptor();
// 使用 descriptor 创建属性描述符
```

### `getConversions()`

异步获取 Web IDL 类型转换工具：

```javascript
const conversions = await webidl.exports.getConversions();
// 使用 conversions 进行类型转换
```

## 实现细节

### Native Function Registry

- 使用 `Map` 存储函数到源码的映射
- 跨 realm 共享，确保 toString 一致性
- 在 sandbox dispose 时自动清理

### Function.prototype.toString 拦截

- 只安装一次（幂等）
- 查找顺序：本地 WeakMap → 跨 realm registry → 原始 toString
- 不影响非注册函数的 toString 行为

## 状态管理

### 插件状态

- `native-function-registry`: 跨 realm 的函数注册表

### 作用域

- Sandbox 级别（跨 realm 共享）

## 生命周期

### install

1. 创建或获取 native function registry
2. 配置 webidl 模块使用该 registry
3. 安装 Function.prototype.toString 拦截
4. 导出工具 API

### reset

- 无操作（toString 拦截是全局的）

### dispose

- 清理状态中的 registry 引用

## 测试

```javascript
import { createApp, createSandbox } from '../../core/app.js';

// 创建 app 并注册插件
const app = createApp();
await app.registerPlugin(webidlFoundation);

// 创建 sandbox 并安装插件
const sandbox = createSandbox(app);
await sandbox.installPlugin('webidl-foundation@1.0.0', globalThis);

// 验证 Function.prototype.toString 拦截生效
const testFn = function myFunction() { /* ... */ };
console.log(testFn.toString()); // 应该包含正确的源码
```

## 已知限制

1. Function.prototype.toString 拦截是全局的，无法在 reset 时撤销
2. 仅支持通过 registry 注册的函数，动态创建的函数需要手动注册
3. 跨 realm registry 需要手动清理，避免内存泄漏

## 未来改进

- [ ] 支持更多 Web IDL 类型
- [ ] 优化 registry 内存占用
- [ ] 提供 descriptor 缓存机制
- [ ] 支持自定义 toString 格式
