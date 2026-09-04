import * as runtime from "../api/timeline-trigger/timeline-trigger-runtime.js";
import {
  TIMELINE_TRIGGER_SURFACES,
} from "../api/timeline-trigger/timeline-trigger-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.timelineTriggerConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installTimelineTrigger() {
  do {
    delete (((runtime.timelineTriggerConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.timelineTriggerConstructors)[0])).name, (((runtime.timelineTriggerConstructors)[0])));
  } while (false);
do {
    delete (((runtime.timelineTriggerConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.timelineTriggerConstructors)[1])).name, (((runtime.timelineTriggerConstructors)[1])));
  } while (false);
do {
    delete (((runtime.timelineTriggerConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.timelineTriggerConstructors)[2])).name, (((runtime.timelineTriggerConstructors)[2])));
  } while (false);
do {
    delete (((runtime.timelineTriggerConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.timelineTriggerConstructors)[3])).name, (((runtime.timelineTriggerConstructors)[3])));
  } while (false);
  do {
    const Constructor = constructors[("AnimationTrigger")];
    const Parent = constructors[(((((Object.entries(TIMELINE_TRIGGER_SURFACES))[0]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {
  do {
    {
      installMethod((Constructor), ("addAnimation"), (2));
    }
  } while (false);
do {
    {
      installMethod((Constructor), ("getAnimations"), (0));
    }
  } while (false);
do {
    {
      installMethod((Constructor), ("removeAnimation"), (1));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("TimelineTrigger")];
    const Parent = constructors[(((((Object.entries(TIMELINE_TRIGGER_SURFACES))[1]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("ranges")]() {
          return runtime.timelineTriggerProperty(this, ("ranges"));
        },
      }, ("ranges")).get;
      registerNativeGetter(getter, ("ranges"));
      definePrototypeGetter((Constructor).prototype, ("ranges"), getter);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("TimelineTriggerRange")];
    const Parent = constructors[(((((Object.entries(TIMELINE_TRIGGER_SURFACES))[2]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("timeline")]() {
          return runtime.timelineTriggerProperty(this, ("timeline"));
        },
      }, ("timeline")).get;
      registerNativeGetter(getter, ("timeline"));
      definePrototypeGetter((Constructor).prototype, ("timeline"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("activationRangeStart")]() {
          return runtime.timelineTriggerProperty(this, ("activationRangeStart"));
        },
      }, ("activationRangeStart")).get;
      registerNativeGetter(getter, ("activationRangeStart"));
      definePrototypeGetter((Constructor).prototype, ("activationRangeStart"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("activationRangeEnd")]() {
          return runtime.timelineTriggerProperty(this, ("activationRangeEnd"));
        },
      }, ("activationRangeEnd")).get;
      registerNativeGetter(getter, ("activationRangeEnd"));
      definePrototypeGetter((Constructor).prototype, ("activationRangeEnd"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("activeRangeStart")]() {
          return runtime.timelineTriggerProperty(this, ("activeRangeStart"));
        },
      }, ("activeRangeStart")).get;
      registerNativeGetter(getter, ("activeRangeStart"));
      definePrototypeGetter((Constructor).prototype, ("activeRangeStart"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("activeRangeEnd")]() {
          return runtime.timelineTriggerProperty(this, ("activeRangeEnd"));
        },
      }, ("activeRangeEnd")).get;
      registerNativeGetter(getter, ("activeRangeEnd"));
      definePrototypeGetter((Constructor).prototype, ("activeRangeEnd"), getter);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("TimelineTriggerRangeList")];
    const Parent = constructors[(((((Object.entries(TIMELINE_TRIGGER_SURFACES))[3]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {
  do {
    {
      installMethod((Constructor), ("entries"), (0));
    }
  } while (false);
do {
    {
      installMethod((Constructor), ("keys"), (0));
    }
  } while (false);
do {
    {
      installMethod((Constructor), ("values"), (0));
    }
  } while (false);
do {
    {
      installMethod((Constructor), ("forEach"), (1));
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("length")]() {
          return runtime.timelineTriggerProperty(this, ("length"));
        },
      }, ("length")).get;
      registerNativeGetter(getter, ("length"));
      definePrototypeGetter((Constructor).prototype, ("length"), getter);
    }
  } while (false);
do {
    {
      installMethod((Constructor), ("item"), (1));
    }
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
do {
    {
      const callback = {
        [("values")]() {
          return runtime.timelineTriggerIterator(this);
        },
      }[("values")];
      registerNativeFunction(callback, ("values"));
      Object.defineProperty((Constructor).prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  } while (false);
}
  } while (false);
}



function installMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.timelineTriggerOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
