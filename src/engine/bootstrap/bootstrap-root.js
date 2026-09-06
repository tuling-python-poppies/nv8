import { hideNodeGlobals } from "./hide-node-globals.js";
import {
  installErrorStackGuard,
} from "./install-error-stack-guard.js";
import { installCustomEvent } from "../../surface/install/install-custom-event.js";
import { installDOMException } from "../../surface/install/install-dom-exception.js";
import { installEvent } from "../../surface/install/install-event.js";
import { installEventTarget } from "../../surface/install/install-event-target.js";
import { installPerformance } from "../../surface/install/install-performance.js";
import {
  installPerformanceEntry,
} from "../../surface/install/install-performance-entry.js";
import {
  installPerformanceMark,
} from "../../surface/install/install-performance-mark.js";
import {
  installPerformanceMeasure,
} from "../../surface/install/install-performance-measure.js";
import {
  installPerformanceLongtail,
} from "../../surface/install/install-performance-longtail.js";
import {
  clearTrace,
  configureTrace,
  disableTrace,
  enableTrace,
  readTrace,
} from "../../infra/trace/trace-state.js";
import {
  configureNativeFunctionRegistry,
  installNativeFunctionToString,
  establishNativeFunctionContext,
  registerNativeGetter,
} from "../webidl/native-function.js";
import {
  finalizeWindowSurfaceOrder,
} from "../../surface/install/finalize-window-surface-order.js";
import {
  finalizePrototypeSurfaceOrder,
} from "../../surface/install/prototype-surface-order.js";
import {
  installEdgeStaticFunctions,
} from "../../surface/install/install-edge-static-functions.js";
import {
  installEdgeAccessorSemantics,
} from "../../surface/install/install-edge-accessor-semantics.js";
import {
  installModernBuiltins,
} from "../../surface/install/install-modern-builtins.js";
import { installDateProfile } from "../../surface/install/install-date-profile.js";
import {
  installIntlV8BreakIterator,
} from "../../surface/install/install-intl-v8-break-iterator.js";
import {
  installIntlDefaultLocale,
} from "../../surface/install/install-intl-default-locale.js";
import {
  configureStandardFontFamily,
} from "../../surface/api/css/css-computed-value.js";
import {
  standardFontFamilyFor,
} from "../../infra/fingerprint/ua-default-fonts.js";
import { installWindowTimers } from "../../surface/install/install-window-timers.js";
import { installScreen } from "../../surface/install/install-screen.js";
import {
  installScreenOrientation,
} from "../../surface/install/install-screen-orientation.js";
import {
  observePromise,
  readPromiseObserver,
} from "../realm/promise-observer.js";
import {
  clearAllTimers,
  nextTimerDelay,
  runDueTimers,
} from "../../infra/scheduler/timer-state.js";
import { configureTimingProfile } from "../../infra/scheduler/monotonic-clock.js";
import { configureScreenProfile } from "../../surface/api/screen/screen-state.js";
import { configureNavigation } from "../../infra/navigation/navigation-state.js";
import {
  dispatchBeforeUnload,
  dispatchPageHideAndUnload,
} from "../../surface/install/install-page-lifecycle.js";
import { installLocation } from "../../surface/install/install-location.js";
import { installHistory } from "../../surface/install/install-history.js";
import { installWindow } from "../../surface/install/install-window.js";
import { installNavigator } from "../../surface/install/install-navigator.js";
import {
  installNavigatorUAData,
} from "../../surface/install/install-navigator-ua-data.js";
import {
  configureNavigatorProfile,
} from "../../surface/api/navigator/navigator-state.js";
import { installStorage } from "../../surface/install/install-storage.js";
import {
  configureStorage,
  encodeLocalStorage,
  encodeSessionStorage,
} from "../../surface/api/storage/storage-state.js";
import {
  installURLSearchParams,
} from "../../surface/install/install-url-search-params.js";
import { installURL } from "../../surface/install/install-url.js";
import {
  configureObjectURLRegistry,
} from "../../surface/api/url/url-state.js";
import {
  installTextEncoding,
} from "../../surface/install/install-text-encoding.js";
import { installTextStreams } from "../../surface/install/install-text-streams.js";
import {
  installCompressionStreams,
} from "../../surface/install/install-compression-streams.js";
import { installCrypto } from "../../surface/install/install-crypto.js";
import { installMessaging } from "../../surface/install/install-messaging.js";
import {
  closeAllBroadcastChannels,
  configureBroadcastConnector,
} from "../../surface/api/messaging/messaging-runtime.js";
import { installWorker } from "../../surface/install/install-worker.js";
import {
  configureWorkers,
  terminateAllWorkers,
  workerResourceCount,
} from "../../surface/api/worker/worker-runtime.js";
import { installSharedWorker } from "../../surface/install/install-shared-worker.js";
import {
  configureSharedWorkers,
  terminateAllSharedWorkers,
  sharedWorkerResourceCount,
} from "../../surface/api/worker/shared-worker-runtime.js";
import { installServiceWorker } from "../../surface/install/install-service-worker.js";
import {
  configureServiceWorkers,
  disposeServiceWorkers,
  serviceWorkerResourceCount,
} from "../../surface/api/worker/service-worker-runtime.js";
import { installWorklet } from "../../surface/install/install-worklet.js";
import { configureWorklets } from "../../surface/api/worklet/worklet-runtime.js";
import { installAudio } from "../../surface/install/install-audio.js";
import { installMediaSource } from "../../surface/install/install-media-source.js";
import { installCodecs } from "../../surface/install/install-codecs.js";
import { configureCodecsProfile } from "../../surface/api/codecs/codecs-runtime.js";
import { installSpeech } from "../../surface/install/install-speech.js";
import { installWebRTC } from "../../surface/install/install-webrtc.js";
import { installXRCore } from "../../surface/install/install-xr-core.js";
import {
  installXRExtensions,
} from "../../surface/install/install-xr-extensions.js";
import { installUserAgency } from "../../surface/install/install-user-agency.js";
import { installDeviceAPIs } from "../../surface/install/install-device.js";
import { configureDeviceProfile } from "../../surface/api/device/device-runtime.js";
import {
  installExternalDeviceAPIs,
} from "../../surface/install/install-external-device.js";
import { installFileSystem } from "../../surface/install/install-file-system.js";
import {
  installCredentialPayment,
} from "../../surface/install/install-credential-payment.js";
import { installMediaAgency } from "../../surface/install/install-media-agency.js";
import {
  installObserverGeometry,
} from "../../surface/install/install-observer-geometry.js";
import { installOfflineSocket } from "../../surface/install/install-offline-socket.js";
import { installInputEvents } from "../../surface/install/install-input-events.js";
import { installGeneralEvents } from "../../surface/install/install-general-events.js";
import { installDOMUtilities } from "../../surface/install/install-dom-utilities.js";
import { installEdge152Ranges } from "../../surface/install/install-edge-152-ranges.js";
import { installEdge152Members } from "../../surface/install/install-edge-152-members.js";
import { installTrustedTypes } from "../../surface/install/install-trusted-types.js";
import { installURLPattern } from "../../surface/install/install-url-pattern.js";
import { installHighlight } from "../../surface/install/install-highlight.js";
import { installNavigationAPI } from "../../surface/install/install-navigation-api.js";
import { installCoordination } from "../../surface/install/install-coordination.js";
import { installCacheAPI } from "../../surface/install/install-cache-api.js";
import { installScheduling } from "../../surface/install/install-scheduling.js";
import {
  installNavigatorServices,
} from "../../surface/install/install-navigator-services.js";
import {
  installLongtailEvents,
} from "../../surface/install/install-longtail-events.js";
import {
  installScrollTimeline,
} from "../../surface/install/install-scroll-timeline.js";
import { installReporting } from "../../surface/install/install-reporting.js";
import { installIndexedDB } from "../../surface/install/install-indexed-db.js";
import {
  installLegacyConstructorAliases,
} from "../../surface/install/install-legacy-constructor-aliases.js";
import { installMIDI } from "../../surface/install/install-midi.js";
import { installPresentation } from "../../surface/install/install-presentation.js";
import {
  installSpeechRecognition,
} from "../../surface/install/install-speech-recognition.js";
import { installPressure } from "../../surface/install/install-pressure.js";
import {
  installServiceWorkerManagers,
} from "../../surface/install/install-service-worker-managers.js";
import {
  installBackgroundFetch,
} from "../../surface/install/install-background-fetch.js";
import {
  installSharedStorage,
} from "../../surface/install/install-shared-storage.js";
import {
  installTimelineTrigger,
} from "../../surface/install/install-timeline-trigger.js";
import {
  installWebTransport,
} from "../../surface/install/install-web-transport.js";
import {
  installScreenDetails,
} from "../../surface/install/install-screen-details.js";
import {
  installLocalLanguage,
} from "../../surface/install/install-local-language.js";
import {
  installLocalFonts,
} from "../../surface/install/install-local-fonts.js";
import {
  installUserInteraction,
} from "../../surface/install/install-user-interaction.js";
import {
  installIdentityServices,
} from "../../surface/install/install-identity-services.js";
import {
  installLaunchHandling,
} from "../../surface/install/install-launch-handling.js";
import {
  installGlobalServices,
} from "../../surface/install/install-global-services.js";
import {
  installFetchLater,
} from "../../surface/install/install-fetch-later.js";
import { installOrigin } from "../../surface/install/install-origin.js";
import {
  installErrorObjects,
} from "../../surface/install/install-error-objects.js";
import {
  installEditContext,
} from "../../surface/install/install-edit-context.js";
import {
  installCaptureTargets,
} from "../../surface/install/install-capture-targets.js";
import {
  installNavigationDiagnostics,
} from "../../surface/install/install-navigation-diagnostics.js";
import {
  installObservable,
} from "../../surface/install/install-observable.js";
import {
  installChapterInformation,
} from "../../surface/install/install-chapter-information.js";
import {
  installFeaturePolicy,
} from "../../surface/install/install-feature-policy.js";
import {
  installWGSLLanguageFeatures,
} from "../../surface/install/install-wgsl-language-features.js";
import {
  installSVGUnitTypes,
} from "../../surface/install/install-svg-unit-types.js";
import {
  configureSpeechProfile,
} from "../../surface/api/speech/speech-runtime.js";
import { installGPU } from "../../surface/install/install-gpu.js";
import { configureGPUProfile } from "../../surface/api/gpu/gpu-runtime.js";
import { installWebGL } from "../../surface/install/install-webgl.js";
import { configureWebGLProfile } from "../../surface/api/webgl/webgl-runtime.js";
import {
  configureIFrameRealms,
} from "../../surface/api/dom/html-iframe-element-realm-state.js";
import {
  configureWindowMessaging,
  receiveParentWindowMessage,
  windowParent,
  windowTop,
} from "../../surface/api/window/window-messaging.js";
import {
  configureDocumentDefaultView,
} from "../../surface/api/dom/document-default-view-state.js";
import { installBase64 } from "../../surface/install/install-base64.js";
import { installAbort } from "../../surface/install/install-abort.js";
import {
  installStructuredClone,
} from "../../surface/api/clone/structured-clone.js";
import { installConsole } from "../../surface/install/install-console.js";
import { installNodeList } from "../../surface/install/install-node-list.js";
import { installNode } from "../../surface/install/install-node.js";
import {
  installCharacterData,
} from "../../surface/install/install-character-data.js";
import { installText } from "../../surface/install/install-text.js";
import { installComment } from "../../surface/install/install-comment.js";
import {
  installCDATASection,
} from "../../surface/install/install-cdata-section.js";
import {
  installProcessingInstruction,
} from "../../surface/install/install-processing-instruction.js";
import {
  installDocumentFragment,
} from "../../surface/install/install-document-fragment.js";
import { installAttr } from "../../surface/install/install-attr.js";
import {
  installNamedNodeMap,
} from "../../surface/install/install-named-node-map.js";
import {
  installHTMLCollection,
} from "../../surface/install/install-html-collection.js";
import { installElement } from "../../surface/install/install-element.js";
import {
  installCustomElementRegistry,
} from "../../surface/install/install-custom-element-registry.js";
import { installCSSStyleValue } from "../../surface/install/install-css-style-value.js";
import {
  installCSSTypedOMValues,
} from "../../surface/install/install-css-typed-om-values.js";
import { installCSSNamespace } from "../../surface/install/install-css-namespace.js";
import {
  installCSSTransformValues,
} from "../../surface/install/install-css-transform-values.js";
import {
  installCSSStyleDeclaration,
} from "../../surface/install/install-css-style-declaration.js";
import {
  installStylePropertyMapReadOnly,
} from "../../surface/install/install-style-property-map-read-only.js";
import {
  installStylePropertyMap,
} from "../../surface/install/install-style-property-map.js";
import {
  installCustomStateSet,
} from "../../surface/install/install-custom-state-set.js";
import {
  installElementInternals,
} from "../../surface/install/install-element-internals.js";
import { installMediaList } from "../../surface/install/install-media-list.js";
import { installStyleSheet } from "../../surface/install/install-style-sheet.js";
import { installStyleSheetList } from "../../surface/install/install-style-sheet-list.js";
import { installCSSRule } from "../../surface/install/install-css-rule.js";
import { installCSSRuleList } from "../../surface/install/install-css-rule-list.js";
import {
  installCSSGroupingRule,
} from "../../surface/install/install-css-grouping-rule.js";
import {
  installCSSConditionRule,
} from "../../surface/install/install-css-condition-rule.js";
import { installCSSMediaRule } from "../../surface/install/install-css-media-rule.js";
import {
  installCSSSupportsRule,
} from "../../surface/install/install-css-supports-rule.js";
import { installCSSImportRule } from "../../surface/install/install-css-import-rule.js";
import {
  installCSSDeclarationRules,
} from "../../surface/install/install-css-declaration-rules.js";
import {
  installCSSGroupingSpecialRules,
} from "../../surface/install/install-css-grouping-special-rules.js";
import {
  installCSSDescriptorRules,
} from "../../surface/install/install-css-descriptor-rules.js";
import {
  installCSSPositionTryDescriptors,
} from "../../surface/install/install-css-position-try-descriptors.js";
import {
  installCSSFunctionRules,
} from "../../surface/install/install-css-function-rules.js";
import {
  installCSSKeyframesRule,
} from "../../surface/install/install-css-keyframes-rule.js";
import {
  installCSSKeyframeRule,
} from "../../surface/install/install-css-keyframe-rule.js";
import { installCSSStyleRule } from "../../surface/install/install-css-style-rule.js";
import { installCSSStyleSheet } from "../../surface/install/install-css-style-sheet.js";
import {
  installMediaQueryList,
} from "../../surface/install/install-media-query-list.js";
import { installWindowCSS } from "../../surface/install/install-window-css.js";
import {
  installCSSPseudoElement,
} from "../../surface/install/install-css-pseudo-element.js";
import {
  installViewTransitionTypeSet,
} from "../../surface/install/install-view-transition-type-set.js";
import {
  installViewTransition,
} from "../../surface/install/install-view-transition.js";
import {
  installAnimationTimeline,
} from "../../surface/install/install-animation-timeline.js";
import {
  installDocumentTimeline,
} from "../../surface/install/install-document-timeline.js";
import {
  installAnimationEffect,
} from "../../surface/install/install-animation-effect.js";
import {
  installKeyframeEffect,
} from "../../surface/install/install-keyframe-effect.js";
import { installAnimation } from "../../surface/install/install-animation.js";
import { installCSSAnimations } from "../../surface/install/install-css-animations.js";
import { installSVGValues } from "../../surface/install/install-svg-values.js";
import { installSVGLists } from "../../surface/install/install-svg-lists.js";
import {
  installSVGAnimatedValues,
} from "../../surface/install/install-svg-animated-values.js";
import {
  installDOMTokenList,
} from "../../surface/install/install-dom-token-list.js";
import {
  installMutationRecord,
} from "../../surface/install/install-mutation-record.js";
import {
  installMutationObserver,
} from "../../surface/install/install-mutation-observer.js";
import {
  installAbstractRange,
} from "../../surface/install/install-abstract-range.js";
import { installRange } from "../../surface/install/install-range.js";
import { installCookie } from "../../surface/install/install-cookie.js";
import {
  configureCookies,
  encodeCookies,
} from "../../surface/api/dom/cookie-state.js";
import { installSelection } from "../../surface/install/install-selection.js";
import { installTreeWalker } from "../../surface/install/install-tree-walker.js";
import { installNodeIterator } from "../../surface/install/install-node-iterator.js";
import { installNodeFilter } from "../../surface/install/install-node-filter.js";
import { installHTMLElement } from "../../surface/install/install-html-element.js";
import {
  installHTMLDivElement,
} from "../../surface/install/install-html-div-element.js";
import {
  installHTMLAnchorElement,
} from "../../surface/install/install-html-anchor-element.js";
import {
  installHTMLHtmlElement,
} from "../../surface/install/install-html-html-element.js";
import {
  installHTMLHeadElement,
} from "../../surface/install/install-html-head-element.js";
import {
  installHTMLBodyElement,
} from "../../surface/install/install-html-body-element.js";
import {
  installHTMLSpanElement,
} from "../../surface/install/install-html-span-element.js";
import {
  installHTMLParagraphElement,
} from "../../surface/install/install-html-paragraph-element.js";
import {
  installHTMLHeadingElement,
} from "../../surface/install/install-html-heading-element.js";
import {
  installHTMLImageElement,
} from "../../surface/install/install-html-image-element.js";
import {
  installHTMLScriptElement,
} from "../../surface/install/install-html-script-element.js";
import {
  installHTMLPictureElement,
} from "../../surface/api/dom/html-picture-element-constructor.js";
import {
  installHTMLSelectedContentElement,
} from "../../surface/api/dom/html-selected-content-element-constructor.js";
import {
  installHTMLBRElement,
} from "../../surface/install/install-html-br-element.js";
import {
  installHTMLDataElement,
} from "../../surface/install/install-html-data-element.js";
import {
  installHTMLDirectoryElement,
} from "../../surface/install/install-html-directory-element.js";
import {
  installHTMLDListElement,
} from "../../surface/install/install-html-d-list-element.js";
import {
  installHTMLMenuElement,
} from "../../surface/install/install-html-menu-element.js";
import {
  installHTMLQuoteElement,
} from "../../surface/install/install-html-quote-element.js";
import {
  installHTMLTimeElement,
} from "../../surface/install/install-html-time-element.js";
import {
  installHTMLTableCaptionElement,
} from "../../surface/install/install-html-table-caption-element.js";
import {
  installHTMLTitleElement,
} from "../../surface/install/install-html-title-element.js";
import {
  installHTMLDataListElement,
} from "../../surface/install/install-html-data-list-element.js";
import {
  installHTMLBaseElement,
} from "../../surface/install/install-html-base-element.js";
import {
  installHTMLDetailsElement,
} from "../../surface/install/install-html-details-element.js";
import {
  installHTMLLIElement,
} from "../../surface/install/install-html-li-element.js";
import {
  installHTMLModElement,
} from "../../surface/install/install-html-mod-element.js";
import {
  installHTMLOptGroupElement,
} from "../../surface/install/install-html-opt-group-element.js";
import {
  installHTMLUListElement,
} from "../../surface/install/install-html-u-list-element.js";
import {
  installHTMLFontElement,
} from "../../surface/install/install-html-font-element.js";
import {
  installHTMLHRElement,
} from "../../surface/install/install-html-hr-element.js";
import {
  installHTMLParamElement,
} from "../../surface/install/install-html-param-element.js";
import {
  installHTMLOListElement,
} from "../../surface/install/install-html-o-list-element.js";
import {
  installHTMLMetaElement,
} from "../../surface/install/install-html-meta-element.js";
import {
  installHTMLStyleElement,
} from "../../surface/install/install-html-style-element.js";
import {
  installHTMLLegendElement,
} from "../../surface/install/install-html-legend-element.js";
import {
  installHTMLMapElement,
} from "../../surface/install/install-html-map-element.js";
import {
  installHTMLLabelElement,
} from "../../surface/install/install-html-label-element.js";
import {
  installHTMLProgressElement,
} from "../../surface/install/install-html-progress-element.js";
import {
  installHTMLTableColElement,
} from "../../surface/install/install-html-table-col-element.js";
import {
  installHTMLSourceElement,
} from "../../surface/install/install-html-source-element.js";
import {
  installHTMLTemplateElement,
} from "../../surface/install/install-html-template-element.js";
import {
  installHTMLEmbedElement,
} from "../../surface/install/install-html-embed-element.js";
import {
  installHTMLTableCellElement,
} from "../../surface/install/install-html-table-cell-element.js";
import {
  installHTMLTableRowElement,
} from "../../surface/install/install-html-table-row-element.js";
import {
  installHTMLTableSectionElement,
} from "../../surface/install/install-html-table-section-element.js";
import {
  installHTMLTableElement,
} from "../../surface/install/install-html-table-element.js";
import {
  installHTMLMeterElement,
} from "../../surface/install/install-html-meter-element.js";
import {
  installHTMLDialogElement,
} from "../../surface/install/install-html-dialog-element.js";
import {
  installHTMLOptionElement,
} from "../../surface/install/install-html-option-element.js";
import {
  installOptionConstructor,
} from "../../surface/api/dom/option-constructor.js";
import {
  installHTMLOptionsCollection,
} from "../../surface/install/install-html-options-collection.js";
import {
  installValidityState,
} from "../../surface/install/install-validity-state.js";
import {
  installHTMLSelectElement,
} from "../../surface/install/install-html-select-element.js";
import {
  installRadioNodeList,
} from "../../surface/install/install-radio-node-list.js";
import {
  installHTMLFormControlsCollection,
} from "../../surface/install/install-html-form-controls-collection.js";
import {
  installHTMLFormElement,
} from "../../surface/install/install-html-form-element.js";
import {
  installHTMLFieldSetElement,
} from "../../surface/install/install-html-field-set-element.js";
import {
  installHTMLOutputElement,
} from "../../surface/install/install-html-output-element.js";
import {
  installHTMLButtonElement,
} from "../../surface/install/install-html-button-element.js";
import {
  installHTMLTextAreaElement,
} from "../../surface/install/install-html-text-area-element.js";
import {
  installFileList,
} from "../../surface/install/install-file-list.js";
import {
  installHTMLInputElement,
} from "../../surface/install/install-html-input-element.js";
import {
  installHTMLAreaElement,
} from "../../surface/install/install-html-area-element.js";
import {
  installHTMLLinkElement,
} from "../../surface/install/install-html-link-element.js";
import {
  installHTMLMarqueeElement,
} from "../../surface/install/install-html-marquee-element.js";
import {
  installHTMLGeolocationElement,
} from "../../surface/install/install-html-geolocation-element.js";
import {
  installHTMLUserMediaElement,
} from "../../surface/install/install-html-user-media-element.js";
import {
  installFencedFrameConfig,
} from "../../surface/install/install-fenced-frame-config.js";
import {
  installHTMLFencedFrameElement,
} from "../../surface/install/install-html-fenced-frame-element.js";
import {
  installHTMLFrameElement,
} from "../../surface/install/install-html-frame-element.js";
import {
  installHTMLIFrameElement,
} from "../../surface/install/install-html-iframe-element.js";
import {
  installTextTrackCue,
} from "../../surface/install/install-text-track-cue.js";
import {
  installVTTCue,
} from "../../surface/install/install-vtt-cue.js";
import {
  installTextTrackCueList,
} from "../../surface/install/install-text-track-cue-list.js";
import {
  installTextTrack,
} from "../../surface/install/install-text-track.js";
import {
  installHTMLTrackElement,
} from "../../surface/install/install-html-track-element.js";
import {
  installHTMLFrameSetElement,
} from "../../surface/install/install-html-frame-set-element.js";
import {
  installHTMLObjectElement,
} from "../../surface/install/install-html-object-element.js";
import {
  installTimeRanges,
} from "../../surface/install/install-time-ranges.js";
import {
  installTextTrackList,
} from "../../surface/install/install-text-track-list.js";
import {
  installRemotePlayback,
} from "../../surface/install/install-remote-playback.js";
import {
  installMediaError,
} from "../../surface/install/install-media-error.js";
import {
  installOverconstrainedError,
} from "../../surface/install/install-overconstrained-error.js";
import {
  installMediaStreamTrackAudioStats,
} from "../../surface/install/install-media-stream-track-audio-stats.js";
import {
  installMediaStreamTrack,
} from "../../surface/install/install-media-stream-track.js";
import {
  installMediaStream,
} from "../../surface/install/install-media-stream.js";
import {
  installHTMLMediaElement,
} from "../../surface/install/install-html-media-element.js";
import {
  configureMediaElementCodecProfile,
} from "../../surface/api/media/html-media-element-codec-profile.js";
import {
  installHTMLAudioElement,
} from "../../surface/install/install-html-audio-element.js";
import {
  installAudioConstructor,
} from "../../surface/api/media/audio-constructor.js";
import {
  installVideoPlaybackQuality,
} from "../../surface/install/install-video-playback-quality.js";
import {
  installPictureInPictureWindow,
} from "../../surface/install/install-picture-in-picture-window.js";
import {
  installHTMLVideoElement,
} from "../../surface/install/install-html-video-element.js";
import {
  installImageData,
} from "../../surface/install/install-image-data.js";
import { installBlob } from "../../surface/install/install-blob.js";
import { configureBlobRegistry } from "../../surface/api/file/blob-state.js";
import { installStreams } from "../../surface/install/install-streams.js";
import { installHeaders } from "../../surface/install/install-headers.js";
import { installFormData } from "../../surface/install/install-form-data.js";
import { installRequestResponse } from "../../surface/install/install-request-response.js";
import { installFileAndReader } from "../../surface/install/install-file-reader.js";
import { installXMLHttpRequest } from "../../surface/install/install-xml-http-request.js";
import {
  configureFetchReplay,
  installFetch,
} from "../../surface/api/fetch/fetch-replay.js";
import {
  installImageBitmap,
} from "../../surface/install/install-image-bitmap.js";
import {
  installImageBitmapRenderingContext,
} from "../../surface/install/install-image-bitmap-rendering-context.js";
import {
  installExecutionObservers,
} from "../../surface/install/install-execution-observers.js";
import {
  installDocumentProcessing,
} from "../../surface/install/install-document-processing.js";
import {
  installWindowStateGlobals,
} from "../../surface/install/install-window-state-globals.js";
import {
  configureFrameElement,
  setWindowClosed,
} from "../../surface/api/window/window-state-globals-runtime.js";
import {
  installWindowEventHandlerGlobals,
} from "../../surface/install/install-window-event-handler-globals.js";
import {
  installWindowLegacyGlobals,
} from "../../surface/install/install-window-legacy-globals.js";
import {
  installTextMetrics,
} from "../../surface/install/install-text-metrics.js";
import {
  installCanvasGradient,
} from "../../surface/install/install-canvas-gradient.js";
import {
  installCanvasPattern,
} from "../../surface/install/install-canvas-pattern.js";
import {
  installPath2D,
} from "../../surface/install/install-path-2d.js";
import {
  installDOMPointReadOnly,
} from "../../surface/install/install-dom-point-read-only.js";
import {
  installDOMPoint,
} from "../../surface/install/install-dom-point.js";
import {
  installDOMMatrixReadOnly,
} from "../../surface/install/install-dom-matrix-read-only.js";
import {
  installDOMMatrix,
} from "../../surface/install/install-dom-matrix.js";
import {
  installDOMRectReadOnly,
} from "../../surface/install/install-dom-rect-read-only.js";
import { installDOMRect } from "../../surface/install/install-dom-rect.js";
import {
  installDOMRectList,
} from "../../surface/install/install-dom-rect-list.js";
import {
  installOffscreenCanvasRenderingContext2D,
} from "../../surface/install/install-offscreen-canvas-rendering-context-2d.js";
import {
  installCanvasRenderingContext2D,
} from "../../surface/install/install-canvas-rendering-context-2d.js";
import {
  installOffscreenCanvas,
} from "../../surface/install/install-offscreen-canvas.js";
import {
  installCanvasCaptureMediaStreamTrack,
} from "../../surface/install/install-canvas-capture-media-stream-track.js";
import {
  installHTMLCanvasElement,
} from "../../surface/install/install-html-canvas-element.js";
import {
  installImageConstructor,
} from "../../surface/api/dom/image-constructor.js";
import {
  installHTMLPreElement,
} from "../../surface/install/install-html-pre-element.js";
import {
  installHTMLUnknownElement,
} from "../../surface/install/install-html-unknown-element.js";
import {
  installMathMLElement,
} from "../../surface/install/install-math-ml-element.js";
import { installSVGElement } from "../../surface/install/install-svg-element.js";
import {
  installSVGGraphicsElement,
} from "../../surface/install/install-svg-graphics-element.js";
import {
  installSVGGeometryElement,
} from "../../surface/install/install-svg-geometry-element.js";
import {
  installSVGCircleElement,
} from "../../surface/install/install-svg-circle-element.js";
import {
  installSVGPathElement,
} from "../../surface/install/install-svg-path-element.js";
import {
  installSVGSVGElement,
} from "../../surface/install/install-svg-svg-element.js";
import {
  installReconstructedSVGFactories,
} from "../../surface/install/install-reconstructed-svg-factories.js";
import {
  installHTMLSlotElement,
} from "../../surface/install/install-html-slot-element.js";
import {
  installHTMLAllCollection,
} from "../../surface/install/install-html-all-collection.js";
import { installShadowRoot } from "../../surface/install/install-shadow-root.js";
import { installDocument } from "../../surface/install/install-document.js";
import {
  installHTMLDocument,
} from "../../surface/install/install-html-document.js";
import { installXMLDocument } from "../../surface/install/install-xml-document.js";
import {
  installDOMImplementation,
} from "../../surface/install/install-dom-implementation.js";
import {
  installDocumentType,
} from "../../surface/install/install-document-type.js";
import { parsePageHTML } from "../../surface/api/dom/html-parser.js";
import { configureDocument } from "../../surface/api/dom/document-record.js";

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
  if (browserMajorVersion >= 151) installHTMLUserMediaElement();
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
  installAbstractRange(browserMajorVersion >= 152);
  if (browserMajorVersion >= 152) installEdge152Ranges();
  installRange(browserMajorVersion >= 152);
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
  installDOMUtilities(browserMajorVersion >= 152);
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
  installFeaturePolicy(browserMajorVersion >= 152);
  installWGSLLanguageFeatures();
  installSVGUnitTypes();
  installPerformanceEntry(browserMajorVersion >= 151);
  installPerformanceMark();
  installPerformanceMeasure();
  installPerformanceLongtail(browserMajorVersion >= 151);
  installPerformance({ edge151Surface: browserMajorVersion >= 151 });
  installWindowTimers();
  installScreenOrientation();
  installScreen();
  installNavigatorUAData();
  installNavigator();
  if (browserMajorVersion >= 152) installEdge152Members();
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
  finalizePrototypeSurfaceOrder(browserMajorVersion);
  finalizeWindowSurfaceOrder(browserMajorVersion);
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
