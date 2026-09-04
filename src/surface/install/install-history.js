import { installHistoryBack } from "../api/history/history-back.js";
import {
  installHistoryConstructor,
  installHistoryConstructorBacklink,
} from "../api/history/history-constructor.js";
import { installHistoryForward } from "../api/history/history-forward.js";
import {
  globalHistory,
} from "../api/history/history-global-getter.js";
import { installHistoryGo } from "../api/history/history-go.js";
import {
  installHistoryLength,
} from "../api/history/history-length-getter.js";
import {
  installHistoryPushState,
} from "../api/history/history-push-state.js";
import {
  installHistoryReplaceState,
} from "../api/history/history-replace-state.js";
import {
  installHistoryScrollRestoration,
} from "../api/history/history-scroll-restoration-property.js";
import {
  installHistoryState,
} from "../api/history/history-state-getter.js";
import { createHistory } from "../api/history/history-state.js";

export function installHistory() {
  installHistoryConstructor();
  installHistoryLength();
  installHistoryScrollRestoration();
  installHistoryState();
  installHistoryBack();
  installHistoryForward();
  installHistoryGo();
  installHistoryPushState();
  installHistoryReplaceState();
  installHistoryConstructorBacklink();
  createHistory();
  Object.defineProperty(globalThis, "history", {
    get: globalHistory,
    enumerable: true,
    configurable: true,
  });
}
