import { installAttr } from './install-attr.js';
import { installCharacterData } from './install-character-data.js';
import { installComment } from './install-comment.js';
import { installDocument } from './install-document.js';
import { installDocumentFragment } from './install-document-fragment.js';
import { installElement } from './install-element.js';
import { installNode } from './install-node.js';
import { installShadowRoot } from './install-shadow-root.js';
import { installText } from './install-text.js';

export function installDOMCore() {
  installNode();
  installCharacterData();
  installText();
  installComment();
  installAttr();
  installElement();
  installDocumentFragment();
  installShadowRoot();
  installDocument();
}
