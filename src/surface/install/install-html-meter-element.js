import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLMeterElement,
  installHTMLMeterElementConstructor,
} from "../api/dom/html-meter-element-constructor.js";
import { high, setHigh } from "../api/dom/html-meter-element-high-property.js";
import { labels } from "../api/dom/html-meter-element-labels-getter.js";
import { low, setLow } from "../api/dom/html-meter-element-low-property.js";
import { max, setMax } from "../api/dom/html-meter-element-max-property.js";
import { min, setMin } from "../api/dom/html-meter-element-min-property.js";
import { optimum, setOptimum } from "../api/dom/html-meter-element-optimum-property.js";
import { setValue, value } from "../api/dom/html-meter-element-value-property.js";

export function installHTMLMeterElement() {
  installHTMLMeterElementConstructor();
  accessor("value", value, setValue);
  accessor("min", min, setMin);
  accessor("max", max, setMax);
  accessor("low", low, setLow);
  accessor("high", high, setHigh);
  accessor("optimum", optimum, setOptimum);
  definePrototypeGetter(HTMLMeterElement.prototype, "labels", labels);
  defineConstructorBacklink(HTMLMeterElement.prototype, HTMLMeterElement);
  defineToStringTag(HTMLMeterElement.prototype, "HTMLMeterElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLMeterElement.prototype, name, getter, setter);
}
