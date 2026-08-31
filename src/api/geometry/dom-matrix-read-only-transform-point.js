import { readonlyMatrixValueOperation } from "./dom-matrix-read-only-operation.js";
import { createDOMPoint } from "./dom-point-constructor.js";
import { pointFromValue } from "./dom-point-state.js";
export const transformPoint = readonlyMatrixValueOperation(
  "transformPoint",
  (matrix, args) => {
    const point = pointFromValue(args[0]);
    return createDOMPoint(
      point.x * matrix[0] + point.y * matrix[4] + point.z * matrix[8] + point.w * matrix[12],
      point.x * matrix[1] + point.y * matrix[5] + point.z * matrix[9] + point.w * matrix[13],
      point.x * matrix[2] + point.y * matrix[6] + point.z * matrix[10] + point.w * matrix[14],
      point.x * matrix[3] + point.y * matrix[7] + point.z * matrix[11] + point.w * matrix[15],
    );
  },
);
