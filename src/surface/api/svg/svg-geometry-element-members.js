import { createDOMPoint } from "../geometry/dom-point-constructor.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { getAttributeValue, requireElement } from "../dom/element-state.js";
import {
  SVGAnimatedNumber,
  createSVGAnimatedValue,
} from "./svg-animated-values.js";

const state = new WeakMap();

export const pathLength = getter("pathLength", value => {
  let animated = state.get(value);
  if (animated === undefined) {
    const number = attributeNumber(value, "pathLength", 0);
    animated = createSVGAnimatedValue(SVGAnimatedNumber, number, number);
    state.set(value, animated);
  }
  return animated;
});
export const getPointAtLength = method("getPointAtLength", 1, (value, args) =>
  pointAtLength(value, Math.max(0, Number(args[0]) || 0)));
export const getTotalLength = method("getTotalLength", 0, value =>
  geometry(value).total);
export const isPointInFill = method("isPointInFill", 0, (value, args) =>
  pointInFill(value, args[0] ?? { x: 0, y: 0 }));
export const isPointInStroke = method("isPointInStroke", 0, (value, args) =>
  pointInStroke(value, args[0] ?? { x: 0, y: 0 }));

function geometry(value) {
  const element = requireElement(value);
  if (element.localName === "circle") {
    const cx = attributeNumber(value, "cx");
    const cy = attributeNumber(value, "cy");
    const radius = Math.max(0, attributeNumber(value, "r"));
    return { kind: "circle", cx, cy, radius, total: 2 * Math.PI * radius };
  }
  if (element.localName === "ellipse") {
    const cx = attributeNumber(value, "cx");
    const cy = attributeNumber(value, "cy");
    const rx = Math.max(0, attributeNumber(value, "rx"));
    const ry = Math.max(0, attributeNumber(value, "ry"));
    const h = ((rx - ry) ** 2) / ((rx + ry) ** 2 || 1);
    const total = Math.PI * (rx + ry) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
    return { kind: "ellipse", cx, cy, rx, ry, total };
  }
  return segmentGeometry(value, element.localName);
}

function segmentGeometry(value, localName) {
  let points;
  let closed = false;
  if (localName === "line") {
    points = [
      [attributeNumber(value, "x1"), attributeNumber(value, "y1")],
      [attributeNumber(value, "x2"), attributeNumber(value, "y2")],
    ];
  } else if (localName === "rect") {
    const x = attributeNumber(value, "x");
    const y = attributeNumber(value, "y");
    const width = Math.max(0, attributeNumber(value, "width"));
    const height = Math.max(0, attributeNumber(value, "height"));
    points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
    closed = true;
  } else if (localName === "polygon" || localName === "polyline") {
    points = parsePoints(getAttributeValue(value, "points") ?? "");
    closed = localName === "polygon";
  } else {
    ({ points, closed } = parsePath(getAttributeValue(value, "d") ?? ""));
  }
  const segments = [];
  for (let index = 1; index < points.length; index += 1) {
    segments.push(segment(points[index - 1], points[index]));
  }
  if (closed && points.length > 1) segments.push(segment(points.at(-1), points[0]));
  return {
    kind: "segments",
    points,
    segments,
    closed,
    total: segments.reduce((sum, item) => sum + item.length, 0),
  };
}

function pointAtLength(value, distance) {
  const shape = geometry(value);
  if (shape.kind === "circle" || shape.kind === "ellipse") {
    if (shape.total === 0) return createDOMPoint(shape.cx, shape.cy);
    const angle = Math.min(distance, shape.total) / shape.total * Math.PI * 2;
    const xRadius = shape.kind === "circle" ? shape.radius : shape.rx;
    const yRadius = shape.kind === "circle" ? shape.radius : shape.ry;
    return createDOMPoint(
      shape.cx + Math.cos(angle) * xRadius,
      shape.cy + Math.sin(angle) * yRadius,
    );
  }
  if (shape.points.length === 0) return createDOMPoint();
  let remaining = Math.min(distance, shape.total);
  for (const item of shape.segments) {
    if (remaining <= item.length) {
      const ratio = item.length === 0 ? 0 : remaining / item.length;
      return createDOMPoint(
        item.from[0] + (item.to[0] - item.from[0]) * ratio,
        item.from[1] + (item.to[1] - item.from[1]) * ratio,
      );
    }
    remaining -= item.length;
  }
  return createDOMPoint(...shape.points.at(-1));
}

function pointInFill(value, point) {
  const shape = geometry(value);
  const x = Number(point.x) || 0;
  const y = Number(point.y) || 0;
  if (shape.kind === "circle") {
    return Math.hypot(x - shape.cx, y - shape.cy) <= shape.radius;
  }
  if (shape.kind === "ellipse") {
    if (shape.rx === 0 || shape.ry === 0) return false;
    return ((x - shape.cx) / shape.rx) ** 2 + ((y - shape.cy) / shape.ry) ** 2 <= 1;
  }
  if (!shape.closed || shape.points.length < 3) return false;
  let inside = false;
  for (let index = 0, previous = shape.points.length - 1;
    index < shape.points.length; previous = index++) {
    const currentPoint = shape.points[index];
    const previousPoint = shape.points[previous];
    if ((currentPoint[1] > y) !== (previousPoint[1] > y)
      && x < (previousPoint[0] - currentPoint[0]) * (y - currentPoint[1])
      / (previousPoint[1] - currentPoint[1]) + currentPoint[0]) inside = !inside;
  }
  return inside;
}

function pointInStroke(value, point) {
  const shape = geometry(value);
  const x = Number(point.x) || 0;
  const y = Number(point.y) || 0;
  if (shape.kind === "circle" || shape.kind === "ellipse") {
    const radius = shape.kind === "circle"
      ? Math.hypot(x - shape.cx, y - shape.cy) / (shape.radius || 1)
      : Math.hypot((x - shape.cx) / (shape.rx || 1), (y - shape.cy) / (shape.ry || 1));
    return Math.abs(radius - 1) <= 0.01;
  }
  return shape.segments.some(item => distanceToSegment(x, y, item) <= 0.5);
}

function parsePoints(source) {
  const numbers = `${source}`.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu)?.map(Number) ?? [];
  const points = [];
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    points.push([numbers[index], numbers[index + 1]]);
  }
  return points;
}

function parsePath(source) {
  const tokens = `${source}`.match(/[a-z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/giu) ?? [];
  const points = [];
  let x = 0;
  let y = 0;
  let command = "";
  let closed = false;
  let index = 0;
  while (index < tokens.length) {
    if (/[a-z]/iu.test(tokens[index])) command = tokens[index++];
    if (command.toLowerCase() === "z") {
      closed = true;
      command = "";
      continue;
    }
    const relative = command === command.toLowerCase();
    const lower = command.toLowerCase();
    if (lower === "h") {
      const next = Number(tokens[index++]);
      x = relative ? x + next : next;
    } else if (lower === "v") {
      const next = Number(tokens[index++]);
      y = relative ? y + next : next;
    } else if (["m", "l"].includes(lower) && index + 1 < tokens.length) {
      const nextX = Number(tokens[index++]);
      const nextY = Number(tokens[index++]);
      x = relative ? x + nextX : nextX;
      y = relative ? y + nextY : nextY;
      if (lower === "m") command = relative ? "l" : "L";
    } else {
      index += 1;
      continue;
    }
    points.push([x, y]);
  }
  return { points, closed };
}

function segment(from, to) {
  return { from, to, length: Math.hypot(to[0] - from[0], to[1] - from[1]) };
}

function distanceToSegment(x, y, item) {
  const dx = item.to[0] - item.from[0];
  const dy = item.to[1] - item.from[1];
  const lengthSquared = dx * dx + dy * dy;
  const ratio = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
    ((x - item.from[0]) * dx + (y - item.from[1]) * dy) / lengthSquared));
  return Math.hypot(x - (item.from[0] + ratio * dx), y - (item.from[1] + ratio * dy));
}

function attributeNumber(element, name, fallback = 0) {
  const value = Number(getAttributeValue(element, name));
  return Number.isFinite(value) ? value : fallback;
}

function getter(name, read) {
  const callback = function () {
    requireElement(this);
    const result = read(this);
    traceCall(`window.SVGGeometryElement.prototype.${name}`, "SVGGeometryElement", [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}

function method(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireElement(this);
      const result = operation(this, args);
      traceCall(`window.SVGGeometryElement.prototype.${name}`, "SVGGeometryElement", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
