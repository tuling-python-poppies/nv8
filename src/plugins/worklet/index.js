const WORKLET_INSTALLER_URL = new URL(
  '../../install/install-worklet-capabilities.js',
  import.meta.url,
);

export const workletPlugin = {
  id: '@nv8/plugin-worklet',
  version: '1.0.0',
  capabilities: ['worklet.base'],
  dependencies: ['@nv8/plugin-webidl'],
  supports: { realms: ['root', 'iframe'] },

  install(context) {
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'Worklet');
    context.surfaceRegistry?.reserveGlobalSurface(this.id, 'AudioWorklet');
    context.exports.worklet = true;
  },

  async activate(context) {
    const installer = await context.moduleLoader?.importUrlAsync(WORKLET_INSTALLER_URL);
    if (!installer?.namespace?.installWorkletCapabilities) {
      throw new Error('Realm module loader cannot install Worklet APIs');
    }
    installer.namespace.installWorkletCapabilities({
      workletFactory: context.runtime?.workletFactory ?? null,
      baseUrl: context.pageUrl,
    });
    context.exports.worklet = true;
  },
};
