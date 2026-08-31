import { localStorage } from '../api/storage/local-storage-global-getter.js';
import { sessionStorage } from '../api/storage/session-storage-global-getter.js';
import { installStorageClear } from '../api/storage/storage-clear.js';
import {
  installStorageConstructor,
  installStorageConstructorBacklink,
} from '../api/storage/storage-constructor.js';
import { installStorageGetItem } from '../api/storage/storage-get-item.js';
import { installStorageKey } from '../api/storage/storage-key.js';
import { installStorageLength } from '../api/storage/storage-length-getter.js';
import { installStorageRemoveItem } from '../api/storage/storage-remove-item.js';
import { installStorageSetItem } from '../api/storage/storage-set-item.js';
import {
  currentLocalStorage,
  currentSessionStorage,
} from '../api/storage/storage-state.js';

export function installStorage(realm = globalThis) {
  installStorageConstructor();
  installStorageLength();
  installStorageClear();
  installStorageGetItem();
  installStorageKey();
  installStorageRemoveItem();
  installStorageSetItem();
  installStorageConstructorBacklink();
  currentLocalStorage();
  currentSessionStorage();
  Object.defineProperty(globalThis, 'localStorage', {
    get: localStorage,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'sessionStorage', {
    get: sessionStorage,
    enumerable: true,
    configurable: true,
  });
}
