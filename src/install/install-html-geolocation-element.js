import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { accuracymode, setAccuracymode } from "../api/dom/html-geolocation-element-accuracy-mode-property.js";
import { autolocate, setAutolocate } from "../api/dom/html-geolocation-element-autolocate-property.js";
import {
  HTMLGeolocationElement,
  installHTMLGeolocationElementConstructor,
} from "../api/dom/html-geolocation-element-constructor.js";
import { error } from "../api/dom/html-geolocation-element-error-property.js";
import { initialPermissionStatus } from "../api/dom/html-geolocation-element-initial-permission-status-property.js";
import { invalidReason } from "../api/dom/html-geolocation-element-invalid-reason-property.js";
import { isValid } from "../api/dom/html-geolocation-element-is-valid-property.js";
import { onlocation, setOnlocation } from "../api/dom/html-geolocation-element-onlocation-property.js";
import { onpromptaction, setOnpromptaction } from "../api/dom/html-geolocation-element-onpromptaction-property.js";
import { onpromptdismiss, setOnpromptdismiss } from "../api/dom/html-geolocation-element-onpromptdismiss-property.js";
import {
  onvalidationstatuschange,
  setOnvalidationstatuschange,
} from "../api/dom/html-geolocation-element-onvalidationstatuschange-property.js";
import { permissionStatus } from "../api/dom/html-geolocation-element-permission-status-property.js";
import { position } from "../api/dom/html-geolocation-element-position-property.js";
import { watch, setWatch } from "../api/dom/html-geolocation-element-watch-property.js";

export function installHTMLGeolocationElement() {
  installHTMLGeolocationElementConstructor();
  definePrototypeAccessor(HTMLGeolocationElement.prototype, "onlocation", onlocation, setOnlocation);
  definePrototypeGetter(HTMLGeolocationElement.prototype, "position", position);
  definePrototypeGetter(HTMLGeolocationElement.prototype, "error", error);
  definePrototypeAccessor(HTMLGeolocationElement.prototype, "accuracymode", accuracymode, setAccuracymode);
  definePrototypeAccessor(HTMLGeolocationElement.prototype, "autolocate", autolocate, setAutolocate);
  definePrototypeAccessor(HTMLGeolocationElement.prototype, "watch", watch, setWatch);
  definePrototypeGetter(HTMLGeolocationElement.prototype, "isValid", isValid);
  definePrototypeGetter(HTMLGeolocationElement.prototype, "invalidReason", invalidReason);
  definePrototypeGetter(HTMLGeolocationElement.prototype, "initialPermissionStatus", initialPermissionStatus);
  definePrototypeGetter(HTMLGeolocationElement.prototype, "permissionStatus", permissionStatus);
  definePrototypeAccessor(HTMLGeolocationElement.prototype, "onpromptaction", onpromptaction, setOnpromptaction);
  definePrototypeAccessor(HTMLGeolocationElement.prototype, "onpromptdismiss", onpromptdismiss, setOnpromptdismiss);
  definePrototypeAccessor(
    HTMLGeolocationElement.prototype,
    "onvalidationstatuschange",
    onvalidationstatuschange,
    setOnvalidationstatuschange,
  );
  defineConstructorBacklink(HTMLGeolocationElement.prototype, HTMLGeolocationElement);
  defineToStringTag(HTMLGeolocationElement.prototype, "HTMLGeolocationElement");
}
