import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/observer-geometry/observer-geometry-runtime.js";
import {
  OBSERVER_GEOMETRY_SURFACES,
} from "../api/observer-geometry/observer-geometry-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.observerGeometryConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

const settable = new Set(["onresize", "onscroll", "onscrollend"]);

export function installObserverGeometry() {

    delete runtime.observerGeometryConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.observerGeometryConstructors[0].name, runtime.observerGeometryConstructors[0]);

    delete runtime.observerGeometryConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.observerGeometryConstructors[1].name, runtime.observerGeometryConstructors[1]);

    delete runtime.observerGeometryConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.observerGeometryConstructors[2].name, runtime.observerGeometryConstructors[2]);

    delete runtime.observerGeometryConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.observerGeometryConstructors[3].name, runtime.observerGeometryConstructors[3]);

    delete runtime.observerGeometryConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.observerGeometryConstructors[4].name, runtime.observerGeometryConstructors[4]);

    delete runtime.observerGeometryConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.observerGeometryConstructors[5].name, runtime.observerGeometryConstructors[5]);

    delete runtime.observerGeometryConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.observerGeometryConstructors[6].name, runtime.observerGeometryConstructors[6]);

  {
    const Constructor = constructors["DOMQuad"];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["ResizeObserverSize"];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["ResizeObserverEntry"];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["ResizeObserver"];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["IntersectionObserverEntry"];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["IntersectionObserver"];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[5]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["VisualViewport"];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[6]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }

    {

    installAccessor(constructors["DOMQuad"], "p1");

    installAccessor(constructors["DOMQuad"], "p2");

    installAccessor(constructors["DOMQuad"], "p3");

    installAccessor(constructors["DOMQuad"], "p4");

    installMethod(constructors["DOMQuad"], "getBounds", 0);

    installMethod(constructors["DOMQuad"], "toJSON", 0);

    {
      defineConstructorBacklink(constructors["DOMQuad"].prototype, constructors["DOMQuad"]);
    }

    {
      defineToStringTag(constructors["DOMQuad"].prototype, constructors["DOMQuad"].name);
    }

}

    {

    installAccessor(constructors["ResizeObserverSize"], "inlineSize");

    installAccessor(constructors["ResizeObserverSize"], "blockSize");

    {
      defineConstructorBacklink(constructors["ResizeObserverSize"].prototype, constructors["ResizeObserverSize"]);
    }

    {
      defineToStringTag(constructors["ResizeObserverSize"].prototype, constructors["ResizeObserverSize"].name);
    }

}

    {

    installAccessor(constructors["ResizeObserverEntry"], "target");

    installAccessor(constructors["ResizeObserverEntry"], "contentRect");

    installAccessor(constructors["ResizeObserverEntry"], "contentBoxSize");

    installAccessor(constructors["ResizeObserverEntry"], "borderBoxSize");

    installAccessor(constructors["ResizeObserverEntry"], "devicePixelContentBoxSize");

    {
      defineConstructorBacklink(constructors["ResizeObserverEntry"].prototype, constructors["ResizeObserverEntry"]);
    }

    {
      defineToStringTag(constructors["ResizeObserverEntry"].prototype, constructors["ResizeObserverEntry"].name);
    }

}

    {

    installMethod(constructors["ResizeObserver"], "disconnect", 0);

    installMethod(constructors["ResizeObserver"], "observe", 1);

    installMethod(constructors["ResizeObserver"], "unobserve", 1);

    {
      defineConstructorBacklink(constructors["ResizeObserver"].prototype, constructors["ResizeObserver"]);
    }

    {
      defineToStringTag(constructors["ResizeObserver"].prototype, constructors["ResizeObserver"].name);
    }

}

    {

    installAccessor(constructors["IntersectionObserverEntry"], "time");

    installAccessor(constructors["IntersectionObserverEntry"], "rootBounds");

    installAccessor(constructors["IntersectionObserverEntry"], "boundingClientRect");

    installAccessor(constructors["IntersectionObserverEntry"], "intersectionRect");

    installAccessor(constructors["IntersectionObserverEntry"], "isIntersecting");

    installAccessor(constructors["IntersectionObserverEntry"], "isVisible");

    installAccessor(constructors["IntersectionObserverEntry"], "intersectionRatio");

    installAccessor(constructors["IntersectionObserverEntry"], "target");

    {
      defineConstructorBacklink(constructors["IntersectionObserverEntry"].prototype, constructors["IntersectionObserverEntry"]);
    }

    {
      defineToStringTag(constructors["IntersectionObserverEntry"].prototype, constructors["IntersectionObserverEntry"].name);
    }

}

    {

    installAccessor(constructors["IntersectionObserver"], "root");

    installAccessor(constructors["IntersectionObserver"], "rootMargin");

    installAccessor(constructors["IntersectionObserver"], "scrollMargin");

    installAccessor(constructors["IntersectionObserver"], "thresholds");

    installAccessor(constructors["IntersectionObserver"], "delay");

    installAccessor(constructors["IntersectionObserver"], "trackVisibility");

    installMethod(constructors["IntersectionObserver"], "disconnect", 0);

    installMethod(constructors["IntersectionObserver"], "observe", 1);

    installMethod(constructors["IntersectionObserver"], "takeRecords", 0);

    installMethod(constructors["IntersectionObserver"], "unobserve", 1);

    {
      defineConstructorBacklink(constructors["IntersectionObserver"].prototype, constructors["IntersectionObserver"]);
    }

    {
      defineToStringTag(constructors["IntersectionObserver"].prototype, constructors["IntersectionObserver"].name);
    }

}

    {

    installAccessor(constructors["VisualViewport"], "offsetLeft");

    installAccessor(constructors["VisualViewport"], "offsetTop");

    installAccessor(constructors["VisualViewport"], "pageLeft");

    installAccessor(constructors["VisualViewport"], "pageTop");

    installAccessor(constructors["VisualViewport"], "width");

    installAccessor(constructors["VisualViewport"], "height");

    installAccessor(constructors["VisualViewport"], "scale");

    installAccessor(constructors["VisualViewport"], "onresize");

    installAccessor(constructors["VisualViewport"], "onscroll");

    installAccessor(constructors["VisualViewport"], "onscrollend");

    {
      defineConstructorBacklink(constructors["VisualViewport"].prototype, constructors["VisualViewport"]);
    }

    {
      defineToStringTag(constructors["VisualViewport"].prototype, constructors["VisualViewport"].name);
    }

}

  installVisualViewportGlobal();
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.observerGeometryProperty(this, name);
    },
    set [name](value) {
      runtime.setObserverGeometryProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (settable.has(name)) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(
      Constructor.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
  } else {
    definePrototypeGetter(Constructor.prototype, name, descriptor.get);
  }
}

function installMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.observerGeometryOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function installVisualViewportGlobal() {
  const descriptor = Object.getOwnPropertyDescriptor({
    get visualViewport() {
      return runtime.createVisualViewport();
    },
  }, "visualViewport");
  registerNativeGetter(descriptor.get, "visualViewport");
  Object.defineProperty(globalThis, "visualViewport", {
    get: descriptor.get,
    enumerable: true,
    configurable: true,
  });
}
