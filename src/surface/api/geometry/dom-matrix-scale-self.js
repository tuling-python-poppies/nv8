import { matrixSelfOperation, optionalNumber } from "./dom-matrix-self-operation.js";
import { multiplyMatrices, scalingMatrix, translationMatrix } from "./dom-matrix-state.js";
export const scaleSelf = matrixSelfOperation("scaleSelf", (matrix, args) => {
  const x = optionalNumber(args, 0, 1);
  const y = optionalNumber(args, 1, x);
  const z = optionalNumber(args, 2, 1);
  const ox = optionalNumber(args, 3, 0);
  const oy = optionalNumber(args, 4, 0);
  const oz = optionalNumber(args, 5, 0);
  return multiplyMatrices(
    multiplyMatrices(
      multiplyMatrices(matrix, translationMatrix(ox, oy, oz)),
      scalingMatrix(x, y, z),
    ),
    translationMatrix(-ox, -oy, -oz),
  );
});
