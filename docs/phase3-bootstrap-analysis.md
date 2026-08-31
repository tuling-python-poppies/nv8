# Phase 3 - Bootstrap 分析报告

## 📊 Bootstrap 概况

**文件**: `src/bootstrap/bootstrap-root.js`
**规模**: 1348 行
**复杂度**: 
- 338 个 import 语句
- 523 个 install 调用
- 42 个 configure 调用

## 🎯 分析目标

理解现有的 bootstrap 流程，为插件化改造做准备：
1. 识别安装顺序和依赖关系
2. 识别可以组合成插件的模块群
3. 识别全局状态和配置点
4. 设计平滑的迁移路径

## 📦 Bootstrap 结构分析

### 启动流程

```javascript
export function bootstrapRoot(
  // Screen 配置 (10 个参数)
  // Navigation 配置 (6 个参数)
  // Navigator 配置 (7 个参数)
  // Storage 配置 (3 个参数)
  // Rendering 配置 (2 个参数)
  // Runtime 配置 (9 个参数)
) {
  // 1. 环境准备
  hideNodeGlobals();
  configureTimingProfile(timingProfile);
  configureNativeFunctionRegistry(nativeFunctionRegistry);
  configureBlobRegistry(objectURLRegistry);
  configureObjectURLRegistry(objectURLRegistry);
  
  // 2. 基础设施
  installNativeFunctionToString();
  installErrorStackGuard(browserMajorVersion >= 151);
  installModernBuiltins();
  installDateProfile();
  installIntlV8BreakIterator(browserMajorVersion >= 151);
  configureTrace(traceEnabled, maxTraceEntries);
  
  // 3. 全局配置
  configureScreenProfile(...);
  configureNavigation(pageUrl);
  configureIFrameRealms(...);
  configureNavigatorProfile(...);
  
  // 4. 大量 install 调用 (523 个)
  installConsole();
  installDOMException();
  installLocation();
  installHistory();
  installEventTarget();
  // ... 500+ more
  
  // 5. 最后的配置和解析
  configureWindowMessaging(...);
  configureDocumentDefaultView(outerWindow);
  configureDocument(pageReferrer, pageContentType);
  parsePageHTML(pageHtml);
  
  // 6. Edge 特殊处理
  installEdgeStaticFunctions();
  installEdgeAccessorSemantics();
  finalizeWindowSurfaceOrder();
}
```

### 安装顺序的关键观察

#### 第一层：基础工具和错误处理
```javascript
hideNodeGlobals();
installErrorStackGuard();
installModernBuiltins();
installDateProfile();
installIntlV8BreakIterator();
```

#### 第二层：Web IDL 基础
```javascript
installNativeFunctionToString();
configureNativeFunctionRegistry();
```

#### 第三层：事件系统
```javascript
installEventTarget();
installEvent();
installCustomEvent();
```

#### 第四层：DOM 基础
```javascript
installNode();
installCharacterData();
installText();
installComment();
installElement();
installDocument();
```

#### 第五层：Window 和 Navigator
```javascript
installWindow();
installNavigator();
installLocation();
installHistory();
```

#### 第六层：浏览器 API
```javascript
installFetch();
installXMLHttpRequest();
installStorage();
installCrypto();
// ... 几百个 API
```

## 🔍 潜在的插件分组

基于分析，可以识别出以下插件候选：

### 1. **webidl-foundation** (最优先)
```javascript
// 依赖: 无
// 提供能力: webidl-tools, native-function-registry
installNativeFunctionToString();
configureNativeFunctionRegistry();
// Web IDL descriptor 工具
```

### 2. **events** 
```javascript
// 依赖: webidl-foundation
// 提供能力: event-target, event-types, mutation-observer
installEventTarget();
installEvent();
installCustomEvent();
installMutationObserver();
installMutationRecord();
```

### 3. **dom-core**
```javascript
// 依赖: webidl-foundation, events
// 提供能力: dom-nodes, dom-tree
installNode();
installNodeList();
installCharacterData();
installText();
installComment();
installDocumentFragment();
installAttr();
installNamedNodeMap();
```

### 4. **dom-element**
```javascript
// 依赖: dom-core, events
// 提供能力: element, html-element
installElement();
installHTMLElement();
installHTMLCollection();
installDOMTokenList();
```

### 5. **css**
```javascript
// 依赖: dom-element
// 提供能力: css-om, css-typed-om
installCSSStyleDeclaration();
installCSSStyleSheet();
installCSSRule();
// ... 所有 CSS 相关
```

### 6. **dom-document**
```javascript
// 依赖: dom-element, css
// 提供能力: document, html-document
installDocument();
installHTMLDocument();
installXMLDocument();
installDOMImplementation();
installDocumentType();
```

### 7. **navigation-storage**
```javascript
// 依赖: events, dom-document
// 提供能力: location, history, storage
installLocation();
installHistory();
installStorage();
configureStorage();
```

### 8. **window**
```javascript
// 依赖: dom-document, navigation-storage
// 提供能力: window, navigator
installWindow();
installNavigator();
installNavigatorUAData();
installScreen();
installScreenOrientation();
```

### 9. **fetch-xhr**
```javascript
// 依赖: events, dom-core
// 提供能力: fetch, xhr, streams
installHeaders();
installFormData();
installStreams();
installBlob();
installRequestResponse();
installFetch();
installXMLHttpRequest();
```

### 10. **timers**
```javascript
// 依赖: window
// 提供能力: timers
installWindowTimers();
```

### 11. **crypto**
```javascript
// 依赖: window
// 提供能力: crypto, subtle-crypto
installCrypto();
```

### 12. **workers**
```javascript
// 依赖: window, events, messaging
// 提供能力: worker, shared-worker, service-worker
installWorker();
installSharedWorker();
installServiceWorker();
configureWorkers();
configureSharedWorkers();
configureServiceWorkers();
```

### 13. **canvas**
```javascript
// 依赖: dom-element
// 提供能力: canvas-2d, offscreen-canvas
installHTMLCanvasElement();
installCanvasRenderingContext2D();
installOffscreenCanvas();
installPath2D();
installImageData();
```

### 14. **media**
```javascript
// 依赖: dom-element, events
// 提供能力: audio, video, media-streams
installHTMLMediaElement();
installHTMLAudioElement();
installHTMLVideoElement();
installMediaStream();
installMediaStreamTrack();
```

## 🔄 状态管理分析

### 全局配置状态

Bootstrap 中有 42 个 configure 调用，这些都是设置全局状态：

```javascript
configureTimingProfile(timingProfile);
configureNativeFunctionRegistry(nativeFunctionRegistry);
configureBlobRegistry(objectURLRegistry);
configureScreenProfile(...);
configureNavigation(pageUrl);
configureNavigatorProfile(...);
configureStorage(localStorageData, sessionStorageData);
configureCookies(cookieData);
configureFetchReplay(replay, networkRequestRecorder);
// ... 等等
```

**迁移策略**:
- 这些需要迁移到 StateRegistry
- 按作用域分类：
  - **Realm 级别**: NavigatorProfile, ScreenProfile
  - **Page 级别**: Navigation, Storage, Cookies
  - **Sandbox 级别**: BlobRegistry, FetchReplay

### 模块级状态

许多 install 函数内部可能有模块级状态，需要扫描 `src/api/` 和 `src/install/`。

## 🎯 Phase 3 实施计划

### Step 1: 创建 Bootstrap 适配器 (1-2 天)

创建 `src/core/legacy/legacy-bootstrap-adapter.js`:

```javascript
import { bootstrapRoot as legacyBootstrapRoot } from '../../bootstrap/bootstrap-root.js';

export function createLegacyAdapter(app) {
  return {
    bootstrap(options) {
      // 调用旧的 bootstrap
      legacyBootstrapRoot(
        options.traceEnabled,
        options.maxTraceEntries,
        // ... 传递所有参数
      );
      
      // 返回旧的导出 API
      return {
        enableProxyTrace,
        disableProxyTrace,
        // ... 所有旧 API
      };
    }
  };
}
```

### Step 2: 创建第一个插件 - webidl-foundation (2-3 天)

```javascript
// src/plugins/webidl-foundation/index.js
import { definePlugin } from '../../core/plugin-sdk/define-plugin.js';

export default definePlugin({
  id: 'webidl-foundation',
  version: '1.0.0',
  capabilities: {
    provides: [
      { name: 'webidl-tools', version: '1.0.0' },
      { name: 'native-function-registry', version: '1.0.0' }
    ]
  },
  realms: ['window', 'worker', 'worklet'],
  
  install(surface, context) {
    const { installNativeFunctionToString } = await import(
      '../../install/install-native-function-toString.js'
    );
    installNativeFunctionToString();
  }
});
```

### Step 3: 逐步迁移插件 (3-5 天/插件)

按依赖顺序实现：
1. webidl-foundation
2. events
3. dom-core
4. dom-element
5. css
6. dom-document
7. navigation-storage
8. window
9. fetch-xhr
10. 其他插件...

### Step 4: 创建 legacy-full Profile (3-5 天)

```javascript
// src/profiles/legacy-full.js
export default {
  id: 'legacy-full',
  displayName: 'Legacy Full Browser',
  description: '完整的浏览器环境，与旧 bootstrap 行为一致',
  
  plugins: [
    'webidl-foundation@1.0.0',
    'events@1.0.0',
    'dom-core@1.0.0',
    // ... 所有插件
  ],
  
  browserMetadata: {
    name: 'Chrome',
    majorVersion: 150,
    userAgent: 'Mozilla/5.0 Chrome/150.0.0.0 Safari/537.36'
  }
};
```

### Step 5: 切换机制 (1-2 天)

```javascript
// src/core/app.js
export function createApp(options = {}) {
  const useLegacy = options.useLegacy ?? true; // 默认使用旧版
  
  if (useLegacy) {
    return createLegacyAdapter(this);
  } else {
    // 使用新的插件系统
    return createModernApp(options);
  }
}
```

## 🧪 验证策略

### Baseline: Golden Fixtures

1. 捕获旧 bootstrap 的完整行为
2. 创建快照对比工具
3. 增量验证每个插件

## 📊 工作量估算

| 任务 | 估算时间 | 优先级 |
|------|---------|--------|
| Bootstrap 适配器 | 1-2 天 | P0 |
| webidl-foundation | 2-3 天 | P0 |
| events | 3-4 天 | P0 |
| dom-core | 4-5 天 | P0 |
| dom-element | 4-5 天 | P1 |
| css | 5-7 天 | P1 |
| dom-document | 4-5 天 | P1 |
| navigation-storage | 3-4 天 | P1 |
| window | 3-4 天 | P1 |
| fetch-xhr | 4-5 天 | P1 |
| 其他插件 | 2-3 天/个 | P2 |
| legacy-full Profile | 3-5 天 | P1 |
| Golden fixtures | 5-7 天 | P0 |
| 状态迁移 | 1-2 周 | P1 |

**总估算**: 2-3 个月全职工作

## 🚧 风险和挑战

### 风险 1: 状态作用域识别困难
### 风险 2: 安装顺序依赖隐式
### 风险 3: 行为差异难以发现
### 风险 4: 工作量可能低估

## 📈 成功标准

Phase 3 完成的标准：

1. ✅ 至少 5 个核心插件实现并测试通过
2. ✅ legacy-full Profile 可以运行
3. ✅ Golden fixtures 对比通过（或差异已审批）
4. ✅ 切换机制工作正常
5. ✅ 状态迁移到 StateRegistry
6. ✅ 文档和测试齐全

## 🔗 下一步

1. 创建 `src/core/legacy/` 目录
2. 实现 Bootstrap 适配器
3. 开始实现 webidl-foundation 插件
4. 建立 golden fixtures 机制
5. 逐步迁移其他插件

---

**创建时间**: 2026-01-XX  
**状态**: Phase 3 启动  
**下一个里程碑**: webidl-foundation 插件完成
