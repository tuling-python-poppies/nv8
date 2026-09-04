import { configureNavigation } from '../../infra/navigation/navigation-state.js';

export function installCoreNavigation(url, options = {}) {
  configureNavigation(url, options);
}
