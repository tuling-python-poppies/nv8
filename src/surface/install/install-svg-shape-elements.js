import {
  SVGCircleElement,
} from "../api/dom/svg-circle-element-constructor.js";
import {
  SVGEllipseElement,
} from "../api/dom/svgellipse-element-factory-constructor.js";
import {
  SVGLineElement,
} from "../api/dom/svgline-element-factory-constructor.js";
import {
  SVGPolygonElement,
} from "../api/dom/svgpolygon-element-factory-constructor.js";
import {
  SVGPolylineElement,
} from "../api/dom/svgpolyline-element-factory-constructor.js";
import {
  SVGRectElement,
} from "../api/dom/svgrect-element-factory-constructor.js";
import {
  createAnimatedLengthGetter,
  createPointsGetter,
} from "../api/svg/svg-shape-element-members.js";
import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";

const shapes = [
  [SVGEllipseElement, ["cx", "cy", "rx", "ry"]],
  [SVGLineElement, ["x1", "y1", "x2", "y2"]],
  [SVGRectElement, ["x", "y", "width", "height", "rx", "ry"]],
];

export function installSVGCircleElementMembers() {
  {
  do {
    definePrototypeGetter(
      (SVGCircleElement).prototype,
      ("cx"),
      createAnimatedLengthGetter((SVGCircleElement).name, ("cx")),
    );
  } while (false);
do {
    definePrototypeGetter(
      (SVGCircleElement).prototype,
      ("cy"),
      createAnimatedLengthGetter((SVGCircleElement).name, ("cy")),
    );
  } while (false);
do {
    definePrototypeGetter(
      (SVGCircleElement).prototype,
      ("r"),
      createAnimatedLengthGetter((SVGCircleElement).name, ("r")),
    );
  } while (false);
}
}

export function installReconstructedSVGShapeMembers() {
  do {
    reopenPrototype((((((shapes)[0]))[0])));
    {
  do {
    definePrototypeGetter(
      ((((shapes)[0]))[0]).prototype,
      ("cx"),
      createAnimatedLengthGetter(((((shapes)[0]))[0]).name, ("cx")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[0]))[0]).prototype,
      ("cy"),
      createAnimatedLengthGetter(((((shapes)[0]))[0]).name, ("cy")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[0]))[0]).prototype,
      ("rx"),
      createAnimatedLengthGetter(((((shapes)[0]))[0]).name, ("rx")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[0]))[0]).prototype,
      ("ry"),
      createAnimatedLengthGetter(((((shapes)[0]))[0]).name, ("ry")),
    );
  } while (false);
}
    closePrototype((((((shapes)[0]))[0])));
  } while (false);
do {
    reopenPrototype((((((shapes)[1]))[0])));
    {
  do {
    definePrototypeGetter(
      ((((shapes)[1]))[0]).prototype,
      ("x1"),
      createAnimatedLengthGetter(((((shapes)[1]))[0]).name, ("x1")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[1]))[0]).prototype,
      ("y1"),
      createAnimatedLengthGetter(((((shapes)[1]))[0]).name, ("y1")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[1]))[0]).prototype,
      ("x2"),
      createAnimatedLengthGetter(((((shapes)[1]))[0]).name, ("x2")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[1]))[0]).prototype,
      ("y2"),
      createAnimatedLengthGetter(((((shapes)[1]))[0]).name, ("y2")),
    );
  } while (false);
}
    closePrototype((((((shapes)[1]))[0])));
  } while (false);
do {
    reopenPrototype((((((shapes)[2]))[0])));
    {
  do {
    definePrototypeGetter(
      ((((shapes)[2]))[0]).prototype,
      ("x"),
      createAnimatedLengthGetter(((((shapes)[2]))[0]).name, ("x")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[2]))[0]).prototype,
      ("y"),
      createAnimatedLengthGetter(((((shapes)[2]))[0]).name, ("y")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[2]))[0]).prototype,
      ("width"),
      createAnimatedLengthGetter(((((shapes)[2]))[0]).name, ("width")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[2]))[0]).prototype,
      ("height"),
      createAnimatedLengthGetter(((((shapes)[2]))[0]).name, ("height")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[2]))[0]).prototype,
      ("rx"),
      createAnimatedLengthGetter(((((shapes)[2]))[0]).name, ("rx")),
    );
  } while (false);
do {
    definePrototypeGetter(
      ((((shapes)[2]))[0]).prototype,
      ("ry"),
      createAnimatedLengthGetter(((((shapes)[2]))[0]).name, ("ry")),
    );
  } while (false);
}
    closePrototype((((((shapes)[2]))[0])));
  } while (false);
  do {
    reopenPrototype(((([SVGPolylineElement, SVGPolygonElement])[0])));
    definePrototypeGetter(
      ((([SVGPolylineElement, SVGPolygonElement])[0])).prototype,
      "points",
      createPointsGetter(((([SVGPolylineElement, SVGPolygonElement])[0])).name, "points"),
    );
    definePrototypeGetter(
      ((([SVGPolylineElement, SVGPolygonElement])[0])).prototype,
      "animatedPoints",
      createPointsGetter(((([SVGPolylineElement, SVGPolygonElement])[0])).name, "animatedPoints"),
    );
    closePrototype(((([SVGPolylineElement, SVGPolygonElement])[0])));
  } while (false);
do {
    reopenPrototype(((([SVGPolylineElement, SVGPolygonElement])[1])));
    definePrototypeGetter(
      ((([SVGPolylineElement, SVGPolygonElement])[1])).prototype,
      "points",
      createPointsGetter(((([SVGPolylineElement, SVGPolygonElement])[1])).name, "points"),
    );
    definePrototypeGetter(
      ((([SVGPolylineElement, SVGPolygonElement])[1])).prototype,
      "animatedPoints",
      createPointsGetter(((([SVGPolylineElement, SVGPolygonElement])[1])).name, "animatedPoints"),
    );
    closePrototype(((([SVGPolylineElement, SVGPolygonElement])[1])));
  } while (false);
}



function reopenPrototype(constructor) {
  delete constructor.prototype.constructor;
  delete constructor.prototype[Symbol.toStringTag];
}

function closePrototype(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
