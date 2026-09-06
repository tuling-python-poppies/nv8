import { installRangeCloneContents } from "../api/dom/range-clone-contents.js";
import { installRangeCloneRange } from "../api/dom/range-clone-range.js";
import { installRangeCollapse } from "../api/dom/range-collapse.js";
import {
  installRangeCommonAncestorContainer,
} from "../api/dom/range-common-ancestor-container-getter.js";
import {
  installRangeCompareBoundaryPoints,
} from "../api/dom/range-compare-boundary-points.js";
import { installRangeComparePoint } from "../api/dom/range-compare-point.js";
import {
  installRangeConstructor,
  installRangePrototypeConstants,
  finishRangeConstructor,
} from "../api/dom/range-constructor.js";
import {
  installRangeCreateContextualFragment,
} from "../api/dom/range-create-contextual-fragment.js";
import { installRangeDeleteContents } from "../api/dom/range-delete-contents.js";
import { installRangeDetach } from "../api/dom/range-detach.js";
import { installRangeExpand } from "../api/dom/range-expand.js";
import {
  installRangeExtractContents,
} from "../api/dom/range-extract-contents.js";
import {
  installRangeGetBoundingClientRect,
} from "../api/dom/range-get-bounding-client-rect.js";
import {
  installRangeGetClientRects,
} from "../api/dom/range-get-client-rects.js";
import { installRangeInsertNode } from "../api/dom/range-insert-node.js";
import {
  installRangeIntersectsNode,
} from "../api/dom/range-intersects-node.js";
import {
  installRangeIsPointInRange,
} from "../api/dom/range-is-point-in-range.js";
import { installRangeSelectNode } from "../api/dom/range-select-node.js";
import {
  installRangeSelectNodeContents,
} from "../api/dom/range-select-node-contents.js";
import { installRangeSetEnd } from "../api/dom/range-set-end.js";
import { installRangeSetEndAfter } from "../api/dom/range-set-end-after.js";
import {
  installRangeSetEndBefore,
} from "../api/dom/range-set-end-before.js";
import { installRangeSetStart } from "../api/dom/range-set-start.js";
import {
  installRangeSetStartAfter,
} from "../api/dom/range-set-start-after.js";
import {
  installRangeSetStartBefore,
} from "../api/dom/range-set-start-before.js";
import {
  installRangeSurroundContents,
} from "../api/dom/range-surround-contents.js";
import { installRangeToString } from "../api/dom/range-to-string.js";

/** @param {boolean} [edge152Surface] 见 `range-constructor.js`：152 起父类是 `NodeRange`。 */
export function installRange(edge152Surface = false) {
  installRangeConstructor(edge152Surface);
  installRangeCommonAncestorContainer();
  installRangePrototypeConstants();
  installRangeCloneContents();
  installRangeCloneRange();
  installRangeCollapse();
  installRangeCompareBoundaryPoints();
  installRangeComparePoint();
  installRangeCreateContextualFragment();
  installRangeDeleteContents();
  installRangeDetach();
  installRangeExpand();
  installRangeExtractContents();
  installRangeGetBoundingClientRect();
  installRangeGetClientRects();
  installRangeInsertNode();
  installRangeIntersectsNode();
  installRangeIsPointInRange();
  installRangeSelectNode();
  installRangeSelectNodeContents();
  installRangeSetEnd();
  installRangeSetEndAfter();
  installRangeSetEndBefore();
  installRangeSetStart();
  installRangeSetStartAfter();
  installRangeSetStartBefore();
  installRangeSurroundContents();
  installRangeToString();
  finishRangeConstructor();
}
