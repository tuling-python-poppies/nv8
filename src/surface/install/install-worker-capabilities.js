import { installWorker } from './install-worker.js';
import { installSharedWorker } from './install-shared-worker.js';
import { configureWorkers } from '../api/worker/worker-runtime.js';
import { configureSharedWorkers } from '../api/worker/shared-worker-runtime.js';

export function installWorkerCapabilities({
  workerFactory = null,
  sharedWorkerFactory = null,
  baseUrl = 'https://sandbox.test/',
  workerDepth = 0,
} = {}) {
  configureWorkers(workerFactory, baseUrl, workerDepth);
  configureSharedWorkers(sharedWorkerFactory, baseUrl, workerDepth);
  installWorker();
  installSharedWorker();
}

export function resetWorkerCapabilities() {
  configureWorkers(null, 'https://sandbox.test/');
  configureSharedWorkers(null, 'https://sandbox.test/');
}
