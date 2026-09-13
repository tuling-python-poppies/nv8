import { cloneDetail } from "../../surface/api/performance/clone-detail.js";
import {
  parseUrl,
  serializeUrl,
  updateUrlComponent,
  urlOrigin,
} from "./url-record.js";
import { createRealmSlot } from "../../engine/core/state-scope.js";

// 历史条目、当前索引和导航钩子原先是模块级状态，会让宿主图上的多个
// Realm 共享同一份 history。现在按当前 Realm 的 globalThis 键控。
const navigationSlot = createRealmSlot(() => ({
  entries: [],
  currentIndex: 0,
  scrollRestoration: "auto",
  nextNavigationEntryId: 0,
  beforeNavigateHook: null,
  navigateHook: null,
  originOverride: null,
}), "navigation-state");

function nav() {
  return navigationSlot.get(globalThis);
}

/**
 * 初始化导航状态。
 *
 * 钩子只在**显式传入**时才赋值。
 *
 * 原先无条件赋值（没传就写 null），而调用顺序是：
 * `realm-factory` 先用 `installCoreNavigation(url, { beforeNavigate, onNavigate })`
 * 装上钩子，legacy bootstrap 随后又调一次 `configureNavigation(pageUrl)`
 * （无 options）——把钩子抹成了 null。后果是 **legacy 模式下
 * `location.assign()` 只改 URL，既不派发 `beforeunload`，也不替换文档**。
 *
 * @param {string} initialUrl
 * @param {object} [options]
 */
export function configureNavigation(initialUrl, options = {}) {
  const state = nav();
  const url = parseUrl(initialUrl);
  state.nextNavigationEntryId = 0;
  state.entries = [createNavigationEntry({
    url,
    state: null,
    title: "",
  })];
  state.currentIndex = 0;
  state.scrollRestoration = "auto";
  state.originOverride = typeof options.origin === "string"
    ? options.origin
    : null;
  if ("beforeNavigate" in options) {
    state.beforeNavigateHook = typeof options.beforeNavigate === "function"
      ? options.beforeNavigate
      : null;
  }
  if ("onNavigate" in options) {
    state.navigateHook = typeof options.onNavigate === "function"
      ? options.onNavigate
      : null;
  }
}

export function currentUrlRecord() {
  const state = nav();
  return state.entries[state.currentIndex].url;
}

export function currentHref() {
  return serializeUrl(currentUrlRecord());
}

export function currentOrigin() {
  return nav().originOverride ?? urlOrigin(currentUrlRecord());
}

export function setLocationComponent(component, value) {
  const updated = updateUrlComponent(currentUrlRecord(), component, value);
  navigateToRecord(updated, "assign", null, "");
}

export function navigate(value, mode = "assign") {
  const next = parseUrl(value, currentUrlRecord());
  navigateToRecord(next, mode, null, "");
}

export function historyLength() {
  return nav().entries.length;
}

export function historyState() {
  const state = nav();
  return state.entries[state.currentIndex].state;
}

export function getScrollRestoration() {
  return nav().scrollRestoration;
}

export function setScrollRestoration(value) {
  if (value !== "auto" && value !== "manual") {
    throw new TypeError("Invalid scroll restoration mode");
  }
  nav().scrollRestoration = value;
}

export function moveHistory(delta) {
  const state = nav();
  const target = state.currentIndex + delta;
  if (target >= 0 && target < state.entries.length) {
    state.currentIndex = target;
  }
}

export function navigationEntriesSnapshot() {
  return nav().entries.map((entry, index) => ({
    key: entry.key,
    id: entry.id,
    url: serializeUrl(entry.url),
    index,
    state: cloneDetail(entry.state),
  }));
}

export function navigationCurrentIndex() {
  return nav().currentIndex;
}

export function currentNavigationSequence() {
  const state = nav();
  const id = state.entries[state.currentIndex]?.id ?? "";
  const value = Number(id.startsWith("navigation-") ? id.slice(11) : NaN);
  return Number.isSafeInteger(value) && value > 0 ? value : 0;
}

export function traverseHistoryToIndex(index) {
  const state = nav();
  const normalized = Number(index);
  if (
    Number.isInteger(normalized)
    && normalized >= 0
    && normalized < state.entries.length
  ) {
    state.currentIndex = normalized;
    return true;
  }
  return false;
}

/**
 * 真实 Edge 的会话历史上限是 50 条。
 *
 * 超出后从最旧一端裁剪；`go()` 的索引随之平移，当前条目始终指向同一份记录。
 */
const MAX_HISTORY_ENTRIES = 50;

function trimHistoryEntries(scope) {
  const excess = scope.entries.length - MAX_HISTORY_ENTRIES;
  if (excess <= 0) return;
  scope.entries.splice(0, excess);
  scope.currentIndex = Math.max(0, scope.currentIndex - excess);
}

export function pushHistoryState(state, title, url) {
  const scope = nav();
  const target = resolveHistoryUrl(url);
  scope.entries.splice(scope.currentIndex + 1);
  scope.entries.push(createNavigationEntry({
    url: target,
    state: cloneDetail(state),
    title,
  }));
  scope.currentIndex = scope.entries.length - 1;
  trimHistoryEntries(scope);
}

export function replaceHistoryState(state, title, url) {
  const scope = nav();
  scope.entries[scope.currentIndex] = {
    ...scope.entries[scope.currentIndex],
    url: resolveHistoryUrl(url),
    state: cloneDetail(state),
    title,
  };
}

function resolveHistoryUrl(value) {
  if (value === undefined || value === null || value === "") {
    return currentUrlRecord();
  }
  const target = parseUrl(value, currentUrlRecord());
  if (urlOrigin(target) !== currentOrigin()) {
    throw new DOMException(
      "Failed to execute history state operation: URL origin differs from the document origin.",
      "SecurityError",
    );
  }
  return target;
}

function navigateToRecord(url, mode, state, title) {
  const scope = nav();
  const targetHref = serializeUrl(url);
  const needsDocumentReplacement = !isSameDocumentNavigation(
    currentHref(),
    targetHref,
  );
  if (
    needsDocumentReplacement
    && scope.beforeNavigateHook !== null
    && scope.beforeNavigateHook({ url: targetHref, mode }) === false
  ) {
    return false;
  }
  const originOverride = needsDocumentReplacement
    ? null
    : scope.originOverride;
  if (mode === "replace") {
    scope.entries[scope.currentIndex] = {
      ...scope.entries[scope.currentIndex],
      url,
      state,
      title,
    };
    scope.originOverride = originOverride;
    if (needsDocumentReplacement) scope.navigateHook?.({ url: targetHref, mode });
    return true;
  }
  scope.entries.splice(scope.currentIndex + 1);
  scope.entries.push(createNavigationEntry({ url, state, title }));
  scope.originOverride = originOverride;
  scope.currentIndex = scope.entries.length - 1;
  trimHistoryEntries(scope);
  if (needsDocumentReplacement) scope.navigateHook?.({ url: targetHref, mode });
  return true;
}

function isSameDocumentNavigation(current, target) {
  const currentUrl = new URL(current);
  const targetUrl = new URL(target);
  return currentUrl.origin === targetUrl.origin
    && currentUrl.pathname === targetUrl.pathname
    && currentUrl.search === targetUrl.search;
}

function createNavigationEntry(fields) {
  const scope = nav();
  scope.nextNavigationEntryId += 1;
  return {
    ...fields,
    key: `entry-${scope.nextNavigationEntryId}`,
    id: `navigation-${scope.nextNavigationEntryId}`,
  };
}
