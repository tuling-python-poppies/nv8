import { requireNode } from "./node-state.js";
import { sectionRows } from "./html-table-section-element-rows-getter.js";

export function directTableChild(table, localName) {
  return requireNode(table).children.find(
    child => child.localName === localName,
  ) ?? null;
}

export function tableBodies(table) {
  return requireNode(table).children.filter(
    child => child.localName === "tbody",
  );
}

export function tableRows(table) {
  const children = requireNode(table).children;
  const head = children.find(child => child.localName === "thead");
  const foot = children.find(child => child.localName === "tfoot");
  const output = [];
  if (head !== undefined) {
    output.push(...sectionRows(head));
  }
  for (const child of children) {
    if (child.localName === "tbody") {
      output.push(...sectionRows(child));
    } else if (child.localName === "tr") {
      output.push(child);
    }
  }
  if (foot !== undefined) {
    output.push(...sectionRows(foot));
  }
  return output;
}

export function setDirectTableChild(table, localName, value) {
  const existing = directTableChild(table, localName);
  if (value === null) {
    existing?.remove();
    return;
  }
  if (value?.localName !== localName) {
    throw new TypeError(`The provided value is not a ${localName} element.`);
  }
  if (existing === value) {
    return;
  }
  if (existing !== null) {
    existing.replaceWith(value);
    return;
  }
  const children = requireNode(table).children;
  let reference = null;
  if (localName === "caption") {
    reference = children[0] ?? null;
  } else if (localName === "thead") {
    reference = children.find(
      child => child.localName === "tbody" || child.localName === "tfoot",
    ) ?? null;
  }
  table.insertBefore(value, reference);
}
