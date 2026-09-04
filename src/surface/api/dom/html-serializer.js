import { attrValue, requireAttr } from "./attr-state.js";
import { attributeNodes, requireElement } from "./element-state.js";
import { requireNode } from "./node-state.js";

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function serializeChildren(node) {
  return requireNode(node).children.map(child => serializeNode(child)).join("");
}

export function serializeNode(node) {
  const state = requireNode(node);
  if (state.nodeType === 3) {
    const parentName = state.parent === null
      ? ""
      : (requireNode(state.parent).nodeName ?? "").toLowerCase();
    return parentName === "script" || parentName === "style"
      ? state.nodeValue ?? ""
      : escapeText(state.nodeValue ?? "");
  }
  if (state.nodeType === 8) {
    return `<!--${state.nodeValue ?? ""}-->`;
  }
  if (state.nodeType === 10) {
    return `<!DOCTYPE ${node.name}>`;
  }
  if (state.nodeType === 9 || state.nodeType === 11) {
    return serializeChildren(node);
  }
  if (state.nodeType !== 1) {
    return "";
  }
  const element = requireElement(node);
  const name = element.localName;
  let output = `<${name}`;
  for (const attr of attributeNodes(node)) {
    output += ` ${requireAttr(attr).name}="${escapeAttribute(attrValue(attr))}"`;
  }
  output += ">";
  if (voidElements.has(name)) {
    return output;
  }
  return `${output}${serializeChildren(node)}</${name}>`;
}

function escapeText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("\u00a0", "&nbsp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("\u00a0", "&nbsp;")
    .replaceAll("\"", "&quot;");
}
