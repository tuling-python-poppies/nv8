import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFragment } from '../src/surface/api/dom/html-parser.js';

const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

function createFakeNode(type, properties = {}) {
  return {
    nodeType: type,
    children: [],
    parentNode: null,
    ...properties,
    appendChild(node) {
      node.parentNode = this;
      this.children.push(node);
      return node;
    },
    insertBefore(node, reference) {
      node.parentNode = this;
      const index = reference === null ? -1 : this.children.indexOf(reference);
      if (index < 0) this.children.push(node);
      else this.children.splice(index, 0, node);
      return node;
    },
  };
}

function createFakeDocument() {
  const document = {
    contentType: 'text/html',
    createDocumentFragment() {
      return createFakeNode(11);
    },
    createComment(data) {
      return createFakeNode(8, { data, nodeValue: data });
    },
    createTextNode(data) {
      return createFakeNode(3, { data, nodeValue: data });
    },
    createElement(localName) {
      return createFakeNode(1, {
        localName,
        namespaceURI: HTML_NAMESPACE,
        attributes: {},
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
      });
    },
    createElementNS(namespaceURI, localName) {
      return createFakeNode(1, {
        localName,
        namespaceURI,
        attributes: {},
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
      });
    },
  };
  return document;
}

test('parseFragment skips XML declarations without looping', () => {
  const document = createFakeDocument();
  const fragment = parseFragment(
    document,
    '<?xml version="1.0" encoding="utf-8"?><div>ok</div>',
  );

  assert.equal(fragment.children.length, 1);
  assert.equal(fragment.children[0].localName, 'div');
  assert.equal(fragment.children[0].children[0].nodeValue, 'ok');
});

test('parseFragment skips generic processing instructions', () => {
  const document = createFakeDocument();
  const fragment = parseFragment(
    document,
    '<?custom value?><span>ok</span>',
  );

  assert.equal(fragment.children.length, 1);
  assert.equal(fragment.children[0].localName, 'span');
});

test('parseFragment terminates on an unterminated processing instruction', () => {
  const document = createFakeDocument();
  const fragment = parseFragment(document, '<?xml version="1.0"');

  assert.equal(fragment.children.length, 0);
});
