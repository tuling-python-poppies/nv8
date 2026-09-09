import vm from "node:vm";
import { auditRealmGlobals } from "./global-audit.js";
import { RealmModuleLoader } from "./module-loader.js";

export async function createWorkerRealm({
  label,
  workerUrl,
  workerName = "",
  workerType = "classic",
  workerKind = "dedicated",
  traceEnabled = false,
  maxTraceEntries = 100_000,
  navigatorProfile = null,
  replay = [],
  networkRequestRecorder = null,
  postMessage,
  close,
  nestedWorkerFactory,
  nestedSharedWorkerFactory,
  broadcastConnector = null,
  renderingProfile = null,
  capabilitiesProfile = null,
  browserMajorVersion = 150,
  timingProfile = null,
  objectURLRegistry = null,
  workerDepth = 0,
}) {
  const parsed = new URL(workerUrl);
  const sandboxGlobal = Object.create(null);
  const context = vm.createContext(sandboxGlobal, {
    name: label,
    origin: parsed.origin,
    codeGeneration: {
      strings: true,
      wasm: true,
    },
  });
  const moduleLoader = new RealmModuleLoader(context);
  const bootstrap = await moduleLoader.importInternalAsync(
    "edge-internal:bootstrap-worker",
  );
  bootstrap.namespace.bootstrapWorker(
    traceEnabled,
    maxTraceEntries,
    parsed.href,
    `${workerName}`,
    `${workerType}`,
    `${workerKind}`,
    navigatorProfile?.userAgent
      ?? "Mozilla/5.0 Chrome/150.0.0.0 Safari/537.36",
    navigatorProfile?.platform ?? "Win32",
    encodeStringList(navigatorProfile?.languages ?? ["en-US", "en"]),
    navigatorProfile?.language ?? "en-US",
    navigatorProfile?.hardwareConcurrency ?? 8,
    navigatorProfile?.deviceMemory ?? 8,
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
    browserMajorVersion,
    timingProfile,
    navigatorProfile,
    workerDepth,
  );
  auditRealmGlobals(context);
  return {
    context,
    moduleLoader,
    bootstrap: bootstrap.namespace,
    label,
    origin: parsed.origin,
    pageUrl: parsed.href,
    destroyed: false,
  };
}

function encodeStringList(values) {
  let output = "";
  for (const value of values) output += `${value.length}:${value}`;
  return output;
}
