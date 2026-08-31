import { installNodeList } from './install-node-list.js';
import { installHTMLCollection } from './install-html-collection.js';
import { installNamedNodeMap } from './install-named-node-map.js';
import { installDOMTokenList } from './install-dom-token-list.js';

export function installDOMCollections() {
  installNodeList();
  installHTMLCollection();
  installNamedNodeMap();
  installDOMTokenList();
}
