import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { createHTMLCollection } from "./html-collection-state.js";
import { requireNode } from "./node-state.js";

const cellCollections = new WeakMap();

export function rowCells(row) {
  return requireNode(row).children.filter(
    child => child.localName === "td" || child.localName === "th",
  );
}

export const cells = Object.getOwnPropertyDescriptor({
  get cells() {
    requireElement(this);
    let result = cellCollections.get(this);
    if (result === undefined) {
      result = createHTMLCollection(() => rowCells(this));
      cellCollections.set(this, result);
    }
    traceGetter(
      "window.HTMLTableRowElement.prototype.cells",
      "HTMLTableRowElement",
      result,
    );
    return result;
  },
}, "cells").get;
registerNativeGetter(cells, "cells");
