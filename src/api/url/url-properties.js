import { definePrototypeAccessor, definePrototypeGetter } from "../../webidl/descriptor.js";
import { URL } from "./url-constructor.js";
import { hash as hashGetter } from "./url-hash-getter.js";
import { hash as hashSetter } from "./url-hash-setter.js";
import { host as hostGetter } from "./url-host-getter.js";
import { host as hostSetter } from "./url-host-setter.js";
import { hostname as hostnameGetter } from "./url-hostname-getter.js";
import { hostname as hostnameSetter } from "./url-hostname-setter.js";
import { href as hrefGetter } from "./url-href-getter.js";
import { href as hrefSetter } from "./url-href-setter.js";
import { origin } from "./url-origin-getter.js";
import { password as passwordGetter } from "./url-password-getter.js";
import { password as passwordSetter } from "./url-password-setter.js";
import { pathname as pathnameGetter } from "./url-pathname-getter.js";
import { pathname as pathnameSetter } from "./url-pathname-setter.js";
import { port as portGetter } from "./url-port-getter.js";
import { port as portSetter } from "./url-port-setter.js";
import { protocol as protocolGetter } from "./url-protocol-getter.js";
import { protocol as protocolSetter } from "./url-protocol-setter.js";
import { search as searchGetter } from "./url-search-getter.js";
import { searchParams } from "./url-search-params-getter.js";
import { search as searchSetter } from "./url-search-setter.js";
import { username as usernameGetter } from "./url-username-getter.js";
import { username as usernameSetter } from "./url-username-setter.js";

export function installURLProperties() {
  definePrototypeGetter(URL.prototype, "origin", origin);
  definePrototypeAccessor(URL.prototype, "protocol", protocolGetter, protocolSetter);
  definePrototypeAccessor(URL.prototype, "username", usernameGetter, usernameSetter);
  definePrototypeAccessor(URL.prototype, "password", passwordGetter, passwordSetter);
  definePrototypeAccessor(URL.prototype, "host", hostGetter, hostSetter);
  definePrototypeAccessor(URL.prototype, "hostname", hostnameGetter, hostnameSetter);
  definePrototypeAccessor(URL.prototype, "port", portGetter, portSetter);
  definePrototypeAccessor(URL.prototype, "pathname", pathnameGetter, pathnameSetter);
  definePrototypeAccessor(URL.prototype, "search", searchGetter, searchSetter);
  definePrototypeGetter(URL.prototype, "searchParams", searchParams);
  definePrototypeAccessor(URL.prototype, "hash", hashGetter, hashSetter);
  definePrototypeAccessor(URL.prototype, "href", hrefGetter, hrefSetter);
}
