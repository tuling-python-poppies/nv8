import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
let singleton = null;

export function TrustedTypePolicyFactory() { illegalConstructor("TrustedTypePolicyFactory"); }
export function TrustedTypePolicy() { illegalConstructor("TrustedTypePolicy"); }
export function TrustedHTML() { illegalConstructor("TrustedHTML"); }
export function TrustedScript() { illegalConstructor("TrustedScript"); }
export function TrustedScriptURL() { illegalConstructor("TrustedScriptURL"); }

export const trustedTypeConstructors = Object.freeze([
  TrustedTypePolicyFactory,
  TrustedTypePolicy,
  TrustedHTML,
  TrustedScript,
  TrustedScriptURL,
]);
for (const Constructor of trustedTypeConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createTrustedTypePolicyFactory() {
  if (singleton !== null) return singleton;
  const value = Object.create(TrustedTypePolicyFactory.prototype);
  const emptyHTML = createTrustedValue(TrustedHTML, "html", "");
  const emptyScript = createTrustedValue(TrustedScript, "script", "");
  state.set(value, {
    kind: "factory",
    emptyHTML,
    emptyScript,
    defaultPolicy: null,
    policies: new Map(),
  });
  singleton = value;
  return value;
}

export function trustedTypeProperty(value, name) {
  return requireRecord(value)[name];
}

export function trustedTypeOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "factory") return factoryOperation(record, name, args);
  if (record.kind === "policy") return policyOperation(record, name, args);
  if (["html", "script", "scriptURL"].includes(record.kind)
    && (name === "toString" || name === "toJSON")) {
    return record.value;
  }
  throw new TypeError(`Unsupported Trusted Types operation: ${name}`);
}

export function unwrapTrustedScript(value) {
  const record = state.get(value);
  return record?.kind === "script" ? record.value : value;
}

function factoryOperation(record, name, args) {
  if (name === "createPolicy") {
    const policyName = `${args[0]}`;
    if (record.policies.has(policyName)) {
      throw new TypeError(`Trusted Types policy '${policyName}' already exists`);
    }
    const rules = args[1] ?? {};
    const policy = Object.create(TrustedTypePolicy.prototype);
    state.set(policy, {
      kind: "policy",
      name: policyName,
      rules: {
        createHTML: callableOrNull(rules.createHTML),
        createScript: callableOrNull(rules.createScript),
        createScriptURL: callableOrNull(rules.createScriptURL),
      },
    });
    record.policies.set(policyName, policy);
    if (policyName === "default") record.defaultPolicy = policy;
    return policy;
  }
  if (name === "isHTML") return state.get(args[0])?.kind === "html";
  if (name === "isScript") return state.get(args[0])?.kind === "script";
  if (name === "isScriptURL") return state.get(args[0])?.kind === "scriptURL";
  if (name === "getAttributeType") {
    return attributeType(`${args[0]}`, `${args[1]}`);
  }
  if (name === "getPropertyType") {
    return propertyType(`${args[0]}`, `${args[1]}`);
  }
  if (name === "getTypeMapping") {
    return Object.freeze({
      script: Object.freeze({
        src: "TrustedScriptURL",
        text: "TrustedScript",
        textContent: "TrustedScript",
        innerText: "TrustedScript",
      }),
      iframe: Object.freeze({ srcdoc: "TrustedHTML" }),
      embed: Object.freeze({ src: "TrustedScriptURL" }),
      object: Object.freeze({ data: "TrustedScriptURL" }),
    });
  }
}

function policyOperation(record, name, args) {
  const mapping = {
    createHTML: [TrustedHTML, "html"],
    createScript: [TrustedScript, "script"],
    createScriptURL: [TrustedScriptURL, "scriptURL"],
  };
  const [Constructor, kind] = mapping[name];
  const input = `${args[0]}`;
  const callback = record.rules[name];
  const output = callback === null
    ? input
    : Reflect.apply(callback, undefined, [input, ...args.slice(1)]);
  return createTrustedValue(Constructor, kind, `${output}`);
}

function createTrustedValue(Constructor, kind, value) {
  const object = Object.create(Constructor.prototype);
  state.set(object, { kind, value });
  return object;
}

function attributeType(elementName, attributeName) {
  const element = elementName.toLowerCase();
  const attribute = attributeName.toLowerCase();
  if (element === "script" && attribute === "src") return "TrustedScriptURL";
  if (element === "iframe" && attribute === "srcdoc") return "TrustedHTML";
  if (["embed", "object"].includes(element)
    && ["src", "data"].includes(attribute)) return "TrustedScriptURL";
  if (attribute.startsWith("on")) return "TrustedScript";
  return null;
}

function propertyType(elementName, propertyName) {
  const element = elementName.toLowerCase();
  const property = propertyName.toLowerCase();
  if (["innerhtml", "outerhtml"].includes(property)) return "TrustedHTML";
  if (element === "script" && ["text", "textcontent", "innertext"].includes(property)) {
    return "TrustedScript";
  }
  return attributeType(element, property);
}

function callableOrNull(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "function") throw new TypeError("Policy rule must be callable");
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
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
