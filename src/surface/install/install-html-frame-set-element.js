import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { cols, setCols } from "../api/dom/html-frame-set-element-cols-property.js";
import {
  HTMLFrameSetElement,
  installHTMLFrameSetElementConstructor,
} from "../api/dom/html-frame-set-element-constructor.js";
import { onafterprint, setOnafterprint } from "../api/dom/html-frame-set-element-onafterprint-property.js";
import { onbeforeprint, setOnbeforeprint } from "../api/dom/html-frame-set-element-onbeforeprint-property.js";
import { onbeforeunload, setOnbeforeunload } from "../api/dom/html-frame-set-element-onbeforeunload-property.js";
import { onblur, setOnblur } from "../api/dom/html-frame-set-element-onblur-property.js";
import { onerror, setOnerror } from "../api/dom/html-frame-set-element-onerror-property.js";
import { onfocus, setOnfocus } from "../api/dom/html-frame-set-element-onfocus-property.js";
import { ongamepadconnected, setOngamepadconnected } from "../api/dom/html-frame-set-element-ongamepadconnected-property.js";
import { ongamepaddisconnected, setOngamepaddisconnected } from "../api/dom/html-frame-set-element-ongamepaddisconnected-property.js";
import { onhashchange, setOnhashchange } from "../api/dom/html-frame-set-element-onhashchange-property.js";
import { onlanguagechange, setOnlanguagechange } from "../api/dom/html-frame-set-element-onlanguagechange-property.js";
import { onload, setOnload } from "../api/dom/html-frame-set-element-onload-property.js";
import { onmessage, setOnmessage } from "../api/dom/html-frame-set-element-onmessage-property.js";
import { onmessageerror, setOnmessageerror } from "../api/dom/html-frame-set-element-onmessageerror-property.js";
import { onoffline, setOnoffline } from "../api/dom/html-frame-set-element-onoffline-property.js";
import { ononline, setOnonline } from "../api/dom/html-frame-set-element-ononline-property.js";
import { onpagehide, setOnpagehide } from "../api/dom/html-frame-set-element-onpagehide-property.js";
import { onpageshow, setOnpageshow } from "../api/dom/html-frame-set-element-onpageshow-property.js";
import { onpopstate, setOnpopstate } from "../api/dom/html-frame-set-element-onpopstate-property.js";
import { onrejectionhandled, setOnrejectionhandled } from "../api/dom/html-frame-set-element-onrejectionhandled-property.js";
import { onresize, setOnresize } from "../api/dom/html-frame-set-element-onresize-property.js";
import { onscroll, setOnscroll } from "../api/dom/html-frame-set-element-onscroll-property.js";
import { onstorage, setOnstorage } from "../api/dom/html-frame-set-element-onstorage-property.js";
import { onunhandledrejection, setOnunhandledrejection } from "../api/dom/html-frame-set-element-onunhandledrejection-property.js";
import { onunload, setOnunload } from "../api/dom/html-frame-set-element-onunload-property.js";
import { rows, setRows } from "../api/dom/html-frame-set-element-rows-property.js";

export function installHTMLFrameSetElement() {
  installHTMLFrameSetElementConstructor();
  accessor("cols", cols, setCols);
  accessor("rows", rows, setRows);
  accessor("onblur", onblur, setOnblur);
  accessor("onerror", onerror, setOnerror);
  accessor("onfocus", onfocus, setOnfocus);
  accessor("onload", onload, setOnload);
  accessor("onresize", onresize, setOnresize);
  accessor("onscroll", onscroll, setOnscroll);
  accessor("onafterprint", onafterprint, setOnafterprint);
  accessor("onbeforeprint", onbeforeprint, setOnbeforeprint);
  accessor("onbeforeunload", onbeforeunload, setOnbeforeunload);
  accessor("onhashchange", onhashchange, setOnhashchange);
  accessor("onlanguagechange", onlanguagechange, setOnlanguagechange);
  accessor("onmessage", onmessage, setOnmessage);
  accessor("onmessageerror", onmessageerror, setOnmessageerror);
  accessor("onoffline", onoffline, setOnoffline);
  accessor("ononline", ononline, setOnonline);
  accessor("onpagehide", onpagehide, setOnpagehide);
  accessor("onpageshow", onpageshow, setOnpageshow);
  accessor("onpopstate", onpopstate, setOnpopstate);
  accessor("onrejectionhandled", onrejectionhandled, setOnrejectionhandled);
  accessor("onstorage", onstorage, setOnstorage);
  accessor("onunhandledrejection", onunhandledrejection, setOnunhandledrejection);
  accessor("onunload", onunload, setOnunload);
  accessor("ongamepadconnected", ongamepadconnected, setOngamepadconnected);
  accessor(
    "ongamepaddisconnected",
    ongamepaddisconnected,
    setOngamepaddisconnected,
  );
  defineConstructorBacklink(HTMLFrameSetElement.prototype, HTMLFrameSetElement);
  defineToStringTag(HTMLFrameSetElement.prototype, "HTMLFrameSetElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLFrameSetElement.prototype, name, getter, setter);
}
