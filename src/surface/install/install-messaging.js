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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installMessaging() {
  installInheritance();

    delete MessageEvent.prototype.constructor;
    defineGlobalConstructor(MessageEvent.name, MessageEvent);

    delete MessagePort.prototype.constructor;
    defineGlobalConstructor(MessagePort.name, MessagePort);

    delete MessageChannel.prototype.constructor;
    defineGlobalConstructor(MessageChannel.name, MessageChannel);

    delete BroadcastChannel.prototype.constructor;
    defineGlobalConstructor(BroadcastChannel.name, BroadcastChannel);

  installMessageEvent();
  installPort();
  installChannel();
  installBroadcast();
}

function installInheritance() {
  Object.setPrototypeOf(MessageEvent.prototype, Event.prototype);
  Object.setPrototypeOf(MessageEvent, Event);

    Object.setPrototypeOf(MessagePort.prototype, EventTarget.prototype);
    Object.setPrototypeOf(MessagePort, EventTarget);

    Object.setPrototypeOf(BroadcastChannel.prototype, EventTarget.prototype);
    Object.setPrototypeOf(BroadcastChannel, EventTarget);

}

function installMessageEvent() {
  getter(MessageEvent, "data", messageEventProperty);
getter(MessageEvent, "origin", messageEventProperty);
getter(MessageEvent, "lastEventId", messageEventProperty);
getter(MessageEvent, "source", messageEventProperty);
getter(MessageEvent, "ports", messageEventProperty);
getter(MessageEvent, "userActivation", messageEventProperty);
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
