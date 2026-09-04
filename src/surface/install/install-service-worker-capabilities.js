import { installServiceWorker } from './install-service-worker.js';
import { installServiceWorkerManagers } from './install-service-worker-managers.js';
import { configureServiceWorkers } from '../api/worker/service-worker-runtime.js';

export function installServiceWorkerCapabilities({
  serviceWorkerFactory = null,
  pageUrl = 'https://sandbox.test/',
  profile = null,
} = {}) {
  configureServiceWorkers(serviceWorkerFactory, pageUrl, profile);
  installServiceWorkerManagers();
  installServiceWorker();
}

export function resetServiceWorkerCapabilities() {
  configureServiceWorkers(null, 'https://sandbox.test/', { enabled: false });
}
