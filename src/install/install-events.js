import { installCustomEvent } from './install-custom-event.js';
import { installEvent } from './install-event.js';
import { installEventTarget } from './install-event-target.js';
import { installMutationObserver } from './install-mutation-observer.js';
import { installMutationRecord } from './install-mutation-record.js';

export function installEvents() {
  installEventTarget();
  installEvent();
  installMutationRecord();
  installMutationObserver();
  installCustomEvent();
}
