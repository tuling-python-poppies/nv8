import { installEventBubbles } from "../api/event/event-bubbles-getter.js";
import {
  installEventCancelBubble,
} from "../api/event/event-cancel-bubble-property.js";
import { installEventCancelable } from "../api/event/event-cancelable-getter.js";
import { installEventComposed } from "../api/event/event-composed-getter.js";
import { installEventComposedPath } from "../api/event/event-composed-path.js";
import {
  installEventConstants,
  installEventConstructor,
  installEventConstructorBacklink,
} from "../api/event/event-constructor.js";
import {
  installEventCurrentTarget,
} from "../api/event/event-current-target-getter.js";
import {
  installEventDefaultPrevented,
} from "../api/event/event-default-prevented-getter.js";
import { installEventInitEvent } from "../api/event/event-init-event.js";
import { installEventIsTrusted } from "../api/event/event-is-trusted-getter.js";
import { installEventPhase } from "../api/event/event-phase-getter.js";
import { installEventPreventDefault } from "../api/event/event-prevent-default.js";
import {
  installEventReturnValue,
} from "../api/event/event-return-value-property.js";
import {
  installEventSrcElement,
} from "../api/event/event-src-element-getter.js";
import {
  installEventStopImmediatePropagation,
} from "../api/event/event-stop-immediate-propagation.js";
import {
  installEventStopPropagation,
} from "../api/event/event-stop-propagation.js";
import { installEventTargetGetter } from "../api/event/event-target-getter.js";
import { installEventTimeStamp } from "../api/event/event-time-stamp-getter.js";
import { installEventType } from "../api/event/event-type-getter.js";

export function installEvent() {
  installEventConstructor();
  installEventType();
  installEventTargetGetter();
  installEventCurrentTarget();
  installEventPhase();
  installEventBubbles();
  installEventCancelable();
  installEventDefaultPrevented();
  installEventComposed();
  installEventTimeStamp();
  installEventIsTrusted();
  installEventSrcElement();
  installEventReturnValue();
  installEventCancelBubble();
  installEventConstants();
  installEventComposedPath();
  installEventInitEvent();
  installEventPreventDefault();
  installEventStopImmediatePropagation();
  installEventStopPropagation();
  installEventConstructorBacklink();
}
