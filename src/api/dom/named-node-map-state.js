import {
  attachAttr,
  detachAttr,
  requireAttr,
} from "./attr-state.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";

const mapState = new WeakMap();

export function createNamedNodeMap(element, onMutation) {
  const map = Object.create(NamedNodeMap.prototype);
  mapState.set(map, {
    element,
    attributes: [],
    indexedLength: 0,
    namedProperties: new Set(),
    onMutation,
  });
  refreshNamedNodeMap(map);
  return map;
}

export function requireNamedNodeMap(value) {
  const state = mapState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function refreshNamedNodeMap(map) {
  const state = requireNamedNodeMap(map);
  for (let index = 0; index < state.indexedLength; index += 1) {
    if (index >= state.attributes.length) {
      delete map[index];
    }
  }
  for (const name of state.namedProperties) {
    delete map[name];
  }
  state.namedProperties.clear();
  for (let index = 0; index < state.attributes.length; index += 1) {
    const attr = state.attributes[index];
    Object.defineProperty(map, index, {
      value: attr,
      writable: false,
      enumerable: true,
      configurable: true,
    });
    const name = requireAttr(attr).name;
    if (
      !Reflect.has(NamedNodeMap.prototype, name)
      && !Object.prototype.hasOwnProperty.call(map, name)
    ) {
      Object.defineProperty(map, name, {
        value: attr,
        writable: false,
        enumerable: false,
        configurable: true,
      });
      state.namedProperties.add(name);
    }
  }
  state.indexedLength = state.attributes.length;
  return state.attributes;
}

export function namedItem(map, name) {
  const normalized = `${name}`;
  return refreshNamedNodeMap(map).find(
    attr => requireAttr(attr).name === normalized,
  ) ?? null;
}

export function namedItemNS(map, namespace, localName) {
  const normalizedNamespace = namespace === null ? null : `${namespace}`;
  const normalizedLocalName = `${localName}`;
  return refreshNamedNodeMap(map).find((attr) => {
    const state = requireAttr(attr);
    return state.namespaceURI === normalizedNamespace
      && state.localName === normalizedLocalName;
  }) ?? null;
}

export function setNamedItemAlgorithm(map, attr, namespaceAware = false) {
  const state = requireNamedNodeMap(map);
  const attrRecord = requireAttr(attr);
  if (
    attrRecord.ownerElement !== null
    && attrRecord.ownerElement !== state.element
  ) {
    throw new DOMException(
      "The attribute is already in use by another element.",
      "InUseAttributeError",
    );
  }
  const existing = namespaceAware
    ? namedItemNS(map, attrRecord.namespaceURI, attrRecord.localName)
    : namedItem(map, attrRecord.name);
  if (existing === attr) {
    return attr;
  }
  let index = state.attributes.length;
  if (existing !== null) {
    index = state.attributes.indexOf(existing);
    detachAttr(existing);
    state.attributes[index] = attr;
  } else {
    state.attributes.push(attr);
  }
  attachAttr(attr, state.element);
  refreshNamedNodeMap(map);
  state.onMutation(attrRecord.name, existing, attr);
  return existing;
}

export function removeNamedItemAlgorithm(
  map,
  name,
  namespaceAware = false,
  localName = null,
) {
  const state = requireNamedNodeMap(map);
  const attr = namespaceAware
    ? namedItemNS(map, name, localName)
    : namedItem(map, name);
  if (attr === null) {
    throw new DOMException("The attribute was not found.", "NotFoundError");
  }
  state.attributes.splice(state.attributes.indexOf(attr), 1);
  detachAttr(attr);
  refreshNamedNodeMap(map);
  state.onMutation(requireAttr(attr).name, attr, null);
  return attr;
}
