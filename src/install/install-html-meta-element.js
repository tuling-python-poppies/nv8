import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  content,
  setContent,
} from "../api/dom/html-meta-element-content-property.js";
import {
  HTMLMetaElement,
  installHTMLMetaElementConstructor,
} from "../api/dom/html-meta-element-constructor.js";
import {
  httpEquiv,
  setHttpEquiv,
} from "../api/dom/html-meta-element-http-equiv-property.js";
import {
  media,
  setMedia,
} from "../api/dom/html-meta-element-media-property.js";
import {
  name,
  setName,
} from "../api/dom/html-meta-element-name-property.js";
import {
  scheme,
  setScheme,
} from "../api/dom/html-meta-element-scheme-property.js";

export function installHTMLMetaElement() {
  installHTMLMetaElementConstructor();
  accessor("name", name, setName);
  accessor("httpEquiv", httpEquiv, setHttpEquiv);
  accessor("content", content, setContent);
  accessor("media", media, setMedia);
  accessor("scheme", scheme, setScheme);
  defineConstructorBacklink(HTMLMetaElement.prototype, HTMLMetaElement);
  defineToStringTag(HTMLMetaElement.prototype, "HTMLMetaElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLMetaElement.prototype, name, getter, setter);
}
