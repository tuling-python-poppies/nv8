const traceState = {
  enabled: false,
  maxEntries: 100_000,
  nextSequence: 1,
  entries: [],
  startIndex: 0,
  size: 0,
  // 命中即断的子串监视集合（全小写）。空 = 从不断下。属于配置，不随
  // clearTrace() 清空；新 Realm 由 configureTrace 重置为空再按需重设。
  watch: [],
};

export function configureTrace(enabled, maxEntries) {
  traceState.enabled = Boolean(enabled);
  if (Number.isSafeInteger(maxEntries) && maxEntries > 0) {
    traceState.maxEntries = maxEntries;
  }
  traceState.watch = [];
  clearTrace();
}

/**
 * 设置 API 访问断点：当被 trace 的 api 标签命中列表中任一子串（不区分大小写），
 * 且当前进程附有 inspector 时，在访问处暂停（供 Chrome DevTools 单步/看作用域）。
 * 需先 enableTrace()。没附 inspector 时 debugger 为 no-op，生产运行零副作用。
 *
 * @param {string[]} list 要监视的 api 子串，如 ["cookie", "toDataURL", "userAgent"]
 */
export function setWatchApis(list) {
  traceState.watch = normalizeWatchList(list);
}

export function readWatchApis() {
  return traceState.watch.slice();
}

function normalizeWatchList(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  const out = [];
  for (const entry of list) {
    if (typeof entry === "string" && entry.length > 0) {
      out.push(entry.toLowerCase());
    }
  }
  return out;
}

function matchesWatch(api) {
  const target = String(api).toLowerCase();
  for (let index = 0; index < traceState.watch.length; index += 1) {
    if (target.includes(traceState.watch[index])) {
      return true;
    }
  }
  return false;
}

function pauseForWatch() {
  // 附了 inspector 就在此暂停：DevTools 调用栈往上一帧即目标访问点。
  // 没附时这是 no-op（Node 语义），因此非调试运行完全无可观测差异。
  // eslint-disable-next-line no-debugger
  debugger;
}

export function enableTrace() {
  traceState.enabled = true;
}

export function disableTrace() {
  traceState.enabled = false;
}

export function clearTrace() {
  traceState.entries.length = 0;
  traceState.startIndex = 0;
  traceState.size = 0;
  traceState.nextSequence = 1;
}

export function traceIsEnabled() {
  return traceState.enabled;
}

export function appendTrace(operation, api, receiver, argumentsSummary, result) {
  if (!traceState.enabled) {
    return;
  }
  if (traceState.watch.length > 0 && matchesWatch(api)) {
    pauseForWatch();
  }
  const entry = {
    sequence: traceState.nextSequence,
    operation,
    api,
    receiver,
    arguments: argumentsSummary,
    result,
  };
  traceState.nextSequence += 1;
  if (traceState.size < traceState.maxEntries) {
    traceState.entries.push(entry);
    traceState.size += 1;
    return;
  }
  traceState.entries[traceState.startIndex] = entry;
  traceState.startIndex = (
    traceState.startIndex + 1
  ) % traceState.maxEntries;
}

export function readTrace() {
  if (
    traceState.size < traceState.maxEntries
    || traceState.startIndex === 0
  ) {
    return traceState.entries.slice(0, traceState.size);
  }
  return [
    ...traceState.entries.slice(traceState.startIndex),
    ...traceState.entries.slice(0, traceState.startIndex),
  ];
}
