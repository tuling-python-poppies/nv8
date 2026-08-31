import { installWorklet } from './install-worklet.js';
import { configureWorklets } from '../api/worklet/worklet-runtime.js';

export function installWorkletCapabilities({
  workletFactory = null,
  baseUrl = 'https://sandbox.test/',
} = {}) {
  configureWorklets(workletFactory, baseUrl);
  installWorklet();
}

export function resetWorkletCapabilities() {
  configureWorklets(null, 'https://sandbox.test/');
}
