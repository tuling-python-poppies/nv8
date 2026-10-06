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

    definePrototypeGetter(
      (SVGCircleElement).prototype,
      ("cx"),
      createAnimatedLengthGetter(SVGCircleElement.name, "cx"),
    );

    definePrototypeGetter(
      (SVGCircleElement).prototype,
      ("cy"),
      createAnimatedLengthGetter(SVGCircleElement.name, "cy"),
    );

    definePrototypeGetter(
      (SVGCircleElement).prototype,
      ("r"),
      createAnimatedLengthGetter(SVGCircleElement.name, "r"),
    );

}

export function installReconstructedSVGShapeMembers() {

    reopenPrototype(shapes[0][0]);
    {

    definePrototypeGetter(
      (shapes[0][0]).prototype,
      ("cx"),
      createAnimatedLengthGetter(shapes[0][0].name, "cx"),
    );

    definePrototypeGetter(
      (shapes[0][0]).prototype,
      ("cy"),
      createAnimatedLengthGetter(shapes[0][0].name, "cy"),
    );

    definePrototypeGetter(
      (shapes[0][0]).prototype,
      ("rx"),
      createAnimatedLengthGetter(shapes[0][0].name, "rx"),
    );

    definePrototypeGetter(
      (shapes[0][0]).prototype,
      ("ry"),
      createAnimatedLengthGetter(shapes[0][0].name, "ry"),
    );

}
    closePrototype(shapes[0][0]);

    reopenPrototype(shapes[1][0]);
    {

    definePrototypeGetter(
      (shapes[1][0]).prototype,
      ("x1"),
      createAnimatedLengthGetter(shapes[1][0].name, "x1"),
    );

    definePrototypeGetter(
      (shapes[1][0]).prototype,
      ("y1"),
      createAnimatedLengthGetter(shapes[1][0].name, "y1"),
    );

    definePrototypeGetter(
      (shapes[1][0]).prototype,
      ("x2"),
      createAnimatedLengthGetter(shapes[1][0].name, "x2"),
    );

    definePrototypeGetter(
      (shapes[1][0]).prototype,
      ("y2"),
      createAnimatedLengthGetter(shapes[1][0].name, "y2"),
    );

}
    closePrototype(shapes[1][0]);

    reopenPrototype(shapes[2][0]);
    {

    definePrototypeGetter(
      (shapes[2][0]).prototype,
      ("x"),
      createAnimatedLengthGetter(shapes[2][0].name, "x"),
    );

    definePrototypeGetter(
      (shapes[2][0]).prototype,
      ("y"),
      createAnimatedLengthGetter(shapes[2][0].name, "y"),
    );

    definePrototypeGetter(
      (shapes[2][0]).prototype,
      ("width"),
      createAnimatedLengthGetter(shapes[2][0].name, "width"),
    );

    definePrototypeGetter(
      (shapes[2][0]).prototype,
      ("height"),
      createAnimatedLengthGetter(shapes[2][0].name, "height"),
    );

    definePrototypeGetter(
      (shapes[2][0]).prototype,
      ("rx"),
      createAnimatedLengthGetter(shapes[2][0].name, "rx"),
    );

    definePrototypeGetter(
      (shapes[2][0]).prototype,
      ("ry"),
      createAnimatedLengthGetter(shapes[2][0].name, "ry"),
    );

}
    closePrototype(shapes[2][0]);

    reopenPrototype(SVGPolylineElement);
    definePrototypeGetter(
      (SVGPolylineElement).prototype,
      "points",
      createPointsGetter(SVGPolylineElement.name, "points"),
    );
    definePrototypeGetter(
      (SVGPolylineElement).prototype,
      "animatedPoints",
      createPointsGetter(SVGPolylineElement.name, "animatedPoints"),
    );
    closePrototype(SVGPolylineElement);

    reopenPrototype(SVGPolygonElement);
    definePrototypeGetter(
      (SVGPolygonElement).prototype,
      "points",
      createPointsGetter(SVGPolygonElement.name, "points"),
    );
    definePrototypeGetter(
      (SVGPolygonElement).prototype,
      "animatedPoints",
      createPointsGetter(SVGPolygonElement.name, "animatedPoints"),
    );
    closePrototype(SVGPolygonElement);

}

function reopenPrototype(constructor) {
  delete constructor.prototype.constructor;
  delete constructor.prototype[Symbol.toStringTag];
}

function closePrototype(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
