import { hideNodeGlobals } from "./hide-node-globals.js";
import {
  installErrorStackGuard,
} from "./install-error-stack-guard.js";
import { installNativeFunctionToString } from "../webidl/native-function.js";
import {
  installModernBuiltins,
} from "../install/install-modern-builtins.js";
import { installDateProfile } from "../install/install-date-profile.js";
import {
  installIntlV8BreakIterator,
} from "../install/install-intl-v8-break-iterator.js";
import {
  clearTrace,
  configureTrace,
  disableTrace,
  enableTrace,
  readTrace,
} from "../trace/trace-state.js";
import { configureNavigation } from "../navigation/navigation-state.js";
import {
  configureNavigatorProfile,
} from "../api/navigator/navigator-state.js";
import { installConsole } from "../install/install-console.js";
import { installDOMException } from "../install/install-dom-exception.js";
import { installEventTarget } from "../install/install-event-target.js";
import { installEvent } from "../install/install-event.js";
import { installCustomEvent } from "../install/install-custom-event.js";
import { installHeaders } from "../install/install-headers.js";
import { installFormData } from "../install/install-form-data.js";
import { installStreams } from "../install/install-streams.js";
import { installBlob } from "../install/install-blob.js";
import { configureBlobRegistry } from "../api/file/blob-state.js";
import { installFileAndReader } from "../install/install-file-reader.js";
import { installRequestResponse } from "../install/install-request-response.js";
import { installXMLHttpRequest } from "../install/install-xml-http-request.js";
import {
  configureFetchReplay,
  installFetch,
} from "../api/fetch/fetch-replay.js";
import { installPerformanceEntry } from "../install/install-performance-entry.js";
import { installPerformanceMark } from "../install/install-performance-mark.js";
import { installPerformanceMeasure } from "../install/install-performance-measure.js";
import { installPerformance } from "../install/install-performance.js";
import { installWindowTimers } from "../install/install-window-timers.js";
import { installURLSearchParams } from "../install/install-url-search-params.js";
import { installURL } from "../install/install-url.js";
import {
  configureObjectURLRegistry,
} from "../api/url/url-state.js";
import { installTextEncoding } from "../install/install-text-encoding.js";
import { installTextStreams } from "../install/install-text-streams.js";
import { installCompressionStreams } from "../install/install-compression-streams.js";
import { installCrypto } from "../install/install-crypto.js";
import { installBase64 } from "../install/install-base64.js";
import { installAbort } from "../install/install-abort.js";
import { installStructuredClone } from "../api/clone/structured-clone.js";
import { installMessaging } from "../install/install-messaging.js";
import {
  closeAllBroadcastChannels,
  configureBroadcastConnector,
} from "../api/messaging/messaging-runtime.js";
import { installGPU } from "../install/install-gpu.js";
import { configureGPUProfile } from "../api/gpu/gpu-runtime.js";
import { installWebGL } from "../install/install-webgl.js";
import { configureWebGLProfile } from "../api/webgl/webgl-runtime.js";
import { installImageBitmap } from "../install/install-image-bitmap.js";
import {
  installWorkerFontFaceSet,
} from "../api/local-fonts/font-face-set-runtime.js";
import {
  installImageBitmapRenderingContext,
} from "../install/install-image-bitmap-rendering-context.js";
import {
  installCreateImageBitmapGlobal,
  installTemporalGlobal,
} from "../api/window/window-legacy-globals-runtime.js";
import {
  installCreateMonitor,
} from "../install/install-execution-observers.js";
import { installImageData } from "../install/install-image-data.js";
import { installTextMetrics } from "../install/install-text-metrics.js";
import { installCanvasGradient } from "../install/install-canvas-gradient.js";
import { installCanvasPattern } from "../install/install-canvas-pattern.js";
import { installPath2D } from "../install/install-path-2d.js";
import {
  installDOMPointReadOnly,
} from "../install/install-dom-point-read-only.js";
import { installDOMPoint } from "../install/install-dom-point.js";
import {
  installDOMMatrixReadOnly,
} from "../install/install-dom-matrix-read-only.js";
import { installDOMMatrix } from "../install/install-dom-matrix.js";
import {
  installDOMRectReadOnly,
} from "../install/install-dom-rect-read-only.js";
import { installDOMRect } from "../install/install-dom-rect.js";
import { installDOMRectList } from "../install/install-dom-rect-list.js";
import {
  installOffscreenCanvasRenderingContext2D,
} from "../install/install-offscreen-canvas-rendering-context-2d.js";
import { installOffscreenCanvas } from "../install/install-offscreen-canvas.js";
import { installCodecs } from "../install/install-codecs.js";
import { configureCodecsProfile } from "../api/codecs/codecs-runtime.js";
import { installMediaSource } from "../install/install-media-source.js";
import { installWebRTC } from "../install/install-webrtc.js";
import { installUserAgency } from "../install/install-user-agency.js";
import {
  installExternalDeviceAPIs,
} from "../install/install-external-device.js";
import { installFileSystem } from "../install/install-file-system.js";
import { installMediaAgency } from "../install/install-media-agency.js";
import { installOfflineSocket } from "../install/install-offline-socket.js";
import { installGeneralEvents } from "../install/install-general-events.js";
import { installDOMUtilities } from "../install/install-dom-utilities.js";
import { installTrustedTypes } from "../install/install-trusted-types.js";
import { installURLPattern } from "../install/install-url-pattern.js";
import { installCoordination } from "../install/install-coordination.js";
import { installCacheAPI } from "../install/install-cache-api.js";
import { installScheduling } from "../install/install-scheduling.js";
import {
  installNavigatorServices,
} from "../install/install-navigator-services.js";
import {
  installLongtailEvents,
} from "../install/install-longtail-events.js";
import { installReporting } from "../install/install-reporting.js";
import { installIndexedDB } from "../install/install-indexed-db.js";
import { installPressure } from "../install/install-pressure.js";
import {
  installServiceWorkerManagers,
} from "../install/install-service-worker-managers.js";
import {
  installBackgroundFetch,
} from "../install/install-background-fetch.js";
import { installWebTransport } from "../install/install-web-transport.js";
import {
  installLocalFonts,
} from "../install/install-local-fonts.js";
import { installOrigin } from "../install/install-origin.js";
import {
  installErrorObjects,
} from "../install/install-error-objects.js";
import {
  installCaptureTargets,
} from "../install/install-capture-targets.js";
import {
  installObservable,
} from "../install/install-observable.js";
import {
  installWGSLLanguageFeatures,
} from "../install/install-wgsl-language-features.js";
import {
  installPerformanceLongtail,
} from "../install/install-performance-longtail.js";
import {
  installCSSTransformValues,
} from "../install/install-css-transform-values.js";
import { installFileList } from "../install/install-file-list.js";
import {
  installObserverGeometry,
} from "../install/install-observer-geometry.js";
import {
  installNavigatorUAData,
} from "../install/install-navigator-ua-data.js";
import { installServiceWorker } from "../install/install-service-worker.js";
import {
  installWorkerOnlyAPIs,
} from "../api/worker/worker-only-runtime.js";
import {
  finalizeWorkerSurfaceOrder,
} from "../install/finalize-worker-surface-order.js";
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
import {
  connectSharedWorker,
  dispatchServiceWorkerLifecycle,
  installDedicatedWorkerGlobal,
  receiveOwnerMessage,
} from "../api/worker/worker-global-runtime.js";
import {
  clearAllTimers,
  nextTimerDelay,
  runDueTimers,
} from "../scheduler/timer-state.js";
import { configureTimingProfile } from "../scheduler/monotonic-clock.js";

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
  installCrypto();
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
  configureWorkers(nestedWorkerFactory, workerUrl);
  installWorker();
  configureSharedWorkers(nestedSharedWorkerFactory, workerUrl);
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
