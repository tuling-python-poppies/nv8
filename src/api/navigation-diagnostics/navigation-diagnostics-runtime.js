import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function FragmentDirective() {
  throw new TypeError(
    "Failed to construct 'FragmentDirective': Illegal constructor",
  );
}

export function NotRestoredReasonDetails() {
  throw new TypeError(
    "Failed to construct 'NotRestoredReasonDetails': Illegal constructor",
  );
}

export function NotRestoredReasons() {
  throw new TypeError(
    "Failed to construct 'NotRestoredReasons': Illegal constructor",
  );
}

registerNativeFunction(FragmentDirective, "FragmentDirective");
registerNativeFunction(
  NotRestoredReasonDetails,
  "NotRestoredReasonDetails",
);
registerNativeFunction(NotRestoredReasons, "NotRestoredReasons");
export const navigationDiagnosticConstructors = Object.freeze([
  FragmentDirective,
  NotRestoredReasonDetails,
  NotRestoredReasons,
]);

export function createFragmentDirective() {
  return create(FragmentDirective, { kind: "fragment-directive" });
}

export function createNotRestoredReasonDetails(reason) {
  return create(NotRestoredReasonDetails, {
    kind: "reason-details",
    reason: `${reason}`,
  });
}

export function createNotRestoredReasons(init = {}) {
  return create(NotRestoredReasons, {
    kind: "reasons",
    src: `${init.src ?? ""}`,
    id: `${init.id ?? ""}`,
    name: `${init.name ?? ""}`,
    url: `${init.url ?? ""}`,
    reasons: init.reasons ?? null,
    children: init.children ?? null,
  });
}

export function navigationDiagnosticProperty(value, name) {
  const record = requireRecord(value);
  if (record.kind === "reason-details" && name === "reason") {
    return record.reason;
  }
  if (record.kind === "reasons" && [
    "src",
    "id",
    "name",
    "url",
    "reasons",
    "children",
  ].includes(name)) return record[name];
  throw new TypeError("Illegal invocation");
}

export function navigationDiagnosticOperation(value, name) {
  const record = requireRecord(value);
  if (name !== "toJSON") throw new TypeError("Illegal invocation");
  if (record.kind === "reason-details") return { reason: record.reason };
  if (record.kind === "reasons") {
    return {
      src: record.src,
      id: record.id,
      name: record.name,
      url: record.url,
      reasons: record.reasons,
      children: record.children,
    };
  }
  throw new TypeError("Illegal invocation");
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
