const WORKER_INSTALLER_URL = new URL(
  '../../install/install-worker-capabilities.js',
  import.meta.url,
);
const WORKER_GLOBAL_INSTALLER_URL = new URL(
  '../../install/install-worker-global.js',
  import.meta.url,
);
const WORKER_RUNTIME_URL = new URL(
  '../../api/worker/worker-runtime.js',
  import.meta.url,
);
const SHARED_WORKER_RUNTIME_URL = new URL(
  '../../api/worker/shared-worker-runtime.js',
  import.meta.url,
);

export const workerPlugin = {
  id: '@nv8/plugin-worker',
  version: '1.0.0',
  capabilities: ['worker.dedicated', 'worker.shared'],
  dependencies: [
    '@nv8/plugin-events',
    '@nv8/plugin-webidl',
    '@nv8/plugin-messaging',
  ],
  supports: { realms: ['root', 'iframe', 'worker'] },

  install(context) {
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'Worker');
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'SharedWorker');
    context.exports.worker = true;
  },

  async activate(context) {
    if (context.realm?.type === 'worker' && context.runtime?.workerGlobal) {
      const installer = await context.moduleLoader?.importUrlAsync(
        WORKER_GLOBAL_INSTALLER_URL,
      );
      if (!installer?.namespace?.installWorkerGlobal) {
        throw new Error('Realm module loader cannot install Worker global');
      }
      installer.namespace.installWorkerGlobal(context.runtime.workerGlobal);
      const capabilities = await context.moduleLoader?.importUrlAsync(WORKER_INSTALLER_URL);
      capabilities?.namespace?.installWorkerCapabilities?.({
        workerFactory: context.runtime?.workerFactory ?? null,
        sharedWorkerFactory: context.runtime?.sharedWorkerFactory ?? null,
        baseUrl: context.pageUrl,
      });
      context.exports.workerGlobal = true;
      return;
    }

    const installer = await context.moduleLoader?.importUrlAsync(WORKER_INSTALLER_URL);
    if (!installer?.namespace?.installWorkerCapabilities) {
      throw new Error('Realm module loader cannot install Worker APIs');
    }
    installer.namespace.installWorkerCapabilities({
      workerFactory: context.runtime?.workerFactory ?? null,
      sharedWorkerFactory: context.runtime?.sharedWorkerFactory ?? null,
      baseUrl: context.pageUrl,
    });
    context.exports.worker = true;
  },

  async dispose(context) {
    const runtime = await context.moduleLoader?.importUrlAsync(WORKER_RUNTIME_URL);
    const sharedRuntime = await context.moduleLoader?.importUrlAsync(
      SHARED_WORKER_RUNTIME_URL,
    );
    runtime?.namespace?.terminateAllWorkers?.();
    sharedRuntime?.namespace?.terminateAllSharedWorkers?.();
  },
};
