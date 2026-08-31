import { installAbort } from '../../install/install-abort.js';

const ABORT_INSTALLER_URL = new URL(
  '../../install/install-abort.js',
  import.meta.url,
);

/**
 * @nv8/plugin-abort
 *
 * AbortController and AbortSignal primitives shared by Fetch, Streams, and
 * other asynchronous browser capabilities.
 */
export const abortPlugin = {
  id: '@nv8/plugin-abort',
  version: '1.0.0',
  capabilities: ['abort.base'],
  dependencies: ['@nv8/plugin-events', '@nv8/plugin-webidl'],
  supports: { realms: ['root', 'iframe', 'worker', 'worklet'] },

  install(sandbox, registry) {
    installAbort();
    registry.reserveGlobalSurface(this.id, 'AbortController');
    registry.reserveGlobalSurface(this.id, 'AbortSignal');
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(ABORT_INSTALLER_URL);
    if (!module?.namespace?.installAbort) {
      throw new Error('Realm module loader cannot install Abort');
    }
    module.namespace.installAbort();
    context.exports.abort = true;
  },

  reset(context) {},
  dispose(context) {},
};
