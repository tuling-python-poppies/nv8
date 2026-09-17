import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
const observers = new Set();

export function ReportingObserver(callback) {
  if (new.target === undefined) {
    throw new TypeError("ReportingObserver requires new");
  }
  if (typeof callback !== "function") {
    throw new TypeError("ReportingObserver callback must be callable");
  }
  const options = arguments[1] ?? {};
  state.set(this, {
    kind: "observer",
    object: this,
    callback,
    types: options.types === undefined
      ? null
      : new Set([...options.types].map(String)),
    buffered: Boolean(options.buffered),
    active: false,
    queued: [],
    deliveryScheduled: false,
  });
}

export function ReportBody() { illegalConstructor("ReportBody", new.target); }
export function CSPViolationReportBody() { illegalConstructor("CSPViolationReportBody", new.target); }
export function IntegrityViolationReportBody() { illegalConstructor("IntegrityViolationReportBody", new.target); }
export const reportingConstructors = Object.freeze([
  ReportingObserver,
  ReportBody,
  CSPViolationReportBody,
  IntegrityViolationReportBody,
]);
for (const Constructor of reportingConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function reportError(error) {
  const normalized = normalizeError(error);
  const body = createBody(ReportBody, {
    name: normalized.name,
    message: normalized.message,
  });
  const report = Object.freeze({
    type: "exception",
    url: `${globalThis.location?.href ?? ""}`,
    body,
  });
  for (const observer of observers) {
    if (observer.types !== null && !observer.types.has(report.type)) continue;
    observer.queued.push(report);
    scheduleDelivery(observer);
  }
}
registerNativeFunction(reportError, "reportError");

export function reportingProperty(value, name) {
  const record = requireRecord(value);
  return record.values?.[name];
}

export function reportingOperation(value, name) {
  const record = requireRecord(value);
  if (record.kind === "observer") {
    if (name === "observe") {
      record.active = true;
      observers.add(record);
      return undefined;
    }
    if (name === "disconnect") {
      record.active = false;
      record.queued.length = 0;
      observers.delete(record);
      return undefined;
    }
    if (name === "takeRecords") {
      return takeRecords(record);
    }
  }
  if (record.kind === "body" && name === "toJSON") {
    return Object.freeze({ ...record.values });
  }
  throw new TypeError(`Unsupported reporting operation: ${name}`);
}

function createBody(Constructor, values) {
  const value = Object.create(Constructor.prototype);
  state.set(value, { kind: "body", values: Object.freeze(values) });
  return value;
}

function scheduleDelivery(record) {
  if (!record.active || record.deliveryScheduled) return;
  record.deliveryScheduled = true;
  Promise.resolve().then(() => {
    record.deliveryScheduled = false;
    if (!record.active || record.queued.length === 0) return;
    const reports = takeRecords(record);
    Reflect.apply(record.callback, record.object, [reports, record.object]);
  });
}

function takeRecords(record) {
  const records = Object.freeze(record.queued.splice(0));
  return records;
}

function normalizeError(error) {
  if (error instanceof Error) {
    return { name: `${error.name}`, message: `${error.message}` };
  }
  return { name: "Error", message: `${error}` };
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
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
