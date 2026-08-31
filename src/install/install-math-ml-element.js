import {
  finishMathMLElementConstructor,
  MathMLElement,
  installMathMLElementConstructor,
} from "../api/dom/math-ml-element-constructor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";
import {
  HTML_NAMESPACE,
  requireElement,
} from "../api/dom/element-state.js";
import {
  installHTMLElementAfterConstructorEventMembers,
  installHTMLElementEarlyEventMembers,
  installHTMLElementLateEventMembers,
} from "../api/dom/html-element-event-members.js";
import { dataset } from "../api/dom/html-element-dataset-getter.js";
import {
  nonce,
  setNonce,
} from "../api/dom/html-element-nonce-property.js";
import {
  autofocus,
  setAutofocus,
} from "../api/dom/html-element-autofocus-property.js";
import {
  tabIndex,
  setTabIndex,
} from "../api/dom/html-element-tab-index-property.js";
import { style } from "../api/dom/html-element-style-getter.js";
import {
  attributeStyleMap,
} from "../api/dom/html-element-attribute-style-map-getter.js";
import { blur } from "../api/dom/html-element-blur.js";
import { focus } from "../api/dom/html-element-focus.js";
import {
  focusGroup,
  setFocusGroup,
} from "../api/dom/html-element-focus-group-property.js";
import {
  focusGroupStart,
  setFocusGroupStart,
} from "../api/dom/html-element-focus-group-start-property.js";

export function installMathMLElement() {
  installMathMLElementConstructor();
  installHTMLElementEarlyEventMembers(accessor);
  getter("dataset", dataset);
  accessor("nonce", nonce, setNonce);
  accessor("autofocus", autofocus, setAutofocus);
  accessor("tabIndex", tabIndex, setTabIndex);
  getter("style", style);
  getter("attributeStyleMap", attributeStyleMap);
  method("blur", blur);
  method("focus", focus);
  installHTMLElementLateEventMembers(accessor);
  accessor("focusGroup", focusGroup, setFocusGroup);
  accessor("focusGroupStart", focusGroupStart, setFocusGroupStart);
  finishMathMLElementConstructor();
  installHTMLElementAfterConstructorEventMembers(accessor);
}

function accessor(name, get, set) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return withHTMLNamespace(this, () => Reflect.apply(get, this, []));
    },
    set [name](value) {
      return withHTMLNamespace(
        this,
        () => Reflect.apply(set, this, [value]),
      );
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  Object.defineProperty(MathMLElement.prototype, name, {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

function getter(name, get) {
  const callback = Object.getOwnPropertyDescriptor({
    get [name]() {
      return withHTMLNamespace(this, () => Reflect.apply(get, this, []));
    },
  }, name).get;
  registerNativeGetter(callback, name);
  Object.defineProperty(MathMLElement.prototype, name, {
    get: callback,
    enumerable: true,
    configurable: true,
  });
}

function method(name, callback) {
  const wrapper = {
    [name](...args) {
      return withHTMLNamespace(
        this,
        () => Reflect.apply(callback, this, args),
      );
    },
  }[name];
  Object.defineProperty(wrapper, "length", {
    value: callback.length,
    configurable: true,
  });
  registerNativeFunction(wrapper, name);
  Object.defineProperty(MathMLElement.prototype, name, {
    value: wrapper,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function withHTMLNamespace(value, callback) {
  const record = requireElement(value);
  const namespace = record.namespaceURI;
  record.namespaceURI = HTML_NAMESPACE;
  try {
    return callback();
  } finally {
    record.namespaceURI = namespace;
  }
}
