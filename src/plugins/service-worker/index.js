const SERVICE_WORKER_INSTALLER_URL = new URL(
  '../../surface/install/install-service-worker-capabilities.js',
  import.meta.url,
);

export const serviceWorkerPlugin = {
  id: '@nv8/plugin-service-worker',
  version: '1.0.0',
  capabilities: ['service-worker.base'],
  dependencies: [
    '@nv8/plugin-events',
    '@nv8/plugin-dom-exception',
    '@nv8/plugin-webidl',
    '@nv8/plugin-navigator',
    '@nv8/plugin-fetch',
    '@nv8/plugin-worker',
  ],
  supports: { realms: ['root', 'iframe'] },

  install(context) {
    context.surfaceRegistry?.reserveGlobalSurface(
      this.id,
      'ServiceWorkerRegistration',
    );
    context.surfaceRegistry?.reserveGlobalSurface(
      this.id,
      'ServiceWorkerContainer',
    );
    context.exports.serviceWorker = true;
  },

  async activate(context) {
    const installer = await context.moduleLoader?.importUrlAsync(
      SERVICE_WORKER_INSTALLER_URL,
    );
    if (!installer?.namespace?.installServiceWorkerCapabilities) {
      throw new Error('Realm module loader cannot install Service Worker APIs');
    }
    installer.namespace.installServiceWorkerCapabilities({
      serviceWorkerFactory: context.runtime?.serviceWorkerFactory ?? null,
      pageUrl: context.runtime?.serviceWorkerPageUrl ?? context.pageUrl,
      profile: context.runtime?.serviceWorkerProfile ?? null,
    });
    context.exports.serviceWorker = true;
  },

  async dispose(context) {
    const installer = await context.moduleLoader?.importUrlAsync(
      SERVICE_WORKER_INSTALLER_URL,
    );
    installer?.namespace?.resetServiceWorkerCapabilities?.();
  },
};
