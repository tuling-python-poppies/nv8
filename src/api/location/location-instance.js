import { locationAncestorOrigins } from "./location-ancestor-origins-getter.js";
import { assign } from "./location-assign.js";
import { locationHash as hashGetter } from "./location-hash-getter.js";
import { locationHash as hashSetter } from "./location-hash-setter.js";
import { locationHost as hostGetter } from "./location-host-getter.js";
import { locationHost as hostSetter } from "./location-host-setter.js";
import {
  locationHostname as hostnameGetter,
} from "./location-hostname-getter.js";
import {
  locationHostname as hostnameSetter,
} from "./location-hostname-setter.js";
import { locationHref as hrefGetter } from "./location-href-getter.js";
import { locationHref as hrefSetter } from "./location-href-setter.js";
import { locationOrigin } from "./location-origin-getter.js";
import {
  locationPathname as pathnameGetter,
} from "./location-pathname-getter.js";
import {
  locationPathname as pathnameSetter,
} from "./location-pathname-setter.js";
import { locationPort as portGetter } from "./location-port-getter.js";
import { locationPort as portSetter } from "./location-port-setter.js";
import {
  locationProtocol as protocolGetter,
} from "./location-protocol-getter.js";
import {
  locationProtocol as protocolSetter,
} from "./location-protocol-setter.js";
import { reload } from "./location-reload.js";
import { replace } from "./location-replace.js";
import { locationSearch as searchGetter } from "./location-search-getter.js";
import { locationSearch as searchSetter } from "./location-search-setter.js";
import { createLocation } from "./location-state.js";
import { toString } from "./location-to-string.js";
import { valueOf } from "./location-value-of.js";

export function installLocationInstance() {
  const location = createLocation();
  Object.defineProperty(location, "valueOf", fixedMethod(valueOf, false));
  Object.defineProperty(location, "ancestorOrigins", {
    get: locationAncestorOrigins,
    enumerable: true,
    configurable: false,
  });
  defineAccessor(location, "href", hrefGetter, hrefSetter);
  defineAccessor(location, "origin", locationOrigin, undefined);
  defineAccessor(location, "protocol", protocolGetter, protocolSetter);
  defineAccessor(location, "host", hostGetter, hostSetter);
  defineAccessor(location, "hostname", hostnameGetter, hostnameSetter);
  defineAccessor(location, "port", portGetter, portSetter);
  defineAccessor(location, "pathname", pathnameGetter, pathnameSetter);
  defineAccessor(location, "search", searchGetter, searchSetter);
  defineAccessor(location, "hash", hashGetter, hashSetter);
  Object.defineProperty(location, "assign", fixedMethod(assign, true));
  Object.defineProperty(location, "reload", fixedMethod(reload, true));
  Object.defineProperty(location, "replace", fixedMethod(replace, true));
  Object.defineProperty(location, "toString", fixedMethod(toString, true));
  Object.defineProperty(location, Symbol.toPrimitive, {
    value: undefined,
    writable: false,
    enumerable: false,
    configurable: false,
  });
}

function defineAccessor(object, name, getter, setter) {
  Object.defineProperty(object, name, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: false,
  });
}

function fixedMethod(value, enumerable) {
  return {
    value,
    writable: false,
    enumerable,
    configurable: false,
  };
}
