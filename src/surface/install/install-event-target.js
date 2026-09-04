import {
  installEventTargetConstructor,
  installEventTargetConstructorBacklink,
} from "../api/event/event-target-constructor.js";
import {
  installEventTargetAddEventListener,
} from "../api/event/event-target-add-event-listener.js";
import {
  installEventTargetDispatchEvent,
} from "../api/event/event-target-dispatch-event.js";
import {
  installEventTargetRemoveEventListener,
} from "../api/event/event-target-remove-event-listener.js";
import {
  installEventTargetWhen,
} from "../api/event/event-target-when.js";

export function installEventTarget() {
  installEventTargetConstructor();
  installEventTargetAddEventListener();
  installEventTargetDispatchEvent();
  installEventTargetRemoveEventListener();
  installEventTargetWhen();
  installEventTargetConstructorBacklink();
}
