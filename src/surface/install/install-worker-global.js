import {
  installDedicatedWorkerGlobal,
} from '../api/worker/worker-global-runtime.js';

export function installWorkerGlobal(options = {}) {
  installDedicatedWorkerGlobal(options);
}
