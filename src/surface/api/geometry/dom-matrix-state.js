const matrixState = new WeakMap();

export const componentIndex = Object.freeze({
  a: 0, b: 1, c: 4, d: 5, e: 12, f: 13,
  m11: 0, m12: 1, m13: 2, m14: 3,
  m21: 4, m22: 5, m23: 6, m24: 7,
  m31: 8, m32: 9, m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15,
});

export function identityMatrix() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function initializeDOMMatrix(matrix, values = identityMatrix()) {
  matrixState.set(matrix, [...values]);
}

export function requireDOMMatrix(matrix) {
  const state = matrixState.get(matrix);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function isDOMMatrixValue(value) {
  return matrixState.has(value);
}

export function matrixFromValue(value) {
  if (value === undefined) return identityMatrix();
  if (isDOMMatrixValue(value)) return [...requireDOMMatrix(value)];
  if (typeof value === "string" || value instanceof String) {
    return parseCSSMatrix(`${value}`);
  }
  if (value === null || typeof value !== "object") {
    throw new TypeError("DOMMatrix initializer must be a string or sequence");
  }
  const length = Number(value.length) >>> 0;
  if (length === 6 || length === 16) {
    const values = Array.from({ length }, (_, index) => Number(value[index]));
    if (length === 16) return values;
    const matrix = identityMatrix();
    matrix[0] = values[0];
    matrix[1] = values[1];
    matrix[4] = values[2];
    matrix[5] = values[3];
    matrix[12] = values[4];
    matrix[13] = values[5];
    return matrix;
  }
  const matrix = identityMatrix();
  for (const [name, index] of Object.entries(componentIndex)) {
    if (value[name] !== undefined) matrix[index] = Number(value[name]);
  }
  return matrix;
}

export function is2DMatrix(matrix) {
  return matrix[2] === 0 && matrix[3] === 0
    && matrix[6] === 0 && matrix[7] === 0
    && matrix[8] === 0 && matrix[9] === 0
    && matrix[10] === 1 && matrix[11] === 0
    && matrix[14] === 0 && matrix[15] === 1;
}

export function isIdentityMatrix(matrix) {
  const identity = identityMatrix();
  return matrix.every((value, index) => value === identity[index]);
}

export function multiplyMatrices(left, right) {
  const output = Array(16).fill(0);
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      for (let index = 0; index < 4; index += 1) {
        output[column * 4 + row] +=
          left[index * 4 + row] * right[column * 4 + index];
      }
    }
  }
  return output;
}

export function invertMatrix(matrix) {
  const augmented = Array.from({ length: 4 }, (_, row) => [
    matrix[row], matrix[4 + row], matrix[8 + row], matrix[12 + row],
    row === 0 ? 1 : 0, row === 1 ? 1 : 0,
    row === 2 ? 1 : 0, row === 3 ? 1 : 0,
  ]);
  for (let column = 0; column < 4; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 4; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) {
        pivot = row;
      }
    }
    if (Math.abs(augmented[pivot][column]) < Number.EPSILON) {
      return Array(16).fill(Number.NaN);
    }
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column];
    augmented[column] = augmented[column].map(value => value / divisor);
    for (let row = 0; row < 4; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      augmented[row] = augmented[row].map(
        (value, index) => value - factor * augmented[column][index],
      );
    }
  }
  const output = Array(16);
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      output[column * 4 + row] = augmented[row][column + 4];
    }
  }
  return output;
}

export function translationMatrix(x = 0, y = 0, z = 0) {
  const result = identityMatrix();
  result[12] = Number(x);
  result[13] = Number(y);
  result[14] = Number(z);
  return result;
}

export function scalingMatrix(x = 1, y = x, z = 1) {
  const result = identityMatrix();
  result[0] = Number(x);
  result[5] = Number(y);
  result[10] = Number(z);
  return result;
}

export function rotationZMatrix(degrees = 0) {
  const radians = Number(degrees) * Math.PI / 180;
  const result = identityMatrix();
  result[0] = Math.cos(radians);
  result[1] = Math.sin(radians);
  result[4] = -Math.sin(radians);
  result[5] = Math.cos(radians);
  return result;
}

export function axisRotationMatrix(x = 0, y = 0, z = 0, degrees = 0) {
  const length = Math.hypot(x, y, z);
  if (length === 0) return identityMatrix();
  x /= length;
  y /= length;
  z /= length;
  const radians = Number(degrees) * Math.PI / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const t = 1 - cos;
  return [
    t * x * x + cos, t * x * y + sin * z, t * x * z - sin * y, 0,
    t * x * y - sin * z, t * y * y + cos, t * y * z + sin * x, 0,
    t * x * z + sin * y, t * y * z - sin * x, t * z * z + cos, 0,
    0, 0, 0, 1,
  ];
}

function parseCSSMatrix(source) {
  const normalized = source.trim();
  if (normalized === "" || normalized === "none") return identityMatrix();
  const match = /^(matrix|matrix3d)\((.*)\)$/u.exec(normalized);
  if (match === null) throw new TypeError("Invalid CSS matrix string");
  const values = match[2].split(",").map(value => Number(value.trim()));
  const expected = match[1] === "matrix" ? 6 : 16;
  if (values.length !== expected || values.some(Number.isNaN)) {
    throw new TypeError("Invalid CSS matrix string");
  }
  return matrixFromValue(values);
}
