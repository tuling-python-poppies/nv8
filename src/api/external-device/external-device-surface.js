// Generated from captured Edge 150 evidence.
export const EXTERNAL_DEVICE_SURFACES = Object.freeze({
  "Bluetooth": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "method",
        "getAvailability",
        0
      ],
      [
        "method",
        "requestDevice",
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
  "BluetoothCharacteristicProperties": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "broadcast"
      ],
      [
        "accessor",
        "read"
      ],
      [
        "accessor",
        "writeWithoutResponse"
      ],
      [
        "accessor",
        "write"
      ],
      [
        "accessor",
        "notify"
      ],
      [
        "accessor",
        "indicate"
      ],
      [
        "accessor",
        "authenticatedSignedWrites"
      ],
      [
        "accessor",
        "reliableWrite"
      ],
      [
        "accessor",
        "writableAuxiliaries"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "BluetoothDevice": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "id"
      ],
      [
        "accessor",
        "name"
      ],
      [
        "accessor",
        "gatt"
      ],
      [
        "accessor",
        "ongattserverdisconnected"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "BluetoothRemoteGATTCharacteristic": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "service"
      ],
      [
        "accessor",
        "uuid"
      ],
      [
        "accessor",
        "properties"
      ],
      [
        "accessor",
        "value"
      ],
      [
        "accessor",
        "oncharacteristicvaluechanged"
      ],
      [
        "method",
        "getDescriptor",
        1
      ],
      [
        "method",
        "getDescriptors",
        0
      ],
      [
        "method",
        "readValue",
        0
      ],
      [
        "method",
        "startNotifications",
        0
      ],
      [
        "method",
        "stopNotifications",
        0
      ],
      [
        "method",
        "writeValue",
        1
      ],
      [
        "method",
        "writeValueWithResponse",
        1
      ],
      [
        "method",
        "writeValueWithoutResponse",
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
  "BluetoothRemoteGATTDescriptor": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "characteristic"
      ],
      [
        "accessor",
        "uuid"
      ],
      [
        "accessor",
        "value"
      ],
      [
        "method",
        "readValue",
        0
      ],
      [
        "method",
        "writeValue",
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
  "BluetoothRemoteGATTServer": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "device"
      ],
      [
        "accessor",
        "connected"
      ],
      [
        "method",
        "connect",
        0
      ],
      [
        "method",
        "disconnect",
        0
      ],
      [
        "method",
        "getPrimaryService",
        1
      ],
      [
        "method",
        "getPrimaryServices",
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
  "BluetoothRemoteGATTService": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "device"
      ],
      [
        "accessor",
        "uuid"
      ],
      [
        "accessor",
        "isPrimary"
      ],
      [
        "method",
        "getCharacteristic",
        1
      ],
      [
        "method",
        "getCharacteristics",
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
  "HID": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "onconnect"
      ],
      [
        "accessor",
        "ondisconnect"
      ],
      [
        "method",
        "getDevices",
        0
      ],
      [
        "constructor"
      ],
      [
        "method",
        "requestDevice",
        1
      ],
      [
        "tag"
      ]
    ]
  },
  "HIDConnectionEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "device"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "HIDDevice": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "oninputreport"
      ],
      [
        "accessor",
        "opened"
      ],
      [
        "accessor",
        "vendorId"
      ],
      [
        "accessor",
        "productId"
      ],
      [
        "accessor",
        "productName"
      ],
      [
        "accessor",
        "collections"
      ],
      [
        "method",
        "close",
        0
      ],
      [
        "method",
        "forget",
        0
      ],
      [
        "method",
        "open",
        0
      ],
      [
        "method",
        "receiveFeatureReport",
        1
      ],
      [
        "method",
        "sendFeatureReport",
        2
      ],
      [
        "method",
        "sendReport",
        2
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "HIDInputReportEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "device"
      ],
      [
        "accessor",
        "reportId"
      ],
      [
        "accessor",
        "data"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "Serial": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "onconnect"
      ],
      [
        "accessor",
        "ondisconnect"
      ],
      [
        "method",
        "getPorts",
        0
      ],
      [
        "constructor"
      ],
      [
        "method",
        "requestPort",
        0
      ],
      [
        "tag"
      ]
    ]
  },
  "SerialPort": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "onconnect"
      ],
      [
        "accessor",
        "ondisconnect"
      ],
      [
        "accessor",
        "readable"
      ],
      [
        "accessor",
        "writable"
      ],
      [
        "method",
        "close",
        0
      ],
      [
        "method",
        "forget",
        0
      ],
      [
        "method",
        "getInfo",
        0
      ],
      [
        "method",
        "getSignals",
        0
      ],
      [
        "method",
        "open",
        1
      ],
      [
        "method",
        "setSignals",
        0
      ],
      [
        "accessor",
        "connected"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USB": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "onconnect"
      ],
      [
        "accessor",
        "ondisconnect"
      ],
      [
        "method",
        "getDevices",
        0
      ],
      [
        "constructor"
      ],
      [
        "method",
        "requestDevice",
        1
      ],
      [
        "tag"
      ]
    ]
  },
  "USBAlternateInterface": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "alternateSetting"
      ],
      [
        "accessor",
        "interfaceClass"
      ],
      [
        "accessor",
        "interfaceSubclass"
      ],
      [
        "accessor",
        "interfaceProtocol"
      ],
      [
        "accessor",
        "interfaceName"
      ],
      [
        "accessor",
        "endpoints"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBConfiguration": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "configurationValue"
      ],
      [
        "accessor",
        "configurationName"
      ],
      [
        "accessor",
        "interfaces"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBConnectionEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "accessor",
        "device"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBDevice": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "usbVersionMajor"
      ],
      [
        "accessor",
        "usbVersionMinor"
      ],
      [
        "accessor",
        "usbVersionSubminor"
      ],
      [
        "accessor",
        "deviceClass"
      ],
      [
        "accessor",
        "deviceSubclass"
      ],
      [
        "accessor",
        "deviceProtocol"
      ],
      [
        "accessor",
        "vendorId"
      ],
      [
        "accessor",
        "productId"
      ],
      [
        "accessor",
        "deviceVersionMajor"
      ],
      [
        "accessor",
        "deviceVersionMinor"
      ],
      [
        "accessor",
        "deviceVersionSubminor"
      ],
      [
        "accessor",
        "manufacturerName"
      ],
      [
        "accessor",
        "productName"
      ],
      [
        "accessor",
        "serialNumber"
      ],
      [
        "accessor",
        "configuration"
      ],
      [
        "accessor",
        "configurations"
      ],
      [
        "accessor",
        "opened"
      ],
      [
        "method",
        "claimInterface",
        1
      ],
      [
        "method",
        "clearHalt",
        2
      ],
      [
        "method",
        "close",
        0
      ],
      [
        "method",
        "controlTransferIn",
        2
      ],
      [
        "method",
        "controlTransferOut",
        1
      ],
      [
        "method",
        "forget",
        0
      ],
      [
        "method",
        "isochronousTransferIn",
        2
      ],
      [
        "method",
        "isochronousTransferOut",
        3
      ],
      [
        "method",
        "open",
        0
      ],
      [
        "method",
        "releaseInterface",
        1
      ],
      [
        "method",
        "reset",
        0
      ],
      [
        "method",
        "selectAlternateInterface",
        2
      ],
      [
        "method",
        "selectConfiguration",
        1
      ],
      [
        "method",
        "transferIn",
        2
      ],
      [
        "method",
        "transferOut",
        2
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBEndpoint": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "endpointNumber"
      ],
      [
        "accessor",
        "direction"
      ],
      [
        "accessor",
        "type"
      ],
      [
        "accessor",
        "packetSize"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBInTransferResult": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "data"
      ],
      [
        "accessor",
        "status"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBInterface": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "interfaceNumber"
      ],
      [
        "accessor",
        "alternate"
      ],
      [
        "accessor",
        "alternates"
      ],
      [
        "accessor",
        "claimed"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBIsochronousInTransferPacket": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "status"
      ],
      [
        "accessor",
        "data"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBIsochronousInTransferResult": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "data"
      ],
      [
        "accessor",
        "packets"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBIsochronousOutTransferPacket": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "bytesWritten"
      ],
      [
        "accessor",
        "status"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBIsochronousOutTransferResult": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "packets"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "USBOutTransferResult": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "bytesWritten"
      ],
      [
        "accessor",
        "status"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "BluetoothUUID": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  }
});
