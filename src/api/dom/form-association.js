import { getAttributeValue } from "./element-state.js";
import { descendants, ELEMENT_NODE, requireNode } from "./node-state.js";

const labelableNames = new Set([
  "button",
  "input",
  "meter",
  "output",
  "progress",
  "select",
  "textarea",
]);

export function formOwnerOf(element) {
  const explicitId = getAttributeValue(element, "form");
  if (explicitId !== null && explicitId !== "") {
    const candidate = element.ownerDocument?.getElementById(explicitId) ?? null;
    if (candidate?.localName === "form") {
      return candidate;
    }
  }
  return element.closest("form");
}

export function labelControl(label) {
  const forId = getAttributeValue(label, "for");
  if (forId !== null && forId !== "") {
    const candidate = label.ownerDocument?.getElementById(forId) ?? null;
    return isLabelable(candidate) ? candidate : null;
  }
  for (const candidate of descendants(label)) {
    if (isLabelable(candidate)) {
      return candidate;
    }
  }
  return null;
}

function isLabelable(candidate) {
  if (
    candidate === null
    || requireNode(candidate).nodeType !== ELEMENT_NODE
    || !labelableNames.has(candidate.localName)
  ) {
    return false;
  }
  return candidate.localName !== "input"
    || candidate.getAttribute("type")?.toLowerCase() !== "hidden";
}
