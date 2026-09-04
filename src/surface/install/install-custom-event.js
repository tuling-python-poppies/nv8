import {
  installCustomEventConstructor,
  installCustomEventConstructorBacklink,
} from "../api/event/custom-event-constructor.js";
import {
  installCustomEventDetail,
} from "../api/event/custom-event-detail-getter.js";
import {
  installCustomEventInitCustomEvent,
} from "../api/event/custom-event-init-custom-event.js";

export function installCustomEvent() {
  installCustomEventConstructor();
  installCustomEventDetail();
  installCustomEventInitCustomEvent();
  installCustomEventConstructorBacklink();
}
