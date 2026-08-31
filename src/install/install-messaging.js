import { Event } from "../api/event/event-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  BroadcastChannel,
  MessageChannel,
  MessageEvent,
  MessagePort,
  broadcastClose,
  broadcastName,
  broadcastPostMessage,
  channelProperty,
  initMessageEvent,
  messageEventProperty,
  messageHandler,
  portClose,
  portPostMessage,
  portStart,
  setMessageHandler,
} from "../api/messaging/messaging-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installMessaging() {
  installInheritance();
  do {
    delete ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[0])).prototype.constructor;
    defineGlobalConstructor(((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[0])).name, ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[0])));
  } while (false);
do {
    delete ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[1])).prototype.constructor;
    defineGlobalConstructor(((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[1])).name, ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[1])));
  } while (false);
do {
    delete ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[2])).prototype.constructor;
    defineGlobalConstructor(((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[2])).name, ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[2])));
  } while (false);
do {
    delete ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[3])).prototype.constructor;
    defineGlobalConstructor(((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[3])).name, ((([
    MessageEvent,
    MessagePort,
    MessageChannel,
    BroadcastChannel,
  ])[3])));
  } while (false);
  installMessageEvent();
  installPort();
  installChannel();
  installBroadcast();
}

function installInheritance() {
  Object.setPrototypeOf(MessageEvent.prototype, Event.prototype);
  Object.setPrototypeOf(MessageEvent, Event);
  do {
    Object.setPrototypeOf(((([MessagePort, BroadcastChannel])[0])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([MessagePort, BroadcastChannel])[0])), EventTarget);
  } while (false);
do {
    Object.setPrototypeOf(((([MessagePort, BroadcastChannel])[1])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([MessagePort, BroadcastChannel])[1])), EventTarget);
  } while (false);
}

function installMessageEvent() {
  do {getter(MessageEvent, ("data"), messageEventProperty);} while (false);
do {getter(MessageEvent, ("origin"), messageEventProperty);} while (false);
do {getter(MessageEvent, ("lastEventId"), messageEventProperty);} while (false);
do {getter(MessageEvent, ("source"), messageEventProperty);} while (false);
do {getter(MessageEvent, ("ports"), messageEventProperty);} while (false);
do {getter(MessageEvent, ("userActivation"), messageEventProperty);} while (false);
  method(MessageEvent, "initMessageEvent", 1, initMessageEvent);
  finish(MessageEvent);
}

function installPort() {
  handler(MessagePort, "onmessage");
  handler(MessagePort, "onmessageerror");
  method(MessagePort, "close", 0, portClose);
  method(MessagePort, "postMessage", 1, portPostMessage);
  method(MessagePort, "start", 0, portStart);
  finish(MessagePort);
}

function installChannel() {
  getter(MessageChannel, "port1", channelProperty);
  getter(MessageChannel, "port2", channelProperty);
  finish(MessageChannel);
}

function installBroadcast() {
  getter(BroadcastChannel, "name", broadcastName);
  handler(BroadcastChannel, "onmessage");
  handler(BroadcastChannel, "onmessageerror");
  method(BroadcastChannel, "close", 0, broadcastClose);
  method(BroadcastChannel, "postMessage", 1, broadcastPostMessage);
  finish(BroadcastChannel);
}

function getter(constructor, name, operation) {
  const callback = function () { return operation(this, name); };
  registerNativeGetter(callback, name);
  definePrototypeGetter(constructor.prototype, name, callback);
}

function handler(constructor, name) {
  const callback = function () { return messageHandler(this, name); };
  registerNativeGetter(callback, name);
  definePrototypeAccessor(constructor.prototype, name, callback, function (value) {
    setMessageHandler(this, name, value);
  });
}

function method(constructor, name, length, operation) {
  const callback = {
    [name](...args) { return operation(this, ...args); },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(constructor.prototype, name, callback);
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
