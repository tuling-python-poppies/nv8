import {
  parseUrl,
  serializeUrl,
  updateUrlComponent,
  urlOrigin,
} from "../../navigation/url-record.js";
import { URL } from "./url-constructor.js";
import {
  createLinkedURLSearchParams,
  replaceURLSearchParams,
} from "./url-search-params-state.js";
import { currentOrigin } from "../../navigation/navigation-state.js";

const urlState = new WeakMap();
let sharedObjectURLRegistry = null;
let nextObjectUrl = 1;

export function configureObjectURLRegistry(registry) {
  sharedObjectURLRegistry = registry;
  nextObjectUrl = 1;
}

export function initializeURL(value, input, base = undefined) {
  const baseRecord = base === undefined
    ? null
    : parseUrl(`${base}`);
  const record = parseUrl(`${input}`, baseRecord);
  const searchParams = createLinkedURLSearchParams(
    record.search,
    (query) => {
      const state = requireURL(value);
      state.record = {
        ...state.record,
        search: query === "" ? "" : `?${query}`,
      };
    },
  );
  urlState.set(value, { record, searchParams });
}

export function createURL(input, base = undefined) {
  const value = Object.create(URL.prototype);
  initializeURL(value, input, base);
  return value;
}

export function requireURL(value) {
  const state = urlState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function readURLComponent(value, component) {
  const state = requireURL(value);
  if (component === "origin") {
    return urlOrigin(state.record);
  }
  if (component === "href") {
    return serializeUrl(state.record);
  }
  if (component === "searchParams") {
    return state.searchParams;
  }
  return state.record[component];
}

export function writeURLComponent(value, component, input) {
  const state = requireURL(value);
  let record;
  if (component === "href") {
    record = parseUrl(`${input}`);
  } else {
    record = updateUrlComponent(state.record, component, input);
  }
  state.record = record;
  if (component === "search" || component === "href") {
    replaceURLSearchParams(state.searchParams, record.search);
  }
}

export function serializeURL(value) {
  return serializeUrl(requireURL(value).record);
}

export function canParseURL(input, base = undefined) {
  try {
    if (base === undefined) {
      parseUrl(`${input}`);
    } else {
      parseUrl(`${input}`, parseUrl(`${base}`));
    }
    return true;
  } catch {
    return false;
  }
}

export function createObjectURL(value) {
  if ((typeof value !== "object" && typeof value !== "function") || value === null) {
    throw new TypeError("URL.createObjectURL requires a Blob or MediaSource");
  }
  if (sharedObjectURLRegistry === null) {
    throw new DOMException(
      "Object URL storage is unavailable.",
      "NotSupportedError",
    );
  }
  if (!sharedObjectURLRegistry.hasBlob(value)) {
    throw new TypeError("URL.createObjectURL requires a Blob or MediaSource");
  }
  for (let attempt = 0; attempt < 1024; attempt += 1) {
    const url = `blob:${currentOrigin()}/${nextObjectURLUUID()}`;
    if (sharedObjectURLRegistry.register(url, value)) return url;
  }
  throw new DOMException(
    "Unable to allocate a unique object URL.",
    "QuotaExceededError",
  );
}

export function revokeObjectURL(value) {
  sharedObjectURLRegistry?.revoke(`${value}`);
}

function nextObjectURLUUID() {
  const sequence = nextObjectUrl;
  nextObjectUrl += 1;
  let state = (sequence ^ 0x9e3779b9) >>> 0;
  const bytes = new Uint8Array(16);
  for (let index = 0; index < bytes.length; index += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    bytes[index] = state & 0xff;
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(
    bytes,
    byte => byte.toString(16).padStart(2, "0"),
  );
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}`
    + `-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}`
    + `-${hex.slice(10).join("")}`;
}
