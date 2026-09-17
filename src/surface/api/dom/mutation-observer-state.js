import {
  isInclusiveAncestor,
  isNode,
  registerMutationHook,
} from "./node-state.js";
import { createMutationRecord } from "./mutation-record-state.js";

const observerState = new WeakMap();
// 活着的 observer 用 WeakRef 集合跟踪：disconnect 立即移除；被 GC 的
// observer 由 FinalizationRegistry 清理。迁移前是强引用 Set，只增不减，
// 大量创建/丢弃 MutationObserver 会让每次 DOM 变更都遍历全部历史 observer。
const observerRefs = new Set();
const observerFinalization = new FinalizationRegistry((ref) => {
  observerRefs.delete(ref);
});

registerMutationHook((record) => {
  for (const ref of observerRefs) {
    const observer = ref.deref();
    if (observer === undefined) {
      observerRefs.delete(ref);
      continue;
    }
    enqueueForObserver(observer, record);
  }
});

export function initializeMutationObserver(observer, callback) {
  const state = {
    callback,
    registrations: new Map(),
    records: [],
    scheduled: false,
    ref: new WeakRef(observer),
    registered: true,
  };
  observerState.set(observer, state);
  observerRefs.add(state.ref);
  observerFinalization.register(observer, state.ref, state);
}

/**
 * 当前仍被跟踪的 observer 数量（测试用）。
 *
 * 顺带清掉已经失活的 WeakRef，因此断言不受 GC 时机影响。
 */
export function liveMutationObserverCount() {
  let count = 0;
  for (const ref of observerRefs) {
    if (ref.deref() === undefined) {
      observerRefs.delete(ref);
    } else {
      count += 1;
    }
  }
  return count;
}

function requireMutationObserver(value) {
  const state = observerState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function observeTarget(observer, target, rawOptions) {
  const state = requireMutationObserver(observer);
  if (!isNode(target)) {
    throw new TypeError(
      "Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.",
    );
  }
  const options = normalizeOptions(rawOptions);
  state.registrations.set(target, options);
  // disconnect 之后重新 observe 要重新纳入跟踪。
  if (!state.registered) {
    state.registered = true;
    observerRefs.add(state.ref);
    observerFinalization.register(observer, state.ref, state);
  }
}

export function disconnectObserver(observer) {
  const state = requireMutationObserver(observer);
  state.registrations.clear();
  state.records.length = 0;
  if (state.registered) {
    state.registered = false;
    observerRefs.delete(state.ref);
    observerFinalization.unregister(state);
  }
}

export function takeObserverRecords(observer) {
  const state = requireMutationObserver(observer);
  return state.records.splice(0);
}

function enqueueForObserver(observer, record) {
  const state = requireMutationObserver(observer);
  for (const [target, options] of state.registrations) {
    if (
      record.target !== target
      && (!options.subtree || !isInclusiveAncestor(target, record.target))
    ) {
      continue;
    }
    if (!recordEnabled(record, options)) {
      continue;
    }
    state.records.push(createMutationRecord(record, options));
    if (!state.scheduled) {
      state.scheduled = true;
      queueMicrotask(() => deliver(observer));
    }
    return;
  }
}

function deliver(observer) {
  const state = observerState.get(observer);
  if (state === undefined) {
    return;
  }
  state.scheduled = false;
  if (state.records.length === 0) {
    return;
  }
  const records = state.records.splice(0);
  try {
    state.callback.call(observer, records, observer);
  } catch (error) {
    console.error(error);
  }
}

function recordEnabled(record, options) {
  if (record.type === "childList") {
    return options.childList;
  }
  if (record.type === "characterData") {
    return options.characterData;
  }
  if (record.type === "attributes") {
    return options.attributes && (
      options.attributeFilter === null
      || options.attributeFilter.includes(record.attributeName)
    );
  }
  return false;
}

function normalizeOptions(value) {
  const source = value === undefined || value === null ? {} : Object(value);
  const hasAttributes = source.attributes !== undefined;
  const hasCharacterData = source.characterData !== undefined;
  const attributeOldValue = Boolean(source.attributeOldValue);
  const characterDataOldValue = Boolean(source.characterDataOldValue);
  const attributeFilter = source.attributeFilter === undefined
    ? null
    : Array.from(source.attributeFilter, entry => `${entry}`);
  const attributes = hasAttributes
    ? Boolean(source.attributes)
    : attributeOldValue || attributeFilter !== null;
  const characterData = hasCharacterData
    ? Boolean(source.characterData)
    : characterDataOldValue;
  const childList = Boolean(source.childList);
  if (
    (!attributes && (attributeOldValue || attributeFilter !== null))
    || (!characterData && characterDataOldValue)
    || (!childList && !attributes && !characterData)
  ) {
    throw new TypeError(
      "The options object must set at least one of childList, attributes, or characterData to true.",
    );
  }
  return {
    childList,
    attributes,
    characterData,
    subtree: Boolean(source.subtree),
    attributeOldValue,
    characterDataOldValue,
    attributeFilter,
  };
}
