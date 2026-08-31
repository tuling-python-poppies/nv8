import { Event } from "../api/event/event-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import * as core from "../api/xr/xr-core-runtime.js";
import * as runtime from "../api/xr/xr-extensions-runtime.js";
import { XR_EXTENSION_SURFACES } from "../api/xr/xr-extensions-surface.js";
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
  runtime.xrExtensionConstructors.map(Constructor => [Constructor.name, Constructor]),
));

const coreConstructors = Object.freeze(Object.fromEntries(
  core.xrCoreConstructors.map(Constructor => [Constructor.name, Constructor]),
));

const settable = new Set([
  "onreflectionchange",
  "onredraw",
  "blendTextureSourceAlpha",
  "forceMonoPresentation",
  "opacity",
  "fixedFoveation",
  "deltaPose",
  "transform",
  "radius",
  "centralAngle",
  "aspectRatio",
  "centralHorizontalAngle",
  "upperVerticalAngle",
  "lowerVerticalAngle",
  "width",
  "height",
]);

export function installXRExtensions() {
  core.configureXRCollectionFactories({
    createAnchorSet: runtime.createXRAnchorSet,
    createPlaneSet: runtime.createXRPlaneSet,
  });
  do {
    delete (((runtime.xrExtensionConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[0])).name, (((runtime.xrExtensionConstructors)[0])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[1])).name, (((runtime.xrExtensionConstructors)[1])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[2])).name, (((runtime.xrExtensionConstructors)[2])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[3])).name, (((runtime.xrExtensionConstructors)[3])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[4])).name, (((runtime.xrExtensionConstructors)[4])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[5])).name, (((runtime.xrExtensionConstructors)[5])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[6])).name, (((runtime.xrExtensionConstructors)[6])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[7])).name, (((runtime.xrExtensionConstructors)[7])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[8])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[8])).name, (((runtime.xrExtensionConstructors)[8])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[9])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[9])).name, (((runtime.xrExtensionConstructors)[9])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[10])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[10])).name, (((runtime.xrExtensionConstructors)[10])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[11])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[11])).name, (((runtime.xrExtensionConstructors)[11])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[12])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[12])).name, (((runtime.xrExtensionConstructors)[12])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[13])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[13])).name, (((runtime.xrExtensionConstructors)[13])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[14])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[14])).name, (((runtime.xrExtensionConstructors)[14])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[15])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[15])).name, (((runtime.xrExtensionConstructors)[15])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[16])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[16])).name, (((runtime.xrExtensionConstructors)[16])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[17])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[17])).name, (((runtime.xrExtensionConstructors)[17])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[18])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[18])).name, (((runtime.xrExtensionConstructors)[18])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[19])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[19])).name, (((runtime.xrExtensionConstructors)[19])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[20])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[20])).name, (((runtime.xrExtensionConstructors)[20])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[21])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[21])).name, (((runtime.xrExtensionConstructors)[21])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[22])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[22])).name, (((runtime.xrExtensionConstructors)[22])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[23])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[23])).name, (((runtime.xrExtensionConstructors)[23])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[24])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[24])).name, (((runtime.xrExtensionConstructors)[24])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[25])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[25])).name, (((runtime.xrExtensionConstructors)[25])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[26])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[26])).name, (((runtime.xrExtensionConstructors)[26])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[27])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[27])).name, (((runtime.xrExtensionConstructors)[27])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[28])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[28])).name, (((runtime.xrExtensionConstructors)[28])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[29])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[29])).name, (((runtime.xrExtensionConstructors)[29])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[30])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[30])).name, (((runtime.xrExtensionConstructors)[30])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[31])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[31])).name, (((runtime.xrExtensionConstructors)[31])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[32])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[32])).name, (((runtime.xrExtensionConstructors)[32])));
  } while (false);
do {
    delete (((runtime.xrExtensionConstructors)[33])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrExtensionConstructors)[33])).name, (((runtime.xrExtensionConstructors)[33])));
  } while (false);
  do {
    const Constructor = constructors[("XRDOMOverlayState")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRWebGLBinding")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRAnchor")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRAnchorSet")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRCPUDepthInformation")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRCamera")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRDepthInformation")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRHand")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRHitTestResult")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRHitTestSource")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRInputSource")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRInputSourceEvent")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRInputSourcesChangeEvent")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRJointPose")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRJointSpace")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRLightEstimate")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRLightProbe")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRTransientInputHitTestResult")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRTransientInputHitTestSource")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRWebGLDepthInformation")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRWebGLLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRCompositionLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRProjectionLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRCubeLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRCylinderLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XREquirectLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRLayerEvent")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRQuadLayer")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRSubImage")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRWebGLSubImage")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRPlane")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRPlaneSet")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRVisibilityMaskChangeEvent")];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("XRDOMOverlayState")]), ("type"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRDOMOverlayState")]).prototype, (constructors[("XRDOMOverlayState")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRDOMOverlayState")]).prototype, (constructors[("XRDOMOverlayState")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      defineConstructorBacklink((constructors[("XRLayer")]).prototype, (constructors[("XRLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRLayer")]).prototype, (constructors[("XRLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRWebGLBinding")]), ("nativeProjectionScaleFactor"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLBinding")]), ("usesDepthValues"));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("createCubeLayer"), (1));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("createCylinderLayer"), (1));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("createEquirectLayer"), (1));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("createProjectionLayer"), (0));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("createQuadLayer"), (1));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("getSubImage"), (2));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("getViewSubImage"), (2));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("getCameraImage"), (1));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("getDepthInformation"), (1));
  } while (false);
do {
    installMethod((constructors[("XRWebGLBinding")]), ("getReflectionCubeMap"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRWebGLBinding")]).prototype, (constructors[("XRWebGLBinding")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRWebGLBinding")]).prototype, (constructors[("XRWebGLBinding")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRAnchor")]), ("anchorSpace"));
  } while (false);
do {
    installMethod((constructors[("XRAnchor")]), ("delete"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRAnchor")]).prototype, (constructors[("XRAnchor")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRAnchor")]).prototype, (constructors[("XRAnchor")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRAnchorSet")]), ("size"));
  } while (false);
do {
    installMethod((constructors[("XRAnchorSet")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("XRAnchorSet")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("XRAnchorSet")]), ("has"), (1));
  } while (false);
do {
    installMethod((constructors[("XRAnchorSet")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("XRAnchorSet")]), ("values"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRAnchorSet")]).prototype, (constructors[("XRAnchorSet")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRAnchorSet")]).prototype, (constructors[("XRAnchorSet")]).name);
    }
  } while (false);
do {
    {
      const callback = {
        [("values")]() {
          return runtime.xrExtensionIterator(this);
        },
      }[("values")];
      registerNativeFunction(callback, ("values"));
      Object.defineProperty((constructors[("XRAnchorSet")]).prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRCPUDepthInformation")]), ("data"));
  } while (false);
do {
    installMethod((constructors[("XRCPUDepthInformation")]), ("getDepthInMeters"), (2));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRCPUDepthInformation")]).prototype, (constructors[("XRCPUDepthInformation")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRCPUDepthInformation")]).prototype, (constructors[("XRCPUDepthInformation")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRCamera")]), ("width"));
  } while (false);
do {
    installAccessor((constructors[("XRCamera")]), ("height"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRCamera")]).prototype, (constructors[("XRCamera")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRCamera")]).prototype, (constructors[("XRCamera")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRDepthInformation")]), ("width"));
  } while (false);
do {
    installAccessor((constructors[("XRDepthInformation")]), ("height"));
  } while (false);
do {
    installAccessor((constructors[("XRDepthInformation")]), ("normDepthBufferFromNormView"));
  } while (false);
do {
    installAccessor((constructors[("XRDepthInformation")]), ("rawValueToMeters"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRDepthInformation")]).prototype, (constructors[("XRDepthInformation")]));
    }
  } while (false);
do {
    installAccessor((constructors[("XRDepthInformation")]), ("projectionMatrix"));
  } while (false);
do {
    installAccessor((constructors[("XRDepthInformation")]), ("transform"));
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRDepthInformation")]).prototype, (constructors[("XRDepthInformation")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRHand")]), ("size"));
  } while (false);
do {
    installMethod((constructors[("XRHand")]), ("get"), (1));
  } while (false);
do {
    installMethod((constructors[("XRHand")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("XRHand")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("XRHand")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("XRHand")]), ("values"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRHand")]).prototype, (constructors[("XRHand")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRHand")]).prototype, (constructors[("XRHand")]).name);
    }
  } while (false);
do {
    {
      const callback = {
        [("entries")]() {
          return runtime.xrExtensionIterator(this);
        },
      }[("entries")];
      registerNativeFunction(callback, ("entries"));
      Object.defineProperty((constructors[("XRHand")]).prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("XRHitTestResult")]), ("getPose"), (1));
  } while (false);
do {
    installMethod((constructors[("XRHitTestResult")]), ("createAnchor"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRHitTestResult")]).prototype, (constructors[("XRHitTestResult")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRHitTestResult")]).prototype, (constructors[("XRHitTestResult")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("XRHitTestSource")]), ("cancel"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRHitTestSource")]).prototype, (constructors[("XRHitTestSource")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRHitTestSource")]).prototype, (constructors[("XRHitTestSource")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRInputSource")]), ("handedness"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSource")]), ("targetRayMode"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSource")]), ("targetRaySpace"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSource")]), ("gripSpace"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSource")]), ("gamepad"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSource")]), ("hand"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSource")]), ("profiles"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRInputSource")]).prototype, (constructors[("XRInputSource")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRInputSource")]).prototype, (constructors[("XRInputSource")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRInputSourceEvent")]), ("frame"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSourceEvent")]), ("inputSource"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRInputSourceEvent")]).prototype, (constructors[("XRInputSourceEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRInputSourceEvent")]).prototype, (constructors[("XRInputSourceEvent")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRInputSourcesChangeEvent")]), ("session"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSourcesChangeEvent")]), ("added"));
  } while (false);
do {
    installAccessor((constructors[("XRInputSourcesChangeEvent")]), ("removed"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRInputSourcesChangeEvent")]).prototype, (constructors[("XRInputSourcesChangeEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRInputSourcesChangeEvent")]).prototype, (constructors[("XRInputSourcesChangeEvent")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRJointPose")]), ("radius"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRJointPose")]).prototype, (constructors[("XRJointPose")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRJointPose")]).prototype, (constructors[("XRJointPose")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRJointSpace")]), ("jointName"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRJointSpace")]).prototype, (constructors[("XRJointSpace")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRJointSpace")]).prototype, (constructors[("XRJointSpace")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRLightEstimate")]), ("sphericalHarmonicsCoefficients"));
  } while (false);
do {
    installAccessor((constructors[("XRLightEstimate")]), ("primaryLightDirection"));
  } while (false);
do {
    installAccessor((constructors[("XRLightEstimate")]), ("primaryLightIntensity"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRLightEstimate")]).prototype, (constructors[("XRLightEstimate")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRLightEstimate")]).prototype, (constructors[("XRLightEstimate")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRLightProbe")]), ("probeSpace"));
  } while (false);
do {
    installAccessor((constructors[("XRLightProbe")]), ("onreflectionchange"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRLightProbe")]).prototype, (constructors[("XRLightProbe")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRLightProbe")]).prototype, (constructors[("XRLightProbe")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRTransientInputHitTestResult")]), ("inputSource"));
  } while (false);
do {
    installAccessor((constructors[("XRTransientInputHitTestResult")]), ("results"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRTransientInputHitTestResult")]).prototype, (constructors[("XRTransientInputHitTestResult")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRTransientInputHitTestResult")]).prototype, (constructors[("XRTransientInputHitTestResult")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("XRTransientInputHitTestSource")]), ("cancel"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRTransientInputHitTestSource")]).prototype, (constructors[("XRTransientInputHitTestSource")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRTransientInputHitTestSource")]).prototype, (constructors[("XRTransientInputHitTestSource")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRWebGLDepthInformation")]), ("texture"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRWebGLDepthInformation")]).prototype, (constructors[("XRWebGLDepthInformation")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRWebGLDepthInformation")]).prototype, (constructors[("XRWebGLDepthInformation")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRWebGLLayer")]), ("antialias"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLLayer")]), ("ignoreDepthValues"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLLayer")]), ("framebufferWidth"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLLayer")]), ("framebufferHeight"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLLayer")]), ("framebuffer"));
  } while (false);
do {
    installMethod((constructors[("XRWebGLLayer")]), ("getViewport"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRWebGLLayer")]).prototype, (constructors[("XRWebGLLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRWebGLLayer")]).prototype, (constructors[("XRWebGLLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRCompositionLayer")]), ("layout"));
  } while (false);
do {
    installAccessor((constructors[("XRCompositionLayer")]), ("blendTextureSourceAlpha"));
  } while (false);
do {
    installAccessor((constructors[("XRCompositionLayer")]), ("forceMonoPresentation"));
  } while (false);
do {
    installAccessor((constructors[("XRCompositionLayer")]), ("opacity"));
  } while (false);
do {
    installAccessor((constructors[("XRCompositionLayer")]), ("mipLevels"));
  } while (false);
do {
    installAccessor((constructors[("XRCompositionLayer")]), ("needsRedraw"));
  } while (false);
do {
    installMethod((constructors[("XRCompositionLayer")]), ("destroy"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRCompositionLayer")]).prototype, (constructors[("XRCompositionLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRCompositionLayer")]).prototype, (constructors[("XRCompositionLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRProjectionLayer")]), ("textureWidth"));
  } while (false);
do {
    installAccessor((constructors[("XRProjectionLayer")]), ("textureHeight"));
  } while (false);
do {
    installAccessor((constructors[("XRProjectionLayer")]), ("textureArrayLength"));
  } while (false);
do {
    installAccessor((constructors[("XRProjectionLayer")]), ("ignoreDepthValues"));
  } while (false);
do {
    installAccessor((constructors[("XRProjectionLayer")]), ("fixedFoveation"));
  } while (false);
do {
    installAccessor((constructors[("XRProjectionLayer")]), ("deltaPose"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRProjectionLayer")]).prototype, (constructors[("XRProjectionLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRProjectionLayer")]).prototype, (constructors[("XRProjectionLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRCubeLayer")]), ("space"));
  } while (false);
do {
    installAccessor((constructors[("XRCubeLayer")]), ("orientation"));
  } while (false);
do {
    installAccessor((constructors[("XRCubeLayer")]), ("onredraw"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRCubeLayer")]).prototype, (constructors[("XRCubeLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRCubeLayer")]).prototype, (constructors[("XRCubeLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRCylinderLayer")]), ("space"));
  } while (false);
do {
    installAccessor((constructors[("XRCylinderLayer")]), ("transform"));
  } while (false);
do {
    installAccessor((constructors[("XRCylinderLayer")]), ("radius"));
  } while (false);
do {
    installAccessor((constructors[("XRCylinderLayer")]), ("centralAngle"));
  } while (false);
do {
    installAccessor((constructors[("XRCylinderLayer")]), ("aspectRatio"));
  } while (false);
do {
    installAccessor((constructors[("XRCylinderLayer")]), ("onredraw"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRCylinderLayer")]).prototype, (constructors[("XRCylinderLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRCylinderLayer")]).prototype, (constructors[("XRCylinderLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XREquirectLayer")]), ("space"));
  } while (false);
do {
    installAccessor((constructors[("XREquirectLayer")]), ("transform"));
  } while (false);
do {
    installAccessor((constructors[("XREquirectLayer")]), ("radius"));
  } while (false);
do {
    installAccessor((constructors[("XREquirectLayer")]), ("centralHorizontalAngle"));
  } while (false);
do {
    installAccessor((constructors[("XREquirectLayer")]), ("upperVerticalAngle"));
  } while (false);
do {
    installAccessor((constructors[("XREquirectLayer")]), ("lowerVerticalAngle"));
  } while (false);
do {
    installAccessor((constructors[("XREquirectLayer")]), ("onredraw"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XREquirectLayer")]).prototype, (constructors[("XREquirectLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XREquirectLayer")]).prototype, (constructors[("XREquirectLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRLayerEvent")]), ("layer"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRLayerEvent")]).prototype, (constructors[("XRLayerEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRLayerEvent")]).prototype, (constructors[("XRLayerEvent")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRQuadLayer")]), ("space"));
  } while (false);
do {
    installAccessor((constructors[("XRQuadLayer")]), ("transform"));
  } while (false);
do {
    installAccessor((constructors[("XRQuadLayer")]), ("width"));
  } while (false);
do {
    installAccessor((constructors[("XRQuadLayer")]), ("height"));
  } while (false);
do {
    installAccessor((constructors[("XRQuadLayer")]), ("onredraw"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRQuadLayer")]).prototype, (constructors[("XRQuadLayer")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRQuadLayer")]).prototype, (constructors[("XRQuadLayer")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRSubImage")]), ("viewport"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRSubImage")]).prototype, (constructors[("XRSubImage")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRSubImage")]).prototype, (constructors[("XRSubImage")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("colorTexture"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("depthStencilTexture"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("motionVectorTexture"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("imageIndex"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("colorTextureWidth"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("colorTextureHeight"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("depthStencilTextureWidth"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("depthStencilTextureHeight"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("motionVectorTextureWidth"));
  } while (false);
do {
    installAccessor((constructors[("XRWebGLSubImage")]), ("motionVectorTextureHeight"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRWebGLSubImage")]).prototype, (constructors[("XRWebGLSubImage")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRWebGLSubImage")]).prototype, (constructors[("XRWebGLSubImage")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRPlane")]), ("planeSpace"));
  } while (false);
do {
    installAccessor((constructors[("XRPlane")]), ("polygon"));
  } while (false);
do {
    installAccessor((constructors[("XRPlane")]), ("orientation"));
  } while (false);
do {
    installAccessor((constructors[("XRPlane")]), ("lastChangedTime"));
  } while (false);
do {
    installAccessor((constructors[("XRPlane")]), ("semanticLabel"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRPlane")]).prototype, (constructors[("XRPlane")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRPlane")]).prototype, (constructors[("XRPlane")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRPlaneSet")]), ("size"));
  } while (false);
do {
    installMethod((constructors[("XRPlaneSet")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("XRPlaneSet")]), ("forEach"), (1));
  } while (false);
do {
    installMethod((constructors[("XRPlaneSet")]), ("has"), (1));
  } while (false);
do {
    installMethod((constructors[("XRPlaneSet")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("XRPlaneSet")]), ("values"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRPlaneSet")]).prototype, (constructors[("XRPlaneSet")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRPlaneSet")]).prototype, (constructors[("XRPlaneSet")]).name);
    }
  } while (false);
do {
    {
      const callback = {
        [("values")]() {
          return runtime.xrExtensionIterator(this);
        },
      }[("values")];
      registerNativeFunction(callback, ("values"));
      Object.defineProperty((constructors[("XRPlaneSet")]).prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRVisibilityMaskChangeEvent")]), ("session"));
  } while (false);
do {
    installAccessor((constructors[("XRVisibilityMaskChangeEvent")]), ("eye"));
  } while (false);
do {
    installAccessor((constructors[("XRVisibilityMaskChangeEvent")]), ("index"));
  } while (false);
do {
    installAccessor((constructors[("XRVisibilityMaskChangeEvent")]), ("vertices"));
  } while (false);
do {
    installAccessor((constructors[("XRVisibilityMaskChangeEvent")]), ("indices"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRVisibilityMaskChangeEvent")]).prototype, (constructors[("XRVisibilityMaskChangeEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRVisibilityMaskChangeEvent")]).prototype, (constructors[("XRVisibilityMaskChangeEvent")]).name);
    }
  } while (false);
}
  } while (false);
  defineNativeStatic(
    runtime.XRWebGLLayer,
    "getNativeFramebufferScaleFactor",
    1,
    runtime.nativeFramebufferScaleFactor,
  );
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.xrExtensionProperty(this, name);
    },
    set [name](value) {
      runtime.setXRExtensionProperty(this, name, value);
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
      return runtime.xrExtensionOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function defineNativeStatic(Constructor, name, length, implementation) {
  const callback = {
    [name](...args) {
      return implementation(...args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
