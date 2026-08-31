import {
  SVGUnitTypes,
} from "../api/svg-unit-types/svg-unit-types-runtime.js";
import {
  SVG_UNIT_TYPES_SURFACE,
} from "../api/svg-unit-types/svg-unit-types-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../webidl/descriptor.js";

export function installSVGUnitTypes() {
  delete SVGUnitTypes.prototype.constructor;
  defineGlobalConstructor("SVGUnitTypes", SVGUnitTypes);
  do {
    {
      defineConstant(SVGUnitTypes.prototype, ("SVG_UNIT_TYPE_UNKNOWN"), (0));
      defineConstant(SVGUnitTypes, ("SVG_UNIT_TYPE_UNKNOWN"), (0));
    }
  } while (false);
do {
    {
      defineConstant(SVGUnitTypes.prototype, ("SVG_UNIT_TYPE_USERSPACEONUSE"), (1));
      defineConstant(SVGUnitTypes, ("SVG_UNIT_TYPE_USERSPACEONUSE"), (1));
    }
  } while (false);
do {
    {
      defineConstant(SVGUnitTypes.prototype, ("SVG_UNIT_TYPE_OBJECTBOUNDINGBOX"), (2));
      defineConstant(SVGUnitTypes, ("SVG_UNIT_TYPE_OBJECTBOUNDINGBOX"), (2));
    }
  } while (false);
do {
    {
      defineConstructorBacklink(SVGUnitTypes.prototype, SVGUnitTypes);
    }
  } while (false);
do {
    {
      defineToStringTag(SVGUnitTypes.prototype, "SVGUnitTypes");
    }
  } while (false);
}

function defineConstant(object, name, value) {
  Object.defineProperty(object, name, {
    value,
    enumerable: true,
  });
}
