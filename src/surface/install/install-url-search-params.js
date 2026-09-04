import { installURLSearchParamsAppend } from "../api/url/url-search-params-append.js";
import {
  installURLSearchParamsConstructor,
  installURLSearchParamsConstructorBacklink,
} from "../api/url/url-search-params-constructor.js";
import { installURLSearchParamsDelete } from "../api/url/url-search-params-delete.js";
import { entries, installURLSearchParamsEntries } from "../api/url/url-search-params-entries.js";
import { installURLSearchParamsForEach } from "../api/url/url-search-params-for-each.js";
import { installURLSearchParamsGetAll } from "../api/url/url-search-params-get-all.js";
import { installURLSearchParamsGet } from "../api/url/url-search-params-get.js";
import { installURLSearchParamsHas } from "../api/url/url-search-params-has.js";
import { installURLSearchParamsKeys } from "../api/url/url-search-params-keys.js";
import { installURLSearchParamsSet } from "../api/url/url-search-params-set.js";
import { installURLSearchParamsSize } from "../api/url/url-search-params-size-getter.js";
import { installURLSearchParamsSort } from "../api/url/url-search-params-sort.js";
import { installURLSearchParamsToString } from "../api/url/url-search-params-to-string.js";
import { installURLSearchParamsValues } from "../api/url/url-search-params-values.js";

export function installURLSearchParams() {
  installURLSearchParamsConstructor();
  installURLSearchParamsSize();
  installURLSearchParamsAppend();
  installURLSearchParamsDelete();
  installURLSearchParamsGet();
  installURLSearchParamsGetAll();
  installURLSearchParamsHas();
  installURLSearchParamsSet();
  installURLSearchParamsSort();
  installURLSearchParamsToString();
  installURLSearchParamsEntries();
  installURLSearchParamsForEach();
  installURLSearchParamsKeys();
  installURLSearchParamsValues();
  installURLSearchParamsConstructorBacklink();
  Object.defineProperty(URLSearchParams.prototype, Symbol.iterator, {
    value: entries,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
