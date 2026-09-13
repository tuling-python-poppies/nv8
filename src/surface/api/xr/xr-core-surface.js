// 数据表：来源于真实 Edge 采集基准（fixtures/fingerprint/edge-*.json）。
// 直接编辑本文件；结构与唯一性由 `npm run check:generated` 校验。

export const XR_CORE_SURFACES = Object.freeze({
  "XRBoundedReferenceSpace": {
    "constructorParent": "XRReferenceSpace",
    "prototypeParent": "XRReferenceSpace",
    "members": [
      [
        "accessor",
        "boundsGeometry"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRFrame": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "session"
      ],
      [
        "method",
        "getPose",
        2
      ],
      [
        "method",
        "getViewerPose",
        1
      ],
      [
        "accessor",
        "trackedAnchors"
      ],
      [
        "method",
        "createAnchor",
        2
      ],
      [
        "method",
        "fillJointRadii",
        2
      ],
      [
        "method",
        "fillPoses",
        3
      ],
      [
        "method",
        "getDepthInformation",
        1
      ],
      [
        "method",
        "getHitTestResults",
        1
      ],
      [
        "method",
        "getHitTestResultsForTransientInput",
        1
      ],
      [
        "method",
        "getJointPose",
        2
      ],
      [
        "method",
        "getLightEstimate",
        1
      ],
      [
        "constructor"
      ],
      [
        "accessor",
        "detectedPlanes"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRInputSourceArray": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "method",
        "entries",
        0
      ],
      [
        "method",
        "keys",
        0
      ],
      [
        "method",
        "values",
        0
      ],
      [
        "method",
        "forEach",
        1
      ],
      [
        "accessor",
        "length"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ],
      [
        "iterator",
        "values",
        0
      ]
    ]
  },
  "XRPose": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "transform"
      ],
      [
        "accessor",
        "emulatedPosition"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRRay": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "origin"
      ],
      [
        "accessor",
        "direction"
      ],
      [
        "accessor",
        "matrix"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRReferenceSpace": {
    "constructorParent": "XRSpace",
    "prototypeParent": "XRSpace",
    "members": [
      [
        "accessor",
        "onreset"
      ],
      [
        "method",
        "getOffsetReferenceSpace",
        1
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRReferenceSpaceEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "referenceSpace"
      ],
      [
        "accessor",
        "transform"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRRenderState": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "depthNear"
      ],
      [
        "accessor",
        "depthFar"
      ],
      [
        "accessor",
        "inlineVerticalFieldOfView"
      ],
      [
        "accessor",
        "baseLayer"
      ],
      [
        "accessor",
        "layers"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRRigidTransform": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "position"
      ],
      [
        "accessor",
        "orientation"
      ],
      [
        "accessor",
        "matrix"
      ],
      [
        "accessor",
        "inverse"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRSession": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "environmentBlendMode"
      ],
      [
        "accessor",
        "interactionMode"
      ],
      [
        "accessor",
        "visibilityState"
      ],
      [
        "accessor",
        "renderState"
      ],
      [
        "accessor",
        "inputSources"
      ],
      [
        "accessor",
        "domOverlayState"
      ],
      [
        "accessor",
        "preferredReflectionFormat"
      ],
      [
        "accessor",
        "onend"
      ],
      [
        "accessor",
        "onselect"
      ],
      [
        "accessor",
        "oninputsourceschange"
      ],
      [
        "accessor",
        "onselectstart"
      ],
      [
        "accessor",
        "onselectend"
      ],
      [
        "accessor",
        "onvisibilitychange"
      ],
      [
        "accessor",
        "onsqueeze"
      ],
      [
        "accessor",
        "onsqueezestart"
      ],
      [
        "accessor",
        "onsqueezeend"
      ],
      [
        "accessor",
        "depthUsage"
      ],
      [
        "accessor",
        "depthDataFormat"
      ],
      [
        "accessor",
        "depthType"
      ],
      [
        "accessor",
        "depthActive"
      ],
      [
        "method",
        "cancelAnimationFrame",
        1
      ],
      [
        "method",
        "end",
        0
      ],
      [
        "method",
        "pauseDepthSensing",
        0
      ],
      [
        "method",
        "requestAnimationFrame",
        1
      ],
      [
        "method",
        "requestHitTestSource",
        1
      ],
      [
        "method",
        "requestHitTestSourceForTransientInput",
        1
      ],
      [
        "method",
        "requestLightProbe",
        0
      ],
      [
        "method",
        "requestReferenceSpace",
        1
      ],
      [
        "method",
        "resumeDepthSensing",
        0
      ],
      [
        "method",
        "updateRenderState",
        0
      ],
      [
        "accessor",
        "enabledFeatures"
      ],
      [
        "accessor",
        "maxRenderLayers"
      ],
      [
        "accessor",
        "onvisibilitymaskchange"
      ],
      [
        "constructor"
      ],
      [
        "method",
        "initiateRoomCapture",
        0
      ],
      [
        "tag"
      ]
    ]
  },
  "XRSessionEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "session"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRSpace": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRSystem": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "ondevicechange"
      ],
      [
        "method",
        "isSessionSupported",
        1
      ],
      [
        "method",
        "requestSession",
        1
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRView": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "eye"
      ],
      [
        "accessor",
        "recommendedViewportScale"
      ],
      [
        "accessor",
        "isFirstPersonObserver"
      ],
      [
        "accessor",
        "camera"
      ],
      [
        "method",
        "requestViewportScale",
        1
      ],
      [
        "accessor",
        "index"
      ],
      [
        "constructor"
      ],
      [
        "accessor",
        "projectionMatrix"
      ],
      [
        "accessor",
        "transform"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRViewerPose": {
    "constructorParent": "XRPose",
    "prototypeParent": "XRPose",
    "members": [
      [
        "accessor",
        "views"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "XRViewport": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "x"
      ],
      [
        "accessor",
        "y"
      ],
      [
        "accessor",
        "width"
      ],
      [
        "accessor",
        "height"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  }
});
