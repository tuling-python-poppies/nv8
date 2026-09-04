import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { documentElements } from "./document-record.js";
import { requireElement } from "./element-state.js";
import { labelControl } from "./form-association.js";
import { createNodeList } from "./node-list-state.js";
const labelLists = new WeakMap();
export const labels = Object.getOwnPropertyDescriptor({
  get labels() {
    requireElement(this);
    let result = labelLists.get(this);
    if (result === undefined) {
      result = createNodeList(
        () => documentElements(this.ownerDocument).filter(
          element => element.localName === "label" && labelControl(element) === this,
        ),
        true,
      );
      labelLists.set(this, result);
    }
    traceGetter("window.HTMLMeterElement.prototype.labels", "HTMLMeterElement", result);
    return result;
  },
}, "labels").get;
registerNativeGetter(labels, "labels");
