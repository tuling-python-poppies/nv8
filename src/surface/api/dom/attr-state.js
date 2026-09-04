import {
  ATTRIBUTE_NODE,
  initializeNode,
  requireNode,
  setNodeValue,
} from "./node-state.js";

const attrState = new WeakMap();
const elementMutationCallbacks = new WeakMap();

export function createAttr(
  name,
  ownerDocument,
  namespaceURI = null,
  prefix = null,
  localName = name,
) {
  const attr = Object.create(Attr.prototype);
  const node = initializeNode(
    attr,
    ATTRIBUTE_NODE,
    name,
    "",
    ownerDocument,
  );
  const state = {
    name,
    namespaceURI,
    prefix,
    localName,
    ownerElement: null,
  };
  attrState.set(attr, state);
  node.valueChangeCallback = (value, oldValue) => {
    if (state.ownerElement !== null) {
      elementMutationCallbacks.get(state.ownerElement)?.(
        attr,
        value,
        oldValue,
      );
    }
  };
  return attr;
}

export function requireAttr(value) {
  const state = attrState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function attrValue(attr) {
  return requireNode(attr).nodeValue ?? "";
}

export function setAttrValue(attr, value) {
  setNodeValue(attr, `${value}`);
}

export function attachAttr(attr, element) {
  requireAttr(attr).ownerElement = element;
}

export function detachAttr(attr) {
  requireAttr(attr).ownerElement = null;
}

export function registerElementAttributeCallback(element, callback) {
  elementMutationCallbacks.set(element, callback);
}
