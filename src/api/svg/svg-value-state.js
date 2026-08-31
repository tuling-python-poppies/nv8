import {
  SVGAngle,
  SVGLength,
  SVGMatrix,
  SVGNumber,
  SVGPoint,
  SVGRect,
  SVGTransform,
  SVGPreserveAspectRatio,
} from "./svg-value-constructors.js";

const state = new WeakMap();

const lengthUnits = new Map([
  [0, ["", 1]],
  [1, ["", 1]],
  [2, ["%", 1]],
  [3, ["em", 16]],
  [4, ["ex", 8]],
  [5, ["px", 1]],
  [6, ["cm", 96 / 2.54]],
  [7, ["mm", 96 / 25.4]],
  [8, ["in", 96]],
  [9, ["pt", 96 / 72]],
  [10, ["pc", 16]],
]);
const angleUnits = new Map([
  [0, ["", 1]],
  [1, ["", 1]],
  [2, ["deg", 1]],
  [3, ["rad", 180 / Math.PI]],
  [4, ["grad", 0.9]],
]);

export function createSVGNumber(value = 0) {
  return create(SVGNumber, { kind: "number", value: finite(value) });
}

export function createSVGPoint(x = 0, y = 0) {
  return create(SVGPoint, { kind: "point", x: finite(x), y: finite(y) });
}

export function createSVGRect(x = 0, y = 0, width = 0, height = 0) {
  return create(SVGRect, {
    kind: "rect",
    x: finite(x),
    y: finite(y),
    width: finite(width),
    height: finite(height),
  });
}

export function createSVGLength(value = 0, unitType = 1) {
  return createSpecified(SVGLength, "length", value, unitType, lengthUnits);
}

export function createSVGAngle(value = 0, unitType = 1) {
  return createSpecified(SVGAngle, "angle", value, unitType, angleUnits);
}

export function createSVGMatrix(values = [1, 0, 0, 1, 0, 0]) {
  const normalized = [...values].map(finite);
  if (normalized.length !== 6) throw new TypeError("An SVGMatrix requires six values");
  return create(SVGMatrix, { kind: "matrix", values: normalized });
}

export function createSVGTransform(matrix = null) {
  return create(SVGTransform, {
    kind: "transform",
    type: matrix === null ? 1 : 1,
    matrix: matrix === null ? createSVGMatrix() : createSVGMatrix(matrixValues(matrix)),
    angle: 0,
  });
}

export function createSVGPreserveAspectRatio(align = 6, meetOrSlice = 1) {
  const normalizedAlign = Number(align) >>> 0;
  const normalizedMeetOrSlice = Number(meetOrSlice) >>> 0;
  if (normalizedAlign < 1 || normalizedAlign > 10) {
    throw new DOMException("The alignment is invalid.", "NotSupportedError");
  }
  if (normalizedMeetOrSlice < 1 || normalizedMeetOrSlice > 2) {
    throw new DOMException("The meet-or-slice value is invalid.", "NotSupportedError");
  }
  return create(SVGPreserveAspectRatio, {
    kind: "preserveAspectRatio",
    align: normalizedAlign,
    meetOrSlice: normalizedMeetOrSlice,
  });
}

export function requireSVGValue(value, kind) {
  const record = state.get(value);
  if (record === undefined || (kind !== undefined && record.kind !== kind)) {
    throw new TypeError("Illegal invocation");
  }
  return record;
}

export function specifiedValue(value, kind) {
  const record = requireSVGValue(value, kind);
  const units = kind === "length" ? lengthUnits : angleUnits;
  return record.valueInSpecifiedUnits * units.get(record.unitType)[1];
}

export function specifiedValueAsString(value, kind) {
  const record = requireSVGValue(value, kind);
  const units = kind === "length" ? lengthUnits : angleUnits;
  return `${formatNumber(record.valueInSpecifiedUnits)}${units.get(record.unitType)[0]}`;
}

export function convertSpecifiedUnits(value, kind, unitType) {
  const record = requireSVGValue(value, kind);
  const units = kind === "length" ? lengthUnits : angleUnits;
  const target = normalizeUnit(unitType, units);
  const base = specifiedValue(value, kind);
  record.unitType = target;
  record.valueInSpecifiedUnits = base / units.get(target)[1];
}

export function setSpecifiedUnits(value, kind, unitType, number) {
  const record = requireSVGValue(value, kind);
  const units = kind === "length" ? lengthUnits : angleUnits;
  record.unitType = normalizeUnit(unitType, units);
  record.valueInSpecifiedUnits = finite(number);
}

export function transformSVGPoint(point, matrix) {
  const source = requireSVGValue(point, "point");
  const values = matrixValues(matrix);
  return createSVGPoint(
    values[0] * source.x + values[2] * source.y + values[4],
    values[1] * source.x + values[3] * source.y + values[5],
  );
}

export function matrixValues(matrix) {
  return [...requireSVGValue(matrix, "matrix").values];
}

export function multiplySVGMatrix(left, right) {
  const a = matrixValues(left);
  const b = matrixValues(right);
  return createSVGMatrix([
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ]);
}

export function inverseSVGMatrix(matrix) {
  const [a, b, c, d, e, f] = matrixValues(matrix);
  const determinant = a * d - b * c;
  if (determinant === 0) throw new DOMException("The matrix is not invertible.", "InvalidStateError");
  return createSVGMatrix([
    d / determinant,
    -b / determinant,
    -c / determinant,
    a / determinant,
    (c * f - d * e) / determinant,
    (b * e - a * f) / determinant,
  ]);
}

export function transformedSVGMatrix(matrix, operation, args) {
  if (operation === "translate") {
    return multiplySVGMatrix(matrix, createSVGMatrix([1, 0, 0, 1, finite(args[0]), finite(args[1])]));
  }
  if (operation === "scale" || operation === "scaleNonUniform") {
    const x = finite(args[0]);
    const y = operation === "scale" ? x : finite(args[1]);
    return multiplySVGMatrix(matrix, createSVGMatrix([x, 0, 0, y, 0, 0]));
  }
  let degrees;
  if (operation === "rotateFromVector") {
    const x = finite(args[0]);
    const y = finite(args[1]);
    if (x === 0 || y === 0) throw new DOMException("The vector is invalid.", "InvalidAccessError");
    degrees = Math.atan2(y, x) * 180 / Math.PI;
  } else {
    degrees = finite(args[0]);
  }
  const radians = degrees * Math.PI / 180;
  if (operation === "skewX") {
    return multiplySVGMatrix(matrix, createSVGMatrix([1, 0, Math.tan(radians), 1, 0, 0]));
  }
  if (operation === "skewY") {
    return multiplySVGMatrix(matrix, createSVGMatrix([1, Math.tan(radians), 0, 1, 0, 0]));
  }
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return multiplySVGMatrix(matrix, createSVGMatrix([cos, sin, -sin, cos, 0, 0]));
}

export function setSVGTransform(value, operation, args) {
  const record = requireSVGValue(value, "transform");
  if (operation === "setMatrix") {
    record.type = 1;
    record.matrix = createSVGMatrix(matrixValues(args[0]));
    record.angle = 0;
    return;
  }
  if (operation === "setTranslate") {
    record.type = 2;
    record.matrix = createSVGMatrix([1, 0, 0, 1, finite(args[0]), finite(args[1])]);
    record.angle = 0;
    return;
  }
  if (operation === "setScale") {
    record.type = 3;
    record.matrix = createSVGMatrix([finite(args[0]), 0, 0, finite(args[1]), 0, 0]);
    record.angle = 0;
    return;
  }
  const angle = finite(args[0]);
  record.angle = angle;
  if (operation === "setRotate") {
    const cx = finite(args[1]);
    const cy = finite(args[2]);
    const translated = transformedSVGMatrix(createSVGMatrix(), "translate", [cx, cy]);
    const rotated = transformedSVGMatrix(translated, "rotate", [angle]);
    record.matrix = transformedSVGMatrix(rotated, "translate", [-cx, -cy]);
    record.type = 4;
  } else {
    record.matrix = transformedSVGMatrix(
      createSVGMatrix(),
      operation === "setSkewX" ? "skewX" : "skewY",
      [angle],
    );
    record.type = operation === "setSkewX" ? 5 : 6;
  }
}

function create(constructor, record) {
  const value = Object.create(constructor.prototype);
  state.set(value, record);
  return value;
}

function createSpecified(constructor, kind, value, unitType, units) {
  return create(constructor, {
    kind,
    unitType: normalizeUnit(unitType, units),
    valueInSpecifiedUnits: finite(value),
  });
}

function normalizeUnit(value, units) {
  const unit = Number(value) >>> 0;
  if (!units.has(unit) || unit === 0) {
    throw new DOMException("The unit type is invalid.", "NotSupportedError");
  }
  return unit;
}

function finite(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError("The value must be finite");
  return number;
}

function formatNumber(value) {
  return Object.is(value, -0) ? "0" : `${value}`;
}
