import {
  installPerformanceMeasureConstructor,
  installPerformanceMeasureConstructorBacklink,
} from "../api/performance/performance-measure-constructor.js";
import {
  installPerformanceMeasureDetail,
} from "../api/performance/performance-measure-detail-getter.js";

export function installPerformanceMeasure() {
  installPerformanceMeasureConstructor();
  installPerformanceMeasureDetail();
  installPerformanceMeasureConstructorBacklink();
}
