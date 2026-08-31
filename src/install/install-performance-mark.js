import {
  installPerformanceMarkConstructor,
  installPerformanceMarkConstructorBacklink,
} from "../api/performance/performance-mark-constructor.js";
import {
  installPerformanceMarkDetail,
} from "../api/performance/performance-mark-detail-getter.js";

export function installPerformanceMark() {
  installPerformanceMarkConstructor();
  installPerformanceMarkDetail();
  installPerformanceMarkConstructorBacklink();
}
