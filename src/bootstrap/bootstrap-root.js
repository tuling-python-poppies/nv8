import { hideNodeGlobals } from "./hide-node-globals.js";
import {
  installErrorStackGuard,
} from "./install-error-stack-guard.js";
import { installCustomEvent } from "../install/install-custom-event.js";
import { installDOMException } from "../install/install-dom-exception.js";
import { installEvent } from "../install/install-event.js";
import { installEventTarget } from "../install/install-event-target.js";
import { installPerformance } from "../install/install-performance.js";
import {
  installPerformanceEntry,
} from "../install/install-performance-entry.js";
import {
  installPerformanceMark,
} from "../install/install-performance-mark.js";
import {
  installPerformanceMeasure,
} from "../install/install-performance-measure.js";
import {
  installPerformanceLongtail,
} from "../install/install-performance-longtail.js";
import {
  clearTrace,
  configureTrace,
  disableTrace,
  enableTrace,
  readTrace,
} from "../trace/trace-state.js";
import {
  configureNativeFunctionRegistry,
  installNativeFunctionToString,
  establishNativeFunctionContext,
  registerNativeGetter,
} from "../webidl/native-function.js";
import {
  finalizeWindowSurfaceOrder,
} from "../install/finalize-window-surface-order.js";
import {
  installEdgeStaticFunctions,
} from "../install/install-edge-static-functions.js";
import {
  installEdgeAccessorSemantics,
} from "../install/install-edge-accessor-semantics.js";
import {
  installModernBuiltins,
} from "../install/install-modern-builtins.js";
import { installDateProfile } from "../install/install-date-profile.js";
import {
  installIntlV8BreakIterator,
} from "../install/install-intl-v8-break-iterator.js";
import {
  installIntlDefaultLocale,
} from "../install/install-intl-default-locale.js";
import {
  configureStandardFontFamily,
} from "../api/css/css-computed-value.js";
import {
  standardFontFamilyFor,
} from "../fingerprint/ua-default-fonts.js";
import { installWindowTimers } from "../install/install-window-timers.js";
import { installScreen } from "../install/install-screen.js";
import {
  installScreenOrientation,
} from "../install/install-screen-orientation.js";
import {
  observePromise,
  readPromiseObserver,
} from "../realm/promise-observer.js";
import {
  clearAllTimers,
  nextTimerDelay,
  runDueTimers,
} from "../scheduler/timer-state.js";
import { configureTimingProfile } from "../scheduler/monotonic-clock.js";
import { configureScreenProfile } from "../api/screen/screen-state.js";
import { configureNavigation } from "../navigation/navigation-state.js";
import {
  dispatchBeforeUnload,
  dispatchPageHideAndUnload,
} from "../install/install-page-lifecycle.js";
import { installLocation } from "../install/install-location.js";
import { installHistory } from "../install/install-history.js";
import { installWindow } from "../install/install-window.js";
import { installNavigator } from "../install/install-navigator.js";
import {
  installNavigatorUAData,
} from "../install/install-navigator-ua-data.js";
import {
  configureNavigatorProfile,
} from "../api/navigator/navigator-state.js";
import { installStorage } from "../install/install-storage.js";
import {
  configureStorage,
  encodeLocalStorage,
  encodeSessionStorage,
} from "../api/storage/storage-state.js";
import {
  installURLSearchParams,
} from "../install/install-url-search-params.js";
import { installURL } from "../install/install-url.js";
import {
  configureObjectURLRegistry,
} from "../api/url/url-state.js";
import {
  installTextEncoding,
} from "../install/install-text-encoding.js";
import { installTextStreams } from "../install/install-text-streams.js";
import {
  installCompressionStreams,
} from "../install/install-compression-streams.js";
import { installCrypto } from "../install/install-crypto.js";
import { installMessaging } from "../install/install-messaging.js";
import {
  closeAllBroadcastChannels,
  configureBroadcastConnector,
} from "../api/messaging/messaging-runtime.js";
import { installWorker } from "../install/install-worker.js";
import {
  configureWorkers,
  terminateAllWorkers,
  workerResourceCount,
} from "../api/worker/worker-runtime.js";
import { installSharedWorker } from "../install/install-shared-worker.js";
import {
  configureSharedWorkers,
  terminateAllSharedWorkers,
  sharedWorkerResourceCount,
} from "../api/worker/shared-worker-runtime.js";
import { installServiceWorker } from "../install/install-service-worker.js";
import {
  configureServiceWorkers,
  disposeServiceWorkers,
  serviceWorkerResourceCount,
} from "../api/worker/service-worker-runtime.js";
import { installWorklet } from "../install/install-worklet.js";
import { configureWorklets } from "../api/worklet/worklet-runtime.js";
import { installAudio } from "../install/install-audio.js";
import { installMediaSource } from "../install/install-media-source.js";
import { installCodecs } from "../install/install-codecs.js";
import { configureCodecsProfile } from "../api/codecs/codecs-runtime.js";
import { installSpeech } from "../install/install-speech.js";
import { installWebRTC } from "../install/install-webrtc.js";
import { installXRCore } from "../install/install-xr-core.js";
import {
  installXRExtensions,
} from "../install/install-xr-extensions.js";
import { installUserAgency } from "../install/install-user-agency.js";
import { installDeviceAPIs } from "../install/install-device.js";
import { configureDeviceProfile } from "../api/device/device-runtime.js";
import {
  installExternalDeviceAPIs,
} from "../install/install-external-device.js";
import { installFileSystem } from "../install/install-file-system.js";
import {
  installCredentialPayment,
} from "../install/install-credential-payment.js";
import { installMediaAgency } from "../install/install-media-agency.js";
import {
  installObserverGeometry,
} from "../install/install-observer-geometry.js";
import { installOfflineSocket } from "../install/install-offline-socket.js";
import { installInputEvents } from "../install/install-input-events.js";
import { installGeneralEvents } from "../install/install-general-events.js";
import { installDOMUtilities } from "../install/install-dom-utilities.js";
import { installTrustedTypes } from "../install/install-trusted-types.js";
import { installURLPattern } from "../install/install-url-pattern.js";
import { installHighlight } from "../install/install-highlight.js";
import { installNavigationAPI } from "../install/install-navigation-api.js";
import { installCoordination } from "../install/install-coordination.js";
import { installCacheAPI } from "../install/install-cache-api.js";
import { installScheduling } from "../install/install-scheduling.js";
import {
  installNavigatorServices,
} from "../install/install-navigator-services.js";
import {
  installLongtailEvents,
} from "../install/install-longtail-events.js";
import {
  installScrollTimeline,
} from "../install/install-scroll-timeline.js";
import { installReporting } from "../install/install-reporting.js";
import { installIndexedDB } from "../install/install-indexed-db.js";
import {
  installLegacyConstructorAliases,
} from "../install/install-legacy-constructor-aliases.js";
import { installMIDI } from "../install/install-midi.js";
import { installPresentation } from "../install/install-presentation.js";
import {
  installSpeechRecognition,
} from "../install/install-speech-recognition.js";
import { installPressure } from "../install/install-pressure.js";
import {
  installServiceWorkerManagers,
} from "../install/install-service-worker-managers.js";
import {
  installBackgroundFetch,
} from "../install/install-background-fetch.js";
import {
  installSharedStorage,
} from "../install/install-shared-storage.js";
import {
  installTimelineTrigger,
} from "../install/install-timeline-trigger.js";
import {
  installWebTransport,
} from "../install/install-web-transport.js";
import {
  installScreenDetails,
} from "../install/install-screen-details.js";
import {
  installLocalLanguage,
} from "../install/install-local-language.js";
import {
  installLocalFonts,
} from "../install/install-local-fonts.js";
import {
  installUserInteraction,
} from "../install/install-user-interaction.js";
import {
  installIdentityServices,
} from "../install/install-identity-services.js";
import {
  installLaunchHandling,
} from "../install/install-launch-handling.js";
import {
  installGlobalServices,
} from "../install/install-global-services.js";
import {
  installFetchLater,
} from "../install/install-fetch-later.js";
import { installOrigin } from "../install/install-origin.js";
import {
  installErrorObjects,
} from "../install/install-error-objects.js";
import {
  installEditContext,
} from "../install/install-edit-context.js";
import {
  installCaptureTargets,
} from "../install/install-capture-targets.js";
import {
  installNavigationDiagnostics,
} from "../install/install-navigation-diagnostics.js";
import {
  installObservable,
} from "../install/install-observable.js";
import {
  installChapterInformation,
} from "../install/install-chapter-information.js";
import {
  installFeaturePolicy,
} from "../install/install-feature-policy.js";
import {
  installWGSLLanguageFeatures,
} from "../install/install-wgsl-language-features.js";
import {
  installSVGUnitTypes,
} from "../install/install-svg-unit-types.js";
import {
  configureSpeechProfile,
} from "../api/speech/speech-runtime.js";
import { installGPU } from "../install/install-gpu.js";
import { configureGPUProfile } from "../api/gpu/gpu-runtime.js";
import { installWebGL } from "../install/install-webgl.js";
import { configureWebGLProfile } from "../api/webgl/webgl-runtime.js";
import {
  configureIFrameRealms,
} from "../api/dom/html-iframe-element-realm-state.js";
import {
  configureWindowMessaging,
  receiveParentWindowMessage,
  windowParent,
  windowTop,
} from "../api/window/window-messaging.js";
import {
  configureDocumentDefaultView,
} from "../api/dom/document-default-view-state.js";
import { installBase64 } from "../install/install-base64.js";
import { installAbort } from "../install/install-abort.js";
import {
  installStructuredClone,
} from "../api/clone/structured-clone.js";
import { installConsole } from "../install/install-console.js";
import { installNodeList } from "../install/install-node-list.js";
import { installNode } from "../install/install-node.js";
import {
  installCharacterData,
} from "../install/install-character-data.js";
import { installText } from "../install/install-text.js";
import { installComment } from "../install/install-comment.js";
import {
  installCDATASection,
} from "../install/install-cdata-section.js";
import {
  installProcessingInstruction,
} from "../install/install-processing-instruction.js";
import {
  installDocumentFragment,
} from "../install/install-document-fragment.js";
import { installAttr } from "../install/install-attr.js";
import {
  installNamedNodeMap,
} from "../install/install-named-node-map.js";
import {
  installHTMLCollection,
} from "../install/install-html-collection.js";
import { installElement } from "../install/install-element.js";
import {
  installCustomElementRegistry,
} from "../install/install-custom-element-registry.js";
import { installCSSStyleValue } from "../install/install-css-style-value.js";
import {
  installCSSTypedOMValues,
} from "../install/install-css-typed-om-values.js";
import { installCSSNamespace } from "../install/install-css-namespace.js";
import {
  installCSSTransformValues,
} from "../install/install-css-transform-values.js";
import {
  installCSSStyleDeclaration,
} from "../install/install-css-style-declaration.js";
import {
  installStylePropertyMapReadOnly,
} from "../install/install-style-property-map-read-only.js";
import {
  installStylePropertyMap,
} from "../install/install-style-property-map.js";
import {
  installCustomStateSet,
} from "../install/install-custom-state-set.js";
import {
  installElementInternals,
} from "../install/install-element-internals.js";
import { installMediaList } from "../install/install-media-list.js";
import { installStyleSheet } from "../install/install-style-sheet.js";
import { installStyleSheetList } from "../install/install-style-sheet-list.js";
import { installCSSRule } from "../install/install-css-rule.js";
import { installCSSRuleList } from "../install/install-css-rule-list.js";
import {
  installCSSGroupingRule,
} from "../install/install-css-grouping-rule.js";
import {
  installCSSConditionRule,
} from "../install/install-css-condition-rule.js";
import { installCSSMediaRule } from "../install/install-css-media-rule.js";
import {
  installCSSSupportsRule,
} from "../install/install-css-supports-rule.js";
import { installCSSImportRule } from "../install/install-css-import-rule.js";
import {
  installCSSDeclarationRules,
} from "../install/install-css-declaration-rules.js";
import {
  installCSSGroupingSpecialRules,
} from "../install/install-css-grouping-special-rules.js";
import {
  installCSSDescriptorRules,
} from "../install/install-css-descriptor-rules.js";
import {
  installCSSPositionTryDescriptors,
} from "../install/install-css-position-try-descriptors.js";
import {
  installCSSFunctionRules,
} from "../install/install-css-function-rules.js";
import {
  installCSSKeyframesRule,
} from "../install/install-css-keyframes-rule.js";
import {
  installCSSKeyframeRule,
} from "../install/install-css-keyframe-rule.js";
import { installCSSStyleRule } from "../install/install-css-style-rule.js";
import { installCSSStyleSheet } from "../install/install-css-style-sheet.js";
import {
  installMediaQueryList,
} from "../install/install-media-query-list.js";
import { installWindowCSS } from "../install/install-window-css.js";
import {
  installCSSPseudoElement,
} from "../install/install-css-pseudo-element.js";
import {
  installViewTransitionTypeSet,
} from "../install/install-view-transition-type-set.js";
import {
  installViewTransition,
} from "../install/install-view-transition.js";
import {
  installAnimationTimeline,
} from "../install/install-animation-timeline.js";
import {
  installDocumentTimeline,
} from "../install/install-document-timeline.js";
import {
  installAnimationEffect,
} from "../install/install-animation-effect.js";
import {
  installKeyframeEffect,
} from "../install/install-keyframe-effect.js";
import { installAnimation } from "../install/install-animation.js";
import { installCSSAnimations } from "../install/install-css-animations.js";
import { installSVGValues } from "../install/install-svg-values.js";
import { installSVGLists } from "../install/install-svg-lists.js";
import {
  installSVGAnimatedValues,
} from "../install/install-svg-animated-values.js";
import {
  installDOMTokenList,
} from "../install/install-dom-token-list.js";
import {
  installMutationRecord,
} from "../install/install-mutation-record.js";
import {
  installMutationObserver,
} from "../install/install-mutation-observer.js";
import {
  installAbstractRange,
} from "../install/install-abstract-range.js";
import { installRange } from "../install/install-range.js";
import { installCookie } from "../install/install-cookie.js";
import {
  configureCookies,
  encodeCookies,
} from "../api/dom/cookie-state.js";
import { installSelection } from "../install/install-selection.js";
import { installTreeWalker } from "../install/install-tree-walker.js";
import { installNodeIterator } from "../install/install-node-iterator.js";
import { installNodeFilter } from "../install/install-node-filter.js";
import { installHTMLElement } from "../install/install-html-element.js";
import {
  installHTMLDivElement,
} from "../install/install-html-div-element.js";
import {
  installHTMLAnchorElement,
} from "../install/install-html-anchor-element.js";
import {
  installHTMLHtmlElement,
} from "../install/install-html-html-element.js";
import {
  installHTMLHeadElement,
} from "../install/install-html-head-element.js";
import {
  installHTMLBodyElement,
} from "../install/install-html-body-element.js";
import {
  installHTMLSpanElement,
} from "../install/install-html-span-element.js";
import {
  installHTMLParagraphElement,
} from "../install/install-html-paragraph-element.js";
import {
  installHTMLHeadingElement,
} from "../install/install-html-heading-element.js";
import {
  installHTMLImageElement,
} from "../install/install-html-image-element.js";
import {
  installHTMLScriptElement,
} from "../install/install-html-script-element.js";
import {
  installHTMLPictureElement,
} from "../api/dom/html-picture-element-constructor.js";
import {
  installHTMLSelectedContentElement,
} from "../api/dom/html-selected-content-element-constructor.js";
import {
  installHTMLBRElement,
} from "../install/install-html-br-element.js";
import {
  installHTMLDataElement,
} from "../install/install-html-data-element.js";
import {
  installHTMLDirectoryElement,
} from "../install/install-html-directory-element.js";
import {
  installHTMLDListElement,
} from "../install/install-html-d-list-element.js";
import {
  installHTMLMenuElement,
} from "../install/install-html-menu-element.js";
import {
  installHTMLQuoteElement,
} from "../install/install-html-quote-element.js";
import {
  installHTMLTimeElement,
} from "../install/install-html-time-element.js";
import {
  installHTMLTableCaptionElement,
} from "../install/install-html-table-caption-element.js";
import {
  installHTMLTitleElement,
} from "../install/install-html-title-element.js";
import {
  installHTMLDataListElement,
} from "../install/install-html-data-list-element.js";
import {
  installHTMLBaseElement,
} from "../install/install-html-base-element.js";
import {
  installHTMLDetailsElement,
} from "../install/install-html-details-element.js";
import {
  installHTMLLIElement,
} from "../install/install-html-li-element.js";
import {
  installHTMLModElement,
} from "../install/install-html-mod-element.js";
import {
  installHTMLOptGroupElement,
} from "../install/install-html-opt-group-element.js";
import {
  installHTMLUListElement,
} from "../install/install-html-u-list-element.js";
import {
  installHTMLFontElement,
} from "../install/install-html-font-element.js";
import {
  installHTMLHRElement,
} from "../install/install-html-hr-element.js";
import {
  installHTMLParamElement,
} from "../install/install-html-param-element.js";
import {
  installHTMLOListElement,
} from "../install/install-html-o-list-element.js";
import {
  installHTMLMetaElement,
} from "../install/install-html-meta-element.js";
import {
  installHTMLStyleElement,
} from "../install/install-html-style-element.js";
import {
  installHTMLLegendElement,
} from "../install/install-html-legend-element.js";
import {
  installHTMLMapElement,
} from "../install/install-html-map-element.js";
import {
  installHTMLLabelElement,
} from "../install/install-html-label-element.js";
import {
  installHTMLProgressElement,
} from "../install/install-html-progress-element.js";
import {
  installHTMLTableColElement,
} from "../install/install-html-table-col-element.js";
import {
  installHTMLSourceElement,
} from "../install/install-html-source-element.js";
import {
  installHTMLTemplateElement,
} from "../install/install-html-template-element.js";
import {
  installHTMLEmbedElement,
} from "../install/install-html-embed-element.js";
import {
  installHTMLTableCellElement,
} from "../install/install-html-table-cell-element.js";
import {
  installHTMLTableRowElement,
} from "../install/install-html-table-row-element.js";
import {
  installHTMLTableSectionElement,
} from "../install/install-html-table-section-element.js";
import {
  installHTMLTableElement,
} from "../install/install-html-table-element.js";
import {
  installHTMLMeterElement,
} from "../install/install-html-meter-element.js";
import {
  installHTMLDialogElement,
} from "../install/install-html-dialog-element.js";
import {
  installHTMLOptionElement,
} from "../install/install-html-option-element.js";
import {
  installOptionConstructor,
} from "../api/dom/option-constructor.js";
import {
  installHTMLOptionsCollection,
} from "../install/install-html-options-collection.js";
import {
  installValidityState,
} from "../install/install-validity-state.js";
import {
  installHTMLSelectElement,
} from "../install/install-html-select-element.js";
import {
  installRadioNodeList,
} from "../install/install-radio-node-list.js";
import {
  installHTMLFormControlsCollection,
} from "../install/install-html-form-controls-collection.js";
import {
  installHTMLFormElement,
} from "../install/install-html-form-element.js";
import {
  installHTMLFieldSetElement,
} from "../install/install-html-field-set-element.js";
import {
  installHTMLOutputElement,
} from "../install/install-html-output-element.js";
import {
  installHTMLButtonElement,
} from "../install/install-html-button-element.js";
import {
  installHTMLTextAreaElement,
} from "../install/install-html-text-area-element.js";
import {
  installFileList,
} from "../install/install-file-list.js";
import {
  installHTMLInputElement,
} from "../install/install-html-input-element.js";
import {
  installHTMLAreaElement,
} from "../install/install-html-area-element.js";
import {
  installHTMLLinkElement,
} from "../install/install-html-link-element.js";
import {
  installHTMLMarqueeElement,
} from "../install/install-html-marquee-element.js";
import {
  installHTMLGeolocationElement,
} from "../install/install-html-geolocation-element.js";
import {
  installFencedFrameConfig,
} from "../install/install-fenced-frame-config.js";
import {
  installHTMLFencedFrameElement,
} from "../install/install-html-fenced-frame-element.js";
import {
  installHTMLFrameElement,
} from "../install/install-html-frame-element.js";
import {
  installHTMLIFrameElement,
} from "../install/install-html-iframe-element.js";
import {
  installTextTrackCue,
} from "../install/install-text-track-cue.js";
import {
  installVTTCue,
} from "../install/install-vtt-cue.js";
import {
  installTextTrackCueList,
} from "../install/install-text-track-cue-list.js";
import {
  installTextTrack,
} from "../install/install-text-track.js";
import {
  installHTMLTrackElement,
} from "../install/install-html-track-element.js";
import {
  installHTMLFrameSetElement,
} from "../install/install-html-frame-set-element.js";
import {
  installHTMLObjectElement,
} from "../install/install-html-object-element.js";
import {
  installTimeRanges,
} from "../install/install-time-ranges.js";
import {
  installTextTrackList,
} from "../install/install-text-track-list.js";
import {
  installRemotePlayback,
} from "../install/install-remote-playback.js";
import {
  installMediaError,
} from "../install/install-media-error.js";
import {
  installOverconstrainedError,
} from "../install/install-overconstrained-error.js";
import {
  installMediaStreamTrackAudioStats,
} from "../install/install-media-stream-track-audio-stats.js";
import {
  installMediaStreamTrack,
} from "../install/install-media-stream-track.js";
import {
  installMediaStream,
} from "../install/install-media-stream.js";
import {
  installHTMLMediaElement,
} from "../install/install-html-media-element.js";
import {
  configureMediaElementCodecProfile,
} from "../api/media/html-media-element-codec-profile.js";
import {
  installHTMLAudioElement,
} from "../install/install-html-audio-element.js";
import {
  installAudioConstructor,
} from "../api/media/audio-constructor.js";
import {
  installVideoPlaybackQuality,
} from "../install/install-video-playback-quality.js";
import {
  installPictureInPictureWindow,
} from "../install/install-picture-in-picture-window.js";
import {
  installHTMLVideoElement,
} from "../install/install-html-video-element.js";
import {
  installImageData,
} from "../install/install-image-data.js";
import { installBlob } from "../install/install-blob.js";
import { configureBlobRegistry } from "../api/file/blob-state.js";
import { installStreams } from "../install/install-streams.js";
import { installHeaders } from "../install/install-headers.js";
import { installFormData } from "../install/install-form-data.js";
import { installRequestResponse } from "../install/install-request-response.js";
import { installFileAndReader } from "../install/install-file-reader.js";
import { installXMLHttpRequest } from "../install/install-xml-http-request.js";
import {
  configureFetchReplay,
  installFetch,
} from "../api/fetch/fetch-replay.js";
import {
  installImageBitmap,
} from "../install/install-image-bitmap.js";
import {
  installImageBitmapRenderingContext,
} from "../install/install-image-bitmap-rendering-context.js";
import {
  installExecutionObservers,
} from "../install/install-execution-observers.js";
import {
  installDocumentProcessing,
} from "../install/install-document-processing.js";
import {
  installWindowStateGlobals,
} from "../install/install-window-state-globals.js";
import {
  configureFrameElement,
  setWindowClosed,
} from "../api/window/window-state-globals-runtime.js";
import {
  installWindowEventHandlerGlobals,
} from "../install/install-window-event-handler-globals.js";
import {
  installWindowLegacyGlobals,
} from "../install/install-window-legacy-globals.js";
import {
  installTextMetrics,
} from "../install/install-text-metrics.js";
import {
  installCanvasGradient,
} from "../install/install-canvas-gradient.js";
import {
  installCanvasPattern,
} from "../install/install-canvas-pattern.js";
import {
  installPath2D,
} from "../install/install-path-2d.js";
import {
  installDOMPointReadOnly,
} from "../install/install-dom-point-read-only.js";
import {
  installDOMPoint,
} from "../install/install-dom-point.js";
import {
  installDOMMatrixReadOnly,
} from "../install/install-dom-matrix-read-only.js";
import {
  installDOMMatrix,
} from "../install/install-dom-matrix.js";
import {
  installDOMRectReadOnly,
} from "../install/install-dom-rect-read-only.js";
import { installDOMRect } from "../install/install-dom-rect.js";
import {
  installDOMRectList,
} from "../install/install-dom-rect-list.js";
import {
  installOffscreenCanvasRenderingContext2D,
} from "../install/install-offscreen-canvas-rendering-context-2d.js";
import {
  installCanvasRenderingContext2D,
} from "../install/install-canvas-rendering-context-2d.js";
import {
  installOffscreenCanvas,
} from "../install/install-offscreen-canvas.js";
import {
  installCanvasCaptureMediaStreamTrack,
} from "../install/install-canvas-capture-media-stream-track.js";
import {
  installHTMLCanvasElement,
} from "../install/install-html-canvas-element.js";
import {
  installImageConstructor,
} from "../api/dom/image-constructor.js";
import {
  installHTMLPreElement,
} from "../install/install-html-pre-element.js";
import {
  installHTMLUnknownElement,
} from "../install/install-html-unknown-element.js";
import {
  installMathMLElement,
} from "../install/install-math-ml-element.js";
import { installSVGElement } from "../install/install-svg-element.js";
import {
  installSVGGraphicsElement,
} from "../install/install-svg-graphics-element.js";
import {
  installSVGGeometryElement,
} from "../install/install-svg-geometry-element.js";
import {
  installSVGCircleElement,
} from "../install/install-svg-circle-element.js";
import {
  installSVGPathElement,
} from "../install/install-svg-path-element.js";
import {
  installSVGSVGElement,
} from "../install/install-svg-svg-element.js";
import {
  installReconstructedSVGFactories,
} from "../install/install-reconstructed-svg-factories.js";
import {
  installHTMLSlotElement,
} from "../install/install-html-slot-element.js";
import {
  installHTMLAllCollection,
} from "../install/install-html-all-collection.js";
import { installShadowRoot } from "../install/install-shadow-root.js";
import { installDocument } from "../install/install-document.js";
import {
  installHTMLDocument,
} from "../install/install-html-document.js";
import { installXMLDocument } from "../install/install-xml-document.js";
import {
  installDOMImplementation,
} from "../install/install-dom-implementation.js";
import {
  installDocumentType,
} from "../install/install-document-type.js";
import { parsePageHTML } from "../api/dom/html-parser.js";
import { configureDocument } from "../api/dom/document-record.js";

export function bootstrapRoot(
  traceEnabled = false,
  maxTraceEntries = 100_000,
  screenWidth = 1920,
  screenHeight = 1080,
  screenAvailWidth = 1920,
  screenAvailHeight = 1040,
  screenColorDepth = 24,
  screenPixelDepth = 24,
  screenDevicePixelRatio = 1,
  screenAvailLeft = 0,
  screenAvailTop = 0,
  screenIsExtended = false,
  pageUrl = "https://localhost/",
  navigatorUserAgent = "Mozilla/5.0 Chrome/150.0.0.0 Safari/537.36",
  navigatorPlatform = "Win32",
  navigatorLanguages = "5:en-US2:en",
  navigatorLanguage = "en-US",
  navigatorHardwareConcurrency = 8,
  navigatorDeviceMemory = 8,
  localStorageData = "",
  sessionStorageData = "",
  cookieData = "",
  pageHtml = "",
  pageReferrer = "",
  pageContentType = "text/html",
  replay = [],
  networkRequestRecorder = null,
  childRealmFactory = null,
  parentWindow = null,
  topWindow = null,
  parentOrigin = "",
  parentPostMessage = null,
  parentSameOrigin = false,
  outerWindow = null,
  workerFactory = null,
  sharedWorkerFactory = null,
  serviceWorkerFactory = null,
  workletFactory = null,
  broadcastConnector = null,
  renderingProfile = null,
  capabilitiesProfile = null,
  nativeFunctionRegistry = null,
  objectURLRegistry = null,
  browserMajorVersion = 150,
  timingProfile = null,
  navigatorMetadata = null,
  frameElement = null,
) {
  // 必须**最先**建立原生函数上下文。
  //
  // `registerNativeFunction` / `registerNativeGetter` / `installToString`
  // 在没有上下文时只会把请求**排队**（见 webidl/native-function.js）。而
  // `setNativeFunctionContext` 此前只有 webidl 插件会调用——legacy 模式
  // （默认运行模式）从来没建过上下文，于是：
  //
  // - 所有 registerNative* 调用永久停留在队列里，`nativeSources` 是空的
  // - `installNativeFunctionToString()` 也只是排队，
  //   `Function.prototype.toString` 从未被接管
  //
  // 后果是 legacy 下**完全没有原生函数伪装**：
  //
  //   Function.prototype.toString.call(document.addEventListener)
  //     真实浏览器: "function addEventListener() { [native code] }"
  //     迁移前     : "call(...args) { return invoke(this, args); }"
  //
  // 这是最经典的检测手法之一。模块求值期排入队列的注册会在这里被冲刷。
  establishNativeFunctionContext();
  hideNodeGlobals();
  configureTimingProfile(timingProfile);
  configureNativeFunctionRegistry(nativeFunctionRegistry);
  configureBlobRegistry(objectURLRegistry);
  configureObjectURLRegistry(objectURLRegistry);
  installNativeFunctionToString();
  installErrorStackGuard(browserMajorVersion >= 151);
  installModernBuiltins();
  installDateProfile();
  installIntlV8BreakIterator(browserMajorVersion >= 151);
  configureTrace(traceEnabled, maxTraceEntries);
  configureScreenProfile(
    screenWidth,
    screenHeight,
    screenAvailWidth,
    screenAvailHeight,
    screenColorDepth,
    screenPixelDepth,
    screenDevicePixelRatio,
    screenAvailLeft,
    screenAvailTop,
    screenIsExtended,
  );
  // legacy 模式下也要让导航经过 `beforeunload`。
  //
  // 迁移前这里传的是空 options，于是 `beforeNavigateHook` 为 null，
  // `location.assign()` 只更新 URL 记录——既不派发 beforeunload，也不给页面
  // 取消导航的机会。真实浏览器里 `location.assign` 一定会先派发 beforeunload。
  //
  // 这个钩子完全在 Realm 内完成，不需要宿主往返；而**整文档替换**仍未接
  // （需要子 Realm 回调宿主），所以取消路径可用、真正的文档替换还没有。
  configureNavigation(pageUrl, {
    beforeNavigate: () => {
      const proceed = dispatchBeforeUnload();
      if (proceed) dispatchPageHideAndUnload();
      return proceed;
    },
  });
  configureIFrameRealms(childRealmFactory, pageUrl);
  configureNavigatorProfile(
    navigatorUserAgent,
    navigatorPlatform,
    navigatorLanguages,
    navigatorLanguage,
    navigatorHardwareConcurrency,
    navigatorDeviceMemory,
    capabilitiesProfile,
    navigatorMetadata,
  );
  configureServiceWorkers(
    serviceWorkerFactory,
    pageUrl,
    capabilitiesProfile?.serviceWorker,
  );
  configureWorklets(workletFactory, pageUrl);
  configureGPUProfile(renderingProfile);
  configureWebGLProfile(renderingProfile);
  configureCodecsProfile(capabilitiesProfile?.media);
  configureMediaElementCodecProfile(capabilitiesProfile?.media);
  configureDeviceProfile(capabilitiesProfile?.sensors);
  configureSpeechProfile(navigatorLanguage);
  // `Intl` 的默认 locale 必须跟随 profile 而不是宿主操作系统——实测 profile 声明
  // en-US 时 `Intl.DateTimeFormat().resolvedOptions().locale` 仍是宿主的 zh-CN。
  // 详见 install-intl-default-locale.js。
  installIntlDefaultLocale(navigatorLanguage);
  // UA 默认样式表的标准字体族也必须跟着 locale 切，否则 `navigator.language`
  // 与 `getComputedStyle(document.body).fontFamily` 会对不上。
  // 实测表见 src/fingerprint/ua-default-fonts.js。
  configureStandardFontFamily(standardFontFamilyFor(navigatorLanguage));
  installWorklet();
  configureStorage(localStorageData, sessionStorageData);
  configureCookies(cookieData);
  installConsole();
  installDOMException();
  installLocation();
  installHistory();
  installEventTarget();
  installGPU();
  installWebGL();
  installNodeList();
  installNode();
  installCharacterData();
  installText();
  installComment();
  installCDATASection();
  installProcessingInstruction();
  installDocumentFragment();
  installDocumentType();
  installAttr();
  installNamedNodeMap();
  installHTMLCollection();
  installRadioNodeList();
  installHTMLFormControlsCollection();
  installDOMTokenList();
  installMutationRecord();
  installMutationObserver();
  installCustomElementRegistry();
  installCSSStyleValue();
  installCSSTypedOMValues();
  installCSSNamespace();
  installCSSTransformValues();
  installCSSStyleDeclaration();
  installStylePropertyMapReadOnly();
  installStylePropertyMap();
  installCustomStateSet();
  installElementInternals();
  installMediaList();
  installStyleSheet();
  installStyleSheetList();
  installCSSRule();
  installCSSRuleList();
  installCSSGroupingRule();
  installCSSConditionRule();
  installCSSMediaRule();
  installCSSSupportsRule();
  installCSSImportRule();
  installCSSDeclarationRules();
  installCSSPositionTryDescriptors();
  installCSSGroupingSpecialRules();
  installCSSDescriptorRules();
  installCSSFunctionRules();
  installCSSKeyframesRule();
  installCSSKeyframeRule();
  installCSSStyleRule();
  installCSSStyleSheet();
  installMediaQueryList();
  installWindowCSS();
  installCSSPseudoElement();
  installViewTransitionTypeSet();
  installViewTransition();
  installAnimationTimeline();
  installDocumentTimeline();
  installAnimationEffect();
  installKeyframeEffect();
  installAnimation();
  installCSSAnimations();
  installElement();
  installHTMLElement();
  installHTMLUnknownElement();
  installHTMLHtmlElement();
  installHTMLHeadElement();
  installHTMLBodyElement();
  installHTMLAnchorElement();
  installHTMLAreaElement();
  installHTMLLinkElement();
  installHTMLMarqueeElement();
  installHTMLGeolocationElement();
  installFencedFrameConfig();
  installHTMLFencedFrameElement();
  installHTMLFrameElement();
  installHTMLIFrameElement();
  installTextTrackCue();
  installVTTCue();
  installTextTrackCueList();
  installTextTrack();
  installHTMLTrackElement();
  installHTMLFrameSetElement();
  installHTMLObjectElement();
  installTimeRanges();
  installTextTrackList();
  installRemotePlayback();
  installMediaError();
  installOverconstrainedError();
  installMediaStreamTrackAudioStats();
  installMediaStreamTrack();
  installMediaStream();
  installHTMLMediaElement();
  installHTMLAudioElement();
  installAudioConstructor();
  installVideoPlaybackQuality();
  installPictureInPictureWindow();
  installHTMLVideoElement();
  installHeaders();
  installFormData();
  installStreams();
  installBlob();
  installFileAndReader();
  installRequestResponse();
  configureFetchReplay(replay, networkRequestRecorder);
  installFetch();
  installXMLHttpRequest();
  installImageBitmap();
  installImageBitmapRenderingContext();
  installExecutionObservers();
  installDocumentProcessing();
  installImageData();
  installTextMetrics();
  installCanvasGradient();
  installCanvasPattern();
  installPath2D();
  installDOMPointReadOnly();
  installDOMPoint();
  installDOMMatrixReadOnly();
  installDOMMatrix();
  installSVGValues();
  installSVGLists();
  installSVGAnimatedValues();
  installDOMRectReadOnly();
  installDOMRect();
  installDOMRectList();
  installOffscreenCanvasRenderingContext2D();
  installCanvasRenderingContext2D();
  installOffscreenCanvas();
  installCanvasCaptureMediaStreamTrack();
  installHTMLCanvasElement();
  installHTMLDivElement();
  installHTMLPreElement();
  installHTMLSpanElement();
  installHTMLParagraphElement();
  installHTMLHeadingElement();
  installHTMLImageElement();
  installImageConstructor();
  installHTMLScriptElement();
  installHTMLPictureElement();
  installHTMLSelectedContentElement();
  installHTMLBRElement();
  installHTMLDataElement();
  installHTMLDirectoryElement();
  installHTMLDListElement();
  installHTMLMenuElement();
  installHTMLQuoteElement();
  installHTMLTimeElement();
  installHTMLTableCaptionElement();
  installHTMLTitleElement();
  installHTMLDataListElement();
  installHTMLBaseElement();
  installHTMLDetailsElement();
  installHTMLLIElement();
  installHTMLModElement();
  installHTMLOptGroupElement();
  installHTMLUListElement();
  installHTMLFontElement();
  installHTMLHRElement();
  installHTMLParamElement();
  installHTMLOListElement();
  installHTMLMetaElement();
  installHTMLStyleElement();
  installHTMLLegendElement();
  installHTMLMapElement();
  installHTMLLabelElement();
  installHTMLProgressElement();
  installHTMLTableColElement();
  installHTMLSourceElement();
  installHTMLTemplateElement();
  installHTMLEmbedElement();
  installHTMLTableCellElement();
  installHTMLTableRowElement();
  installHTMLTableSectionElement();
  installHTMLTableElement();
  installHTMLMeterElement();
  installHTMLDialogElement();
  installHTMLOptionElement();
  installOptionConstructor();
  installHTMLOptionsCollection();
  installValidityState();
  installHTMLSelectElement();
  installHTMLFormElement();
  installHTMLFieldSetElement();
  installHTMLOutputElement();
  installHTMLButtonElement();
  installHTMLTextAreaElement();
  installFileList();
  installHTMLInputElement();
  installMathMLElement();
  installSVGElement();
  installSVGGraphicsElement();
  installSVGGeometryElement();
  installSVGCircleElement();
  installSVGPathElement();
  installSVGSVGElement();
  installReconstructedSVGFactories();
  installHTMLAllCollection();
  installHTMLSlotElement();
  installShadowRoot();
  installWindow();
  installHTMLDocument();
  installXMLDocument();
  installDOMImplementation();
  installDocument();
  installAbstractRange();
  installRange();
  installCookie();
  installSelection();
  installNodeFilter();
  installTreeWalker();
  installNodeIterator();
  installEvent();
  installCustomEvent();
  installAudio();
  installMediaSource();
  installCodecs();
  installSpeech();
  installWebRTC();
  installXRCore();
  installXRExtensions();
  installUserAgency();
  installDeviceAPIs();
  installExternalDeviceAPIs();
  installFileSystem();
  installCredentialPayment();
  installMediaAgency();
  installObserverGeometry();
  installOfflineSocket();
  installInputEvents(browserMajorVersion >= 151);
  installGeneralEvents(browserMajorVersion >= 151);
  installDOMUtilities();
  installTrustedTypes();
  installURLPattern();
  installHighlight();
  installNavigationAPI();
  installCoordination();
  installCacheAPI();
  installScheduling();
  installNavigatorServices();
  installLongtailEvents();
  installScrollTimeline();
  installReporting();
  installIndexedDB();
  installLegacyConstructorAliases();
  installMIDI();
  installPresentation();
  installSpeechRecognition();
  installPressure();
  installServiceWorkerManagers();
  installBackgroundFetch();
  installSharedStorage();
  installTimelineTrigger();
  installWebTransport();
  installScreenDetails();
  installLocalLanguage();
  installLocalFonts({ exposeGlobal: browserMajorVersion >= 151 });
  installUserInteraction();
  installIdentityServices();
  installLaunchHandling();
  installGlobalServices();
  installFetchLater();
  installOrigin();
  installErrorObjects();
  installEditContext();
  installCaptureTargets();
  installNavigationDiagnostics();
  installObservable();
  installChapterInformation();
  installFeaturePolicy();
  installWGSLLanguageFeatures();
  installSVGUnitTypes();
  installPerformanceEntry(browserMajorVersion >= 151);
  installPerformanceMark();
  installPerformanceMeasure();
  installPerformanceLongtail();
  installPerformance({ edge151Surface: browserMajorVersion >= 151 });
  installWindowTimers();
  installScreenOrientation();
  installScreen();
  installNavigatorUAData();
  installNavigator();
  installWindowStateGlobals();
  installWindowEventHandlerGlobals();
  installWindowLegacyGlobals();
  installStorage();
  installURLSearchParams();
  installURL();
  installTextEncoding();
  installTextStreams();
  installCompressionStreams();
  installCrypto();
  installBase64();
  installAbort();
  installStructuredClone();
  configureBroadcastConnector(broadcastConnector);
  installMessaging();
  configureWorkers(workerFactory, pageUrl);
  installWorker();
  configureSharedWorkers(sharedWorkerFactory, pageUrl);
  installSharedWorker();
  installServiceWorker();
  installWindowSelfReferences();
  configureWindowMessaging(
    new URL(pageUrl).origin,
    parentWindow,
    topWindow,
    parentOrigin,
    parentPostMessage,
    parentSameOrigin,
  );
  // 跨源时一律 null：规范要求容器文档不同源时 `frameElement` 返回 null。
  configureFrameElement(parentSameOrigin ? frameElement : null);
  configureDocumentDefaultView(outerWindow);
  configureDocument(pageReferrer, pageContentType);

  parsePageHTML(pageHtml);
  installEdgeStaticFunctions();
  installEdgeAccessorSemantics();
  finalizeWindowSurfaceOrder();
}

function installWindowSelfReferences() {
  const windowGetter = Object.getOwnPropertyDescriptor({
    get window() { return globalThis; },
  }, "window").get;
  const selfGetter = Object.getOwnPropertyDescriptor({
    get self() { return globalThis; },
  }, "self").get;
  const topGetter = Object.getOwnPropertyDescriptor({
    get top() { return windowTop(); },
  }, "top").get;
  const parentGetter = Object.getOwnPropertyDescriptor({
    get parent() { return windowParent(); },
  }, "parent").get;
  registerNativeGetter(windowGetter, "window");
  registerNativeGetter(selfGetter, "self");
  registerNativeGetter(topGetter, "top");
  registerNativeGetter(parentGetter, "parent");
  Object.defineProperty(globalThis, "window", {
    get: windowGetter,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "self", {
    get: selfGetter,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "top", {
    get: topGetter,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "parent", {
    get: parentGetter,
    enumerable: true,
    configurable: true,
  });
}

export function enableProxyTrace() {
  enableTrace();
}

export function disableProxyTrace() {
  disableTrace();
}

export function clearProxyTrace() {
  clearTrace();
}

export function proxyTrace() {
  return readTrace();
}

export function observeEvaluationPromise(promise) {
  return observePromise(promise);
}

export function readEvaluationPromise(observerId) {
  return readPromiseObserver(observerId);
}

export function nextScheduledTaskDelay() {
  return nextTimerDelay();
}

export function runScheduledTasks() {
  runDueTimers();
}

export function resourceSnapshot() {
  return {
    workers: workerResourceCount(),
    sharedWorkers: sharedWorkerResourceCount(),
    serviceWorkers: serviceWorkerResourceCount(),
  };
}

export function clearScheduledTasks() {
  clearAllTimers();
  closeAllBroadcastChannels();
  terminateAllWorkers();
  terminateAllSharedWorkers();
  disposeServiceWorkers();
}

export function markWindowClosed() {
  setWindowClosed(true);
}

export function resetWindowPage(pageHtml, pageReferrer, pageContentType) {
  configureDocument(pageReferrer, pageContentType);
  parsePageHTML(pageHtml);
}

export function exportLocalStorage() {
  return encodeLocalStorage();
}

export function exportSessionStorage() {
  return encodeSessionStorage();
}

export function exportCookies() {
  return encodeCookies();
}

export function receiveParentMessage(
  message,
  origin,
  targetOriginOrOptions,
  transfer,
) {
  receiveParentWindowMessage(
    message,
    origin,
    targetOriginOrOptions,
    transfer,
  );
}

/**
 * 把一个**预热的**空白子 Realm 接到真正的父窗口上。
 *
 * 预热池在根 Realm 存在**之前**就把子 Realm 建好了（否则 `contentWindow` 无法
 * 同步可用，见 `docs/adr/0004-dynamic-iframe-timing.md`），那时还没有
 * `parentWindow` 可传，所以池位是以「自己是顶层」的状态引导的。真正被某个
 * `<iframe>` 领走时再补上父子关系。
 *
 * 只重配**父子关系**，不重建文档：池位的文档已经是空白骨架，正好就是空白 iframe
 * 该有的样子。带 `src` / `srcdoc` 的 iframe 不走池——那需要不同的文档，
 * 重建文档的成本和新建一个 Realm 没有区别。
 *
 * 走 `bootstrap` 命名空间而不是 `importUrlSyncCached()`：bootstrap 模块本来就已
 * 经加载好（它就是引导入口），不需要额外 preload，在 Node 18–22 上也不依赖同步
 * 模块链接。
 */
export function reparentRealm(
  parentWindow = null,
  topWindow = null,
  parentOrigin = "",
  parentPostMessage = null,
  parentSameOrigin = false,
  frameElement = null,
) {
  configureWindowMessaging(
    currentOriginForReparent(),
    parentWindow,
    topWindow ?? parentWindow,
    parentOrigin,
    parentPostMessage,
    parentSameOrigin,
  );
  configureFrameElement(parentSameOrigin ? frameElement : null);
}

/**
 * 重配时不能重新解析页面 URL —— 池位的 origin 在引导时就定了，
 * 而 `location` 已经是权威来源。
 */
function currentOriginForReparent() {
  return new URL(globalThis.location.href).origin;
}
