import { hideNodeGlobals } from "./hide-node-globals.js";
import {
  installErrorStackGuard,
} from "./install-error-stack-guard.js";
import { installNativeFunctionToString } from "../webidl/native-function.js";
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
  installIntlDefaultTimeZone,
} from "../../surface/install/install-intl-timezone.js";
import {
  clearTrace,
  configureTrace,
  disableTrace,
  enableTrace,
  readTrace,
} from "../../infra/trace/trace-state.js";
import { configureNavigation } from "../../infra/navigation/navigation-state.js";
import {
  configureNavigatorProfile,
} from "../../surface/api/navigator/navigator-state.js";
import { installConsole } from "../../surface/install/install-console.js";
import { installDOMException } from "../../surface/install/install-dom-exception.js";
import { installEventTarget } from "../../surface/install/install-event-target.js";
import { installEvent } from "../../surface/install/install-event.js";
import { installCustomEvent } from "../../surface/install/install-custom-event.js";
import { installHeaders } from "../../surface/install/install-headers.js";
import { installFormData } from "../../surface/install/install-form-data.js";
import { installStreams } from "../../surface/install/install-streams.js";
import { installBlob } from "../../surface/install/install-blob.js";
import { configureBlobRegistry } from "../../surface/api/file/blob-state.js";
import { installFileAndReader } from "../../surface/install/install-file-reader.js";
import { installRequestResponse } from "../../surface/install/install-request-response.js";
import { installXMLHttpRequest } from "../../surface/install/install-xml-http-request.js";
import {
  configureFetchReplay,
  installFetch,
} from "../../surface/api/fetch/fetch-replay.js";
import { installPerformanceEntry } from "../../surface/install/install-performance-entry.js";
import { installPerformanceMark } from "../../surface/install/install-performance-mark.js";
import { installPerformanceMeasure } from "../../surface/install/install-performance-measure.js";
import { installPerformance } from "../../surface/install/install-performance.js";
import { installWindowTimers } from "../../surface/install/install-window-timers.js";
import { installURLSearchParams } from "../../surface/install/install-url-search-params.js";
import { installURL } from "../../surface/install/install-url.js";
import {
  configureObjectURLRegistry,
} from "../../surface/api/url/url-state.js";
import { installTextEncoding } from "../../surface/install/install-text-encoding.js";
import { installTextStreams } from "../../surface/install/install-text-streams.js";
import { installCompressionStreams } from "../../surface/install/install-compression-streams.js";
import { installCrypto } from "../../surface/install/install-crypto.js";
import { installBase64 } from "../../surface/install/install-base64.js";
import { installAbort } from "../../surface/install/install-abort.js";
import { installStructuredClone } from "../../surface/api/clone/structured-clone.js";
import { installMessaging } from "../../surface/install/install-messaging.js";
import {
  closeAllBroadcastChannels,
  configureBroadcastConnector,
} from "../../surface/api/messaging/messaging-runtime.js";
import { installGPU } from "../../surface/install/install-gpu.js";
import { configureGPUProfile } from "../../surface/api/gpu/gpu-runtime.js";
import { installWebGL } from "../../surface/install/install-webgl.js";
import { configureWebGLProfile } from "../../surface/api/webgl/webgl-runtime.js";
import { installImageBitmap } from "../../surface/install/install-image-bitmap.js";
import {
  installWorkerFontFaceSet,
} from "../../surface/api/local-fonts/font-face-set-runtime.js";
import {
  installImageBitmapRenderingContext,
} from "../../surface/install/install-image-bitmap-rendering-context.js";
import {
  installCreateImageBitmapGlobal,
  installTemporalGlobal,
} from "../../surface/api/window/window-legacy-globals-runtime.js";
import {
  installCreateMonitor,
} from "../../surface/install/install-execution-observers.js";
import { installImageData } from "../../surface/install/install-image-data.js";
import { installTextMetrics } from "../../surface/install/install-text-metrics.js";
import { installCanvasGradient } from "../../surface/install/install-canvas-gradient.js";
import { installCanvasPattern } from "../../surface/install/install-canvas-pattern.js";
import { installPath2D } from "../../surface/install/install-path-2d.js";
import {
  installDOMPointReadOnly,
} from "../../surface/install/install-dom-point-read-only.js";
import { installDOMPoint } from "../../surface/install/install-dom-point.js";
import {
  installDOMMatrixReadOnly,
} from "../../surface/install/install-dom-matrix-read-only.js";
import { installDOMMatrix } from "../../surface/install/install-dom-matrix.js";
import {
  installDOMRectReadOnly,
} from "../../surface/install/install-dom-rect-read-only.js";
import { installDOMRect } from "../../surface/install/install-dom-rect.js";
import { installDOMRectList } from "../../surface/install/install-dom-rect-list.js";
import {
  installOffscreenCanvasRenderingContext2D,
} from "../../surface/install/install-offscreen-canvas-rendering-context-2d.js";
import { installOffscreenCanvas } from "../../surface/install/install-offscreen-canvas.js";
import { installCodecs } from "../../surface/install/install-codecs.js";
import { configureCodecsProfile } from "../../surface/api/codecs/codecs-runtime.js";
import { installMediaSource } from "../../surface/install/install-media-source.js";
import { installWebRTC } from "../../surface/install/install-webrtc.js";
import { installUserAgency } from "../../surface/install/install-user-agency.js";
import {
  installExternalDeviceAPIs,
} from "../../surface/install/install-external-device.js";
import { installFileSystem } from "../../surface/install/install-file-system.js";
import { installMediaAgency } from "../../surface/install/install-media-agency.js";
import { installOfflineSocket } from "../../surface/install/install-offline-socket.js";
import { installGeneralEvents } from "../../surface/install/install-general-events.js";
import { installDOMUtilities } from "../../surface/install/install-dom-utilities.js";
import { installTrustedTypes } from "../../surface/install/install-trusted-types.js";
import { installURLPattern } from "../../surface/install/install-url-pattern.js";
import { installCoordination } from "../../surface/install/install-coordination.js";
import { installCacheAPI } from "../../surface/install/install-cache-api.js";
import { installScheduling } from "../../surface/install/install-scheduling.js";
import {
  installNavigatorServices,
} from "../../surface/install/install-navigator-services.js";
import {
  installLongtailEvents,
} from "../../surface/install/install-longtail-events.js";
import { installReporting } from "../../surface/install/install-reporting.js";
import { installIndexedDB } from "../../surface/install/install-indexed-db.js";
import { installPressure } from "../../surface/install/install-pressure.js";
import {
  installServiceWorkerManagers,
} from "../../surface/install/install-service-worker-managers.js";
import {
  installBackgroundFetch,
} from "../../surface/install/install-background-fetch.js";
import { installWebTransport } from "../../surface/install/install-web-transport.js";
import {
  installLocalFonts,
} from "../../surface/install/install-local-fonts.js";
import { installOrigin } from "../../surface/install/install-origin.js";
import {
  installErrorObjects,
} from "../../surface/install/install-error-objects.js";
import {
  installCaptureTargets,
} from "../../surface/install/install-capture-targets.js";
import {
  installObservable,
} from "../../surface/install/install-observable.js";
import {
  installWGSLLanguageFeatures,
} from "../../surface/install/install-wgsl-language-features.js";
import {
  installPerformanceLongtail,
} from "../../surface/install/install-performance-longtail.js";
import {
  installCSSTransformValues,
} from "../../surface/install/install-css-transform-values.js";
import { installFileList } from "../../surface/install/install-file-list.js";
import {
  installObserverGeometry,
} from "../../surface/install/install-observer-geometry.js";
import {
  installNavigatorUAData,
} from "../../surface/install/install-navigator-ua-data.js";
import { installServiceWorker } from "../../surface/install/install-service-worker.js";
import {
  installWorkerOnlyAPIs,
} from "../../surface/api/worker/worker-only-runtime.js";
import {
  finalizeWorkerSurfaceOrder,
} from "../../surface/install/finalize-worker-surface-order.js";
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
import {
  connectSharedWorker,
  dispatchServiceWorkerLifecycle,
  installDedicatedWorkerGlobal,
  receiveOwnerMessage,
} from "../../surface/api/worker/worker-global-runtime.js";
import {
  clearAllTimers,
  nextTimerDelay,
  runDueTimers,
} from "../../infra/scheduler/timer-state.js";
import { configureTimingProfile } from "../../infra/scheduler/monotonic-clock.js";

export function bootstrapWorker(
  traceEnabled,
  maxTraceEntries,
  workerUrl,
  workerName,
  workerType,
  workerKind,
  navigatorUserAgent,
  navigatorPlatform,
  navigatorLanguages,
  navigatorLanguage,
  navigatorHardwareConcurrency,
  navigatorDeviceMemory,
  replay,
  networkRequestRecorder,
  postMessage,
  close,
  nestedWorkerFactory,
  nestedSharedWorkerFactory,
  broadcastConnector,
  renderingProfile,
  capabilitiesProfile,
  objectURLRegistry,
  browserMajorVersion = 150,
  timingProfile = null,
  navigatorMetadata = null,
  workerDepth = 0,
  timezone = null,
  cryptoEntropy = null,
) {
  hideNodeGlobals();
  configureTimingProfile(timingProfile);
  configureBlobRegistry(objectURLRegistry);
  configureObjectURLRegistry(objectURLRegistry);
  installNativeFunctionToString();
  installErrorStackGuard(browserMajorVersion >= 151);
  installModernBuiltins();
  installDateProfile();
  installIntlV8BreakIterator(browserMajorVersion >= 151);
  // Worker Realm 与 root 对齐：Intl 默认 locale 跟随 navigator.language
  // （IKFD9O）。worker_threads 与宿主共享 ICU，线程级 TZ 改不了默认时区，
  // 因此默认 timeZone 必须在 Realm 内 hook（install-intl-timezone.js）。
  installIntlDefaultLocale(navigatorLanguage);
  installIntlDefaultTimeZone(timezone ?? navigatorMetadata?.timezone ?? null);
  configureTrace(traceEnabled, maxTraceEntries);
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
  configureGPUProfile(renderingProfile);
  configureWebGLProfile(renderingProfile);
  configureCodecsProfile(capabilitiesProfile?.media);
  configureNavigation(
    workerUrl.startsWith("data:")
      ? "https://sandbox.invalid/"
      : workerUrl,
  );
  installConsole();
  installDOMException();
  installEventTarget();
  installGPU();
  installWebGL();
  installEvent();
  installCustomEvent();
  installImageBitmap();
  installImageBitmapRenderingContext();
  installCreateMonitor();
  installImageData();
  installTextMetrics();
  installCanvasGradient();
  installCanvasPattern();
  installPath2D();
  installDOMPointReadOnly();
  installDOMPoint();
  installDOMMatrixReadOnly();
  installDOMMatrix();
  installDOMRectReadOnly();
  installDOMRect();
  installDOMRectList();
  installOffscreenCanvasRenderingContext2D();
  installOffscreenCanvas();
  installCreateImageBitmapGlobal();
  installTemporalGlobal();
  installCodecs();
  installHeaders();
  installFormData();
  installStreams();
  installBlob();
  installFileAndReader();
  installRequestResponse();
  configureFetchReplay(replay, networkRequestRecorder);
  installFetch();
  installXMLHttpRequest();
  installPerformanceEntry(browserMajorVersion >= 151);
  installPerformanceMark();
  installPerformanceMeasure();
  installPerformance({
    edge151Surface: browserMajorVersion >= 151,
    includeNavigationEntry: false,
  });
  installWindowTimers();
  installURLSearchParams();
  installURL();
  installTextEncoding();
  installTextStreams();
  installCompressionStreams();
  installCrypto(globalThis, cryptoEntropy);
  installBase64();
  installAbort();
  installStructuredClone();
  installMediaSource();
  installWebRTC();
  installUserAgency();
  installExternalDeviceAPIs();
  installFileSystem();
  installMediaAgency();
  installOfflineSocket();
  installGeneralEvents(browserMajorVersion >= 151);
  installDOMUtilities();
  installTrustedTypes();
  installURLPattern();
  installCoordination();
  installCacheAPI();
  installScheduling();
  installNavigatorServices();
  installLongtailEvents();
  installReporting();
  installIndexedDB();
  installPressure();
  installServiceWorkerManagers();
  installBackgroundFetch();
  installWebTransport();
  installLocalFonts({ exposeGlobal: browserMajorVersion >= 151 });
  installOrigin();
  installErrorObjects();
  installCaptureTargets();
  installObservable();
  installWGSLLanguageFeatures();
  installPerformanceLongtail();
  installCSSTransformValues();
  installFileList();
  installObserverGeometry();
  installNavigatorUAData();
  installServiceWorker();
  installWorkerOnlyAPIs();
  configureBroadcastConnector(broadcastConnector);
  installMessaging();
  configureWorkers(nestedWorkerFactory, workerUrl, workerDepth);
  installWorker();
  configureSharedWorkers(nestedSharedWorkerFactory, workerUrl, workerDepth);
  installSharedWorker();
  installDedicatedWorkerGlobal({
    kind: workerKind,
    name: workerName,
    url: workerUrl,
    type: workerType,
    replay,
    navigatorProfile: {
      ...navigatorMetadata,
      userAgent: navigatorUserAgent,
      platform: navigatorPlatform,
      languages: decodeStringList(navigatorLanguages),
      language: navigatorLanguage,
      hardwareConcurrency: navigatorHardwareConcurrency,
      deviceMemory: navigatorDeviceMemory,
      online: capabilitiesProfile?.network?.online ?? true,
    },
    postMessage,
    close,
  });
  installWorkerFontFaceSet({ exposeGlobal: browserMajorVersion >= 151 });
  if (workerKind === "dedicated") finalizeWorkerSurfaceOrder();
}

export function receiveOwnerMessageEvent(message, options, ports) {
  receiveOwnerMessage(message, options, ports);
}

export function connectSharedWorkerConnection(sendToOwner) {
  return connectSharedWorker(sendToOwner);
}

export function runServiceWorkerLifecycle(type) {
  return dispatchServiceWorkerLifecycle(type);
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
  };
}

export function clearScheduledTasks() {
  clearAllTimers();
  closeAllBroadcastChannels();
  terminateAllWorkers();
  terminateAllSharedWorkers();
}

function decodeStringList(encoded) {
  const output = [];
  let index = 0;
  while (index < encoded.length) {
    const colon = encoded.indexOf(":", index);
    if (colon < 0) break;
    const length = Number(encoded.slice(index, colon));
    const start = colon + 1;
    output.push(encoded.slice(start, start + length));
    index = start + length;
  }
  return output;
}
