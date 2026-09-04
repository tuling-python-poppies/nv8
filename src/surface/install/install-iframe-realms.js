import { configureIFrameRealms } from '../api/dom/html-iframe-element-realm-state.js';

export function installIFrameRealms(factory, pageUrl) {
  configureIFrameRealms(factory, pageUrl);
}
