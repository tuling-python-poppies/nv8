import vm from "node:vm";
import { auditRealmGlobals } from "./global-audit.js";
import { RealmModuleLoader } from "./module-loader.js";

export async function createWorkletRealm({
  label,
  kind,
  origin,
  traceEnabled = false,
  maxTraceEntries = 100_000,
  objectURLRegistry = null,
}) {
  const context = vm.createContext(Object.create(null), {
    name: label,
    origin,
    codeGeneration: {
      strings: true,
      wasm: true,
    },
  });
  const moduleLoader = new RealmModuleLoader(context);
  const bootstrap = await moduleLoader.importInternalAsync(
    "edge-internal:bootstrap-worklet",
  );
  bootstrap.namespace.bootstrapWorklet(
    `${kind}`,
    traceEnabled,
    maxTraceEntries,
    objectURLRegistry,
  );
  auditRealmGlobals(context);
  return {
    context,
    moduleLoader,
    bootstrap: bootstrap.namespace,
    label,
    origin,
    pageUrl: "",
    destroyed: false,
  };
}
