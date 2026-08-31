import { configureNavigation } from '../navigation/navigation-state.js';

export function installCoreNavigation(url, options = {}) {
  configureNavigation(url, options);
}
