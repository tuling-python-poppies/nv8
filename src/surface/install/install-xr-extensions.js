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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

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

    delete runtime.xrExtensionConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[0].name, runtime.xrExtensionConstructors[0]);

    delete runtime.xrExtensionConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[1].name, runtime.xrExtensionConstructors[1]);

    delete runtime.xrExtensionConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[2].name, runtime.xrExtensionConstructors[2]);

    delete runtime.xrExtensionConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[3].name, runtime.xrExtensionConstructors[3]);

    delete runtime.xrExtensionConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[4].name, runtime.xrExtensionConstructors[4]);

    delete runtime.xrExtensionConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[5].name, runtime.xrExtensionConstructors[5]);

    delete runtime.xrExtensionConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[6].name, runtime.xrExtensionConstructors[6]);

    delete runtime.xrExtensionConstructors[7].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[7].name, runtime.xrExtensionConstructors[7]);

    delete runtime.xrExtensionConstructors[8].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[8].name, runtime.xrExtensionConstructors[8]);

    delete runtime.xrExtensionConstructors[9].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[9].name, runtime.xrExtensionConstructors[9]);

    delete runtime.xrExtensionConstructors[10].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[10].name, runtime.xrExtensionConstructors[10]);

    delete runtime.xrExtensionConstructors[11].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[11].name, runtime.xrExtensionConstructors[11]);

    delete runtime.xrExtensionConstructors[12].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[12].name, runtime.xrExtensionConstructors[12]);

    delete runtime.xrExtensionConstructors[13].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[13].name, runtime.xrExtensionConstructors[13]);

    delete runtime.xrExtensionConstructors[14].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[14].name, runtime.xrExtensionConstructors[14]);

    delete runtime.xrExtensionConstructors[15].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[15].name, runtime.xrExtensionConstructors[15]);

    delete runtime.xrExtensionConstructors[16].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[16].name, runtime.xrExtensionConstructors[16]);

    delete runtime.xrExtensionConstructors[17].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[17].name, runtime.xrExtensionConstructors[17]);

    delete runtime.xrExtensionConstructors[18].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[18].name, runtime.xrExtensionConstructors[18]);

    delete runtime.xrExtensionConstructors[19].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[19].name, runtime.xrExtensionConstructors[19]);

    delete runtime.xrExtensionConstructors[20].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[20].name, runtime.xrExtensionConstructors[20]);

    delete runtime.xrExtensionConstructors[21].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[21].name, runtime.xrExtensionConstructors[21]);

    delete runtime.xrExtensionConstructors[22].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[22].name, runtime.xrExtensionConstructors[22]);

    delete runtime.xrExtensionConstructors[23].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[23].name, runtime.xrExtensionConstructors[23]);

    delete runtime.xrExtensionConstructors[24].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[24].name, runtime.xrExtensionConstructors[24]);

    delete runtime.xrExtensionConstructors[25].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[25].name, runtime.xrExtensionConstructors[25]);

    delete runtime.xrExtensionConstructors[26].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[26].name, runtime.xrExtensionConstructors[26]);

    delete runtime.xrExtensionConstructors[27].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[27].name, runtime.xrExtensionConstructors[27]);

    delete runtime.xrExtensionConstructors[28].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[28].name, runtime.xrExtensionConstructors[28]);

    delete runtime.xrExtensionConstructors[29].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[29].name, runtime.xrExtensionConstructors[29]);

    delete runtime.xrExtensionConstructors[30].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[30].name, runtime.xrExtensionConstructors[30]);

    delete runtime.xrExtensionConstructors[31].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[31].name, runtime.xrExtensionConstructors[31]);

    delete runtime.xrExtensionConstructors[32].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[32].name, runtime.xrExtensionConstructors[32]);

    delete runtime.xrExtensionConstructors[33].prototype.constructor;
    defineGlobalConstructor(runtime.xrExtensionConstructors[33].name, runtime.xrExtensionConstructors[33]);

  {
    const Constructor = constructors["XRDOMOverlayState"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[0]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[1]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRWebGLBinding"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[2]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRAnchor"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[3]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRAnchorSet"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[4]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRCPUDepthInformation"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[5]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRCamera"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[6]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRDepthInformation"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[7]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRHand"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[8]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRHitTestResult"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[9]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRHitTestSource"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[10]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRInputSource"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[11]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRInputSourceEvent"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[12]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRInputSourcesChangeEvent"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[13]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRJointPose"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[14]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRJointSpace"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[15]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRLightEstimate"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[16]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRLightProbe"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[17]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRTransientInputHitTestResult"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[18]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRTransientInputHitTestSource"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[19]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRWebGLDepthInformation"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[20]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRWebGLLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[21]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRCompositionLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[22]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRProjectionLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[23]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRCubeLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[24]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRCylinderLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[25]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XREquirectLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[26]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRLayerEvent"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[27]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRQuadLayer"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[28]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRSubImage"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[29]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRWebGLSubImage"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[30]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRPlane"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[31]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRPlaneSet"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[32]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["XRVisibilityMaskChangeEvent"];
    const parent = constructors[(((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent]
      ?? coreConstructors[(((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent]
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent === "EventTarget" ? EventTarget : null)
      ?? ((((((Object.entries(XR_EXTENSION_SURFACES))[33]))[1])).prototypeParent === "Event" ? Event : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }

    {

    installAccessor(constructors["XRDOMOverlayState"], "type");

    {
      defineConstructorBacklink(constructors["XRDOMOverlayState"].prototype, constructors["XRDOMOverlayState"]);
    }

    {
      defineToStringTag(constructors["XRDOMOverlayState"].prototype, constructors["XRDOMOverlayState"].name);
    }

}

    {

    {
      defineConstructorBacklink(constructors["XRLayer"].prototype, constructors["XRLayer"]);
    }

    {
      defineToStringTag(constructors["XRLayer"].prototype, constructors["XRLayer"].name);
    }

}

    {

    installAccessor(constructors["XRWebGLBinding"], "nativeProjectionScaleFactor");

    installAccessor(constructors["XRWebGLBinding"], "usesDepthValues");

    installMethod(constructors["XRWebGLBinding"], "createCubeLayer", 1);

    installMethod(constructors["XRWebGLBinding"], "createCylinderLayer", 1);

    installMethod(constructors["XRWebGLBinding"], "createEquirectLayer", 1);

    installMethod(constructors["XRWebGLBinding"], "createProjectionLayer", 0);

    installMethod(constructors["XRWebGLBinding"], "createQuadLayer", 1);

    installMethod(constructors["XRWebGLBinding"], "getSubImage", 2);

    installMethod(constructors["XRWebGLBinding"], "getViewSubImage", 2);

    installMethod(constructors["XRWebGLBinding"], "getCameraImage", 1);

    installMethod(constructors["XRWebGLBinding"], "getDepthInformation", 1);

    installMethod(constructors["XRWebGLBinding"], "getReflectionCubeMap", 1);

    {
      defineConstructorBacklink(constructors["XRWebGLBinding"].prototype, constructors["XRWebGLBinding"]);
    }

    {
      defineToStringTag(constructors["XRWebGLBinding"].prototype, constructors["XRWebGLBinding"].name);
    }

}

    {

    installAccessor(constructors["XRAnchor"], "anchorSpace");

    installMethod(constructors["XRAnchor"], "delete", 0);

    {
      defineConstructorBacklink(constructors["XRAnchor"].prototype, constructors["XRAnchor"]);
    }

    {
      defineToStringTag(constructors["XRAnchor"].prototype, constructors["XRAnchor"].name);
    }

}

{

    installAccessor(constructors["XRAnchorSet"], "size");

    installMethod(constructors["XRAnchorSet"], "entries", 0);

    installMethod(constructors["XRAnchorSet"], "forEach", 1);

    installMethod(constructors["XRAnchorSet"], "has", 1);

    installMethod(constructors["XRAnchorSet"], "keys", 0);

    installMethod(constructors["XRAnchorSet"], "values", 0);

    {
      defineConstructorBacklink(constructors["XRAnchorSet"].prototype, constructors["XRAnchorSet"]);
    }

    {
      defineToStringTag(constructors["XRAnchorSet"].prototype, constructors["XRAnchorSet"].name);
    }

{
      const callback = {
        ["values"]() {
          return runtime.xrExtensionIterator(this);
        },
      }["values"];
      registerNativeFunction(callback, "values");
      Object.defineProperty(constructors["XRAnchorSet"].prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
}

    {

    installAccessor(constructors["XRCPUDepthInformation"], "data");

    installMethod(constructors["XRCPUDepthInformation"], "getDepthInMeters", 2);

    {
      defineConstructorBacklink(constructors["XRCPUDepthInformation"].prototype, constructors["XRCPUDepthInformation"]);
    }

    {
      defineToStringTag(constructors["XRCPUDepthInformation"].prototype, constructors["XRCPUDepthInformation"].name);
    }

}

    {

    installAccessor(constructors["XRCamera"], "width");

    installAccessor(constructors["XRCamera"], "height");

    {
      defineConstructorBacklink(constructors["XRCamera"].prototype, constructors["XRCamera"]);
    }

    {
      defineToStringTag(constructors["XRCamera"].prototype, constructors["XRCamera"].name);
    }

}

    {

    installAccessor(constructors["XRDepthInformation"], "width");

    installAccessor(constructors["XRDepthInformation"], "height");

    installAccessor(constructors["XRDepthInformation"], "normDepthBufferFromNormView");

    installAccessor(constructors["XRDepthInformation"], "rawValueToMeters");

    {
      defineConstructorBacklink(constructors["XRDepthInformation"].prototype, constructors["XRDepthInformation"]);
    }

    installAccessor(constructors["XRDepthInformation"], "projectionMatrix");

    installAccessor(constructors["XRDepthInformation"], "transform");

    {
      defineToStringTag(constructors["XRDepthInformation"].prototype, constructors["XRDepthInformation"].name);
    }

}

{

    installAccessor(constructors["XRHand"], "size");

    installMethod(constructors["XRHand"], "get", 1);

    installMethod(constructors["XRHand"], "entries", 0);

    installMethod(constructors["XRHand"], "forEach", 1);

    installMethod(constructors["XRHand"], "keys", 0);

    installMethod(constructors["XRHand"], "values", 0);

    {
      defineConstructorBacklink(constructors["XRHand"].prototype, constructors["XRHand"]);
    }

    {
      defineToStringTag(constructors["XRHand"].prototype, constructors["XRHand"].name);
    }

{
      const callback = {
        ["entries"]() {
          return runtime.xrExtensionIterator(this);
        },
      }["entries"];
      registerNativeFunction(callback, "entries");
      Object.defineProperty(constructors["XRHand"].prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
}

    {

    installMethod(constructors["XRHitTestResult"], "getPose", 1);

    installMethod(constructors["XRHitTestResult"], "createAnchor", 0);

    {
      defineConstructorBacklink(constructors["XRHitTestResult"].prototype, constructors["XRHitTestResult"]);
    }

    {
      defineToStringTag(constructors["XRHitTestResult"].prototype, constructors["XRHitTestResult"].name);
    }

}

    {

    installMethod(constructors["XRHitTestSource"], "cancel", 0);

    {
      defineConstructorBacklink(constructors["XRHitTestSource"].prototype, constructors["XRHitTestSource"]);
    }

    {
      defineToStringTag(constructors["XRHitTestSource"].prototype, constructors["XRHitTestSource"].name);
    }

}

    {

    installAccessor(constructors["XRInputSource"], "handedness");

    installAccessor(constructors["XRInputSource"], "targetRayMode");

    installAccessor(constructors["XRInputSource"], "targetRaySpace");

    installAccessor(constructors["XRInputSource"], "gripSpace");

    installAccessor(constructors["XRInputSource"], "gamepad");

    installAccessor(constructors["XRInputSource"], "hand");

    installAccessor(constructors["XRInputSource"], "profiles");

    {
      defineConstructorBacklink(constructors["XRInputSource"].prototype, constructors["XRInputSource"]);
    }

    {
      defineToStringTag(constructors["XRInputSource"].prototype, constructors["XRInputSource"].name);
    }

}

    {

    installAccessor(constructors["XRInputSourceEvent"], "frame");

    installAccessor(constructors["XRInputSourceEvent"], "inputSource");

    {
      defineConstructorBacklink(constructors["XRInputSourceEvent"].prototype, constructors["XRInputSourceEvent"]);
    }

    {
      defineToStringTag(constructors["XRInputSourceEvent"].prototype, constructors["XRInputSourceEvent"].name);
    }

}

    {

    installAccessor(constructors["XRInputSourcesChangeEvent"], "session");

    installAccessor(constructors["XRInputSourcesChangeEvent"], "added");

    installAccessor(constructors["XRInputSourcesChangeEvent"], "removed");

    {
      defineConstructorBacklink(constructors["XRInputSourcesChangeEvent"].prototype, constructors["XRInputSourcesChangeEvent"]);
    }

    {
      defineToStringTag(constructors["XRInputSourcesChangeEvent"].prototype, constructors["XRInputSourcesChangeEvent"].name);
    }

}

    {

    installAccessor(constructors["XRJointPose"], "radius");

    {
      defineConstructorBacklink(constructors["XRJointPose"].prototype, constructors["XRJointPose"]);
    }

    {
      defineToStringTag(constructors["XRJointPose"].prototype, constructors["XRJointPose"].name);
    }

}

    {

    installAccessor(constructors["XRJointSpace"], "jointName");

    {
      defineConstructorBacklink(constructors["XRJointSpace"].prototype, constructors["XRJointSpace"]);
    }

    {
      defineToStringTag(constructors["XRJointSpace"].prototype, constructors["XRJointSpace"].name);
    }

}

    {

    installAccessor(constructors["XRLightEstimate"], "sphericalHarmonicsCoefficients");

    installAccessor(constructors["XRLightEstimate"], "primaryLightDirection");

    installAccessor(constructors["XRLightEstimate"], "primaryLightIntensity");

    {
      defineConstructorBacklink(constructors["XRLightEstimate"].prototype, constructors["XRLightEstimate"]);
    }

    {
      defineToStringTag(constructors["XRLightEstimate"].prototype, constructors["XRLightEstimate"].name);
    }

}

    {

    installAccessor(constructors["XRLightProbe"], "probeSpace");

    installAccessor(constructors["XRLightProbe"], "onreflectionchange");

    {
      defineConstructorBacklink(constructors["XRLightProbe"].prototype, constructors["XRLightProbe"]);
    }

    {
      defineToStringTag(constructors["XRLightProbe"].prototype, constructors["XRLightProbe"].name);
    }

}

    {

    installAccessor(constructors["XRTransientInputHitTestResult"], "inputSource");

    installAccessor(constructors["XRTransientInputHitTestResult"], "results");

    {
      defineConstructorBacklink(constructors["XRTransientInputHitTestResult"].prototype, constructors["XRTransientInputHitTestResult"]);
    }

    {
      defineToStringTag(constructors["XRTransientInputHitTestResult"].prototype, constructors["XRTransientInputHitTestResult"].name);
    }

}

    {

    installMethod(constructors["XRTransientInputHitTestSource"], "cancel", 0);

    {
      defineConstructorBacklink(constructors["XRTransientInputHitTestSource"].prototype, constructors["XRTransientInputHitTestSource"]);
    }

    {
      defineToStringTag(constructors["XRTransientInputHitTestSource"].prototype, constructors["XRTransientInputHitTestSource"].name);
    }

}

    {

    installAccessor(constructors["XRWebGLDepthInformation"], "texture");

    {
      defineConstructorBacklink(constructors["XRWebGLDepthInformation"].prototype, constructors["XRWebGLDepthInformation"]);
    }

    {
      defineToStringTag(constructors["XRWebGLDepthInformation"].prototype, constructors["XRWebGLDepthInformation"].name);
    }

}

    {

    installAccessor(constructors["XRWebGLLayer"], "antialias");

    installAccessor(constructors["XRWebGLLayer"], "ignoreDepthValues");

    installAccessor(constructors["XRWebGLLayer"], "framebufferWidth");

    installAccessor(constructors["XRWebGLLayer"], "framebufferHeight");

    installAccessor(constructors["XRWebGLLayer"], "framebuffer");

    installMethod(constructors["XRWebGLLayer"], "getViewport", 1);

    {
      defineConstructorBacklink(constructors["XRWebGLLayer"].prototype, constructors["XRWebGLLayer"]);
    }

    {
      defineToStringTag(constructors["XRWebGLLayer"].prototype, constructors["XRWebGLLayer"].name);
    }

}

    {

    installAccessor(constructors["XRCompositionLayer"], "layout");

    installAccessor(constructors["XRCompositionLayer"], "blendTextureSourceAlpha");

    installAccessor(constructors["XRCompositionLayer"], "forceMonoPresentation");

    installAccessor(constructors["XRCompositionLayer"], "opacity");

    installAccessor(constructors["XRCompositionLayer"], "mipLevels");

    installAccessor(constructors["XRCompositionLayer"], "needsRedraw");

    installMethod(constructors["XRCompositionLayer"], "destroy", 0);

    {
      defineConstructorBacklink(constructors["XRCompositionLayer"].prototype, constructors["XRCompositionLayer"]);
    }

    {
      defineToStringTag(constructors["XRCompositionLayer"].prototype, constructors["XRCompositionLayer"].name);
    }

}

    {

    installAccessor(constructors["XRProjectionLayer"], "textureWidth");

    installAccessor(constructors["XRProjectionLayer"], "textureHeight");

    installAccessor(constructors["XRProjectionLayer"], "textureArrayLength");

    installAccessor(constructors["XRProjectionLayer"], "ignoreDepthValues");

    installAccessor(constructors["XRProjectionLayer"], "fixedFoveation");

    installAccessor(constructors["XRProjectionLayer"], "deltaPose");

    {
      defineConstructorBacklink(constructors["XRProjectionLayer"].prototype, constructors["XRProjectionLayer"]);
    }

    {
      defineToStringTag(constructors["XRProjectionLayer"].prototype, constructors["XRProjectionLayer"].name);
    }

}

    {

    installAccessor(constructors["XRCubeLayer"], "space");

    installAccessor(constructors["XRCubeLayer"], "orientation");

    installAccessor(constructors["XRCubeLayer"], "onredraw");

    {
      defineConstructorBacklink(constructors["XRCubeLayer"].prototype, constructors["XRCubeLayer"]);
    }

    {
      defineToStringTag(constructors["XRCubeLayer"].prototype, constructors["XRCubeLayer"].name);
    }

}

    {

    installAccessor(constructors["XRCylinderLayer"], "space");

    installAccessor(constructors["XRCylinderLayer"], "transform");

    installAccessor(constructors["XRCylinderLayer"], "radius");

    installAccessor(constructors["XRCylinderLayer"], "centralAngle");

    installAccessor(constructors["XRCylinderLayer"], "aspectRatio");

    installAccessor(constructors["XRCylinderLayer"], "onredraw");

    {
      defineConstructorBacklink(constructors["XRCylinderLayer"].prototype, constructors["XRCylinderLayer"]);
    }

    {
      defineToStringTag(constructors["XRCylinderLayer"].prototype, constructors["XRCylinderLayer"].name);
    }

}

    {

    installAccessor(constructors["XREquirectLayer"], "space");

    installAccessor(constructors["XREquirectLayer"], "transform");

    installAccessor(constructors["XREquirectLayer"], "radius");

    installAccessor(constructors["XREquirectLayer"], "centralHorizontalAngle");

    installAccessor(constructors["XREquirectLayer"], "upperVerticalAngle");

    installAccessor(constructors["XREquirectLayer"], "lowerVerticalAngle");

    installAccessor(constructors["XREquirectLayer"], "onredraw");

    {
      defineConstructorBacklink(constructors["XREquirectLayer"].prototype, constructors["XREquirectLayer"]);
    }

    {
      defineToStringTag(constructors["XREquirectLayer"].prototype, constructors["XREquirectLayer"].name);
    }

}

    {

    installAccessor(constructors["XRLayerEvent"], "layer");

    {
      defineConstructorBacklink(constructors["XRLayerEvent"].prototype, constructors["XRLayerEvent"]);
    }

    {
      defineToStringTag(constructors["XRLayerEvent"].prototype, constructors["XRLayerEvent"].name);
    }

}

    {

    installAccessor(constructors["XRQuadLayer"], "space");

    installAccessor(constructors["XRQuadLayer"], "transform");

    installAccessor(constructors["XRQuadLayer"], "width");

    installAccessor(constructors["XRQuadLayer"], "height");

    installAccessor(constructors["XRQuadLayer"], "onredraw");

    {
      defineConstructorBacklink(constructors["XRQuadLayer"].prototype, constructors["XRQuadLayer"]);
    }

    {
      defineToStringTag(constructors["XRQuadLayer"].prototype, constructors["XRQuadLayer"].name);
    }

}

    {

    installAccessor(constructors["XRSubImage"], "viewport");

    {
      defineConstructorBacklink(constructors["XRSubImage"].prototype, constructors["XRSubImage"]);
    }

    {
      defineToStringTag(constructors["XRSubImage"].prototype, constructors["XRSubImage"].name);
    }

}

    {

    installAccessor(constructors["XRWebGLSubImage"], "colorTexture");

    installAccessor(constructors["XRWebGLSubImage"], "depthStencilTexture");

    installAccessor(constructors["XRWebGLSubImage"], "motionVectorTexture");

    installAccessor(constructors["XRWebGLSubImage"], "imageIndex");

    installAccessor(constructors["XRWebGLSubImage"], "colorTextureWidth");

    installAccessor(constructors["XRWebGLSubImage"], "colorTextureHeight");

    installAccessor(constructors["XRWebGLSubImage"], "depthStencilTextureWidth");

    installAccessor(constructors["XRWebGLSubImage"], "depthStencilTextureHeight");

    installAccessor(constructors["XRWebGLSubImage"], "motionVectorTextureWidth");

    installAccessor(constructors["XRWebGLSubImage"], "motionVectorTextureHeight");

    {
      defineConstructorBacklink(constructors["XRWebGLSubImage"].prototype, constructors["XRWebGLSubImage"]);
    }

    {
      defineToStringTag(constructors["XRWebGLSubImage"].prototype, constructors["XRWebGLSubImage"].name);
    }

}

    {

    installAccessor(constructors["XRPlane"], "planeSpace");

    installAccessor(constructors["XRPlane"], "polygon");

    installAccessor(constructors["XRPlane"], "orientation");

    installAccessor(constructors["XRPlane"], "lastChangedTime");

    installAccessor(constructors["XRPlane"], "semanticLabel");

    {
      defineConstructorBacklink(constructors["XRPlane"].prototype, constructors["XRPlane"]);
    }

    {
      defineToStringTag(constructors["XRPlane"].prototype, constructors["XRPlane"].name);
    }

}

{

    installAccessor(constructors["XRPlaneSet"], "size");

    installMethod(constructors["XRPlaneSet"], "entries", 0);

    installMethod(constructors["XRPlaneSet"], "forEach", 1);

    installMethod(constructors["XRPlaneSet"], "has", 1);

    installMethod(constructors["XRPlaneSet"], "keys", 0);

    installMethod(constructors["XRPlaneSet"], "values", 0);

    {
      defineConstructorBacklink(constructors["XRPlaneSet"].prototype, constructors["XRPlaneSet"]);
    }

    {
      defineToStringTag(constructors["XRPlaneSet"].prototype, constructors["XRPlaneSet"].name);
    }

{
      const callback = {
        ["values"]() {
          return runtime.xrExtensionIterator(this);
        },
      }["values"];
      registerNativeFunction(callback, "values");
      Object.defineProperty(constructors["XRPlaneSet"].prototype, Symbol.iterator, {
        value: callback,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
}

    {

    installAccessor(constructors["XRVisibilityMaskChangeEvent"], "session");

    installAccessor(constructors["XRVisibilityMaskChangeEvent"], "eye");

    installAccessor(constructors["XRVisibilityMaskChangeEvent"], "index");

    installAccessor(constructors["XRVisibilityMaskChangeEvent"], "vertices");

    installAccessor(constructors["XRVisibilityMaskChangeEvent"], "indices");

    {
      defineConstructorBacklink(constructors["XRVisibilityMaskChangeEvent"].prototype, constructors["XRVisibilityMaskChangeEvent"]);
    }

    {
      defineToStringTag(constructors["XRVisibilityMaskChangeEvent"].prototype, constructors["XRVisibilityMaskChangeEvent"].name);
    }

}

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
