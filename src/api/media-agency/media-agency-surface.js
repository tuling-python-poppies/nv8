// Generated from captured Edge 150 evidence.
export const MEDIA_AGENCY_SURFACES = Object.freeze({
  "MediaDeviceInfo": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "deviceId"
      ],
      [
        "accessor",
        "kind"
      ],
      [
        "accessor",
        "label"
      ],
      [
        "accessor",
        "groupId"
      ],
      [
        "method",
        "toJSON",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "InputDeviceInfo": {
    "constructorParent": "MediaDeviceInfo",
    "prototypeParent": "MediaDeviceInfo",
    "members": [
      [
        "method",
        "getCapabilities",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaDevices": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "ondevicechange"
      ],
      [
        "method",
        "enumerateDevices",
        0
      ],
      [
        "method",
        "getSupportedConstraints",
        0
      ],
      [
        "method",
        "getUserMedia",
        0
      ],
      [
        "method",
        "getDisplayMedia",
        0
      ],
      [
        "method",
        "setCaptureHandleConfig",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaCapabilities": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "method",
        "decodingInfo",
        1
      ],
      [
        "method",
        "encodingInfo",
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
  "MediaEncryptedEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "initDataType"
      ],
      [
        "accessor",
        "initData"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaKeyMessageEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "messageType"
      ],
      [
        "accessor",
        "message"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaKeySession": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "sessionId"
      ],
      [
        "accessor",
        "expiration"
      ],
      [
        "accessor",
        "closed"
      ],
      [
        "accessor",
        "keyStatuses"
      ],
      [
        "accessor",
        "onkeystatuseschange"
      ],
      [
        "accessor",
        "onmessage"
      ],
      [
        "method",
        "close",
        0
      ],
      [
        "method",
        "generateRequest",
        2
      ],
      [
        "method",
        "load",
        1
      ],
      [
        "method",
        "remove",
        0
      ],
      [
        "method",
        "update",
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
  "MediaKeyStatusMap": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "size"
      ],
      [
        "method",
        "get",
        1
      ],
      [
        "method",
        "has",
        1
      ],
      [
        "method",
        "entries",
        0
      ],
      [
        "method",
        "forEach",
        1
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
        "constructor"
      ],
      [
        "tag"
      ],
      [
        "iterator",
        "entries",
        0
      ]
    ]
  },
  "MediaKeySystemAccess": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "keySystem"
      ],
      [
        "method",
        "createMediaKeys",
        0
      ],
      [
        "method",
        "getConfiguration",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaKeys": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "method",
        "createSession",
        0
      ],
      [
        "method",
        "setServerCertificate",
        1
      ],
      [
        "constructor"
      ],
      [
        "method",
        "getStatusForPolicy",
        0
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaMetadata": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "title"
      ],
      [
        "accessor",
        "artist"
      ],
      [
        "accessor",
        "album"
      ],
      [
        "accessor",
        "artwork"
      ],
      [
        "accessor",
        "chapterInfo"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaSession": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "metadata"
      ],
      [
        "accessor",
        "playbackState"
      ],
      [
        "method",
        "setActionHandler",
        2
      ],
      [
        "method",
        "setCameraActive",
        1
      ],
      [
        "method",
        "setMicrophoneActive",
        1
      ],
      [
        "method",
        "setPositionState",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "CaptureController": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "method",
        "setFocusBehavior",
        1
      ],
      [
        "accessor",
        "zoomLevel"
      ],
      [
        "accessor",
        "onzoomlevelchange"
      ],
      [
        "method",
        "decreaseZoomLevel",
        0
      ],
      [
        "method",
        "forwardWheel",
        1
      ],
      [
        "method",
        "getSupportedZoomLevels",
        0
      ],
      [
        "method",
        "increaseZoomLevel",
        0
      ],
      [
        "method",
        "resetZoomLevel",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "ImageCapture": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "track"
      ],
      [
        "method",
        "getPhotoCapabilities",
        0
      ],
      [
        "method",
        "getPhotoSettings",
        0
      ],
      [
        "method",
        "grabFrame",
        0
      ],
      [
        "method",
        "takePhoto",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "BrowserCaptureMediaStreamTrack": {
    "constructorParent": "MediaStreamTrack",
    "prototypeParent": "MediaStreamTrack",
    "members": [
      [
        "method",
        "cropTo",
        1
      ],
      [
        "method",
        "restrictTo",
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
  "MediaStreamTrackGenerator": {
    "constructorParent": "MediaStreamTrack",
    "prototypeParent": "MediaStreamTrack",
    "members": [
      [
        "accessor",
        "writable"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaStreamTrackProcessor": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "readable"
      ],
      [
        "accessor",
        "totalFrames"
      ],
      [
        "accessor",
        "discardedFrames"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaStreamTrackVideoStats": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "deliveredFrames"
      ],
      [
        "accessor",
        "discardedFrames"
      ],
      [
        "accessor",
        "totalFrames"
      ],
      [
        "method",
        "toJSON",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaStreamTrackEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "track"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "MediaStreamEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "stream"
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
