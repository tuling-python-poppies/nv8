// 通用浏览器 Profile 不携带采集机器的音频、蓝牙、USB 或串口设备身份。
// 调用方需要复现真实设备时，应通过 fingerprint 覆盖这些字段。
export const neutralMediaDevices = Object.freeze([]);

export const neutralExternalDevices = Object.freeze({
  bluetooth: Object.freeze({
    available: false,
    devices: Object.freeze([]),
  }),
  hid: Object.freeze({
    devices: Object.freeze([]),
  }),
  serial: Object.freeze({
    ports: Object.freeze([]),
  }),
  usb: Object.freeze({
    devices: Object.freeze([]),
  }),
});
