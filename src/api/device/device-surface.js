// Generated from captured Edge 150 evidence.
export const DEVICE_SURFACES = Object.freeze({
  "GeolocationPositionError": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "code"
      ],
      [
        "accessor",
        "message"
      ],
      [
        "constant",
        "PERMISSION_DENIED"
      ],
      [
        "constant",
        "POSITION_UNAVAILABLE"
      ],
      [
        "constant",
        "TIMEOUT"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "GeolocationPosition": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "coords"
      ],
      [
        "accessor",
        "timestamp"
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
  "GeolocationCoordinates": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "latitude"
      ],
      [
        "accessor",
        "longitude"
      ],
      [
        "accessor",
        "altitude"
      ],
      [
        "accessor",
        "accuracy"
      ],
      [
        "accessor",
        "altitudeAccuracy"
      ],
      [
        "accessor",
        "heading"
      ],
      [
        "accessor",
        "speed"
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
  "Geolocation": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "method",
        "clearWatch",
        1
      ],
      [
        "method",
        "getCurrentPosition",
        1
      ],
      [
        "method",
        "watchPosition",
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
  "GamepadHapticActuator": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "effects"
      ],
      [
        "accessor",
        "type"
      ],
      [
        "method",
        "playEffect",
        2
      ],
      [
        "method",
        "reset",
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
  "GamepadEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "gamepad"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "GamepadButton": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "pressed"
      ],
      [
        "accessor",
        "touched"
      ],
      [
        "accessor",
        "value"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "Gamepad": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "id"
      ],
      [
        "accessor",
        "index"
      ],
      [
        "accessor",
        "connected"
      ],
      [
        "accessor",
        "timestamp"
      ],
      [
        "accessor",
        "mapping"
      ],
      [
        "accessor",
        "axes"
      ],
      [
        "accessor",
        "buttons"
      ],
      [
        "accessor",
        "vibrationActuator"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "Sensor": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "activated"
      ],
      [
        "accessor",
        "hasReading"
      ],
      [
        "accessor",
        "timestamp"
      ],
      [
        "accessor",
        "onerror"
      ],
      [
        "accessor",
        "onreading"
      ],
      [
        "accessor",
        "onactivate"
      ],
      [
        "method",
        "start",
        0
      ],
      [
        "method",
        "stop",
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
  "SensorErrorEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "error"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "Accelerometer": {
    "constructorParent": "Sensor",
    "prototypeParent": "Sensor",
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
        "z"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "GravitySensor": {
    "constructorParent": "Accelerometer",
    "prototypeParent": "Accelerometer",
    "members": [
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "LinearAccelerationSensor": {
    "constructorParent": "Accelerometer",
    "prototypeParent": "Accelerometer",
    "members": [
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "Gyroscope": {
    "constructorParent": "Sensor",
    "prototypeParent": "Sensor",
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
        "z"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "OrientationSensor": {
    "constructorParent": "Sensor",
    "prototypeParent": "Sensor",
    "members": [
      [
        "accessor",
        "quaternion"
      ],
      [
        "method",
        "populateMatrix",
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
  "AbsoluteOrientationSensor": {
    "constructorParent": "OrientationSensor",
    "prototypeParent": "OrientationSensor",
    "members": [
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "RelativeOrientationSensor": {
    "constructorParent": "OrientationSensor",
    "prototypeParent": "OrientationSensor",
    "members": [
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "DeviceMotionEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "acceleration"
      ],
      [
        "accessor",
        "accelerationIncludingGravity"
      ],
      [
        "accessor",
        "rotationRate"
      ],
      [
        "accessor",
        "interval"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "DeviceMotionEventAcceleration": {
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
        "z"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "DeviceMotionEventRotationRate": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "alpha"
      ],
      [
        "accessor",
        "beta"
      ],
      [
        "accessor",
        "gamma"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "DeviceOrientationEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "alpha"
      ],
      [
        "accessor",
        "beta"
      ],
      [
        "accessor",
        "gamma"
      ],
      [
        "accessor",
        "absolute"
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
