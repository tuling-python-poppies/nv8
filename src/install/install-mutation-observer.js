import {
  finishMutationObserverConstructor,
  installMutationObserverConstructor,
} from "../api/dom/mutation-observer-constructor.js";
import {
  installMutationObserverDisconnect,
} from "../api/dom/mutation-observer-disconnect.js";
import {
  installMutationObserverObserve,
} from "../api/dom/mutation-observer-observe.js";
import {
  installMutationObserverTakeRecords,
} from "../api/dom/mutation-observer-take-records.js";

export function installMutationObserver() {
  installMutationObserverConstructor();
  installMutationObserverDisconnect();
  installMutationObserverObserve();
  installMutationObserverTakeRecords();
  finishMutationObserverConstructor();
}
