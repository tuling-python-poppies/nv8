import { AnimationTimeline } from "../api/animation/animation-timeline-constructor.js";
import * as runtime from "../api/scroll-timeline/scroll-timeline-runtime.js";
import {
  SCROLL_TIMELINE_SURFACES,
} from "../api/scroll-timeline/scroll-timeline-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { registerNativeGetter } from "../webidl/native-function.js";

const constructors = Object.freeze({
  ScrollTimeline: runtime.ScrollTimeline,
  ViewTimeline: runtime.ViewTimeline,
});

export function installScrollTimeline() {
  do {
    delete (((runtime.scrollTimelineConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.scrollTimelineConstructors)[0])).name, (((runtime.scrollTimelineConstructors)[0])));
  } while (false);
do {
    delete (((runtime.scrollTimelineConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.scrollTimelineConstructors)[1])).name, (((runtime.scrollTimelineConstructors)[1])));
  } while (false);
  Object.setPrototypeOf(
    runtime.ScrollTimeline.prototype,
    AnimationTimeline.prototype,
  );
  Object.setPrototypeOf(runtime.ScrollTimeline, AnimationTimeline);
  Object.setPrototypeOf(
    runtime.ViewTimeline.prototype,
    runtime.ScrollTimeline.prototype,
  );
  Object.setPrototypeOf(runtime.ViewTimeline, runtime.ScrollTimeline);
  do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("source")]() { return runtime.scrollTimelineProperty(this, ("source")); },
      }, ("source")).get;
      registerNativeGetter(getter, ("source"));
      definePrototypeGetter((constructors[("ScrollTimeline")]).prototype, ("source"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("axis")]() { return runtime.scrollTimelineProperty(this, ("axis")); },
      }, ("axis")).get;
      registerNativeGetter(getter, ("axis"));
      definePrototypeGetter((constructors[("ScrollTimeline")]).prototype, ("axis"), getter);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ScrollTimeline")]).prototype, (constructors[("ScrollTimeline")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ScrollTimeline")]).prototype, (constructors[("ScrollTimeline")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("subject")]() { return runtime.scrollTimelineProperty(this, ("subject")); },
      }, ("subject")).get;
      registerNativeGetter(getter, ("subject"));
      definePrototypeGetter((constructors[("ViewTimeline")]).prototype, ("subject"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("startOffset")]() { return runtime.scrollTimelineProperty(this, ("startOffset")); },
      }, ("startOffset")).get;
      registerNativeGetter(getter, ("startOffset"));
      definePrototypeGetter((constructors[("ViewTimeline")]).prototype, ("startOffset"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("endOffset")]() { return runtime.scrollTimelineProperty(this, ("endOffset")); },
      }, ("endOffset")).get;
      registerNativeGetter(getter, ("endOffset"));
      definePrototypeGetter((constructors[("ViewTimeline")]).prototype, ("endOffset"), getter);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ViewTimeline")]).prototype, (constructors[("ViewTimeline")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ViewTimeline")]).prototype, (constructors[("ViewTimeline")]).name);
    }
  } while (false);
}
  } while (false);
}


