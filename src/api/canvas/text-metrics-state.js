import { TextMetrics } from "./text-metrics-constructor.js";

const textMetricsState = new WeakMap();

export function createTextMetrics(values = {}) {
  const metrics = Object.create(TextMetrics.prototype);
  textMetricsState.set(metrics, {
    width: Number(values.width ?? 0),
    actualBoundingBoxLeft: Number(values.actualBoundingBoxLeft ?? 0),
    actualBoundingBoxRight: Number(values.actualBoundingBoxRight ?? 0),
    fontBoundingBoxAscent: Number(values.fontBoundingBoxAscent ?? 0),
    fontBoundingBoxDescent: Number(values.fontBoundingBoxDescent ?? 0),
    actualBoundingBoxAscent: Number(values.actualBoundingBoxAscent ?? 0),
    actualBoundingBoxDescent: Number(values.actualBoundingBoxDescent ?? 0),
    hangingBaseline: Number(values.hangingBaseline ?? 0),
    alphabeticBaseline: Number(values.alphabeticBaseline ?? 0),
    ideographicBaseline: Number(values.ideographicBaseline ?? 0),
  });
  return metrics;
}

export function requireTextMetrics(metrics) {
  const state = textMetricsState.get(metrics);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
