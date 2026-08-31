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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.observerGeometryConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

const settable = new Set(["onresize", "onscroll", "onscrollend"]);

export function installObserverGeometry() {
  do {
    delete (((runtime.observerGeometryConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.observerGeometryConstructors)[0])).name, (((runtime.observerGeometryConstructors)[0])));
  } while (false);
do {
    delete (((runtime.observerGeometryConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.observerGeometryConstructors)[1])).name, (((runtime.observerGeometryConstructors)[1])));
  } while (false);
do {
    delete (((runtime.observerGeometryConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.observerGeometryConstructors)[2])).name, (((runtime.observerGeometryConstructors)[2])));
  } while (false);
do {
    delete (((runtime.observerGeometryConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.observerGeometryConstructors)[3])).name, (((runtime.observerGeometryConstructors)[3])));
  } while (false);
do {
    delete (((runtime.observerGeometryConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.observerGeometryConstructors)[4])).name, (((runtime.observerGeometryConstructors)[4])));
  } while (false);
do {
    delete (((runtime.observerGeometryConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.observerGeometryConstructors)[5])).name, (((runtime.observerGeometryConstructors)[5])));
  } while (false);
do {
    delete (((runtime.observerGeometryConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((runtime.observerGeometryConstructors)[6])).name, (((runtime.observerGeometryConstructors)[6])));
  } while (false);
  do {
    const Constructor = constructors[("DOMQuad")];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("ResizeObserverSize")];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("ResizeObserverEntry")];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("ResizeObserver")];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("IntersectionObserverEntry")];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("IntersectionObserver")];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[5]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("VisualViewport")];
    const parent = constructors[(((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(OBSERVER_GEOMETRY_SURFACES))[6]))[1])).prototypeParent === "EventTarget" ? EventTarget : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("DOMQuad")]), ("p1"));
  } while (false);
do {
    installAccessor((constructors[("DOMQuad")]), ("p2"));
  } while (false);
do {
    installAccessor((constructors[("DOMQuad")]), ("p3"));
  } while (false);
do {
    installAccessor((constructors[("DOMQuad")]), ("p4"));
  } while (false);
do {
    installMethod((constructors[("DOMQuad")]), ("getBounds"), (0));
  } while (false);
do {
    installMethod((constructors[("DOMQuad")]), ("toJSON"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("DOMQuad")]).prototype, (constructors[("DOMQuad")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("DOMQuad")]).prototype, (constructors[("DOMQuad")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("ResizeObserverSize")]), ("inlineSize"));
  } while (false);
do {
    installAccessor((constructors[("ResizeObserverSize")]), ("blockSize"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ResizeObserverSize")]).prototype, (constructors[("ResizeObserverSize")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ResizeObserverSize")]).prototype, (constructors[("ResizeObserverSize")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("ResizeObserverEntry")]), ("target"));
  } while (false);
do {
    installAccessor((constructors[("ResizeObserverEntry")]), ("contentRect"));
  } while (false);
do {
    installAccessor((constructors[("ResizeObserverEntry")]), ("contentBoxSize"));
  } while (false);
do {
    installAccessor((constructors[("ResizeObserverEntry")]), ("borderBoxSize"));
  } while (false);
do {
    installAccessor((constructors[("ResizeObserverEntry")]), ("devicePixelContentBoxSize"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ResizeObserverEntry")]).prototype, (constructors[("ResizeObserverEntry")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ResizeObserverEntry")]).prototype, (constructors[("ResizeObserverEntry")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("ResizeObserver")]), ("disconnect"), (0));
  } while (false);
do {
    installMethod((constructors[("ResizeObserver")]), ("observe"), (1));
  } while (false);
do {
    installMethod((constructors[("ResizeObserver")]), ("unobserve"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ResizeObserver")]).prototype, (constructors[("ResizeObserver")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ResizeObserver")]).prototype, (constructors[("ResizeObserver")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("time"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("rootBounds"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("boundingClientRect"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("intersectionRect"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("isIntersecting"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("isVisible"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("intersectionRatio"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserverEntry")]), ("target"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("IntersectionObserverEntry")]).prototype, (constructors[("IntersectionObserverEntry")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("IntersectionObserverEntry")]).prototype, (constructors[("IntersectionObserverEntry")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("IntersectionObserver")]), ("root"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserver")]), ("rootMargin"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserver")]), ("scrollMargin"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserver")]), ("thresholds"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserver")]), ("delay"));
  } while (false);
do {
    installAccessor((constructors[("IntersectionObserver")]), ("trackVisibility"));
  } while (false);
do {
    installMethod((constructors[("IntersectionObserver")]), ("disconnect"), (0));
  } while (false);
do {
    installMethod((constructors[("IntersectionObserver")]), ("observe"), (1));
  } while (false);
do {
    installMethod((constructors[("IntersectionObserver")]), ("takeRecords"), (0));
  } while (false);
do {
    installMethod((constructors[("IntersectionObserver")]), ("unobserve"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("IntersectionObserver")]).prototype, (constructors[("IntersectionObserver")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("IntersectionObserver")]).prototype, (constructors[("IntersectionObserver")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("VisualViewport")]), ("offsetLeft"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("offsetTop"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("pageLeft"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("pageTop"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("width"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("height"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("scale"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("onresize"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("onscroll"));
  } while (false);
do {
    installAccessor((constructors[("VisualViewport")]), ("onscrollend"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("VisualViewport")]).prototype, (constructors[("VisualViewport")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("VisualViewport")]).prototype, (constructors[("VisualViewport")]).name);
    }
  } while (false);
}
  } while (false);
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
