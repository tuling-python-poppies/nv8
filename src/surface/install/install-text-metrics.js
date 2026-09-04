import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { actualBoundingBoxAscent } from "../api/canvas/text-metrics-actual-bounding-box-ascent-getter.js";
import { actualBoundingBoxDescent } from "../api/canvas/text-metrics-actual-bounding-box-descent-getter.js";
import { actualBoundingBoxLeft } from "../api/canvas/text-metrics-actual-bounding-box-left-getter.js";
import { actualBoundingBoxRight } from "../api/canvas/text-metrics-actual-bounding-box-right-getter.js";
import { alphabeticBaseline } from "../api/canvas/text-metrics-alphabetic-baseline-getter.js";
import {
  TextMetrics,
  installTextMetricsConstructor,
} from "../api/canvas/text-metrics-constructor.js";
import { fontBoundingBoxAscent } from "../api/canvas/text-metrics-font-bounding-box-ascent-getter.js";
import { fontBoundingBoxDescent } from "../api/canvas/text-metrics-font-bounding-box-descent-getter.js";
import { hangingBaseline } from "../api/canvas/text-metrics-hanging-baseline-getter.js";
import { ideographicBaseline } from "../api/canvas/text-metrics-ideographic-baseline-getter.js";
import { width } from "../api/canvas/text-metrics-width-getter.js";

export function installTextMetrics() {
  installTextMetricsConstructor();
  getter("width", width);
  getter("actualBoundingBoxLeft", actualBoundingBoxLeft);
  getter("actualBoundingBoxRight", actualBoundingBoxRight);
  getter("fontBoundingBoxAscent", fontBoundingBoxAscent);
  getter("fontBoundingBoxDescent", fontBoundingBoxDescent);
  getter("actualBoundingBoxAscent", actualBoundingBoxAscent);
  getter("actualBoundingBoxDescent", actualBoundingBoxDescent);
  getter("hangingBaseline", hangingBaseline);
  getter("alphabeticBaseline", alphabeticBaseline);
  getter("ideographicBaseline", ideographicBaseline);
  defineConstructorBacklink(TextMetrics.prototype, TextMetrics);
  defineToStringTag(TextMetrics.prototype, "TextMetrics");
}

function getter(name, callback) {
  definePrototypeGetter(TextMetrics.prototype, name, callback);
}
