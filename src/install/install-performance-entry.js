import {
  installPerformanceEntryConstructor,
  installPerformanceEntryConstructorBacklink,
} from "../api/performance/performance-entry-constructor.js";
import {
  installPerformanceEntryDuration,
} from "../api/performance/performance-entry-duration-getter.js";
import {
  installPerformanceEntryName,
} from "../api/performance/performance-entry-name-getter.js";
import {
  installPerformanceEntryNavigationId,
} from "../api/performance/performance-entry-navigation-id-getter.js";
import {
  installPerformanceEntryStartTime,
} from "../api/performance/performance-entry-start-time-getter.js";
import {
  installPerformanceEntryToJSON,
} from "../api/performance/performance-entry-to-json.js";
import {
  installPerformanceEntryType,
} from "../api/performance/performance-entry-type-getter.js";

export function installPerformanceEntry(edge151Surface = false) {
  installPerformanceEntryConstructor();
  installPerformanceEntryName();
  installPerformanceEntryType();
  installPerformanceEntryStartTime();
  installPerformanceEntryDuration();
  installPerformanceEntryToJSON();
  installPerformanceEntryConstructorBacklink();
  if (edge151Surface) installPerformanceEntryNavigationId();
}
