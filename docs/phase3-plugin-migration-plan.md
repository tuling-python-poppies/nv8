# Phase 3: 插件迁移计划

## 目标

将 `src/bootstrap/bootstrap-root.js` 中的所有浏览器能力按功能域拆分为插件，使其符合 Plugin SDK 的契约。

## 插件拆分方案

### 1. Core 基础插件（必需，无依赖）

#### 1.1 `@nv8/plugin-webidl`
**职责**：WebIDL 基础设施和原生函数注册
**能力**：`webidl.base`
**安装内容**：
- `installNativeFunctionToString()`
- `configureNativeFunctionRegistry(nativeFunctionRegistry)`

#### 1.2 `@nv8/plugin-errors`
**职责**：错误对象和堆栈保护
**能力**：`errors.base`
**安装内容**：
- `installErrorStackGuard(browserMajorVersion >= 151)`
- `installErrorObjects()`

#### 1.3 `@nv8/plugin-builtins`
**职责**：现代 JavaScript 内置对象
**能力**：`builtins.modern`
**安装内容**：
- `installModernBuiltins()`
- `installDateProfile()`
- `installIntlV8BreakIterator(browserMajorVersion >= 151)`

#### 1.4 `@nv8/plugin-console`
**职责**：Console API
**能力**：`console.base`
**安装内容**：
- `installConsole()`

### 2. 事件系统插件

#### 2.1 `@nv8/plugin-events`
**职责**：Event 和 EventTarget 基础
**能力**：`events.base`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installEventTarget()`
- `installEvent()`
- `installCustomEvent()`

#### 2.2 `@nv8/plugin-dom-exception`
**职责**：DOMException
**能力**：`dom.exception`
**依赖**：`@nv8/plugin-errors`
**安装内容**：
- `installDOMException()`

### 3. DOM 核心插件

#### 3.1 `@nv8/plugin-dom-core`
**职责**：DOM 节点树基础
**能力**：`dom.core`, `dom.node`, `dom.text`, `dom.comment`
**依赖**：`@nv8/plugin-events`, `@nv8/plugin-dom-exception`
**安装内容**：
- `installNodeList()`
- `installNode()`
- `installCharacterData()`
- `installText()`
- `installComment()`
- `installCDATASection()`
- `installProcessingInstruction()`
- `installDocumentFragment()`
- `installDocumentType()`
- `installAttr()`
- `installNamedNodeMap()`

#### 3.2 `@nv8/plugin-dom-collections`
**职责**：DOM 集合类型
**能力**：`dom.collections`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installHTMLCollection()`
- `installRadioNodeList()`
- `installHTMLFormControlsCollection()`
- `installDOMTokenList()`
- `installHTMLAllCollection()`

#### 3.3 `@nv8/plugin-dom-observers`
**职责**：DOM Mutation Observer
**能力**：`dom.observers`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installMutationRecord()`
- `installMutationObserver()`

#### 3.4 `@nv8/plugin-dom-ranges`
**职责**：Range 和 Selection
**能力**：`dom.ranges`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installAbstractRange()`
- `installRange()`
- `installSelection()`

#### 3.5 `@nv8/plugin-dom-traversal`
**职责**：DOM 遍历
**能力**：`dom.traversal`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installNodeFilter()`
- `installTreeWalker()`
- `installNodeIterator()`

### 4. CSS 插件

#### 4.1 `@nv8/plugin-cssom-core`
**职责**：CSSOM 核心
**能力**：`cssom.core`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installCSSStyleValue()`
- `installCSSTypedOMValues()`
- `installCSSNamespace()`
- `installCSSTransformValues()`
- `installCSSStyleDeclaration()`
- `installStylePropertyMapReadOnly()`
- `installStylePropertyMap()`

#### 4.2 `@nv8/plugin-cssom-rules`
**职责**：CSS 规则
**能力**：`cssom.rules`
**依赖**：`@nv8/plugin-cssom-core`
**安装内容**：
- `installMediaList()`
- `installStyleSheet()`
- `installStyleSheetList()`
- `installCSSRule()`
- `installCSSRuleList()`
- `installCSSGroupingRule()`
- `installCSSConditionRule()`
- `installCSSMediaRule()`
- `installCSSSupportsRule()`
- `installCSSImportRule()`
- `installCSSDeclarationRules()`
- `installCSSPositionTryDescriptors()`
- `installCSSGroupingSpecialRules()`
- `installCSSDescriptorRules()`
- `installCSSFunctionRules()`
- `installCSSKeyframesRule()`
- `installCSSKeyframeRule()`
- `installCSSStyleRule()`
- `installCSSStyleSheet()`

#### 4.3 `@nv8/plugin-cssom-query`
**职责**：Media Query
**能力**：`cssom.query`
**依赖**：`@nv8/plugin-cssom-core`
**安装内容**：
- `installMediaQueryList()`
- `installWindowCSS()`

#### 4.4 `@nv8/plugin-css-animations`
**职责**：CSS 动画和过渡
**能力**：`css.animations`
**依赖**：`@nv8/plugin-cssom-core`
**安装内容**：
- `installAnimationTimeline()`
- `installDocumentTimeline()`
- `installAnimationEffect()`
- `installKeyframeEffect()`
- `installAnimation()`
- `installCSSAnimations()`

#### 4.5 `@nv8/plugin-css-pseudo`
**职责**：CSS 伪元素和 View Transitions
**能力**：`css.pseudo`
**依赖**：`@nv8/plugin-cssom-core`
**安装内容**：
- `installCSSPseudoElement()`
- `installViewTransitionTypeSet()`
- `installViewTransition()`

### 5. HTML Elements 插件

#### 5.1 `@nv8/plugin-html-core`
**职责**：HTML Element 基类和基础元素
**能力**：`html.elements.core`
**依赖**：`@nv8/plugin-dom-core`, `@nv8/plugin-cssom-core`
**安装内容**：
- `installCustomElementRegistry()`
- `installCustomStateSet()`
- `installElementInternals()`
- `installElement()`
- `installHTMLElement()`
- `installHTMLUnknownElement()`

#### 5.2 `@nv8/plugin-html-document-structure`
**职责**：文档结构元素
**能力**：`html.elements.document`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installHTMLHtmlElement()`
- `installHTMLHeadElement()`
- `installHTMLBodyElement()`
- `installHTMLTitleElement()`
- `installHTMLBaseElement()`
- `installHTMLMetaElement()`
- `installHTMLLinkElement()`

#### 5.3 `@nv8/plugin-html-text`
**职责**：文本内容元素
**能力**：`html.elements.text`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installHTMLDivElement()`
- `installHTMLSpanElement()`
- `installHTMLParagraphElement()`
- `installHTMLHeadingElement()`
- `installHTMLPreElement()`
- `installHTMLBRElement()`
- `installHTMLHRElement()`
- `installHTMLQuoteElement()`
- `installHTMLTimeElement()`
- `installHTMLDataElement()`

#### 5.4 `@nv8/plugin-html-lists`
**职责**：列表元素
**能力**：`html.elements.lists`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installHTMLUListElement()`
- `installHTMLOListElement()`
- `installHTMLLIElement()`
- `installHTMLDListElement()`
- `installHTMLMenuElement()`
- `installHTMLDirectoryElement()`

#### 5.5 `@nv8/plugin-html-tables`
**职责**：表格元素
**能力**：`html.elements.tables`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installHTMLTableElement()`
- `installHTMLTableSectionElement()`
- `installHTMLTableRowElement()`
- `installHTMLTableCellElement()`
- `installHTMLTableColElement()`
- `installHTMLTableCaptionElement()`

#### 5.6 `@nv8/plugin-html-forms`
**职责**：表单元素
**能力**：`html.elements.forms`
**依赖**：`@nv8/plugin-html-core`, `@nv8/plugin-dom-collections`
**安装内容**：
- `installValidityState()`
- `installHTMLFormElement()`
- `installHTMLInputElement()`
- `installHTMLTextAreaElement()`
- `installHTMLButtonElement()`
- `installHTMLSelectElement()`
- `installHTMLOptionElement()`
- `installOptionConstructor()`
- `installHTMLOptionsCollection()`
- `installHTMLOptGroupElement()`
- `installHTMLFieldSetElement()`
- `installHTMLLegendElement()`
- `installHTMLLabelElement()`
- `installHTMLOutputElement()`
- `installHTMLDataListElement()`
- `installFileList()`

#### 5.7 `@nv8/plugin-html-embedded`
**职责**：嵌入式内容元素
**能力**：`html.elements.embedded`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installHTMLImageElement()`
- `installImageConstructor()`
- `installHTMLPictureElement()`
- `installHTMLScriptElement()`
- `installHTMLStyleElement()`
- `installHTMLTemplateElement()`
- `installHTMLEmbedElement()`
- `installHTMLObjectElement()`
- `installHTMLParamElement()`
- `installHTMLSourceElement()`
- `installHTMLMapElement()`
- `installHTMLAreaElement()`

#### 5.8 `@nv8/plugin-html-frames`
**职责**：Frame 和 IFrame
**能力**：`html.elements.frames`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installFencedFrameConfig()`
- `installHTMLFencedFrameElement()`
- `installHTMLFrameElement()`
- `installHTMLIFrameElement()`
- `installHTMLFrameSetElement()`

#### 5.9 `@nv8/plugin-html-media`
**职责**：媒体元素
**能力**：`html.elements.media`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installTimeRanges()`
- `installTextTrackCue()`
- `installVTTCue()`
- `installTextTrackCueList()`
- `installTextTrack()`
- `installTextTrackList()`
- `installHTMLTrackElement()`
- `installRemotePlayback()`
- `installMediaError()`
- `installOverconstrainedError()`
- `installMediaStreamTrackAudioStats()`
- `installMediaStreamTrack()`
- `installMediaStream()`
- `installHTMLMediaElement()`
- `installHTMLAudioElement()`
- `installAudioConstructor()`
- `installVideoPlaybackQuality()`
- `installPictureInPictureWindow()`
- `installHTMLVideoElement()`

#### 5.10 `@nv8/plugin-html-canvas`
**职责**：Canvas 元素
**能力**：`html.elements.canvas`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installImageData()`
- `installTextMetrics()`
- `installCanvasGradient()`
- `installCanvasPattern()`
- `installPath2D()`
- `installImageBitmap()`
- `installImageBitmapRenderingContext()`
- `installOffscreenCanvasRenderingContext2D()`
- `installCanvasRenderingContext2D()`
- `installOffscreenCanvas()`
- `installCanvasCaptureMediaStreamTrack()`
- `installHTMLCanvasElement()`

#### 5.11 `@nv8/plugin-html-interactive`
**职责**：交互式元素
**能力**：`html.elements.interactive`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installHTMLAnchorElement()`
- `installHTMLDetailsElement()`
- `installHTMLDialogElement()`
- `installHTMLProgressElement()`
- `installHTMLMeterElement()`
- `installHTMLMarqueeElement()`
- `installHTMLSlotElement()`

#### 5.12 `@nv8/plugin-html-legacy`
**职责**：遗留 HTML 元素
**能力**：`html.elements.legacy`
**依赖**：`@nv8/plugin-html-core`
**安装内容**：
- `installHTMLFontElement()`
- `installHTMLGeolocationElement()`
- `installHTMLSelectedContentElement()`
- `installHTMLModElement()`

### 6. SVG 和 MathML 插件

#### 6.1 `@nv8/plugin-svg-core`
**职责**：SVG 核心
**能力**：`svg.core`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installSVGValues()`
- `installSVGLists()`
- `installSVGAnimatedValues()`
- `installSVGElement()`
- `installSVGGraphicsElement()`
- `installSVGGeometryElement()`
- `installSVGCircleElement()`
- `installSVGPathElement()`
- `installSVGSVGElement()`
- `installReconstructedSVGFactories()`
- `installSVGUnitTypes()`

#### 6.2 `@nv8/plugin-mathml`
**职责**：MathML 支持
**能力**：`mathml.core`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installMathMLElement()`

### 7. Document 插件

#### 7.1 `@nv8/plugin-document`
**职责**：Document 和 ShadowRoot
**能力**：`document.core`
**依赖**：`@nv8/plugin-dom-core`, `@nv8/plugin-html-core`
**安装内容**：
- `installShadowRoot()`
- `installDocument()`
- `installHTMLDocument()`
- `installXMLDocument()`
- `installDOMImplementation()`
- `installExecutionObservers()`
- `installDocumentProcessing()`

#### 7.2 `@nv8/plugin-cookie`
**职责**：Cookie 管理
**能力**：`document.cookie`
**依赖**：`@nv8/plugin-document`
**安装内容**：
- `installCookie()`
- `configureCookies(cookieData)`

### 8. Geometry 插件

#### 8.1 `@nv8/plugin-geometry`
**职责**：Geometry API (DOMRect, DOMPoint, DOMMatrix)
**能力**：`geometry.core`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installDOMPointReadOnly()`
- `installDOMPoint()`
- `installDOMMatrixReadOnly()`
- `installDOMMatrix()`
- `installDOMRectReadOnly()`
- `installDOMRect()`
- `installDOMRectList()`

### 9. Window 插件

#### 9.1 `@nv8/plugin-window-core`
**职责**：Window 对象核心
**能力**：`window.core`
**依赖**：`@nv8/plugin-events`, `@nv8/plugin-document`
**安装内容**：
- `installWindow()`
- `installWindowStateGlobals()`
- `installWindowEventHandlerGlobals()`
- `installWindowLegacyGlobals()`

#### 9.2 `@nv8/plugin-location`
**职责**：Location API
**能力**：`window.location`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installLocation()`
- `configureNavigation(pageUrl)`

#### 9.3 `@nv8/plugin-history`
**职责**：History API
**能力**：`window.history`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installHistory()`

### 10. Navigator 插件

#### 10.1 `@nv8/plugin-navigator`
**职责**：Navigator 对象
**能力**：`navigator.core`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installNavigator()`
- `installNavigatorUAData()`
- `configureNavigatorProfile(...)`

### 11. Screen 插件

#### 11.1 `@nv8/plugin-screen`
**职责**：Screen API
**能力**：`screen.core`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installScreen()`
- `installScreenOrientation()`
- `installScreenDetails()`
- `configureScreenProfile(...)`

### 12. Timing 插件

#### 12.1 `@nv8/plugin-timers`
**职责**：setTimeout/setInterval
**能力**：`timers.core`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installWindowTimers()`
- `configureTimingProfile(timingProfile)`

#### 12.2 `@nv8/plugin-performance`
**职责**：Performance API
**能力**：`performance.core`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installPerformanceEntry(browserMajorVersion >= 151)`
- `installPerformanceMark()`
- `installPerformanceMeasure()`
- `installPerformanceLongtail()`
- `installPerformance({ edge151Surface: browserMajorVersion >= 151 })`

### 13. Storage 插件

#### 13.1 `@nv8/plugin-storage`
**职责**：localStorage 和 sessionStorage
**能力**：`storage.web`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installStorage()`
- `configureStorage(localStorageData, sessionStorageData)`

### 14. URL 插件

#### 14.1 `@nv8/plugin-url`
**职责**：URL 和 URLSearchParams
**能力**：`url.core`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installURLSearchParams()`
- `installURL()`
- `installURLPattern()`
- `configureObjectURLRegistry(objectURLRegistry)`

### 15. Encoding 插件

#### 15.1 `@nv8/plugin-encoding`
**职责**：TextEncoder/TextDecoder
**能力**：`encoding.text`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installTextEncoding()`

#### 15.2 `@nv8/plugin-base64`
**职责**：atob/btoa
**能力**：`encoding.base64`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installBase64()`

### 16. Streams 插件

#### 16.1 `@nv8/plugin-streams`
**职责**：Streams API
**能力**：`streams.core`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installStreams()`
- `installTextStreams()`
- `installCompressionStreams()`

### 17. Crypto 插件

#### 17.1 `@nv8/plugin-crypto`
**职责**：Crypto API
**能力**：`crypto.core`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installCrypto()`

### 18. File 插件

#### 18.1 `@nv8/plugin-file`
**职责**：File、Blob、FileReader
**能力**：`file.core`
**依赖**：`@nv8/plugin-webidl`, `@nv8/plugin-streams`
**安装内容**：
- `installBlob()`
- `installFileAndReader()`
- `configureBlobRegistry(objectURLRegistry)`

### 19. Fetch 插件

#### 19.1 `@nv8/plugin-fetch`
**职责**：Fetch API
**能力**：`fetch.core`
**依赖**：`@nv8/plugin-webidl`, `@nv8/plugin-streams`, `@nv8/plugin-file`
**安装内容**：
- `installHeaders()`
- `installFormData()`
- `installRequestResponse()`
- `configureFetchReplay(replay, networkRequestRecorder)`
- `installFetch()`

#### 19.2 `@nv8/plugin-xhr`
**职责**：XMLHttpRequest
**能力**：`xhr.core`
**依赖**：`@nv8/plugin-fetch`
**安装内容**：
- `installXMLHttpRequest()`

### 20. Messaging 插件

#### 20.1 `@nv8/plugin-messaging`
**职责**：postMessage 和 BroadcastChannel
**能力**：`messaging.core`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installMessaging()`
- `configureBroadcastConnector(broadcastConnector)`
- `configureWindowMessaging(...)`

### 21. Workers 插件

#### 21.1 `@nv8/plugin-workers`
**职责**：Worker, SharedWorker, ServiceWorker
**能力**：`workers.dedicated`, `workers.shared`, `workers.service`
**依赖**：`@nv8/plugin-messaging`
**安装内容**：
- `configureWorkers(workerFactory, pageUrl)`
- `installWorker()`
- `configureSharedWorkers(sharedWorkerFactory, pageUrl)`
- `installSharedWorker()`
- `configureServiceWorkers(serviceWorkerFactory, pageUrl, capabilitiesProfile?.serviceWorker)`
- `installServiceWorker()`
- `installServiceWorkerManagers()`

#### 21.2 `@nv8/plugin-worklets`
**职责**：Worklet
**能力**：`worklets.core`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `configureWorklets(workletFactory, pageUrl)`
- `installWorklet()`

### 22. Abort 插件

#### 22.1 `@nv8/plugin-abort`
**职责**：AbortController/AbortSignal
**能力**：`abort.core`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installAbort()`

### 23. Structured Clone 插件

#### 23.1 `@nv8/plugin-structured-clone`
**职责**：structuredClone
**能力**：`clone.structured`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installStructuredClone()`

### 24. 渲染引擎插件

#### 24.1 `@nv8/plugin-webgl`
**职责**：WebGL
**能力**：`webgl.core`
**依赖**：`@nv8/plugin-html-canvas`
**安装内容**：
- `installWebGL()`
- `configureWebGLProfile(renderingProfile)`

#### 24.2 `@nv8/plugin-webgpu`
**职责**：WebGPU
**能力**：`webgpu.core`
**依赖**：`@nv8/plugin-html-canvas`
**安装内容**：
- `installGPU()`
- `configureGPUProfile(renderingProfile)`
- `installWGSLLanguageFeatures()`

### 25. 媒体能力插件

#### 25.1 `@nv8/plugin-audio`
**职责**：Web Audio API
**能力**：`audio.core`
**依赖**：`@nv8/plugin-html-media`
**安装内容**：
- `installAudio()`

#### 25.2 `@nv8/plugin-media-source`
**职责**：Media Source Extensions
**能力**：`media.source`
**依赖**：`@nv8/plugin-html-media`
**安装内容**：
- `installMediaSource()`

#### 25.3 `@nv8/plugin-codecs`
**职责**：Media Codecs
**能力**：`media.codecs`
**依赖**：`@nv8/plugin-html-media`
**安装内容**：
- `installCodecs()`
- `configureCodecsProfile(capabilitiesProfile?.media)`
- `configureMediaElementCodecProfile(capabilitiesProfile?.media)`

#### 25.4 `@nv8/plugin-speech`
**职责**：Speech Synthesis
**能力**：`speech.synthesis`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installSpeech()`
- `configureSpeechProfile(navigatorLanguage)`

#### 25.5 `@nv8/plugin-speech-recognition`
**职责**：Speech Recognition
**能力**：`speech.recognition`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installSpeechRecognition()`

### 26. WebRTC 插件

#### 26.1 `@nv8/plugin-webrtc`
**职责**：WebRTC
**能力**：`webrtc.core`
**依赖**：`@nv8/plugin-html-media`
**安装内容**：
- `installWebRTC()`

### 27. XR 插件

#### 27.1 `@nv8/plugin-xr`
**职责**：WebXR
**能力**：`xr.core`
**依赖**：`@nv8/plugin-webgl`
**安装内容**：
- `installXRCore()`
- `installXRExtensions()`

### 28. 设备 API 插件

#### 28.1 `@nv8/plugin-device`
**职责**：设备传感器
**能力**：`device.sensors`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installDeviceAPIs()`
- `installExternalDeviceAPIs()`
- `configureDeviceProfile(capabilitiesProfile?.sensors)`

#### 28.2 `@nv8/plugin-pressure`
**职责**：Compute Pressure API
**能力**：`device.pressure`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installPressure()`

### 29. 用户交互插件

#### 29.1 `@nv8/plugin-input-events`
**职责**：输入事件
**能力**：`events.input`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installInputEvents(browserMajorVersion >= 151)`

#### 29.2 `@nv8/plugin-general-events`
**职责**：通用事件
**能力**：`events.general`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installGeneralEvents(browserMajorVersion >= 151)`
- `installLongtailEvents()`

#### 29.3 `@nv8/plugin-user-agency`
**职责**：用户代理能力
**能力**：`user.agency`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installUserAgency()`

#### 29.4 `@nv8/plugin-user-interaction`
**职责**：用户交互
**能力**：`user.interaction`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installUserInteraction()`

### 30. 文件系统插件

#### 30.1 `@nv8/plugin-file-system`
**职责**：File System Access API
**能力**：`filesystem.access`
**依赖**：`@nv8/plugin-file`
**安装内容**：
- `installFileSystem()`

### 31. 凭证和支付插件

#### 31.1 `@nv8/plugin-credentials`
**职责**：Credential Management API
**能力**：`credentials.core`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installCredentialPayment()`

#### 31.2 `@nv8/plugin-identity`
**职责**：Federated Credential Management
**能力**：`identity.federated`
**依赖**：`@nv8/plugin-credentials`
**安装内容**：
- `installIdentityServices()`

### 32. 观察器插件

#### 32.1 `@nv8/plugin-observers-geometry`
**职责**：Intersection/Resize Observer
**能力**：`observers.geometry`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installObserverGeometry()`

### 33. 网络插件

#### 33.1 `@nv8/plugin-websocket`
**职责**：WebSocket (offline)
**能力**：`websocket.offline`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installOfflineSocket()`

#### 33.2 `@nv8/plugin-webtransport`
**职责**：WebTransport
**能力**：`webtransport.core`
**依赖**：`@nv8/plugin-streams`
**安装内容**：
- `installWebTransport()`

### 34. DOM 工具插件

#### 34.1 `@nv8/plugin-dom-utilities`
**职责**：DOM 实用工具
**能力**：`dom.utilities`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installDOMUtilities()`

#### 34.2 `@nv8/plugin-trusted-types`
**职责**：Trusted Types
**能力**：`dom.trusted-types`
**依赖**：`@nv8/plugin-dom-core`
**安装内容**：
- `installTrustedTypes()`

#### 34.3 `@nv8/plugin-highlight`
**职责**：CSS Custom Highlight API
**能力**：`dom.highlight`
**依赖**：`@nv8/plugin-cssom-core`
**安装内容**：
- `installHighlight()`

### 35. 导航和路由插件

#### 35.1 `@nv8/plugin-navigation-api`
**职责**：Navigation API
**能力**：`navigation.api`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installNavigationAPI()`

#### 35.2 `@nv8/plugin-navigation-diagnostics`
**职责**：Navigation Diagnostics
**能力**：`navigation.diagnostics`
**依赖**：`@nv8/plugin-navigation-api`
**安装内容**：
- `installNavigationDiagnostics()`

### 36. 媒体代理插件

#### 36.1 `@nv8/plugin-media-agency`
**职责**：Media Capabilities
**能力**：`media.agency`
**依赖**：`@nv8/plugin-html-media`
**安装内容**：
- `installMediaAgency()`

### 37. 协调和调度插件

#### 37.1 `@nv8/plugin-coordination`
**职责**：Web Locks API
**能力**：`coordination.locks`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installCoordination()`

#### 37.2 `@nv8/plugin-scheduling`
**职责**：Scheduler API
**能力**：`scheduling.api`
**依赖**：`@nv8/plugin-webidl`
**安装内容**：
- `installScheduling()`

### 38. Cache API 插件

#### 38.1 `@nv8/plugin-cache`
**职责**：Cache API
**能力**：`cache.storage`
**依赖**：`@nv8/plugin-fetch`
**安装内容**：
- `installCacheAPI()`

### 39. IndexedDB 插件

#### 39.1 `@nv8/plugin-indexeddb`
**职责**：IndexedDB
**能力**：`indexeddb.core`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installIndexedDB()`

### 40. Navigator Services 插件

#### 40.1 `@nv8/plugin-navigator-services`
**职责**：Navigator Services (share, contacts, etc.)
**能力**：`navigator.services`
**依赖**：`@nv8/plugin-navigator`
**安装内容**：
- `installNavigatorServices()`

### 41. 时间线插件

#### 41.1 `@nv8/plugin-scroll-timeline`
**职责**：Scroll Timeline
**能力**：`timeline.scroll`
**依赖**：`@nv8/plugin-css-animations`
**安装内容**：
- `installScrollTimeline()`

#### 41.2 `@nv8/plugin-timeline-trigger`
**职责**：View Timeline
**能力**：`timeline.view`
**依赖**：`@nv8/plugin-scroll-timeline`
**安装内容**：
- `installTimelineTrigger()`

### 42. Reporting 插件

#### 42.1 `@nv8/plugin-reporting`
**职责**：Reporting API
**能力**：`reporting.core`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installReporting()`

### 43. 遗留构造器插件

#### 43.1 `@nv8/plugin-legacy-aliases`
**职责**：遗留构造器别名
**能力**：`legacy.aliases`
**依赖**：多个插件
**安装内容**：
- `installLegacyConstructorAliases()`

### 44. 专用 API 插件

#### 44.1 `@nv8/plugin-midi`
**职责**：Web MIDI
**能力**：`midi.core`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installMIDI()`

#### 44.2 `@nv8/plugin-presentation`
**职责**：Presentation API
**能力**：`presentation.core`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installPresentation()`

#### 44.3 `@nv8/plugin-background-fetch`
**职责**：Background Fetch
**能力**：`background.fetch`
**依赖**：`@nv8/plugin-fetch`
**安装内容**：
- `installBackgroundFetch()`

#### 44.4 `@nv8/plugin-shared-storage`
**职责**：Shared Storage
**能力**：`storage.shared`
**依赖**：`@nv8/plugin-storage`
**安装内容**：
- `installSharedStorage()`

#### 44.5 `@nv8/plugin-local-language`
**职责**：Local Language Detection
**能力**：`local.language`
**依赖**：`@nv8/plugin-navigator`
**安装内容**：
- `installLocalLanguage()`

#### 44.6 `@nv8/plugin-local-fonts`
**职责**：Local Font Access
**能力**：`local.fonts`
**依赖**：`@nv8/plugin-navigator`
**安装内容**：
- `installLocalFonts({ exposeGlobal: browserMajorVersion >= 151 })`

#### 44.7 `@nv8/plugin-launch-handling`
**职责**：Launch Handling
**能力**：`launch.handling`
**依赖**：`@nv8/plugin-window-core`
**安装内容**：
- `installLaunchHandling()`

#### 44.8 `@nv8/plugin-global-services`
**职责**：Global Privacy Control 等
**能力**：`global.services`
**依赖**：`@nv8/plugin-navigator`
**安装内容**：
- `installGlobalServices()`

#### 44.9 `@nv8/plugin-fetch-later`
**职责**：Fetch Later API
**能力**：`fetch.later`
**依赖**：`@nv8/plugin-fetch`
**安装内容**：
- `installFetchLater()`

#### 44.10 `@nv8/plugin-origin`
**职责**：Origin Private File System
**能力**：`origin.private`
**依赖**：`@nv8/plugin-file-system`
**安装内容**：
- `installOrigin()`

#### 44.11 `@nv8/plugin-edit-context`
**职责**：EditContext API
**能力**：`edit.context`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installEditContext()`

#### 44.12 `@nv8/plugin-capture-targets`
**职责**：Capture Handle/Controller
**能力**：`capture.targets`
**依赖**：`@nv8/plugin-html-media`
**安装内容**：
- `installCaptureTargets()`

#### 44.13 `@nv8/plugin-observable`
**职责**：Observable API (提案)
**能力**：`observable.core`
**依赖**：`@nv8/plugin-events`
**安装内容**：
- `installObservable()`

#### 44.14 `@nv8/plugin-chapter-information`
**职责**：Media Chapter Information
**能力**：`media.chapters`
**依赖**：`@nv8/plugin-html-media`
**安装内容**：
- `installChapterInformation()`

#### 44.15 `@nv8/plugin-feature-policy`
**职责**：Feature Policy
**能力**：`feature.policy`
**依赖**：`@nv8/plugin-document`
**安装内容**：
- `installFeaturePolicy()`

### 45. Edge 特定插件

#### 45.1 `@nv8/plugin-edge-compat`
**职责**：Edge 浏览器兼容性
**能力**：`edge.compat`
**依赖**：多个插件
**安装内容**：
- `installEdgeStaticFunctions()`
- `installEdgeAccessorSemantics()`

## Profile 定义

### Legacy Full Profile
为了向后兼容，创建一个包含所有插件的 Profile：

```javascript
// src/profiles/legacy-full.js
export const legacyFullProfile = {
  id: '@nv8/profile-legacy-full',
  version: '1.0.0',
  plugins: [
    // 所有上述插件
  ],
  config: {
    browserMajorVersion: 150,
    traceEnabled: false,
    maxTraceEntries: 100000,
  }
};
```

### Minimal Profile
最小化 Profile，仅包含 Core 基础：

```javascript
// src/profiles/minimal.js
export const minimalProfile = {
  id: '@nv8/profile-minimal',
  version: '1.0.0',
  plugins: [
    '@nv8/plugin-webidl',
    '@nv8/plugin-errors',
    '@nv8/plugin-builtins',
    '@nv8/plugin-console',
  ],
  config: {}
};
```

### Common Web Profile
常见 Web 开发场景：

```javascript
// src/profiles/common-web.js
export const commonWebProfile = {
  id: '@nv8/profile-common-web',
  version: '1.0.0',
  plugins: [
    // Core
    '@nv8/plugin-webidl',
    '@nv8/plugin-errors',
    '@nv8/plugin-builtins',
    '@nv8/plugin-console',
    // Events
    '@nv8/plugin-events',
    '@nv8/plugin-dom-exception',
    // DOM
    '@nv8/plugin-dom-core',
    '@nv8/plugin-dom-collections',
    '@nv8/plugin-html-core',
    '@nv8/plugin-html-text',
    '@nv8/plugin-document',
    // Window
    '@nv8/plugin-window-core',
    '@nv8/plugin-location',
    '@nv8/plugin-history',
    '@nv8/plugin-navigator',
    // APIs
    '@nv8/plugin-url',
    '@nv8/plugin-encoding',
    '@nv8/plugin-fetch',
    '@nv8/plugin-storage',
    '@nv8/plugin-timers',
  ],
  config: {}
};
```

## 实施步骤

### Step 1: 创建第一批核心插件
1. `@nv8/plugin-webidl`
2. `@nv8/plugin-errors`
3. `@nv8/plugin-builtins`
4. `@nv8/plugin-console`

### Step 2: 创建事件系统插件
1. `@nv8/plugin-events`
2. `@nv8/plugin-dom-exception`

### Step 3: 创建 DOM 核心插件
1. `@nv8/plugin-dom-core`
2. `@nv8/plugin-dom-collections`

### Step 4: 迁移状态管理
将所有模块级状态迁移到 StateRegistry

### Step 5: 创建 legacy-full Profile
包装所有插件，保持向后兼容

### Step 6: 验证
使用 Baseline golden fixtures 验证行为一致性

### Step 7: 继续迁移剩余插件
按功能域逐步迁移

## 注意事项

1. **依赖关系**：每个插件必须明确声明依赖
2. **状态隔离**：所有模块级状态必须迁移到 StateRegistry
3. **能力注册**：每个插件必须注册其提供的能力
4. **表面注册**：每个插件必须注册其全局表面
5. **生命周期**：每个插件必须实现 reset 和 dispose 钩子
6. **向后兼容**：通过 legacy-full Profile 保持现有行为
7. **测试覆盖**：每个插件需要独立的测试
8. **文档**：每个插件需要说明其职责和使用方法
