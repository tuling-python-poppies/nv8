import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "../api/dom/html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "../api/dom/element-state.js";
import { assignEventHandler } from "../api/event/event-handler-attribute.js";

const states = new WeakMap();

function createCaptureElement(Constructor, tagName, ownerDocument) {
  const element = Object.create(Constructor.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  states.set(element, {
    error: null,
    track: null,
    handlers: new Map(),
    handlerListeners: new Map(),
  });
  return element;
}

function captureState(receiver) {
  const state = states.get(receiver);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function handler(name) {
  const holder = {};
  Object.defineProperty(holder, name, {
    get() {
      return captureState(this).handlers.get(name) ?? null;
    },
    set(value) {
      const state = captureState(this);
      assignEventHandler(this, state.handlers, state.handlerListeners, name,
        typeof value === "function" ? value : null);
    },
  });
  return Object.getOwnPropertyDescriptor(holder, name);
}

function installCaptureElement(name, tagName) {
  const Constructor = function () {
    throw new TypeError("Illegal constructor");
  };
  registerNativeFunction(Constructor, name);
  Object.setPrototypeOf(Constructor.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(Constructor, HTMLElement);
  delete Constructor.prototype.constructor;
  defineGlobalConstructor(name, Constructor);
  registerHTMLElementFactory(tagName, (_tag, ownerDocument) =>
    createCaptureElement(Constructor, tagName, ownerDocument));

  const error = function () { return captureState(this).error; };
  const track = function () { return captureState(this).track; };
  registerNativeGetter(error, "error");
  registerNativeGetter(track, "track");
  definePrototypeGetter(Constructor.prototype, "error", error);
  for (const property of ["oncancel", "onerror", "ontrack"]) {
    const descriptor = handler(property);
    registerNativeGetter(descriptor.get, property);
    registerNativeFunction(descriptor.set, `set ${property}`);
    definePrototypeAccessor(Constructor.prototype, property, descriptor.get, descriptor.set);
  }
  definePrototypeGetter(Constructor.prototype, "track", track);
  const setConstraints = function () {
    captureState(this);
    return undefined;
  };
  registerNativeFunction(setConstraints, "setConstraints");
  definePrototypeMethod(Constructor.prototype, "setConstraints", setConstraints);
  defineConstructorBacklink(Constructor.prototype, Constructor);
  defineToStringTag(Constructor.prototype, name);
}

export function installHTMLCaptureElements() {
  installCaptureElement("HTMLCameraElement", "camera");
  installCaptureElement("HTMLMicrophoneElement", "microphone");
}
