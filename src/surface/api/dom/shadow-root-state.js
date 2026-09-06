import { attachElementShadow, elementShadowRoot } from "./element-state.js";
import { ShadowRoot } from "./shadow-root-constructor.js";
import {
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE,
  initializeNode,
  registerMutationHook,
  requireNode,
} from "./node-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const shadowRootSlot = createRealmSlot(() => ({
  liveShadowRoots: new Set(),
}), "shadowRoot");

function shadowRootRealmState() {
  return shadowRootSlot.get(globalThis);
}

const shadowState = new WeakMap();

export function createShadowRoot(host, init) {
  const mode = `${init?.mode ?? ""}`;
  if (mode !== "open" && mode !== "closed") {
    throw new TypeError(
      "Failed to execute 'attachShadow' on 'Element': the provided value is not a valid enum value of type ShadowRootMode.",
    );
  }
  const slotAssignment = init?.slotAssignment === undefined
    ? "named"
    : `${init.slotAssignment}`;
  if (slotAssignment !== "named" && slotAssignment !== "manual") {
    throw new TypeError(
      "The provided value is not a valid enum value of type SlotAssignmentMode.",
    );
  }
  const root = Object.create(ShadowRoot.prototype);
  initializeNode(
    root,
    DOCUMENT_FRAGMENT_NODE,
    "#document-fragment",
    null,
    requireNode(host).ownerDocument,
  );
  requireNode(root).host = host;
  shadowState.set(root, {
    host,
    mode,
    delegatesFocus: Boolean(init?.delegatesFocus),
    slotAssignment,
    referenceTarget: null,
    serializable: Boolean(init?.serializable),
    clonable: Boolean(init?.clonable),
    adoptedStyleSheets: [],
    onslotchange: null,
    assignmentSignatures: new WeakMap(),
    slotchangeQueued: false,
  });
  attachElementShadow(host, root);
  shadowRootRealmState().liveShadowRoots.add(root);
  return root;
}

export function requireShadowRoot(value) {
  const state = shadowState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function exposedShadowRoot(host) {
  const root = elementShadowRoot(host);
  return root !== null && requireShadowRoot(root).mode === "open" ? root : null;
}

export function slotsInShadowRoot(root) {
  requireShadowRoot(root);
  return descendantsIncludingChildren(root).filter(
    node => requireNode(node).nodeType === ELEMENT_NODE
      && node.localName === "slot",
  );
}

export function assignedNodesForSlot(slot, flatten = false) {
  const root = shadowRootContaining(slot);
  if (root === null) {
    return [];
  }
  const state = requireShadowRoot(root);
  let assigned;
  if (state.slotAssignment === "manual") {
    assigned = requireSlotAssignments(slot).slice();
  } else {
    const slots = slotsInShadowRoot(root);
    const name = slot.getAttribute("name") ?? "";
    if (slots.find(candidate => (candidate.getAttribute("name") ?? "") === name) !== slot) {
      assigned = [];
    } else {
      assigned = requireNode(state.host).children.filter((node) => (
        slotNameOf(node) === name
      ));
    }
  }
  if (assigned.length === 0) {
    assigned = requireNode(slot).children.slice();
  }
  if (!flatten) {
    return assigned;
  }
  const output = [];
  for (const node of assigned) {
    if (requireNode(node).nodeType === ELEMENT_NODE && node.localName === "slot") {
      output.push(...assignedNodesForSlot(node, true));
    } else {
      output.push(node);
    }
  }
  return output;
}

const manualAssignments = new WeakMap();

export function setManualSlotAssignments(slot, nodes) {
  const root = shadowRootContaining(slot);
  if (root === null || requireShadowRoot(root).slotAssignment !== "manual") {
    return;
  }
  const unique = [];
  for (const node of nodes) {
    requireNode(node);
    if (!unique.includes(node)) {
      unique.push(node);
    }
  }
  manualAssignments.set(slot, unique);
  queueSlotchangeScan(root);
}

export function assignedSlotForNode(node) {
  const parent = requireNode(node).parent;
  if (parent === null || requireNode(parent).nodeType !== ELEMENT_NODE) {
    return null;
  }
  const root = elementShadowRoot(parent);
  if (root === null || requireShadowRoot(root).mode === "closed") {
    return null;
  }
  for (const slot of slotsInShadowRoot(root)) {
    if (assignedNodesForSlot(slot).includes(node)) {
      return slot;
    }
  }
  return null;
}

function requireSlotAssignments(slot) {
  return manualAssignments.get(slot) ?? [];
}

function shadowRootContaining(node) {
  let current = node;
  while (requireNode(current).parent !== null) {
    current = requireNode(current).parent;
  }
  return shadowState.has(current) ? current : null;
}

function slotNameOf(node) {
  if (requireNode(node).nodeType !== ELEMENT_NODE) {
    return "";
  }
  return node.getAttribute("slot") ?? "";
}

function descendantsIncludingChildren(node) {
  const output = [];
  for (const child of requireNode(node).children) {
    output.push(child);
    output.push(...descendantsIncludingChildren(child));
  }
  return output;
}

registerMutationHook(() => {
  for (const root of shadowRootRealmState().liveShadowRoots) {
    queueSlotchangeScan(root);
  }
});

function queueSlotchangeScan(root) {
  const state = shadowState.get(root);
  if (state === undefined || state.slotchangeQueued) {
    return;
  }
  state.slotchangeQueued = true;
  queueMicrotask(() => {
    state.slotchangeQueued = false;
    for (const slot of slotsInShadowRoot(root)) {
      const assigned = assignedNodesForSlot(slot);
      const signature = assigned.slice();
      const previous = state.assignmentSignatures.get(slot);
      state.assignmentSignatures.set(slot, signature);
      if (previous === undefined || sameNodes(previous, signature)) {
        continue;
      }
      slot.dispatchEvent(new Event("slotchange", { bubbles: true }));
    }
  });
}

function sameNodes(left, right) {
  return left.length === right.length
    && left.every((node, index) => node === right[index]);
}
