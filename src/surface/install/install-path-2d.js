import {
  defineConstructorBacklink,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { addPath } from "../api/canvas/path-2d-add-path.js";
import { arc } from "../api/canvas/path-2d-arc.js";
import { arcTo } from "../api/canvas/path-2d-arc-to.js";
import {
  Path2D,
  installPath2DConstructor,
} from "../api/canvas/path-2d-constructor.js";
import { ellipse } from "../api/canvas/path-2d-ellipse.js";
import { pathCommandTable } from "../api/canvas/path-command-members.js";

export function installPath2D() {
  installPath2DConstructor();
  method("addPath", addPath);
  for (const [name, entry] of pathCommandTable) method(name, entry);
  method("arc", arc);
  method("arcTo", arcTo);
  for (const [name, entry] of pathCommandTable) method(name, entry);
  method("ellipse", ellipse);
  for (const [name, entry] of pathCommandTable) method(name, entry);
  defineConstructorBacklink(Path2D.prototype, Path2D);
  defineToStringTag(Path2D.prototype, "Path2D");
}

function method(name, callback) {
  definePrototypeMethod(Path2D.prototype, name, callback);
}
