import {
  installGlobalPerformance,
} from "../api/performance/performance-global-getter.js";
import {
  configurePerformanceSurface,
} from "../api/performance/performance-state.js";
import {
  installPerformanceClearMarks,
} from "../api/performance/performance-clear-marks.js";
import {
  installPerformanceClearMeasures,
} from "../api/performance/performance-clear-measures.js";
import {
  installPerformanceClearResourceTimings,
} from "../api/performance/performance-clear-resource-timings.js";
import {
  installPerformanceConstructor,
  installPerformanceConstructorBacklink,
} from "../api/performance/performance-constructor.js";
import {
  installPerformanceEventCounts,
} from "../api/performance/performance-event-counts-getter.js";
import {
  installPerformanceGetEntries,
} from "../api/performance/performance-get-entries.js";
import {
  installPerformanceGetEntriesByName,
} from "../api/performance/performance-get-entries-by-name.js";
import {
  installPerformanceGetEntriesByType,
} from "../api/performance/performance-get-entries-by-type.js";
import {
  installPerformanceInteractionCount,
} from "../api/performance/performance-interaction-count-getter.js";
import {
  installPerformanceMarkMethod,
} from "../api/performance/performance-mark.js";
import {
  installPerformanceMeasureMethod,
} from "../api/performance/performance-measure.js";
import {
  installPerformanceMemory,
} from "../api/performance/performance-memory-getter.js";
import {
  installPerformanceNavigation,
} from "../api/performance/performance-navigation-getter.js";
import { installPerformanceNow } from "../api/performance/performance-now.js";
import {
  installPerformanceResourceHandler,
} from "../api/performance/performance-resource-handler-property.js";
import {
  installPerformanceSetResourceTimingBufferSize,
} from "../api/performance/performance-set-resource-buffer-size.js";
import {
  installPerformanceTimeOrigin,
} from "../api/performance/performance-time-origin-getter.js";
import {
  installPerformanceTiming,
} from "../api/performance/performance-timing-getter.js";
import {
  installPerformanceToJSON,
} from "../api/performance/performance-to-json.js";
import { configureTimingProfile } from "../../infra/scheduler/monotonic-clock.js";

export { configureTimingProfile };

export function installPerformance({
  edge151Surface = false,
  includeNavigationEntry = true,
} = {}) {
  configurePerformanceSurface({ edge151Surface, includeNavigationEntry });
  installPerformanceConstructor();
  installPerformanceTimeOrigin();
  installPerformanceResourceHandler();
  installPerformanceClearMarks();
  installPerformanceClearMeasures();
  installPerformanceClearResourceTimings();
  installPerformanceGetEntries();
  installPerformanceGetEntriesByName();
  installPerformanceGetEntriesByType();
  installPerformanceMarkMethod();
  installPerformanceMeasureMethod();
  installPerformanceSetResourceTimingBufferSize();
  installPerformanceToJSON();
  installPerformanceNow();
  installPerformanceConstructorBacklink();
  installPerformanceTiming();
  installPerformanceNavigation();
  installPerformanceMemory();
  installPerformanceEventCounts();
  installPerformanceInteractionCount();
  installGlobalPerformance();
}
