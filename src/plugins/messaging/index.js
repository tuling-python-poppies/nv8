const MESSAGING_INSTALLER_URL = new URL(
  '../../surface/install/install-messaging.js',
  import.meta.url,
);
const MESSAGING_RUNTIME_URL = new URL(
  '../../surface/api/messaging/messaging-runtime.js',
  import.meta.url,
);

export const messagingPlugin = {
  id: '@nv8/plugin-messaging',
  version: '1.0.0',
  capabilities: ['messaging.base'],
  dependencies: ['@nv8/plugin-events', '@nv8/plugin-webidl'],
  supports: { realms: ['root', 'iframe', 'worker'] },

  install(context) {
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'MessageChannel');
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'MessagePort');
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'MessageEvent');
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'BroadcastChannel');
    context.exports.messaging = true;
  },

  async activate(context) {
    const installer = await context.moduleLoader?.importUrlAsync(MESSAGING_INSTALLER_URL);
    const runtime = await context.moduleLoader?.importUrlAsync(MESSAGING_RUNTIME_URL);
    if (!installer?.namespace?.installMessaging || !runtime?.namespace) {
      throw new Error('Realm module loader cannot install Messaging');
    }
    installer.namespace.installMessaging();
    runtime.namespace.configureBroadcastConnector(
      context.runtime?.broadcastConnector ?? null,
    );
    context.exports.messaging = true;
  },

  async dispose(context) {
    const runtime = await context.moduleLoader?.importUrlAsync(MESSAGING_RUNTIME_URL);
    runtime?.namespace?.closeAllBroadcastChannels?.();
  },
};
