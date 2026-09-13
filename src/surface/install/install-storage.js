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

export function installStorage(realm = globalThis) {
  installStorageConstructor();
  installStorageLength();
  installStorageClear();
  installStorageGetItem();
  installStorageKey();
  installStorageRemoveItem();
  installStorageSetItem();
  installStorageConstructorBacklink();
  // 不在这里预创建 Storage：legacy 子 Realm 的 bootstrap 顺序里
  // `configureWindowMessaging` 晚于本函数，过早实例化会把共享容器建在
  // 子 Realm 自己身上（parent 还是占位数据属性），同源共享失效。
  // 全局 getter 在页面首次访问时再解析。
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
