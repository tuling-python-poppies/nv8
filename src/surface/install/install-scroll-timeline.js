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
} from "../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../engine/webidl/native-function.js";

const constructors = Object.freeze({
  ScrollTimeline: runtime.ScrollTimeline,
  ViewTimeline: runtime.ViewTimeline,
});

export function installScrollTimeline() {

    delete runtime.scrollTimelineConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.scrollTimelineConstructors[0].name, runtime.scrollTimelineConstructors[0]);

    delete runtime.scrollTimelineConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.scrollTimelineConstructors[1].name, runtime.scrollTimelineConstructors[1]);

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
  {
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["source"]() { return runtime.scrollTimelineProperty(this, "source"); },
      }, "source").get;
      registerNativeGetter(getter, "source");
      definePrototypeGetter(constructors["ScrollTimeline"].prototype, "source", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["axis"]() { return runtime.scrollTimelineProperty(this, "axis"); },
      }, "axis").get;
      registerNativeGetter(getter, "axis");
      definePrototypeGetter(constructors["ScrollTimeline"].prototype, "axis", getter);
    }

    {
      defineConstructorBacklink(constructors["ScrollTimeline"].prototype, constructors["ScrollTimeline"]);
    }

    {
      defineToStringTag(constructors["ScrollTimeline"].prototype, constructors["ScrollTimeline"].name);
    }

}
{
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["subject"]() { return runtime.scrollTimelineProperty(this, "subject"); },
      }, "subject").get;
      registerNativeGetter(getter, "subject");
      definePrototypeGetter(constructors["ViewTimeline"].prototype, "subject", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["startOffset"]() { return runtime.scrollTimelineProperty(this, "startOffset"); },
      }, "startOffset").get;
      registerNativeGetter(getter, "startOffset");
      definePrototypeGetter(constructors["ViewTimeline"].prototype, "startOffset", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["endOffset"]() { return runtime.scrollTimelineProperty(this, "endOffset"); },
      }, "endOffset").get;
      registerNativeGetter(getter, "endOffset");
      definePrototypeGetter(constructors["ViewTimeline"].prototype, "endOffset", getter);
    }

    {
      defineConstructorBacklink(constructors["ViewTimeline"].prototype, constructors["ViewTimeline"]);
    }

    {
      defineToStringTag(constructors["ViewTimeline"].prototype, constructors["ViewTimeline"].name);
    }

}
}
