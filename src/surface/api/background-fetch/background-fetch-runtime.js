import { initializeEventTarget } from "../event/event-target-state.js";
import {
  Request,
  createReplayResponse,
  requestProperty,
} from "../fetch/request-response-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function BackgroundFetchManager() {
  throw new TypeError("Illegal constructor");
}
export function BackgroundFetchRecord() {
  throw new TypeError("Illegal constructor");
}
export function BackgroundFetchRegistration() {
  throw new TypeError("Illegal constructor");
}

export const backgroundFetchConstructors = Object.freeze([
  BackgroundFetchManager,
  BackgroundFetchRecord,
  BackgroundFetchRegistration,
]);
for (const Constructor of backgroundFetchConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createBackgroundFetchManager() {
  return create(BackgroundFetchManager, {
    kind: "manager",
    registrations: new Map(),
  });
}

export function backgroundFetchProperty(value, name) {
  return requireRecord(value)[name];
}

export function setBackgroundFetchProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.kind !== "registration" || name !== "onprogress") {
    throw new TypeError("Illegal invocation");
  }
  record.onprogress = typeof input === "function" ? input : null;
}

export function backgroundFetchOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "manager") {
    if (name === "fetch") return managerFetch(record, args);
    if (name === "get") {
      requireArguments(args, 1, "get", "BackgroundFetchManager");
      return Promise.resolve(record.registrations.get(`${args[0]}`));
    }
    if (name === "getIds") {
      return Promise.resolve([...record.registrations.keys()]);
    }
  }
  if (record.kind === "registration") {
    if (name === "abort") {
      record.result = "failure";
      record.failureReason = "aborted";
      return Promise.resolve(true);
    }
    if (name === "match") {
      requireArguments(args, 1, "match", "BackgroundFetchRegistration");
      const wanted = `${args[0]}`;
      return Promise.resolve(record.records.find(entry =>
        requestProperty(
          requireRecord(entry).request,
          "url",
        ) === wanted));
    }
    if (name === "matchAll") {
      return Promise.resolve(record.records.slice());
    }
  }
  throw new TypeError(`Unsupported Background Fetch operation: ${name}`);
}

function managerFetch(manager, args) {
  requireArguments(args, 2, "fetch", "BackgroundFetchManager");
  const id = `${args[0]}`;
  if (id.length === 0) {
    throw new TypeError("Background fetch id must not be empty");
  }
  const inputs = Array.isArray(args[1]) ? args[1] : [args[1]];
  if (inputs.length === 0) {
    throw new TypeError("Background fetch requires at least one request");
  }
  const records = inputs.map(input => {
    const request = new Request(input);
    const url = requestProperty(request, "url");
    const response = createReplayResponse(null, {
      status: 200,
      statusText: "OK",
    }, {
      url,
      type: "basic",
    });
    return create(BackgroundFetchRecord, {
      kind: "record",
      request,
      responseReady: Promise.resolve(response),
    });
  });
  const options = args[2] !== null && typeof args[2] === "object"
    ? args[2]
    : {};
  const rawDownloadTotal = Number(options.downloadTotal ?? 0);
  const downloadTotal = Number.isFinite(rawDownloadTotal)
    ? rawDownloadTotal
    : 0;
  const registration = create(BackgroundFetchRegistration, {
    kind: "registration",
    id,
    uploadTotal: 0,
    uploaded: 0,
    downloadTotal,
    downloaded: downloadTotal,
    result: "success",
    failureReason: "",
    recordsAvailable: records.length > 0,
    records,
    onprogress: null,
  });
  initializeEventTarget(registration);
  manager.registrations.set(id, registration);
  return Promise.resolve(registration);
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireArguments(args, count, method, interfaceName) {
  if (args.length >= count) return;
  throw new TypeError(
    `Failed to execute '${method}' on '${interfaceName}': `
      + `${count} argument${count === 1 ? "" : "s"} required, `
      + `but only ${args.length} present.`,
  );
}
