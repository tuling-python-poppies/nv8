import { Event } from "../event/event-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { createDOMStringList } from "../dom-utilities/dom-utilities-runtime.js";
import {
  performStructuredClone,
} from "../clone/structured-clone-algorithm.js";
import {
  IDBVersionChangeEvent,
} from "../longtail-events/longtail-events-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { reserveTimer } from "../../../infra/scheduler/timer-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// 数据库注册表和 IDBFactory 原先是模块级状态，会跨 Realm 共享数据库。
const indexedDBSlot = createRealmSlot(() => ({
  databases: new Map(),
  factorySingleton: null,
}), "indexed-db-runtime");

function indexedDBState() {
  return indexedDBSlot.get(globalThis);
}

export function IDBFactory() { illegalConstructor("IDBFactory"); }
export function IDBDatabase() { illegalConstructor("IDBDatabase"); }
export function IDBTransaction() { illegalConstructor("IDBTransaction"); }
export function IDBRequest() { illegalConstructor("IDBRequest"); }
export function IDBOpenDBRequest() { illegalConstructor("IDBOpenDBRequest"); }
export function IDBObjectStore() { illegalConstructor("IDBObjectStore"); }
export function IDBIndex() { illegalConstructor("IDBIndex"); }
export function IDBCursor() { illegalConstructor("IDBCursor"); }
export function IDBCursorWithValue() { illegalConstructor("IDBCursorWithValue"); }
export function IDBKeyRange() { illegalConstructor("IDBKeyRange"); }
export function IDBRecord() { illegalConstructor("IDBRecord"); }

export const indexedDBConstructors = Object.freeze([
  IDBFactory,
  IDBDatabase,
  IDBTransaction,
  IDBRequest,
  IDBOpenDBRequest,
  IDBObjectStore,
  IDBIndex,
  IDBCursor,
  IDBCursorWithValue,
  IDBKeyRange,
  IDBRecord,
]);
for (const Constructor of indexedDBConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createIDBFactory() {
  const runtime = indexedDBState();
  if (runtime.factorySingleton !== null) return runtime.factorySingleton;
  runtime.factorySingleton = Object.create(IDBFactory.prototype);
  state.set(runtime.factorySingleton, { kind: "factory" });
  return runtime.factorySingleton;
}

export function indexedDBProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "request") {
    if (["result", "error"].includes(name) && record.readyState === "pending") {
      throw domError("Request is still pending", "InvalidStateError");
    }
    return record[name];
  }
  if (record.kind === "database" && name === "objectStoreNames") {
    return createDOMStringList([...record.metadata.stores.keys()].sort());
  }
  if (record.kind === "transaction" && name === "objectStoreNames") {
    return createDOMStringList(record.storeNames);
  }
  if (record.kind === "objectStore" && name === "indexNames") {
    return createDOMStringList([...record.metadata.indexes.keys()].sort());
  }
  return record[name];
}

export function setIndexedDBProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "objectStore" && name === "name") {
    renameStore(record, `${input}`);
  }
  if (record.kind === "index" && name === "name") {
    renameIndex(record, `${input}`);
  }
}

export function indexedDBOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "factory") return factoryOperation(name, args);
  if (record.kind === "database") {
    return databaseOperation(record, name, args);
  }
  if (record.kind === "transaction") {
    return transactionOperation(record, name, args);
  }
  if (record.kind === "objectStore") {
    return objectStoreOperation(record, name, args);
  }
  if (record.kind === "index") return indexOperation(record, name, args);
  if (record.kind === "cursor") return cursorOperation(record, name, args);
  if (record.kind === "keyRange" && name === "includes") {
    return keyRangeIncludes(record, args[0]);
  }
  throw new TypeError(`Unsupported IndexedDB operation: ${name}`);
}

export function createKeyRange(kind, args) {
  let lower;
  let upper;
  let lowerOpen = false;
  let upperOpen = false;
  if (kind === "only") {
    lower = cloneKey(args[0]);
    upper = cloneKey(args[0]);
  } else if (kind === "lowerBound") {
    lower = cloneKey(args[0]);
    upper = undefined;
    lowerOpen = Boolean(args[1]);
  } else if (kind === "upperBound") {
    lower = undefined;
    upper = cloneKey(args[0]);
    upperOpen = Boolean(args[1]);
  } else {
    lower = cloneKey(args[0]);
    upper = cloneKey(args[1]);
    lowerOpen = Boolean(args[2]);
    upperOpen = Boolean(args[3]);
    if (compareKeys(lower, upper) > 0) {
      throw domError("Lower key exceeds upper key", "DataError");
    }
  }
  const value = Object.create(IDBKeyRange.prototype);
  state.set(value, {
    kind: "keyRange",
    lower,
    upper,
    lowerOpen,
    upperOpen,
  });
  return value;
}

function factoryOperation(name, args) {
  const runtime = indexedDBState();
  if (name === "cmp") return compareKeys(args[0], args[1]);
  if (name === "databases") {
    return Promise.resolve(
      [...runtime.databases.values()]
        .map(item => Object.freeze({ name: item.name, version: item.version }))
        .sort((left, right) => left.name.localeCompare(right.name)),
    );
  }
  if (name === "open") return openDatabase(args[0], args[1]);
  if (name === "deleteDatabase") return deleteDatabase(args[0]);
}

function openDatabase(inputName, inputVersion) {
  const name = `${inputName}`;
  const requestedVersion = inputVersion === undefined
    ? undefined
    : Number(inputVersion);
  if (requestedVersion !== undefined
      && (!Number.isSafeInteger(requestedVersion) || requestedVersion <= 0)) {
    throw new TypeError("Version must be a positive integer");
  }
  const request = createRequest(null, null, true);
  Promise.resolve().then(() => {
    const runtime = indexedDBState();
  let metadata = runtime.databases.get(name);
    const oldVersion = metadata?.version ?? 0;
    const version = requestedVersion ?? (metadata?.version ?? 1);
    if (metadata !== undefined && version < metadata.version) {
      failRequest(request, domError("Requested version is too low", "VersionError"));
      return;
    }
    if (metadata === undefined) {
      metadata = {
        name,
        version,
        stores: new Map(),
        connections: new Set(),
      };
      runtime.databases.set(name, metadata);
    }
    const database = createDatabase(metadata);
    const requestRecord = requireRecord(request);
    requestRecord.result = database;
    const upgrade = version > oldVersion;
    if (upgrade) {
      metadata.version = version;
      const transaction = createTransaction(
        database,
        [...metadata.stores.keys()],
        "versionchange",
        "default",
      );
      const transactionRecord = requireRecord(transaction);
      transactionRecord.versionchange = true;
      requireRecord(database).upgradeTransaction = transaction;
      requestRecord.transaction = transaction;
      requestRecord.readyState = "done";
      const event = new IDBVersionChangeEvent("upgradeneeded", {
        oldVersion,
        newVersion: version,
      });
      fire(request, "upgradeneeded", event);
      requireRecord(database).upgradeTransaction = null;
      finishTransaction(transactionRecord);
    }
    succeedRequest(request, database);
  });
  return request;
}

function deleteDatabase(inputName) {
  const runtime = indexedDBState();
  const name = `${inputName}`;
  const request = createRequest(null, null, true);
  Promise.resolve().then(() => {
    const metadata = runtime.databases.get(name);
    const oldVersion = metadata?.version ?? 0;
    if (metadata !== undefined) {
      for (const connection of metadata.connections) {
        fire(
          connection,
          "versionchange",
          new IDBVersionChangeEvent("versionchange", {
            oldVersion,
            newVersion: null,
          }),
        );
      }
      runtime.databases.delete(name);
    }
    succeedRequest(request, undefined);
  });
  return request;
}

function createDatabase(metadata) {
  const value = Object.create(IDBDatabase.prototype);
  initializeEventTarget(value);
  const record = {
    kind: "database",
    object: value,
    metadata,
    name: metadata.name,
    version: metadata.version,
    closed: false,
    upgradeTransaction: null,
    handlers: handlerMap("onabort", "onclose", "onerror", "onversionchange"),
  };
  state.set(value, record);
  metadata.connections.add(value);
  return value;
}

function databaseOperation(record, name, args) {
  requireOpenDatabase(record);
  if (name === "close") {
    record.closed = true;
    record.metadata.connections.delete(record.object);
    return undefined;
  }
  if (name === "createObjectStore") {
    requireVersionchange(record);
    const storeName = `${args[0]}`;
    if (record.metadata.stores.has(storeName)) {
      throw domError("Object store already exists", "ConstraintError");
    }
    const options = args[1] ?? {};
    const metadata = {
      name: storeName,
      keyPath: options.keyPath ?? null,
      autoIncrement: Boolean(options.autoIncrement),
      nextKey: 1,
      records: new Map(),
      indexes: new Map(),
    };
    record.metadata.stores.set(storeName, metadata);
    const transaction = record.upgradeTransaction;
    const transactionRecord = requireRecord(transaction);
    if (!transactionRecord.storeNames.includes(storeName)) {
      transactionRecord.storeNames.push(storeName);
    }
    return createObjectStore(metadata, transaction);
  }
  if (name === "deleteObjectStore") {
    requireVersionchange(record);
    const storeName = `${args[0]}`;
    if (!record.metadata.stores.delete(storeName)) {
      throw domError("Object store does not exist", "NotFoundError");
    }
    return undefined;
  }
  if (name === "transaction") {
    const names = typeof args[0] === "string" ? [args[0]] : [...args[0]].map(String);
    if (names.length === 0) throw new TypeError("At least one store is required");
    for (const storeName of names) {
      if (!record.metadata.stores.has(storeName)) {
        throw domError("Object store does not exist", "NotFoundError");
      }
    }
    const mode = `${args[1] ?? "readonly"}`;
    if (!["readonly", "readwrite"].includes(mode)) {
      throw new TypeError("Invalid transaction mode");
    }
    const durability = `${args[2]?.durability ?? "default"}`;
    return createTransaction(record.object, names, mode, durability);
  }
}

function createTransaction(database, storeNames, mode, durability) {
  const value = Object.create(IDBTransaction.prototype);
  initializeEventTarget(value);
  const record = {
    kind: "transaction",
    object: value,
    database,
    db: database,
    storeNames: [...storeNames],
    mode,
    durability,
    error: null,
    active: true,
    pending: 0,
    completionScheduled: false,
    versionchange: false,
    handlers: handlerMap("onabort", "oncomplete", "onerror"),
  };
  state.set(value, record);
  scheduleTransactionCompletion(record);
  return value;
}

function transactionOperation(record, name, args) {
  if (name === "objectStore") {
    requireActiveTransaction(record);
    const storeName = `${args[0]}`;
    if (!record.storeNames.includes(storeName)) {
      throw domError("Store is outside this transaction", "NotFoundError");
    }
    const metadata = requireRecord(record.database).metadata.stores.get(storeName);
    if (metadata === undefined) {
      throw domError("Object store does not exist", "NotFoundError");
    }
    return createObjectStore(metadata, record.object);
  }
  if (name === "abort") {
    abortTransaction(record, domError("Transaction aborted", "AbortError"));
    return undefined;
  }
  if (name === "commit") {
    requireActiveTransaction(record);
    finishTransaction(record);
    return undefined;
  }
}

function createObjectStore(metadata, transaction) {
  const value = Object.create(IDBObjectStore.prototype);
  state.set(value, {
    kind: "objectStore",
    object: value,
    metadata,
    name: metadata.name,
    keyPath: cloneMaybe(metadata.keyPath),
    transaction,
    autoIncrement: metadata.autoIncrement,
  });
  return value;
}

function objectStoreOperation(record, name, args) {
  const transaction = requireRecord(record.transaction);
  requireActiveTransaction(transaction);
  if (name === "createIndex") {
    requireVersionchangeTransaction(transaction);
    const indexName = `${args[0]}`;
    if (record.metadata.indexes.has(indexName)) {
      throw domError("Index already exists", "ConstraintError");
    }
    const options = args[2] ?? {};
    const metadata = {
      name: indexName,
      keyPath: cloneMaybe(args[1]),
      multiEntry: Boolean(options.multiEntry),
      unique: Boolean(options.unique),
    };
    record.metadata.indexes.set(indexName, metadata);
    return createIndex(metadata, record.object);
  }
  if (name === "deleteIndex") {
    requireVersionchangeTransaction(transaction);
    if (!record.metadata.indexes.delete(`${args[0]}`)) {
      throw domError("Index does not exist", "NotFoundError");
    }
    return undefined;
  }
  if (name === "index") {
    const metadata = record.metadata.indexes.get(`${args[0]}`);
    if (metadata === undefined) {
      throw domError("Index does not exist", "NotFoundError");
    }
    return createIndex(metadata, record.object);
  }
  if (["add", "put"].includes(name)) {
    requireWritableTransaction(transaction);
    return scheduleStoreRequest(record, name, args, () => {
      const value = clone(args[0]);
      const key = deriveKey(record.metadata, value, args[1]);
      const encoded = encodeKey(key);
      if (name === "add" && record.metadata.records.has(encoded)) {
        throw domError("Key already exists", "ConstraintError");
      }
      enforceUniqueIndexes(record.metadata, value, key);
      record.metadata.records.set(encoded, { key: cloneKey(key), value });
      return cloneKey(key);
    });
  }
  if (name === "clear") {
    requireWritableTransaction(transaction);
    return scheduleStoreRequest(record, name, args, () => {
      record.metadata.records.clear();
      return undefined;
    });
  }
  if (name === "delete") {
    requireWritableTransaction(transaction);
    return scheduleStoreRequest(record, name, args, () => {
      deleteByQuery(record.metadata, args[0]);
      return undefined;
    });
  }
  if (["get", "getKey", "count", "getAll", "getAllKeys", "getAllRecords"].includes(name)) {
    return scheduleStoreRequest(record, name, args, () => {
      const entries = matchingStoreEntries(record.metadata, args[0]);
      if (name === "count") return entries.length;
      if (name === "get") return entries.length ? clone(entries[0].value) : undefined;
      if (name === "getKey") return entries.length ? cloneKey(entries[0].key) : undefined;
      const limited = limitEntries(entries, args[1]);
      if (name === "getAll") return limited.map(entry => clone(entry.value));
      if (name === "getAllKeys") return limited.map(entry => cloneKey(entry.key));
      return limited.map(entry => createRecord(entry.key, entry.key, entry.value));
    });
  }
  if (name === "openCursor" || name === "openKeyCursor") {
    return openCursor(
      record.object,
      record.transaction,
      matchingStoreEntries(record.metadata, args[0]),
      args[1],
      name === "openKeyCursor",
    );
  }
}

function createIndex(metadata, objectStore) {
  const value = Object.create(IDBIndex.prototype);
  state.set(value, {
    kind: "index",
    object: value,
    metadata,
    name: metadata.name,
    objectStore,
    keyPath: cloneMaybe(metadata.keyPath),
    multiEntry: metadata.multiEntry,
    unique: metadata.unique,
  });
  return value;
}

function indexOperation(record, name, args) {
  const store = requireRecord(record.objectStore);
  const transaction = requireRecord(store.transaction);
  requireActiveTransaction(transaction);
  const entries = () => matchingIndexEntries(store.metadata, record.metadata, args[0]);
  if (["get", "getKey", "count", "getAll", "getAllKeys", "getAllRecords"].includes(name)) {
    return scheduleStoreRequest(store, name, args, () => {
      const matches = entries();
      if (name === "count") return matches.length;
      if (name === "get") return matches.length ? clone(matches[0].value) : undefined;
      if (name === "getKey") {
        return matches.length ? cloneKey(matches[0].primaryKey) : undefined;
      }
      const limited = limitEntries(matches, args[1]);
      if (name === "getAll") return limited.map(entry => clone(entry.value));
      if (name === "getAllKeys") {
        return limited.map(entry => cloneKey(entry.primaryKey));
      }
      return limited.map(entry => createRecord(
        entry.key,
        entry.primaryKey,
        entry.value,
      ));
    }, record.object);
  }
  if (name === "openCursor" || name === "openKeyCursor") {
    return openCursor(
      record.object,
      store.transaction,
      entries(),
      args[1],
      name === "openKeyCursor",
    );
  }
}

function scheduleStoreRequest(store, name, args, operation, source = store.object) {
  const transaction = requireRecord(store.transaction);
  const request = createRequest(source, store.transaction);
  transaction.pending += 1;
  Promise.resolve().then(() => {
    try {
      requireActiveTransaction(transaction);
      succeedRequest(request, operation());
    } catch (error) {
      transaction.error = error;
      failRequest(request, error);
      fire(transaction.object, "error");
    } finally {
      transaction.pending -= 1;
      scheduleTransactionCompletion(transaction);
    }
  });
  return request;
}

function createRequest(source, transaction, open = false) {
  const Constructor = open ? IDBOpenDBRequest : IDBRequest;
  const value = Object.create(Constructor.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "request",
    object: value,
    result: undefined,
    error: null,
    source,
    transaction,
    readyState: "pending",
    handlers: handlerMap(
      "onsuccess",
      "onerror",
      ...(open ? ["onblocked", "onupgradeneeded"] : []),
    ),
  });
  return value;
}

function succeedRequest(request, result) {
  const record = requireRecord(request);
  record.result = result;
  record.error = null;
  record.readyState = "done";
  fire(request, "success");
}

function failRequest(request, error) {
  const record = requireRecord(request);
  record.result = undefined;
  record.error = error;
  record.readyState = "done";
  fire(request, "error");
}

function openCursor(source, transaction, entries, direction = "next", keyOnly = false) {
  const normalizedDirection = `${direction ?? "next"}`;
  if (!["next", "nextunique", "prev", "prevunique"].includes(normalizedDirection)) {
    throw new TypeError("Invalid cursor direction");
  }
  const ordered = normalizedDirection.startsWith("prev")
    ? [...entries].reverse()
    : [...entries];
  const request = createRequest(source, transaction);
  const transactionRecord = requireRecord(transaction);
  transactionRecord.pending += 1;
  const cursorRecord = {
    kind: "cursor",
    source,
    direction: normalizedDirection,
    request,
    transaction,
    entries: ordered,
    position: 0,
    keyOnly,
    key: undefined,
    primaryKey: undefined,
    value: undefined,
  };
  Promise.resolve().then(() => deliverCursor(cursorRecord, request, transactionRecord));
  return request;
}

function deliverCursor(cursorRecord, request, transactionRecord) {
  try {
    const entry = cursorRecord.entries[cursorRecord.position];
    if (entry === undefined) {
      succeedRequest(request, null);
    } else {
      cursorRecord.key = cloneKey(entry.key);
      cursorRecord.primaryKey = cloneKey(entry.primaryKey ?? entry.key);
      cursorRecord.value = clone(entry.value);
      const Constructor = cursorRecord.keyOnly ? IDBCursor : IDBCursorWithValue;
      const cursor = Object.create(Constructor.prototype);
      state.set(cursor, cursorRecord);
      succeedRequest(request, cursor);
    }
  } catch (error) {
    failRequest(request, error);
  } finally {
    transactionRecord.pending -= 1;
    scheduleTransactionCompletion(transactionRecord);
  }
}

function cursorOperation(record, name, args) {
  if (name === "continue" || name === "continuePrimaryKey" || name === "advance") {
    let amount = name === "advance" ? Number(args[0]) : 1;
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new TypeError("Cursor advance count must be positive");
    }
    if (name === "continue" && args[0] !== undefined) {
      const target = args[0];
      const next = record.entries.findIndex(
        (entry, index) => index > record.position
          && compareKeys(entry.key, target) >= 0,
      );
      record.position = next === -1 ? record.entries.length : next;
    } else {
      record.position += amount;
    }
    const requestRecord = requireRecord(record.request);
    requestRecord.readyState = "pending";
    requestRecord.result = undefined;
    const transaction = requireRecord(record.transaction);
    transaction.pending += 1;
    Promise.resolve().then(() => deliverCursor(record, record.request, transaction));
    return undefined;
  }
  const source = requireRecord(record.source);
  const store = source.kind === "objectStore"
    ? source
    : requireRecord(source.objectStore);
  if (name === "delete") {
    return objectStoreOperation(store, "delete", [record.primaryKey]);
  }
  if (name === "update") {
    return objectStoreOperation(store, "put", [args[0], record.primaryKey]);
  }
}

function createRecord(key, primaryKey, inputValue) {
  const value = Object.create(IDBRecord.prototype);
  state.set(value, {
    kind: "record",
    key: cloneKey(key),
    primaryKey: cloneKey(primaryKey),
    value: clone(inputValue),
  });
  return value;
}

function matchingStoreEntries(metadata, query) {
  return [...metadata.records.values()]
    .filter(entry => matchesQuery(entry.key, query))
    .sort((left, right) => compareKeys(left.key, right.key));
}

function matchingIndexEntries(store, index, query) {
  const entries = [];
  for (const entry of store.records.values()) {
    const indexValue = extractKeyPath(entry.value, index.keyPath);
    const keys = index.multiEntry && Array.isArray(indexValue)
      ? indexValue
      : [indexValue];
    for (const key of keys) {
      if (key !== undefined && matchesQuery(key, query)) {
        entries.push({
          key: cloneKey(key),
          primaryKey: cloneKey(entry.key),
          value: entry.value,
        });
      }
    }
  }
  return entries.sort((left, right) => {
    const result = compareKeys(left.key, right.key);
    return result || compareKeys(left.primaryKey, right.primaryKey);
  });
}

function matchesQuery(key, query) {
  if (query === undefined || query === null) return true;
  const range = state.get(query);
  if (range?.kind === "keyRange") return keyRangeIncludes(range, key);
  return compareKeys(key, query) === 0;
}

function keyRangeIncludes(range, key) {
  if (range.lower !== undefined) {
    const comparison = compareKeys(key, range.lower);
    if (comparison < 0 || (comparison === 0 && range.lowerOpen)) return false;
  }
  if (range.upper !== undefined) {
    const comparison = compareKeys(key, range.upper);
    if (comparison > 0 || (comparison === 0 && range.upperOpen)) return false;
  }
  return true;
}

function deriveKey(metadata, value, explicitKey) {
  let key = explicitKey;
  if (key === undefined && metadata.keyPath !== null) {
    key = extractKeyPath(value, metadata.keyPath);
  }
  if (key === undefined && metadata.autoIncrement) {
    key = metadata.nextKey;
    metadata.nextKey += 1;
    if (metadata.keyPath !== null && typeof metadata.keyPath === "string") {
      assignKeyPath(value, metadata.keyPath, key);
    }
  }
  if (key === undefined) throw domError("A key is required", "DataError");
  validateKey(key);
  return cloneKey(key);
}

function enforceUniqueIndexes(metadata, value, primaryKey) {
  for (const index of metadata.indexes.values()) {
    if (!index.unique) continue;
    const candidate = extractKeyPath(value, index.keyPath);
    if (candidate === undefined) continue;
    for (const entry of metadata.records.values()) {
      if (compareKeys(entry.key, primaryKey) === 0) continue;
      const existing = extractKeyPath(entry.value, index.keyPath);
      if (existing !== undefined && compareKeys(existing, candidate) === 0) {
        throw domError("Unique index constraint failed", "ConstraintError");
      }
    }
  }
}

function extractKeyPath(value, keyPath) {
  if (Array.isArray(keyPath)) {
    return keyPath.map(path => extractKeyPath(value, path));
  }
  if (keyPath === "" || keyPath === null) return value;
  let current = value;
  for (const part of `${keyPath}`.split(".")) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

function assignKeyPath(value, keyPath, key) {
  const parts = keyPath.split(".");
  let current = value;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (current[part] === undefined) current[part] = {};
    current = current[part];
  }
  current[parts.at(-1)] = key;
}

function deleteByQuery(metadata, query) {
  for (const [encoded, entry] of metadata.records) {
    if (matchesQuery(entry.key, query)) metadata.records.delete(encoded);
  }
}

function limitEntries(entries, inputLimit) {
  if (inputLimit === undefined) return entries;
  const limit = Number(inputLimit) >>> 0;
  return entries.slice(0, limit);
}

function compareKeys(left, right) {
  validateKey(left);
  validateKey(right);
  const leftRank = keyRank(left);
  const rightRank = keyRank(right);
  if (leftRank !== rightRank) return leftRank < rightRank ? -1 : 1;
  if (typeof left === "number") return Math.sign(left - right);
  if (left instanceof Date) return Math.sign(left.getTime() - right.getTime());
  if (typeof left === "string") return left < right ? -1 : left > right ? 1 : 0;
  if (ArrayBuffer.isView(left) || left instanceof ArrayBuffer) {
    return compareArrays([...new Uint8Array(
      left instanceof ArrayBuffer ? left : left.buffer,
      left.byteOffset ?? 0,
      left.byteLength,
    )], [...new Uint8Array(
      right instanceof ArrayBuffer ? right : right.buffer,
      right.byteOffset ?? 0,
      right.byteLength,
    )]);
  }
  return compareArrays(left, right);
}

function compareArrays(left, right) {
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    const result = compareKeys(left[index], right[index]);
    if (result !== 0) return result;
  }
  return Math.sign(left.length - right.length);
}

function keyRank(value) {
  if (typeof value === "number") return 1;
  if (value instanceof Date) return 2;
  if (typeof value === "string") return 3;
  if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) return 4;
  return 5;
}

function validateKey(value) {
  const valid = (typeof value === "number" && Number.isFinite(value))
    || typeof value === "string"
    || (value instanceof Date && Number.isFinite(value.getTime()))
    || value instanceof ArrayBuffer
    || ArrayBuffer.isView(value)
    || (Array.isArray(value) && value.every(item => {
      try { validateKey(item); return true; } catch { return false; }
    }));
  if (!valid) throw domError("Invalid IndexedDB key", "DataError");
}

function encodeKey(value) {
  if (typeof value === "number") return `n:${value}`;
  if (typeof value === "string") return `s:${value.length}:${value}`;
  if (value instanceof Date) return `d:${value.getTime()}`;
  if (Array.isArray(value)) return `a:${value.map(encodeKey).join("|")}`;
  const bytes = new Uint8Array(
    value instanceof ArrayBuffer ? value : value.buffer,
    value.byteOffset ?? 0,
    value.byteLength,
  );
  return `b:${[...bytes].join(",")}`;
}

function cloneKey(value) {
  validateKey(value);
  return clone(value);
}

function cloneMaybe(value) {
  return value === null || value === undefined ? value : clone(value);
}

function clone(value) {
  return performStructuredClone(value);
}

function renameStore(record, nextName) {
  if (nextName === record.name) return;
  const transaction = requireRecord(record.transaction);
  requireVersionchangeTransaction(transaction);
  const database = requireRecord(transaction.database);
  if (database.metadata.stores.has(nextName)) {
    throw domError("Object store already exists", "ConstraintError");
  }
  database.metadata.stores.delete(record.name);
  record.metadata.name = nextName;
  database.metadata.stores.set(nextName, record.metadata);
  const position = transaction.storeNames.indexOf(record.name);
  if (position !== -1) transaction.storeNames[position] = nextName;
  record.name = nextName;
}

function renameIndex(record, nextName) {
  if (nextName === record.name) return;
  const store = requireRecord(record.objectStore);
  const transaction = requireRecord(store.transaction);
  requireVersionchangeTransaction(transaction);
  if (store.metadata.indexes.has(nextName)) {
    throw domError("Index already exists", "ConstraintError");
  }
  store.metadata.indexes.delete(record.name);
  record.metadata.name = nextName;
  store.metadata.indexes.set(nextName, record.metadata);
  record.name = nextName;
}

function scheduleTransactionCompletion(record) {
  if (!record.active || record.completionScheduled) return;
  record.completionScheduled = true;
  reserveTimer(() => {
    record.completionScheduled = false;
    if (!record.active || record.versionchange) return;
    if (record.pending === 0) {
      finishTransaction(record);
    } else {
      scheduleTransactionCompletion(record);
    }
  }, 0, [], false);
}

function finishTransaction(record) {
  if (!record.active) return;
  record.active = false;
  fire(record.object, "complete");
}

function abortTransaction(record, error) {
  if (!record.active) throw domError("Transaction is inactive", "InvalidStateError");
  record.error = error;
  record.active = false;
  fire(record.object, "abort");
}

function requireActiveTransaction(record) {
  if (!record.active) throw domError("Transaction is inactive", "TransactionInactiveError");
}

function requireWritableTransaction(record) {
  if (record.mode === "readonly") {
    throw domError("Transaction is read-only", "ReadOnlyError");
  }
}

function requireVersionchangeTransaction(record) {
  if (record.mode !== "versionchange") {
    throw domError("A versionchange transaction is required", "InvalidStateError");
  }
}

function requireOpenDatabase(record) {
  if (record.closed) throw domError("Database connection is closed", "InvalidStateError");
}

function requireVersionchange(record) {
  if (record.upgradeTransaction === null) {
    throw domError("No versionchange transaction is active", "InvalidStateError");
  }
}

function fire(target, type, event = new Event(type)) {
  target.dispatchEvent(event);
  const record = requireRecord(target);
  const handler = record.handlers?.get(`on${type}`) ?? null;
  if (handler !== null) Reflect.apply(handler, target, [event]);
}

function handlerMap(...names) {
  return new Map(names.map(name => [name, null]));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function domError(message, name) {
  return new DOMException(message, name);
}

function illegalConstructor(name) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    name === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
