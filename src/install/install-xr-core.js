import { Event } from "../api/event/event-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/xr/xr-core-runtime.js";
import { XR_CORE_SURFACES } from "../api/xr/xr-core-surface.js";
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
  runtime.xrCoreConstructors.map(Constructor => [Constructor.name, Constructor]),
));

const settable = new Set([
  "ondevicechange",
  "onend",
  "onselect",
  "oninputsourceschange",
  "onselectstart",
  "onselectend",
  "onvisibilitychange",
  "onsqueeze",
  "onsqueezestart",
  "onsqueezeend",
  "onvisibilitymaskchange",
  "onreset",
]);

export function installXRCore() {
  do {
    delete (((runtime.xrCoreConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[0])).name, (((runtime.xrCoreConstructors)[0])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[1])).name, (((runtime.xrCoreConstructors)[1])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[2])).name, (((runtime.xrCoreConstructors)[2])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[3])).name, (((runtime.xrCoreConstructors)[3])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[4])).name, (((runtime.xrCoreConstructors)[4])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[5])).name, (((runtime.xrCoreConstructors)[5])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[6])).name, (((runtime.xrCoreConstructors)[6])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[7])).name, (((runtime.xrCoreConstructors)[7])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[8])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[8])).name, (((runtime.xrCoreConstructors)[8])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[9])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[9])).name, (((runtime.xrCoreConstructors)[9])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[10])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[10])).name, (((runtime.xrCoreConstructors)[10])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[11])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[11])).name, (((runtime.xrCoreConstructors)[11])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[12])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[12])).name, (((runtime.xrCoreConstructors)[12])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[13])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[13])).name, (((runtime.xrCoreConstructors)[13])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[14])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[14])).name, (((runtime.xrCoreConstructors)[14])));
  } while (false);
do {
    delete (((runtime.xrCoreConstructors)[15])).prototype.constructor;
    defineGlobalConstructor((((runtime.xrCoreConstructors)[15])).name, (((runtime.xrCoreConstructors)[15])));
  } while (false);
  do {
    const Constructor = constructors[("XRBoundedReferenceSpace")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[0]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRFrame")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[1]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRInputSourceArray")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[2]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRPose")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[3]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRRay")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[4]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRReferenceSpace")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[5]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[5]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRReferenceSpaceEvent")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[6]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[6]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRRenderState")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[7]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[7]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[7]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRRigidTransform")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[8]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[8]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[8]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRSession")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[9]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[9]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[9]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRSessionEvent")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[10]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[10]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[10]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRSpace")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[11]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[11]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[11]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRSystem")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[12]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[12]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[12]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRView")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[13]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[13]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[13]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRViewerPose")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[14]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[14]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[14]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("XRViewport")];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[15]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[15]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[15]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("XRBoundedReferenceSpace")]), ("boundsGeometry"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRBoundedReferenceSpace")]).prototype, (constructors[("XRBoundedReferenceSpace")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRBoundedReferenceSpace")]).prototype, (constructors[("XRBoundedReferenceSpace")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRFrame")]), ("session"));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("getPose"), (2));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("getViewerPose"), (1));
  } while (false);
do {
    installAccessor((constructors[("XRFrame")]), ("trackedAnchors"));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("createAnchor"), (2));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("fillJointRadii"), (2));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("fillPoses"), (3));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("getDepthInformation"), (1));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("getHitTestResults"), (1));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("getHitTestResultsForTransientInput"), (1));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("getJointPose"), (2));
  } while (false);
do {
    installMethod((constructors[("XRFrame")]), ("getLightEstimate"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRFrame")]).prototype, (constructors[("XRFrame")]));
    }
  } while (false);
do {
    installAccessor((constructors[("XRFrame")]), ("detectedPlanes"));
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRFrame")]).prototype, (constructors[("XRFrame")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("XRInputSourceArray")]), ("entries"), (0));
  } while (false);
do {
    installMethod((constructors[("XRInputSourceArray")]), ("keys"), (0));
  } while (false);
do {
    installMethod((constructors[("XRInputSourceArray")]), ("values"), (0));
  } while (false);
do {
    installMethod((constructors[("XRInputSourceArray")]), ("forEach"), (1));
  } while (false);
do {
    installAccessor((constructors[("XRInputSourceArray")]), ("length"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRInputSourceArray")]).prototype, (constructors[("XRInputSourceArray")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRInputSourceArray")]).prototype, (constructors[("XRInputSourceArray")]).name);
    }
  } while (false);
do {
    {
      function values() {
        return runtime.xrIterator(this);
      }
      registerNativeFunction(values, "values");
      definePrototypeMethod(
        (constructors[("XRInputSourceArray")]).prototype,
        Symbol.iterator,
        values,
        "values",
        false,
      );
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRPose")]), ("transform"));
  } while (false);
do {
    installAccessor((constructors[("XRPose")]), ("emulatedPosition"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRPose")]).prototype, (constructors[("XRPose")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRPose")]).prototype, (constructors[("XRPose")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRRay")]), ("origin"));
  } while (false);
do {
    installAccessor((constructors[("XRRay")]), ("direction"));
  } while (false);
do {
    installAccessor((constructors[("XRRay")]), ("matrix"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRRay")]).prototype, (constructors[("XRRay")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRRay")]).prototype, (constructors[("XRRay")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRReferenceSpace")]), ("onreset"));
  } while (false);
do {
    installMethod((constructors[("XRReferenceSpace")]), ("getOffsetReferenceSpace"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRReferenceSpace")]).prototype, (constructors[("XRReferenceSpace")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRReferenceSpace")]).prototype, (constructors[("XRReferenceSpace")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRReferenceSpaceEvent")]), ("referenceSpace"));
  } while (false);
do {
    installAccessor((constructors[("XRReferenceSpaceEvent")]), ("transform"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRReferenceSpaceEvent")]).prototype, (constructors[("XRReferenceSpaceEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRReferenceSpaceEvent")]).prototype, (constructors[("XRReferenceSpaceEvent")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRRenderState")]), ("depthNear"));
  } while (false);
do {
    installAccessor((constructors[("XRRenderState")]), ("depthFar"));
  } while (false);
do {
    installAccessor((constructors[("XRRenderState")]), ("inlineVerticalFieldOfView"));
  } while (false);
do {
    installAccessor((constructors[("XRRenderState")]), ("baseLayer"));
  } while (false);
do {
    installAccessor((constructors[("XRRenderState")]), ("layers"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRRenderState")]).prototype, (constructors[("XRRenderState")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRRenderState")]).prototype, (constructors[("XRRenderState")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRRigidTransform")]), ("position"));
  } while (false);
do {
    installAccessor((constructors[("XRRigidTransform")]), ("orientation"));
  } while (false);
do {
    installAccessor((constructors[("XRRigidTransform")]), ("matrix"));
  } while (false);
do {
    installAccessor((constructors[("XRRigidTransform")]), ("inverse"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRRigidTransform")]).prototype, (constructors[("XRRigidTransform")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRRigidTransform")]).prototype, (constructors[("XRRigidTransform")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRSession")]), ("environmentBlendMode"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("interactionMode"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("visibilityState"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("renderState"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("inputSources"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("domOverlayState"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("preferredReflectionFormat"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onend"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onselect"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("oninputsourceschange"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onselectstart"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onselectend"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onvisibilitychange"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onsqueeze"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onsqueezestart"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onsqueezeend"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("depthUsage"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("depthDataFormat"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("depthType"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("depthActive"));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("cancelAnimationFrame"), (1));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("end"), (0));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("pauseDepthSensing"), (0));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("requestAnimationFrame"), (1));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("requestHitTestSource"), (1));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("requestHitTestSourceForTransientInput"), (1));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("requestLightProbe"), (0));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("requestReferenceSpace"), (1));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("resumeDepthSensing"), (0));
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("updateRenderState"), (0));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("enabledFeatures"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("maxRenderLayers"));
  } while (false);
do {
    installAccessor((constructors[("XRSession")]), ("onvisibilitymaskchange"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRSession")]).prototype, (constructors[("XRSession")]));
    }
  } while (false);
do {
    installMethod((constructors[("XRSession")]), ("initiateRoomCapture"), (0));
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRSession")]).prototype, (constructors[("XRSession")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRSessionEvent")]), ("session"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRSessionEvent")]).prototype, (constructors[("XRSessionEvent")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRSessionEvent")]).prototype, (constructors[("XRSessionEvent")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      defineConstructorBacklink((constructors[("XRSpace")]).prototype, (constructors[("XRSpace")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRSpace")]).prototype, (constructors[("XRSpace")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRSystem")]), ("ondevicechange"));
  } while (false);
do {
    installMethod((constructors[("XRSystem")]), ("isSessionSupported"), (1));
  } while (false);
do {
    installMethod((constructors[("XRSystem")]), ("requestSession"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRSystem")]).prototype, (constructors[("XRSystem")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRSystem")]).prototype, (constructors[("XRSystem")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRView")]), ("eye"));
  } while (false);
do {
    installAccessor((constructors[("XRView")]), ("recommendedViewportScale"));
  } while (false);
do {
    installAccessor((constructors[("XRView")]), ("isFirstPersonObserver"));
  } while (false);
do {
    installAccessor((constructors[("XRView")]), ("camera"));
  } while (false);
do {
    installMethod((constructors[("XRView")]), ("requestViewportScale"), (1));
  } while (false);
do {
    installAccessor((constructors[("XRView")]), ("index"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRView")]).prototype, (constructors[("XRView")]));
    }
  } while (false);
do {
    installAccessor((constructors[("XRView")]), ("projectionMatrix"));
  } while (false);
do {
    installAccessor((constructors[("XRView")]), ("transform"));
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRView")]).prototype, (constructors[("XRView")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRViewerPose")]), ("views"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRViewerPose")]).prototype, (constructors[("XRViewerPose")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRViewerPose")]).prototype, (constructors[("XRViewerPose")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("XRViewport")]), ("x"));
  } while (false);
do {
    installAccessor((constructors[("XRViewport")]), ("y"));
  } while (false);
do {
    installAccessor((constructors[("XRViewport")]), ("width"));
  } while (false);
do {
    installAccessor((constructors[("XRViewport")]), ("height"));
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("XRViewport")]).prototype, (constructors[("XRViewport")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("XRViewport")]).prototype, (constructors[("XRViewport")]).name);
    }
  } while (false);
}
  } while (false);
}



function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.xrProperty(this, name);
    },
    set [name](value) {
      runtime.setXRProperty(this, name, value);
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
      return runtime.xrOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
