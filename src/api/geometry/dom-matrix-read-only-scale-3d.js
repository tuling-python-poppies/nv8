import { optionalNumber, readonlyMatrixOperation } from "./dom-matrix-read-only-operation.js";
import { multiplyMatrices, scalingMatrix, translationMatrix } from "./dom-matrix-state.js";
export const scale3d = readonlyMatrixOperation("scale3d", (matrix, args) => {
  const factor = optionalNumber(args, 0, 1);
  const ox = optionalNumber(args, 1, 0);
  const oy = optionalNumber(args, 2, 0);
  const oz = optionalNumber(args, 3, 0);
  return multiplyMatrices(
    multiplyMatrices(
      multiplyMatrices(matrix, translationMatrix(ox, oy, oz)),
      scalingMatrix(factor, factor, factor),
    ),
    translationMatrix(-ox, -oy, -oz),
  );
});
