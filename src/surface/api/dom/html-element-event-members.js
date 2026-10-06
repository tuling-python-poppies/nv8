export function installHTMLElementEarlyEventMembers(install) {
  install("onabort", onabort, setOnabort);
  install("onbeforeinput", onbeforeinput, setOnbeforeinput);
  install("onbeforematch", onbeforematch, setOnbeforematch);
  install("onbeforetoggle", onbeforetoggle, setOnbeforetoggle);
  install("onblur", onblur, setOnblur);
  install("oncancel", oncancel, setOncancel);
  install("oncanplay", oncanplay, setOncanplay);
  install("oncanplaythrough", oncanplaythrough, setOncanplaythrough);
  install("onchange", onchange, setOnchange);
  install("onclick", onclick, setOnclick);
  install("onclose", onclose, setOnclose);
  install("oncommand", oncommand, setOncommand);
  install("oncontentvisibilityautostatechange", oncontentvisibilityautostatechange, setOncontentvisibilityautostatechange);
  install("oncontextlost", oncontextlost, setOncontextlost);
  install("oncontextmenu", oncontextmenu, setOncontextmenu);
  install("oncontextrestored", oncontextrestored, setOncontextrestored);
  install("oncuechange", oncuechange, setOncuechange);
  install("ondblclick", ondblclick, setOndblclick);
  install("ondrag", ondrag, setOndrag);
  install("ondragend", ondragend, setOndragend);
  install("ondragenter", ondragenter, setOndragenter);
  install("ondragleave", ondragleave, setOndragleave);
  install("ondragover", ondragover, setOndragover);
  install("ondragstart", ondragstart, setOndragstart);
  install("ondrop", ondrop, setOndrop);
  install("ondurationchange", ondurationchange, setOndurationchange);
  install("onemptied", onemptied, setOnemptied);
  install("onended", onended, setOnended);
  install("onerror", onerror, setOnerror);
  install("onfocus", onfocus, setOnfocus);
  install("onformdata", onformdata, setOnformdata);
  install("oninput", oninput, setOninput);
  install("oninvalid", oninvalid, setOninvalid);
  install("onkeydown", onkeydown, setOnkeydown);
  install("onkeypress", onkeypress, setOnkeypress);
  install("onkeyup", onkeyup, setOnkeyup);
  install("onload", onload, setOnload);
  install("onloadeddata", onloadeddata, setOnloadeddata);
  install("onloadedmetadata", onloadedmetadata, setOnloadedmetadata);
  install("onloadstart", onloadstart, setOnloadstart);
  install("onmousedown", onmousedown, setOnmousedown);
  install("onmouseenter", onmouseenter, setOnmouseenter);
  install("onmouseleave", onmouseleave, setOnmouseleave);
  install("onmousemove", onmousemove, setOnmousemove);
  install("onmouseout", onmouseout, setOnmouseout);
  install("onmouseover", onmouseover, setOnmouseover);
  install("onmouseup", onmouseup, setOnmouseup);
  install("onmousewheel", onmousewheel, setOnmousewheel);
  install("onpause", onpause, setOnpause);
  install("onplay", onplay, setOnplay);
  install("onplaying", onplaying, setOnplaying);
  install("onprogress", onprogress, setOnprogress);
  install("onratechange", onratechange, setOnratechange);
  install("onreset", onreset, setOnreset);
  install("onresize", onresize, setOnresize);
  install("onscroll", onscroll, setOnscroll);
  install("onscrollend", onscrollend, setOnscrollend);
  install("onsecuritypolicyviolation", onsecuritypolicyviolation, setOnsecuritypolicyviolation);
  install("onseeked", onseeked, setOnseeked);
  install("onseeking", onseeking, setOnseeking);
  install("onselect", onselect, setOnselect);
  install("onslotchange", onslotchange, setOnslotchange);
  install("onstalled", onstalled, setOnstalled);
  install("onsubmit", onsubmit, setOnsubmit);
  install("onsuspend", onsuspend, setOnsuspend);
  install("ontimeupdate", ontimeupdate, setOntimeupdate);
  install("ontoggle", ontoggle, setOntoggle);
  install("onvolumechange", onvolumechange, setOnvolumechange);
  install("onwaiting", onwaiting, setOnwaiting);
  install("onwebkitanimationend", onwebkitanimationend, setOnwebkitanimationend);
  install("onwebkitanimationiteration", onwebkitanimationiteration, setOnwebkitanimationiteration);
  install("onwebkitanimationstart", onwebkitanimationstart, setOnwebkitanimationstart);
  install("onwebkittransitionend", onwebkittransitionend, setOnwebkittransitionend);
  install("onwheel", onwheel, setOnwheel);
  install("onauxclick", onauxclick, setOnauxclick);
  install("ongotpointercapture", ongotpointercapture, setOngotpointercapture);
  install("onlostpointercapture", onlostpointercapture, setOnlostpointercapture);
  install("onpointerdown", onpointerdown, setOnpointerdown);
  install("onpointermove", onpointermove, setOnpointermove);
  install("onpointerup", onpointerup, setOnpointerup);
  install("onpointercancel", onpointercancel, setOnpointercancel);
  install("onpointerover", onpointerover, setOnpointerover);
  install("onpointerout", onpointerout, setOnpointerout);
  install("onpointerenter", onpointerenter, setOnpointerenter);
  install("onpointerleave", onpointerleave, setOnpointerleave);
  install("onselectstart", onselectstart, setOnselectstart);
  install("onselectionchange", onselectionchange, setOnselectionchange);
  install("onanimationcancel", onanimationcancel, setOnanimationcancel);
  install("onanimationend", onanimationend, setOnanimationend);
  install("onanimationiteration", onanimationiteration, setOnanimationiteration);
  install("onanimationstart", onanimationstart, setOnanimationstart);
  install("ontransitionrun", ontransitionrun, setOntransitionrun);
  install("ontransitionstart", ontransitionstart, setOntransitionstart);
  install("ontransitionend", ontransitionend, setOntransitionend);
  install("ontransitioncancel", ontransitioncancel, setOntransitioncancel);
  install("onbeforexrselect", onbeforexrselect, setOnbeforexrselect);
  install("oncopy", oncopy, setOncopy);
  install("oncut", oncut, setOncut);
  install("onpaste", onpaste, setOnpaste);
}

export function installHTMLElementLateEventMembers(install) {
  install("onscrollsnapchange", onscrollsnapchange, setOnscrollsnapchange);
  install("onscrollsnapchanging", onscrollsnapchanging, setOnscrollsnapchanging);
}

export function installHTMLElementAfterConstructorEventMembers(install) {
  install("onpointerrawupdate", onpointerrawupdate, setOnpointerrawupdate);
}

import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";

const HTML_ELEMENT_HANDLER_DESCRIPTOR_TABLE_ROWS = [
  ["onabort", "onabort"],
  ["onanimationcancel", "onanimationcancel"],
  ["onanimationend", "onanimationend"],
  ["onanimationiteration", "onanimationiteration"],
  ["onanimationstart", "onanimationstart"],
  ["onauxclick", "onauxclick"],
  ["onbeforeinput", "onbeforeinput"],
  ["onbeforematch", "onbeforematch"],
  ["onbeforetoggle", "onbeforetoggle"],
  ["onbeforexrselect", "onbeforexrselect"],
  ["onblur", "onblur"],
  ["oncancel", "oncancel"],
  ["oncanplay", "oncanplay"],
  ["oncanplaythrough", "oncanplaythrough"],
  ["onchange", "onchange"],
  ["onclick", "onclick"],
  ["onclose", "onclose"],
  ["oncommand", "oncommand"],
  ["oncontentvisibilityautostatechange", "oncontentvisibilityautostatechange"],
  ["oncontextlost", "oncontextlost"],
  ["oncontextmenu", "oncontextmenu"],
  ["oncontextrestored", "oncontextrestored"],
  ["oncopy", "oncopy"],
  ["oncuechange", "oncuechange"],
  ["oncut", "oncut"],
  ["ondblclick", "ondblclick"],
  ["ondrag", "ondrag"],
  ["ondragend", "ondragend"],
  ["ondragenter", "ondragenter"],
  ["ondragleave", "ondragleave"],
  ["ondragover", "ondragover"],
  ["ondragstart", "ondragstart"],
  ["ondrop", "ondrop"],
  ["ondurationchange", "ondurationchange"],
  ["onemptied", "onemptied"],
  ["onended", "onended"],
  ["onerror", "onerror"],
  ["onfocus", "onfocus"],
  ["onformdata", "onformdata"],
  ["ongotpointercapture", "ongotpointercapture"],
  ["oninput", "oninput"],
  ["oninvalid", "oninvalid"],
  ["onkeydown", "onkeydown"],
  ["onkeypress", "onkeypress"],
  ["onkeyup", "onkeyup"],
  ["onload", "onload"],
  ["onloadeddata", "onloadeddata"],
  ["onloadedmetadata", "onloadedmetadata"],
  ["onloadstart", "onloadstart"],
  ["onlostpointercapture", "onlostpointercapture"],
  ["onmousedown", "onmousedown"],
  ["onmouseenter", "onmouseenter"],
  ["onmouseleave", "onmouseleave"],
  ["onmousemove", "onmousemove"],
  ["onmouseout", "onmouseout"],
  ["onmouseover", "onmouseover"],
  ["onmouseup", "onmouseup"],
  ["onmousewheel", "onmousewheel"],
  ["onpaste", "onpaste"],
  ["onpause", "onpause"],
  ["onplay", "onplay"],
  ["onplaying", "onplaying"],
  ["onpointercancel", "onpointercancel"],
  ["onpointerdown", "onpointerdown"],
  ["onpointerenter", "onpointerenter"],
  ["onpointerleave", "onpointerleave"],
  ["onpointermove", "onpointermove"],
  ["onpointerout", "onpointerout"],
  ["onpointerover", "onpointerover"],
  ["onpointerrawupdate", "onpointerrawupdate"],
  ["onpointerup", "onpointerup"],
  ["onprogress", "onprogress"],
  ["onratechange", "onratechange"],
  ["onreset", "onreset"],
  ["onresize", "onresize"],
  ["onscroll", "onscroll"],
  ["onscrollend", "onscrollend"],
  ["onscrollsnapchange", "onscrollsnapchange"],
  ["onscrollsnapchanging", "onscrollsnapchanging"],
  ["onsecuritypolicyviolation", "onsecuritypolicyviolation"],
  ["onseeked", "onseeked"],
  ["onseeking", "onseeking"],
  ["onselect", "onselect"],
  ["onselectionchange", "onselectionchange"],
  ["onselectstart", "onselectstart"],
  ["onslotchange", "onslotchange"],
  ["onstalled", "onstalled"],
  ["onsubmit", "onsubmit"],
  ["onsuspend", "onsuspend"],
  ["ontimeupdate", "ontimeupdate"],
  ["ontoggle", "ontoggle"],
  ["ontransitioncancel", "ontransitioncancel"],
  ["ontransitionend", "ontransitionend"],
  ["ontransitionrun", "ontransitionrun"],
  ["ontransitionstart", "ontransitionstart"],
  ["onvolumechange", "onvolumechange"],
  ["onwaiting", "onwaiting"],
  ["onwebkitanimationend", "onwebkitanimationend"],
  ["onwebkitanimationiteration", "onwebkitanimationiteration"],
  ["onwebkitanimationstart", "onwebkitanimationstart"],
  ["onwebkittransitionend", "onwebkittransitionend"],
  ["onwheel", "onwheel"],
];

export const htmlElementHandlerDescriptorTable = HTML_ELEMENT_HANDLER_DESCRIPTOR_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlElementHandlerDescriptor(...args)],
);

