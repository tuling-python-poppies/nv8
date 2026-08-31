import { createNodeList } from "./node-list-state.js";
import { descendants, requireNode } from "./node-state.js";
import { documentElements } from "./document-record.js";

export function querySelectorAlgorithm(root, selector) {
  return select(root, selector)[0] ?? null;
}

export function querySelectorAllAlgorithm(root, selector) {
  const values = select(root, selector);
  return createNodeList(() => values, false);
}

export function matchesAlgorithm(element, selector) {
  requireElementLike(element);
  const groups = splitGroups(`${selector}`);
  return groups.some(group => matchesComplex(element, tokenizeComplex(group), null));
}

export function closestAlgorithm(element, selector) {
  requireElementLike(element);
  const groups = splitGroups(`${selector}`).map(tokenizeComplex);
  let current = element;
  while (current !== null && requireNode(current).nodeType === 1) {
    if (groups.some(group => matchesComplex(current, group, element))) {
      return current;
    }
    current = requireNode(current).parent;
  }
  return null;
}

function select(root, selector) {
  requireNode(root);
  const groups = splitGroups(`${selector}`).map(tokenizeComplex);
  const elements = requireNode(root).nodeType === 9
    ? documentElements(root)
    : descendants(root).filter(node => requireNode(node).nodeType === 1);
  return elements.filter(
    element => groups.some(group => matchesComplex(element, group, root)),
  );
}

function splitGroups(selector) {
  const groups = [];
  let start = 0;
  let bracketDepth = 0;
  let parenthesisDepth = 0;
  let quote = "";
  for (let index = 0; index < selector.length; index += 1) {
    const character = selector[index];
    if (quote !== "") {
      if (character === quote) {
        quote = "";
      }
    } else if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === "[") {
      bracketDepth += 1;
    } else if (character === "]") {
      bracketDepth -= 1;
    } else if (character === "(") {
      parenthesisDepth += 1;
    } else if (character === ")") {
      parenthesisDepth -= 1;
    } else if (character === "," && bracketDepth === 0 && parenthesisDepth === 0) {
      groups.push(selector.slice(start, index).trim());
      start = index + 1;
    }
  }
  groups.push(selector.slice(start).trim());
  if (
    groups.some(group => group === "")
    || bracketDepth !== 0
    || parenthesisDepth !== 0
    || quote !== ""
  ) {
    throw syntaxError(selector);
  }
  return groups;
}

function tokenizeComplex(selector) {
  const tokens = [];
  let start = 0;
  let bracketDepth = 0;
  let parenthesisDepth = 0;
  let quote = "";
  let pendingDescendant = false;
  for (let index = 0; index <= selector.length; index += 1) {
    const character = selector[index] ?? "";
    if (quote !== "") {
      if (character === quote) {
        quote = "";
      }
      continue;
    }
    if (character === "\"" || character === "'") {
      quote = character;
      continue;
    }
    if (character === "[") {
      bracketDepth += 1;
      continue;
    }
    if (character === "]") {
      bracketDepth -= 1;
      continue;
    }
    if (character === "(") {
      parenthesisDepth += 1;
      continue;
    }
    if (character === ")") {
      parenthesisDepth -= 1;
      continue;
    }
    if (bracketDepth !== 0 || parenthesisDepth !== 0) {
      continue;
    }
    if (character === ">" || /\s/u.test(character) || character === "") {
      const part = selector.slice(start, index).trim();
      if (part !== "") {
        if (pendingDescendant && tokens.length > 0) {
          tokens.push(" ");
        }
        tokens.push(part);
        pendingDescendant = false;
      }
      if (character === ">") {
        if (tokens.at(-1) === " ") {
          tokens.pop();
        }
        tokens.push(">");
        pendingDescendant = false;
      } else if (character !== "") {
        pendingDescendant = tokens.length > 0 && tokens.at(-1) !== ">";
      }
      start = index + 1;
    }
  }
  if (
    tokens.length === 0
    || typeof tokens.at(-1) !== "string"
    || tokens.at(-1) === " "
    || tokens.at(-1) === ">"
  ) {
    throw syntaxError(selector);
  }
  return tokens;
}

function matchesComplex(element, tokens, scope) {
  let index = tokens.length - 1;
  let current = element;
  if (!matchesSimple(current, tokens[index], scope)) {
    return false;
  }
  index -= 1;
  while (index >= 0) {
    const combinator = tokens[index];
    const simple = tokens[index - 1];
    if (combinator === ">") {
      current = requireNode(current).parent;
      if (
        current === null
        || requireNode(current).nodeType !== 1
        || !matchesSimple(current, simple, scope)
      ) {
        return false;
      }
    } else {
      let ancestor = requireNode(current).parent;
      while (
        ancestor !== null
        && (
          requireNode(ancestor).nodeType !== 1
          || !matchesSimple(ancestor, simple, scope)
        )
      ) {
        ancestor = requireNode(ancestor).parent;
      }
      if (ancestor === null) {
        return false;
      }
      current = ancestor;
    }
    index -= 2;
  }
  return true;
}

function matchesSimple(element, selector, scope) {
  requireElementLike(element);
  let remaining = selector;
  const type = /^(\*|[A-Za-z][A-Za-z0-9_-]*)/u.exec(remaining);
  if (type !== null) {
    if (type[1] !== "*" && element.localName !== type[1].toLowerCase()) {
      return false;
    }
    remaining = remaining.slice(type[0].length);
  }
  while (remaining !== "") {
    let match = /^#([A-Za-z0-9_-]+)/u.exec(remaining);
    if (match !== null) {
      if (element.getAttribute("id") !== match[1]) {
        return false;
      }
      remaining = remaining.slice(match[0].length);
      continue;
    }
    match = /^\.([A-Za-z0-9_-]+)/u.exec(remaining);
    if (match !== null) {
      const classes = (element.getAttribute("class") ?? "").split(/\s+/u);
      if (!classes.includes(match[1])) {
        return false;
      }
      remaining = remaining.slice(match[0].length);
      continue;
    }
    match = /^\[\s*([^\s~|^$*=\]]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\s*\]/u.exec(remaining);
    if (match !== null) {
      const value = element.getAttribute(match[1]);
      if (value === null) {
        return false;
      }
      if (match[2] !== undefined) {
        const expected = match[3] ?? match[4] ?? match[5] ?? "";
        if (!attributeOperator(value, match[2], expected)) {
          return false;
        }
      }
      remaining = remaining.slice(match[0].length);
      continue;
    }
    if (remaining.startsWith(":scope")) {
      if (element !== scope) {
        return false;
      }
      remaining = remaining.slice(6);
      continue;
    }
    if (remaining.startsWith(":first-child")) {
      if (elementSiblingIndex(element) !== 0) {
        return false;
      }
      remaining = remaining.slice(12);
      continue;
    }
    if (remaining.startsWith(":last-child")) {
      const siblings = elementSiblings(element);
      if (siblings.indexOf(element) !== siblings.length - 1) {
        return false;
      }
      remaining = remaining.slice(11);
      continue;
    }
    match = /^:not\((.+)\)$/u.exec(remaining);
    if (match !== null) {
      if (matchesSimple(element, match[1], scope)) {
        return false;
      }
      remaining = "";
      continue;
    }
    throw syntaxError(selector);
  }
  return true;
}

function elementSiblings(element) {
  const parent = requireNode(element).parent;
  return parent === null ? [element] : requireNode(parent).children.filter(
    node => requireNode(node).nodeType === 1,
  );
}

function elementSiblingIndex(element) {
  return elementSiblings(element).indexOf(element);
}

function attributeOperator(value, operator, expected) {
  switch (operator) {
    case "=":
      return value === expected;
    case "~=":
      return value.split(/\s+/u).includes(expected);
    case "|=":
      return value === expected || value.startsWith(`${expected}-`);
    case "^=":
      return value.startsWith(expected);
    case "$=":
      return value.endsWith(expected);
    case "*=":
      return value.includes(expected);
    default:
      return false;
  }
}

function requireElementLike(value) {
  if (requireNode(value).nodeType !== 1) {
    throw new TypeError("Illegal invocation");
  }
}

function syntaxError(selector) {
  return new DOMException(`'${selector}' is not a valid selector.`, "SyntaxError");
}
