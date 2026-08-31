import {
  SVGLengthList,
  SVGNumberList,
  SVGPointList,
  SVGStringList,
  SVGTransformList,
} from "./svg-list-constructors.js";
import {
  createSVGMatrix,
  createSVGTransform,
  matrixValues,
  multiplySVGMatrix,
  requireSVGValue,
} from "./svg-value-state.js";

const state = new WeakMap();
const definitions = {
  length: [SVGLengthList, "length"],
  number: [SVGNumberList, "number"],
  point: [SVGPointList, "point"],
  string: [SVGStringList, null],
  transform: [SVGTransformList, "transform"],
};

export function createSVGList(kind, initial = []) {
  const definition = definitions[kind];
  if (definition === undefined) throw new TypeError("Unknown SVG list kind");
  const list = Object.create(definition[0].prototype);
  const record = { kind, values: [], indexedLength: 0 };
  state.set(list, record);
  record.values.push(...[...initial].map(value => normalizeItem(record, value)));
  refreshSVGList(list);
  return list;
}

export function requireSVGList(value, kind) {
  const record = state.get(value);
  if (record === undefined || (kind !== undefined && record.kind !== kind)) {
    throw new TypeError("Illegal invocation");
  }
  return record;
}

export function refreshSVGList(list) {
  const record = requireSVGList(list);
  for (let index = record.values.length; index < record.indexedLength; index += 1) {
    delete list[index];
  }
  for (let index = 0; index < record.values.length; index += 1) {
    Object.defineProperty(list, index, {
      value: record.values[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  record.indexedLength = record.values.length;
  return record.values;
}

export function appendSVGListItem(list, value) {
  const record = requireSVGList(list);
  const item = normalizeItem(record, value);
  record.values.push(item);
  refreshSVGList(list);
  return item;
}

export function clearSVGList(list) {
  requireSVGList(list).values.splice(0);
  refreshSVGList(list);
}

export function getSVGListItem(list, index) {
  const record = requireSVGList(list);
  const normalized = Number(index) >>> 0;
  if (normalized >= record.values.length) throw indexError();
  return record.values[normalized];
}

export function initializeSVGList(list, value) {
  const record = requireSVGList(list);
  const item = normalizeItem(record, value);
  record.values.splice(0, record.values.length, item);
  refreshSVGList(list);
  return item;
}

export function insertSVGListItem(list, value, index) {
  const record = requireSVGList(list);
  const item = normalizeItem(record, value);
  const normalized = Math.min(Number(index) >>> 0, record.values.length);
  record.values.splice(normalized, 0, item);
  refreshSVGList(list);
  return item;
}

export function removeSVGListItem(list, index) {
  const record = requireSVGList(list);
  const normalized = Number(index) >>> 0;
  if (normalized >= record.values.length) throw indexError();
  const [item] = record.values.splice(normalized, 1);
  refreshSVGList(list);
  return item;
}

export function replaceSVGListItem(list, value, index) {
  const record = requireSVGList(list);
  const normalized = Number(index) >>> 0;
  if (normalized >= record.values.length) throw indexError();
  const item = normalizeItem(record, value);
  record.values[normalized] = item;
  refreshSVGList(list);
  return item;
}

export function consolidateSVGTransformList(list) {
  const record = requireSVGList(list, "transform");
  if (record.values.length === 0) return null;
  let matrix = createSVGMatrix();
  for (const transform of record.values) {
    matrix = multiplySVGMatrix(matrix, requireSVGValue(transform, "transform").matrix);
  }
  const consolidated = createSVGTransform(matrix);
  record.values.splice(0, record.values.length, consolidated);
  refreshSVGList(list);
  return consolidated;
}

export function createTransformFromMatrix(matrix) {
  matrixValues(matrix);
  return createSVGTransform(matrix);
}

function normalizeItem(record, value) {
  if (record.kind === "string") return `${value}`;
  requireSVGValue(value, definitions[record.kind][1]);
  return value;
}

function indexError() {
  return new DOMException("The index is not in the allowed range.", "IndexSizeError");
}
