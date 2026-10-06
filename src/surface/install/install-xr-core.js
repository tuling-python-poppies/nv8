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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

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

    delete runtime.xrCoreConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[0].name, runtime.xrCoreConstructors[0]);

    delete runtime.xrCoreConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[1].name, runtime.xrCoreConstructors[1]);

    delete runtime.xrCoreConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[2].name, runtime.xrCoreConstructors[2]);

    delete runtime.xrCoreConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[3].name, runtime.xrCoreConstructors[3]);

    delete runtime.xrCoreConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[4].name, runtime.xrCoreConstructors[4]);

    delete runtime.xrCoreConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[5].name, runtime.xrCoreConstructors[5]);

    delete runtime.xrCoreConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[6].name, runtime.xrCoreConstructors[6]);

    delete runtime.xrCoreConstructors[7].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[7].name, runtime.xrCoreConstructors[7]);

    delete runtime.xrCoreConstructors[8].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[8].name, runtime.xrCoreConstructors[8]);

    delete runtime.xrCoreConstructors[9].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[9].name, runtime.xrCoreConstructors[9]);

    delete runtime.xrCoreConstructors[10].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[10].name, runtime.xrCoreConstructors[10]);

    delete runtime.xrCoreConstructors[11].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[11].name, runtime.xrCoreConstructors[11]);

    delete runtime.xrCoreConstructors[12].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[12].name, runtime.xrCoreConstructors[12]);

    delete runtime.xrCoreConstructors[13].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[13].name, runtime.xrCoreConstructors[13]);

    delete runtime.xrCoreConstructors[14].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[14].name, runtime.xrCoreConstructors[14]);

    delete runtime.xrCoreConstructors[15].prototype.constructor;
    defineGlobalConstructor(runtime.xrCoreConstructors[15].name, runtime.xrCoreConstructors[15]);

  {
    const Constructor = constructors["XRBoundedReferenceSpace"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[0]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRFrame"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[1]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRInputSourceArray"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[2]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRPose"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[3]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRRay"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[4]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRReferenceSpace"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[5]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[5]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRReferenceSpaceEvent"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[6]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[6]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRRenderState"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[7]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[7]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[7]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRRigidTransform"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[8]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[8]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[8]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRSession"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[9]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[9]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[9]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRSessionEvent"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[10]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[10]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[10]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRSpace"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[11]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[11]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[11]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRSystem"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[12]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[12]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[12]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRView"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[13]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[13]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[13]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRViewerPose"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[14]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[14]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[14]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRViewport"];
    const parent = constructors[(((((Object.entries(XR_CORE_SURFACES))[15]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_CORE_SURFACES))[15]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_CORE_SURFACES))[15]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }

    {

    installAccessor(constructors["XRBoundedReferenceSpace"], "boundsGeometry");

    {
      defineConstructorBacklink(constructors["XRBoundedReferenceSpace"].prototype, constructors["XRBoundedReferenceSpace"]);
    }

    {
      defineToStringTag(constructors["XRBoundedReferenceSpace"].prototype, constructors["XRBoundedReferenceSpace"].name);
    }

}

    {

    installAccessor(constructors["XRFrame"], "session");

    installMethod(constructors["XRFrame"], "getPose", 2);

    installMethod(constructors["XRFrame"], "getViewerPose", 1);

    installAccessor(constructors["XRFrame"], "trackedAnchors");

    installMethod(constructors["XRFrame"], "createAnchor", 2);

    installMethod(constructors["XRFrame"], "fillJointRadii", 2);

    installMethod(constructors["XRFrame"], "fillPoses", 3);

    installMethod(constructors["XRFrame"], "getDepthInformation", 1);

    installMethod(constructors["XRFrame"], "getHitTestResults", 1);

    installMethod(constructors["XRFrame"], "getHitTestResultsForTransientInput", 1);

    installMethod(constructors["XRFrame"], "getJointPose", 2);

    installMethod(constructors["XRFrame"], "getLightEstimate", 1);

    {
      defineConstructorBacklink(constructors["XRFrame"].prototype, constructors["XRFrame"]);
    }

    installAccessor(constructors["XRFrame"], "detectedPlanes");

    {
      defineToStringTag(constructors["XRFrame"].prototype, constructors["XRFrame"].name);
    }

}

{

    installMethod(constructors["XRInputSourceArray"], "entries", 0);

    installMethod(constructors["XRInputSourceArray"], "keys", 0);

    installMethod(constructors["XRInputSourceArray"], "values", 0);

    installMethod(constructors["XRInputSourceArray"], "forEach", 1);

    installAccessor(constructors["XRInputSourceArray"], "length");

    {
      defineConstructorBacklink(constructors["XRInputSourceArray"].prototype, constructors["XRInputSourceArray"]);
    }

    {
      defineToStringTag(constructors["XRInputSourceArray"].prototype, constructors["XRInputSourceArray"].name);
    }

{
      function values() {
        return runtime.xrIterator(this);
      }
      registerNativeFunction(values, "values");
      definePrototypeMethod(
        (constructors["XRInputSourceArray"]).prototype,
        Symbol.iterator,
        values,
        "values",
        false,
      );
    }
}

    {

    installAccessor(constructors["XRPose"], "transform");

    installAccessor(constructors["XRPose"], "emulatedPosition");

    {
      defineConstructorBacklink(constructors["XRPose"].prototype, constructors["XRPose"]);
    }

    {
      defineToStringTag(constructors["XRPose"].prototype, constructors["XRPose"].name);
    }

}

    {

    installAccessor(constructors["XRRay"], "origin");

    installAccessor(constructors["XRRay"], "direction");

    installAccessor(constructors["XRRay"], "matrix");

    {
      defineConstructorBacklink(constructors["XRRay"].prototype, constructors["XRRay"]);
    }

    {
      defineToStringTag(constructors["XRRay"].prototype, constructors["XRRay"].name);
    }

}

    {

    installAccessor(constructors["XRReferenceSpace"], "onreset");

    installMethod(constructors["XRReferenceSpace"], "getOffsetReferenceSpace", 1);

    {
      defineConstructorBacklink(constructors["XRReferenceSpace"].prototype, constructors["XRReferenceSpace"]);
    }

    {
      defineToStringTag(constructors["XRReferenceSpace"].prototype, constructors["XRReferenceSpace"].name);
    }

}

    {

    installAccessor(constructors["XRReferenceSpaceEvent"], "referenceSpace");

    installAccessor(constructors["XRReferenceSpaceEvent"], "transform");

    {
      defineConstructorBacklink(constructors["XRReferenceSpaceEvent"].prototype, constructors["XRReferenceSpaceEvent"]);
    }

    {
      defineToStringTag(constructors["XRReferenceSpaceEvent"].prototype, constructors["XRReferenceSpaceEvent"].name);
    }

}

    {

    installAccessor(constructors["XRRenderState"], "depthNear");

    installAccessor(constructors["XRRenderState"], "depthFar");

    installAccessor(constructors["XRRenderState"], "inlineVerticalFieldOfView");

    installAccessor(constructors["XRRenderState"], "baseLayer");

    installAccessor(constructors["XRRenderState"], "layers");

    {
      defineConstructorBacklink(constructors["XRRenderState"].prototype, constructors["XRRenderState"]);
    }

    {
      defineToStringTag(constructors["XRRenderState"].prototype, constructors["XRRenderState"].name);
    }

}

    {

    installAccessor(constructors["XRRigidTransform"], "position");

    installAccessor(constructors["XRRigidTransform"], "orientation");

    installAccessor(constructors["XRRigidTransform"], "matrix");

    installAccessor(constructors["XRRigidTransform"], "inverse");

    {
      defineConstructorBacklink(constructors["XRRigidTransform"].prototype, constructors["XRRigidTransform"]);
    }

    {
      defineToStringTag(constructors["XRRigidTransform"].prototype, constructors["XRRigidTransform"].name);
    }

}

    {

    installAccessor(constructors["XRSession"], "environmentBlendMode");

    installAccessor(constructors["XRSession"], "interactionMode");

    installAccessor(constructors["XRSession"], "visibilityState");

    installAccessor(constructors["XRSession"], "renderState");

    installAccessor(constructors["XRSession"], "inputSources");

    installAccessor(constructors["XRSession"], "domOverlayState");

    installAccessor(constructors["XRSession"], "preferredReflectionFormat");

    installAccessor(constructors["XRSession"], "onend");

    installAccessor(constructors["XRSession"], "onselect");

    installAccessor(constructors["XRSession"], "oninputsourceschange");

    installAccessor(constructors["XRSession"], "onselectstart");

    installAccessor(constructors["XRSession"], "onselectend");

    installAccessor(constructors["XRSession"], "onvisibilitychange");

    installAccessor(constructors["XRSession"], "onsqueeze");

    installAccessor(constructors["XRSession"], "onsqueezestart");

    installAccessor(constructors["XRSession"], "onsqueezeend");

    installAccessor(constructors["XRSession"], "depthUsage");

    installAccessor(constructors["XRSession"], "depthDataFormat");

    installAccessor(constructors["XRSession"], "depthType");

    installAccessor(constructors["XRSession"], "depthActive");

    installMethod(constructors["XRSession"], "cancelAnimationFrame", 1);

    installMethod(constructors["XRSession"], "end", 0);

    installMethod(constructors["XRSession"], "pauseDepthSensing", 0);

    installMethod(constructors["XRSession"], "requestAnimationFrame", 1);

    installMethod(constructors["XRSession"], "requestHitTestSource", 1);

    installMethod(constructors["XRSession"], "requestHitTestSourceForTransientInput", 1);

    installMethod(constructors["XRSession"], "requestLightProbe", 0);

    installMethod(constructors["XRSession"], "requestReferenceSpace", 1);

    installMethod(constructors["XRSession"], "resumeDepthSensing", 0);

    installMethod(constructors["XRSession"], "updateRenderState", 0);

    installAccessor(constructors["XRSession"], "enabledFeatures");

    installAccessor(constructors["XRSession"], "maxRenderLayers");

    installAccessor(constructors["XRSession"], "onvisibilitymaskchange");

    {
      defineConstructorBacklink(constructors["XRSession"].prototype, constructors["XRSession"]);
    }

    installMethod(constructors["XRSession"], "initiateRoomCapture", 0);

    {
      defineToStringTag(constructors["XRSession"].prototype, constructors["XRSession"].name);
    }

}

    {

    installAccessor(constructors["XRSessionEvent"], "session");

    {
      defineConstructorBacklink(constructors["XRSessionEvent"].prototype, constructors["XRSessionEvent"]);
    }

    {
      defineToStringTag(constructors["XRSessionEvent"].prototype, constructors["XRSessionEvent"].name);
    }

}

    {

    {
      defineConstructorBacklink(constructors["XRSpace"].prototype, constructors["XRSpace"]);
    }

    {
      defineToStringTag(constructors["XRSpace"].prototype, constructors["XRSpace"].name);
    }

}

    {

    installAccessor(constructors["XRSystem"], "ondevicechange");

    installMethod(constructors["XRSystem"], "isSessionSupported", 1);

    installMethod(constructors["XRSystem"], "requestSession", 1);

    {
      defineConstructorBacklink(constructors["XRSystem"].prototype, constructors["XRSystem"]);
    }

    {
      defineToStringTag(constructors["XRSystem"].prototype, constructors["XRSystem"].name);
    }

}

    {

    installAccessor(constructors["XRView"], "eye");

    installAccessor(constructors["XRView"], "recommendedViewportScale");

    installAccessor(constructors["XRView"], "isFirstPersonObserver");

    installAccessor(constructors["XRView"], "camera");

    installMethod(constructors["XRView"], "requestViewportScale", 1);

    installAccessor(constructors["XRView"], "index");

    {
      defineConstructorBacklink(constructors["XRView"].prototype, constructors["XRView"]);
    }

    installAccessor(constructors["XRView"], "projectionMatrix");

    installAccessor(constructors["XRView"], "transform");

    {
      defineToStringTag(constructors["XRView"].prototype, constructors["XRView"].name);
    }

}

    {

    installAccessor(constructors["XRViewerPose"], "views");

    {
      defineConstructorBacklink(constructors["XRViewerPose"].prototype, constructors["XRViewerPose"]);
    }

    {
      defineToStringTag(constructors["XRViewerPose"].prototype, constructors["XRViewerPose"].name);
    }

}

    {

    installAccessor(constructors["XRViewport"], "x");

    installAccessor(constructors["XRViewport"], "y");

    installAccessor(constructors["XRViewport"], "width");

    installAccessor(constructors["XRViewport"], "height");

    {
      defineConstructorBacklink(constructors["XRViewport"].prototype, constructors["XRViewport"]);
    }

    {
      defineToStringTag(constructors["XRViewport"].prototype, constructors["XRViewport"].name);
    }

}

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
