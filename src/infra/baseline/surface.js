import { createHash } from 'node:crypto';

const GLOBAL_NAMES = Object.freeze([
  'window', 'self', 'document', 'navigator', 'location', 'history',
  'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest', 'Worker',
  'SharedWorker', 'ServiceWorker', 'MutationObserver', 'URL', 'crypto',
  'performance', 'screen', 'Event', 'EventTarget', 'Node', 'Element',
  'Document', 'HTMLScriptElement',
]);

const PROTOTYPE_NAMES = Object.freeze([
  'EventTarget', 'Event', 'Node', 'Element', 'Document', 'HTMLScriptElement',
  'Storage', 'Location', 'Worker', 'ServiceWorkerContainer',
]);

const SURFACE_DESCRIPTOR_EXPRESSION = `(${createExpression()})()`;

export async function captureSurfaceSnapshot(evaluate) {
  if (typeof evaluate !== 'function') throw new TypeError('Surface evaluator must be a function');
  const value = await evaluate(`JSON.stringify(${SURFACE_DESCRIPTOR_EXPRESSION})`);
  return normalizeSurfaceSnapshot(JSON.parse(value));
}

export function summarizeSurfaceSnapshot(snapshot) {
  const normalized = normalize(snapshot);
  const serialized = JSON.stringify(normalized);
  return {
    schema: normalized.schema,
    digest: createHash('sha256').update(serialized).digest('hex'),
    globals: Object.keys(normalized.globals).length,
    prototypes: Object.keys(normalized.prototypes).length,
    members: Object.values(normalized.prototypes)
      .reduce((total, entry) => total + (entry?.members?.length ?? 0), 0),
  };
}

function normalizeSurfaceSnapshot(snapshot) {
  return normalize(snapshot);
}

function createExpression() {
  return `(() => {
    const descriptor = value => {
      if (!value) return null;
      return {
        configurable: Boolean(value.configurable),
        enumerable: Boolean(value.enumerable),
        writable: 'writable' in value ? Boolean(value.writable) : null,
        getter: typeof value.get === 'function',
        setter: typeof value.set === 'function',
        valueType: 'value' in value ? typeof value.value : null,
      };
    };
    const targetDescriptor = (target, name) => descriptor(
      target ? Object.getOwnPropertyDescriptor(target, name) : null,
    );
    const globals = ${JSON.stringify(GLOBAL_NAMES)};
    const prototypes = ${JSON.stringify(PROTOTYPE_NAMES)};
    return {
      schema: 'nv8/surface/snapshot@1',
      globals: Object.fromEntries(globals.map(name => [name, {
        type: typeof globalThis[name],
        descriptor: targetDescriptor(globalThis, name),
      }])),
      prototypes: Object.fromEntries(prototypes.map(name => {
        const constructor = globalThis[name];
        const prototype = typeof constructor === 'function' ? constructor.prototype : null;
        const members = prototype === null ? [] : Reflect.ownKeys(prototype)
          .filter(key => typeof key === 'string')
          .sort();
        return [name, {
          present: prototype !== null,
          members: members.map(member => ({
            name: member,
            descriptor: targetDescriptor(prototype, member),
          })),
        }];
      })),
    };
  })`;
}

function normalize(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(normalize);
  return Object.fromEntries(
    Object.keys(value).sort().map(key => [key, normalize(value[key])]),
  );
}
