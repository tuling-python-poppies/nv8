import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { Event } from "../event/event-constructor.js";
import { currentHref, navigationCurrentIndex, navigationEntriesSnapshot, pushHistoryState, replaceHistoryState, traverseHistoryToIndex } from "../../../infra/navigation/navigation-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
let singleton = null;

export function Navigation() { illegalConstructor("Navigation", new.target); }
export function NavigationHistoryEntry() { illegalConstructor("NavigationHistoryEntry", new.target); }
export function NavigationCurrentEntryChangeEvent(type, init) {
  requireNew(new.target, "NavigationCurrentEntryChangeEvent");
  initializeNavigationEvent(this, type, init, {
    navigationType: `${init?.navigationType ?? "push"}`,
    from: init?.from ?? null,
  });
}
export function NavigateEvent(type, init) {
  requireNew(new.target, "NavigateEvent");
  initializeNavigateEvent(this, type, init);
}
export function NavigationDestination() { illegalConstructor("NavigationDestination", new.target); }
export function NavigationTransition() { illegalConstructor("NavigationTransition", new.target); }
export function NavigationActivation() { illegalConstructor("NavigationActivation", new.target); }
export function NavigationPrecommitController() { illegalConstructor("NavigationPrecommitController", new.target); }

const navigationAPIConstructors = Object.freeze([
  Navigation, NavigationHistoryEntry, NavigationCurrentEntryChangeEvent,
  NavigateEvent, NavigationDestination, NavigationTransition,
  NavigationActivation, NavigationPrecommitController,
]);
for (const Constructor of navigationAPIConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createNavigation() {
  if (singleton !== null) return singleton;
  const value = Object.create(Navigation.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "navigation",
    object: value,
    entriesByKey: new Map(),
    transition: null,
    activation: null,
    handlers: handlers([
      "onnavigate", "onnavigatesuccess", "onnavigateerror",
      "oncurrententrychange",
    ]),
  });
  singleton = value;
  syncEntries(state.get(value));
  return value;
}

export function navigationAPIProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "navigation") {
    const entries = syncEntries(record);
    const index = navigationCurrentIndex();
    if (name === "currentEntry") return entries[index] ?? null;
    if (name === "canGoBack") return index > 0;
    if (name === "canGoForward") return index < entries.length - 1;
  }
  return record[name];
}

export function setNavigationAPIProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
  if (record.kind === "entry" && name === "ondispose") {
    record.ondispose = typeof input === "function" ? input : null;
  }
}

export function navigationAPIOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "navigation") return navigationOperation(record, name, args);
  if (["entry", "destination"].includes(record.kind) && name === "getState") {
    return clone(record.entryState);
  }
  if (record.kind === "navigateEvent") {
    if (name === "intercept") {
      if (!record.canIntercept) throw new DOMException("Navigation cannot be intercepted.", "SecurityError");
      const options = args[0] ?? {};
      if (typeof options.handler === "function") record.interceptors.push(options.handler);
      return;
    }
    if (name === "scroll") {
      record.scrolled = true;
      return;
    }
  }
  if (record.kind === "precommit") {
    if (name === "addHandler") {
      if (typeof args[0] !== "function") throw new TypeError("Handler must be callable");
      record.handlers.push(args[0]);
      return;
    }
    if (name === "redirect") {
      record.redirect = `${args[0]}`;
      return;
    }
  }
  throw new TypeError(`Unsupported Navigation API operation: ${name}`);
}

function navigationOperation(record, name, args) {
  if (name === "entries") return [...syncEntries(record)];
  if (name === "updateCurrentEntry") {
    const from = navigationAPIProperty(record.object, "currentEntry");
    replaceHistoryState(args[0]?.state ?? null, "", null);
    syncEntries(record);
    emit(record, new NavigationCurrentEntryChangeEvent("currententrychange", {
      navigationType: "replace",
      from,
    }), "oncurrententrychange");
    return;
  }
  if (name === "navigate") {
    const url = new URL(`${args[0]}`, currentHref()).href;
    return startNavigation(record, "push", {
      url,
      state: args[1]?.state ?? null,
      history: `${args[1]?.history ?? "auto"}`,
      info: args[1]?.info,
    });
  }
  if (name === "reload") {
    return startNavigation(record, "reload", {
      url: currentHref(),
      state: args[0]?.state,
      history: "replace",
      info: args[0]?.info,
    });
  }
  if (name === "back" || name === "forward") {
    const target = navigationCurrentIndex() + (name === "back" ? -1 : 1);
    return startTraverse(record, target, "traverse");
  }
  if (name === "traverseTo") {
    const entries = navigationEntriesSnapshot();
    const target = entries.findIndex(entry => entry.key === `${args[0]}`);
    return startTraverse(record, target, "traverse");
  }
}

function startTraverse(record, targetIndex, navigationType) {
  const entries = navigationEntriesSnapshot();
  if (targetIndex < 0 || targetIndex >= entries.length) {
    const error = new DOMException("Navigation entry was not found.", "InvalidStateError");
    return { committed: Promise.reject(error), finished: Promise.reject(error) };
  }
  return startNavigation(record, navigationType, {
    targetIndex,
    url: entries[targetIndex].url,
    state: entries[targetIndex].state,
    history: "traverse",
  });
}

function startNavigation(record, navigationType, options) {
  const from = navigationAPIProperty(record.object, "currentEntry");
  const destination = createDestination(options, navigationType);
  const event = createNavigateEvent(destination, navigationType, options.info);
  record.object.dispatchEvent(event);
  const navigateHandler = record.handlers.get("onnavigate");
  if (navigateHandler !== null) Reflect.apply(navigateHandler, record.object, [event]);
  const eventRecord = requireRecord(event);
  let transition;
  const committed = Promise.resolve().then(async () => {
    for (const interceptor of eventRecord.interceptors) {
      await Reflect.apply(interceptor, undefined, []);
    }
    if (options.history === "traverse") traverseHistoryToIndex(options.targetIndex);
    else if (options.history === "replace" || navigationType === "reload") {
      replaceHistoryState(options.state ?? null, "", options.url);
    } else {
      pushHistoryState(options.state ?? null, "", options.url);
    }
    const entries = syncEntries(record);
    const current = entries[navigationCurrentIndex()];
    requireRecord(transition).to = current;
    emit(record, new NavigationCurrentEntryChangeEvent("currententrychange", {
      navigationType,
      from,
    }), "oncurrententrychange");
    emit(record, new Event("navigatesuccess"), "onnavigatesuccess");
    return current;
  }).catch(error => {
    emit(record, new Event("navigateerror"), "onnavigateerror");
    throw error;
  });
  const finished = committed.then(entry => entry);
  transition = createTransition(navigationType, from, destination, committed, finished);
  record.transition = transition;
  finished.finally(() => {
    if (record.transition === transition) record.transition = null;
  }).catch(() => {});
  return Object.freeze({ committed, finished });
}

function syncEntries(record) {
  const snapshots = navigationEntriesSnapshot();
  const liveKeys = new Set(snapshots.map(entry => entry.key));
  for (const [key, object] of record.entriesByKey) {
    if (liveKeys.has(key)) continue;
    const entryRecord = requireRecord(object);
    if (entryRecord.ondispose !== null) {
      Reflect.apply(entryRecord.ondispose, object, [new Event("dispose")]);
    }
    record.entriesByKey.delete(key);
  }
  return snapshots.map(snapshot => {
    let object = record.entriesByKey.get(snapshot.key);
    if (object === undefined) {
      object = Object.create(NavigationHistoryEntry.prototype);
      initializeEventTarget(object);
      state.set(object, { kind: "entry", ondispose: null, sameDocument: true });
      record.entriesByKey.set(snapshot.key, object);
    }
    Object.assign(requireRecord(object), {
      key: snapshot.key,
      id: snapshot.id,
      url: snapshot.url,
      index: snapshot.index,
      entryState: snapshot.state,
    });
    return object;
  });
}

function createDestination(options, navigationType) {
  const value = Object.create(NavigationDestination.prototype);
  const target = options.targetIndex === undefined
    ? { key: "", id: "", index: -1 }
    : navigationEntriesSnapshot()[options.targetIndex];
  state.set(value, {
    kind: "destination",
    key: target?.key ?? "",
    id: target?.id ?? "",
    url: options.url,
    index: target?.index ?? -1,
    sameDocument: true,
    entryState: options.state ?? null,
    navigationType,
  });
  return value;
}

function createNavigateEvent(destination, navigationType, info) {
  const value = Object.create(NavigateEvent.prototype);
  initializeNavigateEvent(value, "navigate", {
    navigationType,
    destination,
    canIntercept: true,
    info,
  });
  return value;
}

function initializeNavigateEvent(value, type, init = {}) {
  initializeNavigationEvent(value, type, init, {
    kind: "navigateEvent",
    navigationType: `${init.navigationType ?? "push"}`,
    destination: init.destination ?? null,
    canIntercept: Boolean(init.canIntercept),
    userInitiated: Boolean(init.userInitiated),
    hashChange: Boolean(init.hashChange),
    signal: init.signal ?? new AbortController().signal,
    formData: init.formData ?? null,
    downloadRequest: init.downloadRequest ?? null,
    info: init.info,
    sourceElement: init.sourceElement ?? null,
    hasUAVisualTransition: Boolean(init.hasUAVisualTransition),
    interceptors: [],
    scrolled: false,
  });
}

function initializeNavigationEvent(value, type, init, fields) {
  if (init === null || typeof init !== "object") throw new TypeError("Event init is required");
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, { kind: "navigationEvent", ...fields });
}

function createTransition(navigationType, from, to, committed, finished) {
  const value = Object.create(NavigationTransition.prototype);
  state.set(value, {
    kind: "transition", navigationType, from, to, committed, finished,
  });
  return value;
}

function emit(record, event, handlerName) {
  record.object.dispatchEvent(event);
  const handler = record.handlers.get(handlerName);
  if (handler !== null) Reflect.apply(handler, record.object, [event]);
}

function handlers(names) {
  return new Map(names.map(name => [name, null]));
}

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) throw new TypeError(`Failed to construct '${name}': use new`);
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
