import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { setSelectionBaseAndExtent } from "./selection-state.js";
export const setBaseAndExtent = { setBaseAndExtent(
  anchorNode,
  anchorOffset,
  focusNode,
  focusOffset,
) {
  setSelectionBaseAndExtent(this, anchorNode, anchorOffset, focusNode, focusOffset);
  traceCall(
    "window.Selection.prototype.setBaseAndExtent",
    "Selection",
    [anchorNode, anchorOffset, focusNode, focusOffset],
    undefined,
  );
}}.setBaseAndExtent;
registerNativeFunction(setBaseAndExtent, "setBaseAndExtent");
